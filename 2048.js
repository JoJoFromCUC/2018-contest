//初始化
var array;
//备选数字2,4
var gen_nums = [2, 4];
function init() {
    array = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    $(".score").text(0); //初始得分为0

    var content = $("#game-field .content");
    var bgs = "";
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            bgs += "<div class = 'back-layer row" + i + " col" + j + "'></div>";
        }
    }
    content.html(bgs);
    generate();
}
//生成随机数
function pickup(seed) {
    return Math.floor(Math.random() * seed);
}
function generate() {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if (array[i][j]) {
                count++;
            }
        }
    }
    //若全满则退出
    if (count == 16) {
        return;
    }
    //若为空随机填入2或4
    while (true) {
        var i = pickup(4);
        var j = pickup(4);
        var box = array[i][j];
        if (box) {
            continue;
        }
        var num = gen_nums[pickup(2)];
        array[i][j] = num;
        box = "<div class='box row" + i + " col" + j + "'>" + num + "</div>"
        box = $(box); 
        changeStyle(box); 
        $("#game-field .content").append(box);
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

function changeStyle(box) {
    var num = box.text();
    var backgroundcolor = colors[(Math.log(num) / Math.log(2)) - 1];
    box.css({
        "background-color": backgroundcolor,
        "font-size": num >= 1024 ? "40px" : "",
        "color": num <= 4 ? "" : "white"
    });

}

function calcScore(score) {
    $("#game-field .controller .score").text(
        $("#game-field .controller .score").text() * 1 + score);
}

function posFinder(i, j) {
    return $("#game-field .content .box.row" + i + ".col" + j);
}

function isGameover() {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            var box = array[i][j];
            if (!box) {
                return false;
            }
            if (i - 1 >= 0 && box == array[i - 1][j]) {
                return false;
            }
            if (i + 1 < array.length && box == array[i + 1][j]) {
                return false;
            }
            if (j - 1 >= 0 && box == array[i][j - 1]) {
                return false;
            }
            if (j + 1 < array[i].length && box == array[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}

function leftHandler() {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array.length; j++) {
            if (!array[i][j]) {
                continue;
            }
            if (moveLeft(array[i], i, j)) {
                count++;
            }
        }
    }
    return count;
}

function upHandler() {
    var count = 0;
    for (var j = 0; j < array[0].length; j++) {
        for (var i = 1; i < array.length; i++) {
            if (!array[i][j]) {
                continue;
            }
            if (moveTop(i, j)) {
                count++;
            }
        }
    }
    return count;
}

function rightHandler() {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        for (var j = array[i].length - 2; j >= 0; j--) {
            if (!array[i][j]) {
                continue;
            }
            if (moveRight(array[i], i, j)) {
                count++;
            }
        }
    }
    return count;
}

function downHandler() {
    var count = 0;
    for (var j = 0; j < array[0].length; j++) {
        for (var i = 2; i >= 0; i--) {
            if (!array[i][j]) {
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
    var pre = array[i][j]; //取当前值
    var isMoved = false;
    for (var k = i - 1; k >= 0; k--) { //向上检查
        var curr = array[k][j]; //现在检查位置的元素
        if (curr) { //如果是有数字
            if (curr == pre) { //如果数字相等
                array[i][j] = 0; //原来位置置零
                array[k][j] = curr + pre; //检查位置数字相加
                isMoved = true;
                //TODO 设置分数
                calcScore(curr);
                posFinder(k, j).remove();
                var box = posFinder(i, j)
                    .removeClass("row" + i)
                    .addClass("row" + k)
                    .text(curr + pre);
                changeStyle(box);
            } else { //如果数字不相等
                if (!array[k + 1][j]) { //如果检查位置为0
                    isMoved = true;
                    array[i][j] = 0; //原来的位置设置成0
                    array[k + 1][j] = pre; //检查位置设置成pre

                    box = posFinder(i, j)
                        .removeClass("row" + i)
                        .addClass("row" + (k + 1));
                }
            }
            return isMoved;
        }
    }
    if (array[0][j] == 0) {
        isMoved = true;
    }
    //前面都是0
    array[i][j] = 0;
    array[0][j] = pre;
    var box = posFinder(i, j).removeClass("row" + i)
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
                calcScore(curr);

                posFinder(i, k).remove();
                var box = posFinder(i, j)
                    .removeClass("col" + j)
                    .addClass("col" + k)
                    .text(curr + pre);
                changeStyle(box);
            } else {
                if (!row[k + 1]) {
                    isMoved = true;
                    row[j] = 0;
                    row[k + 1] = pre;
                    box = posFinder(i, j)
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
    var box = posFinder(i, j).removeClass("col" + j)
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
                calcScore(curr);
                posFinder(i, k).remove();
                var box = posFinder(i, j)
                    .removeClass("col" + j)
                    .addClass("col" + k)
                    .text(curr + pre);
                changeStyle(box);
            } else {
                if (!row[k - 1]) {
                    isMoved = true;
                    row[j] = 0;
                    row[k - 1] = pre;
                    box = posFinder(i, j)
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
    var box = posFinder(i, j).removeClass("col" + j)
        .addClass("col3");

    return isMoved;
}

function moveBottom(i, j) {
    var pre = array[i][j]; //取当前值
    var isMoved = false;
    for (var k = i + 1; k <= 3; k++) { //向下检查
        var curr = array[k][j]; //现在检查位置的元素
        if (curr) { //如果是有数字
            if (curr == pre) { //如果数字相等
                array[i][j] = 0; //原来位置置零
                array[k][j] = curr + pre; //检查位置数字相加
                isMoved = true;
                // 设置分数
                calcScore(curr);
                posFinder(k, j).remove();
                var box = posFinder(i, j)
                    .removeClass("row" + i)
                    .addClass("row" + k)
                    .text(curr + pre);
                changeStyle(box);
            } else { //如果数字不相等
                if (!array[k - 1][j]) {
                    isMoved = true;
                    array[i][j] = 0; //原来的位置设置成0
                    array[k - 1][j] = pre; //检查位置设置成pre

                    box = posFinder(i, j)
                        .removeClass("row" + i)
                        .addClass("row" + (k - 1));
                }
            }
            return isMoved;
        }
    }
    if (array[3][j] == 0) {
        isMoved = true;
    }
    //前面都是0
    array[i][j] = 0;
    array[3][j] = pre;
    var box = posFinder(i, j).removeClass("row" + i)
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
        if ( keyCode == 37) {
            if (leftHandler()) {
                generate();
                if (isGameover() == true) {
                    alert("game over");
                    return;
                }
            }
        } else if ( keyCode == 38) {
            if (upHandler()) {
                generate();
                if (isGameover() == true) {
                    alert("game over");
                    return;
                }
            }
        } else if ( keyCode == 39) {
            if (rightHandler()) {
                generate();
                if (isGameover() == true) {
                    alert("game over");
                    return;
                }
            }
        } else if ( keyCode == 40) {
            if (downHandler()) {
                generate();
                if (isGameover() == true) {
                    alert("game over");
                    return;
                }
            }
        }
    });
})