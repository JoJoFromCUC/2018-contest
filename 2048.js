var cells;
//铺背景方块
function init() {
    cells = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    $("#game-field .controller .score").text(0); //分数置0

    var content = $("#game-field .content");
    var bgs = "";
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            bgs += "<div class = 'bg-cell row" + i + " col" + j + "'></div>";
        }
    }
    content.html(bgs);
    random_cell();
}
//获取一个随机数
function pickup(seed) {
    return Math.floor(Math.random() * seed);
}
//生成一个随机数字方块
nums = [2, 4];

function random_cell() {
    //空格全满之后弹出函数
    var count = 0;
    for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells[i].length; j++) {
            if (cells[i][j]) {
                count++;
            }
        }
    }
    if (count == 16) {
        return;
    }
    //判断空格是不是空的填2或4
    while (1) {
        var i = pickup(4);
        console.log(i);
        var j = pickup(4);
        console.log(j);
        var cell = cells[i][j];
        if (cell) {
            continue;
        }
        var num = nums[pickup(2)];
        cells[i][j] = num;
        cell = "<div class='cell row" + i + " col" + j + "'>" + num + "</div>"
        cell = $(cell); 
        changeStyle(cell); 
        $("#game-field .content").append(cell);
        break;
    }
}

var colors = [
    "seagreen", //2
    "dodgerblue", //4
    "darkred", //8
    "darkslategray", //16
    "rgb(240, 59, 225)", //32
    "rgb(177, 235, 19)", //64
    "rgb(73, 90, 247)", //128
    "rgb(223, 114, 13)", //256
    "rgb(81, 91, 240)", //512
    "rgb(24, 196, 187)", //1024
    "rgb(228, 41, 172)", //2048
];

function changeStyle(cell) {
    var num = cell.text();
    var backgroundcolor = colors[(Math.log(num) / Math.log(2)) - 1];
    cell.css({
        "background-color": backgroundcolor,
        "font-size": num >= 1024 ? "40px" : "",
        "color": num <= 4 ? "" : "white"
    });

}

function setScore(score) {
    $("#game-field .controller .score").text(
        $("#game-field .controller .score").text() * 1 + score);
}

function findCell(i, j) {
    return $("#game-field .content .cell.row" + i + ".col" + j);
}

function isDead() {
    for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells[i].length; j++) {
            var cell = cells[i][j];
            if (!cell) {
                return false;
            }
            if (i - 1 >= 0 && cell == cells[i - 1][j]) {
                return false;
            }
            if (i + 1 < cells.length && cell == cells[i + 1][j]) {
                return false;
            }
            if (j - 1 >= 0 && cell == cells[i][j - 1]) {
                return false;
            }
            if (j + 1 < cells[i].length && cell == cells[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}

function leftAction() {
    var count = 0;
    for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells.length; j++) {
            if (!cells[i][j]) {
                continue;
            }
            if (moveLeft(cells[i], i, j)) {
                count++;
            }
        }
    }
    return count;
}

function topAction() {
    var count = 0;
    for (var j = 0; j < cells[0].length; j++) {
        for (var i = 1; i < cells.length; i++) {
            if (!cells[i][j]) {
                continue;
            }
            if (moveTop(i, j)) {
                count++;
            }
        }
    }
    return count;
}

function rightAction() {
    var count = 0;
    for (var i = 0; i < cells.length; i++) {
        for (var j = cells[i].length - 2; j >= 0; j--) {
            if (!cells[i][j]) {
                continue;
            }
            if (moveRight(cells[i], i, j)) {
                count++;
            }
        }
    }
    return count;
}

function bottomAction() {
    var count = 0;
    for (var j = 0; j < cells[0].length; j++) {
        for (var i = 2; i >= 0; i--) {
            if (!cells[i][j]) {
                continue;
            }
            if (moveBottom(i, j)) {
                count++;
            }
        }
    }
    return count;
}

function moveTop(i, j) { //进入函数说明 列固定，动行数
    var pre = cells[i][j]; //取当前值
    var isMoved = false;
    for (var k = i - 1; k >= 0; k--) { //向上检查
        var curr = cells[k][j]; //现在检查位置的元素
        if (curr) { //如果是有数字
            if (curr == pre) { //如果数字相等
                cells[i][j] = 0; //原来位置置零
                cells[k][j] = curr + pre; //检查位置数字相加
                isMoved = true;
                //TODO 设置分数
                setScore(curr);
                findCell(k, j).remove();
                var cell = findCell(i, j)
                    .removeClass("row" + i)
                    .addClass("row" + k)
                    .text(curr + pre);
                changeStyle(cell);
            } else { //如果数字不相等
                if (!cells[k + 1][j]) { //如果检查位置为0
                    isMoved = true;
                    cells[i][j] = 0; //原来的位置设置成0
                    cells[k + 1][j] = pre; //检查位置设置成pre

                    cell = findCell(i, j)
                        .removeClass("row" + i)
                        .addClass("row" + (k + 1));
                }
            }
            return isMoved;
        }
    }
    if (cells[0][j] == 0) {
        isMoved = true;
    }
    //前面都是0
    cells[i][j] = 0;
    cells[0][j] = pre;
    var cell = findCell(i, j).removeClass("row" + i)
        .addClass("row0");
    return isMoved;
}

function moveLeft(row, i, j) {
    var pre = row[j];
    var isMoved = false;
    for (var k = j - 1; k >= 0; k--) {
        var curr = row[k]; //现在检查位置的元素
        if (curr) {
            if (curr == pre) {
                row[j] = 0; //原来位置置零
                row[k] = curr + pre;
                isMoved = true;
                //TODO 设置分数
                setScore(curr);

                findCell(i, k).remove();
                var cell = findCell(i, j)
                    .removeClass("col" + j)
                    .addClass("col" + k)
                    .text(curr + pre);
                changeStyle(cell);
            } else {
                if (!row[k + 1]) {
                    isMoved = true;
                    row[j] = 0;
                    row[k + 1] = pre;
                    cell = findCell(i, j)
                        .removeClass("col" + j)
                        .addClass("col" + (k + 1));
                }
            }
            return isMoved;
        }
    }
    if (row[0] == 0) {
        isMoved = true;
    }
    //前面都是0
    row[j] = 0;
    row[0] = pre;
    var cell = findCell(i, j).removeClass("col" + j)
        .addClass("col0");

    return isMoved;
}

function moveRight(row, i, j) {
    var pre = row[j];
    var isMoved = false;
    for (var k = j + 1; k < row.length; k++) {
        var curr = row[k]; //现在检查位置的元素
        if (curr) {
            if (curr == pre) {
                row[j] = 0; //原来位置置零
                row[k] = curr + pre;
                isMoved = true;
                //TODO 设置分数
                setScore(curr);
                findCell(i, k).remove();
                var cell = findCell(i, j)
                    .removeClass("col" + j)
                    .addClass("col" + k)
                    .text(curr + pre);
                changeStyle(cell);
            } else {
                if (!row[k - 1]) {
                    isMoved = true;
                    row[j] = 0;
                    row[k - 1] = pre;
                    cell = findCell(i, j)
                        .removeClass("col" + j)
                        .addClass("col" + (k - 1));
                }
            }
            return isMoved;
        }
    }
    if (row[3] == 0) {
        isMoved = true;
    }
    //前面都是0
    row[j] = 0;
    row[row.length - 1] = pre;
    var cell = findCell(i, j).removeClass("col" + j)
        .addClass("col3");

    return isMoved;
}

function moveBottom(i, j) {
    var pre = cells[i][j]; //取当前值
    var isMoved = false;
    for (var k = i + 1; k <= 3; k++) { //向下检查
        var curr = cells[k][j]; //现在检查位置的元素
        if (curr) { //如果是有数字
            if (curr == pre) { //如果数字相等
                cells[i][j] = 0; //原来位置置零
                cells[k][j] = curr + pre; //检查位置数字相加
                isMoved = true;
                //TODO 设置分数
                setScore(curr);
                findCell(k, j).remove();
                var cell = findCell(i, j)
                    .removeClass("row" + i)
                    .addClass("row" + k)
                    .text(curr + pre);
                changeStyle(cell);
            } else { //如果数字不相等
                if (!cells[k - 1][j]) {
                    isMoved = true;
                    cells[i][j] = 0; //原来的位置设置成0
                    cells[k - 1][j] = pre; //检查位置设置成pre

                    cell = findCell(i, j)
                        .removeClass("row" + i)
                        .addClass("row" + (k - 1));
                }
            }
            return isMoved;
        }
    }
    if (cells[3][j] == 0) {
        isMoved = true;
    }
    //前面都是0
    cells[i][j] = 0;
    cells[3][j] = pre;
    var cell = findCell(i, j).removeClass("row" + i)
        .addClass("row3");
    return isMoved;
}
$(function () {
    //初始化界面
    init();
    //new game按钮效果实现
    $("#game-field .controller .button").click(function () {
        init();
    })
    //监听
    $(window).on("keydown", function (e) {
        var keyCode = e.keyCode;
        var keyChar = String.fromCharCode(keyCode)
            .toLocaleUpperCase(); //转换大写
        if (keyChar == "A" || keyCode == 37) {
            if (leftAction()) {
                random_cell();
                if (isDead() == true) {
                    alert("game over");
                    return;
                }
            }
        } else if (keyChar == "W" || keyCode == 38) {
            if (topAction()) {
                random_cell();
                if (isDead() == true) {
                    alert("game over");
                    return;
                }
            }
        } else if (keyChar == "D" || keyCode == 39) {
            if (rightAction()) {
                random_cell();
                if (isDead() == true) {
                    alert("game over");
                    return;
                }
            }
        } else if (keyChar == "S" || keyCode == 40) {
            if (bottomAction()) {
                random_cell();
                if (isDead() == true) {
                    alert("game over");
                    return;
                }
            }
        }
    });
})