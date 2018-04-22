window.onload = function(){
    var arr = init();
    //queue 维护空缺位置索引
    var queue = Array.from({length:16}).map((item,index)=>{
        return index;
    });
    //status 维护各位置状态
    var status = Array.from({length:16}).map((item,index)=>{
        return 0;
    });

    var first = generate(queue,status);
    var second = generate(queue,status);
    changeArr(arr,first);
    changeArr(arr,second);
    render(arr);
    addStyle();
    document.onkeydown = function(event){
        var e = event || window.event;
        var keyCode = e.keyCode || e.which;
        switch(keyCode){
            case(37):
                leftHandler(arr,queue,status);
                break;
            case(38):
                upHandler(arr,queue,status);
                break;
            case(39):
                rightHandler(arr,queue,status);
                break;
            case(40):
                downHandler(arr,queue,status);
                break;
            default:
                break;
        }
    }
}
function rightHandler(arr,queue,status){
    var nodes = document.getElementsByClassName('row-item');
    for(var i=0;i<4;i++){
        var parent = document.getElementById(`row${i+1}`);
        var pre,cur;
        for(var j=0;j<4;j++){ 
            if( arr[i][j+1] === 0 && arr[i][j] !== 0){
                arr[i][j+1] = arr[i][j];
                parent.removeChild(nodes[i*4+j+1]);
                var a = document.createElement('div');
                a.className += 'row-item';
                parent.insertBefore(a,nodes[i*4]);
            }
        }
    }
}
function createRowItem(num){
    var fragment = document.createDocumentFragment();
    for(var i=0;i<num;i++){
        var a = document.createElement('div');
        a.class = 'row-item';
        fragment.appendChild(a);
    }
    return fragment;
}
function init(){
    var a = new Array(4);
    for(var i=0;i<4;i++){
        a[i] = new Array(4);
        for(var j=0;j<4;j++){
            a[i][j] = 0;
        }
    }
    return a;
}
function changeArr(arr,index){
    var i = Math.floor(index/4);
    var j = index%4;
    console.log(i,j);
    var val = (Math.random()>0.4)? 2 : 4;
    arr[i][j] = val;
}
function generate(queue,status){
    var len = queue.length;
    var a = Math.floor(Math.random()*len);
    var gen = queue[a];
    status[gen] = 1;
    queue.splice(a,1);
    return gen;
}
function render(arr){
    var nodes = document.getElementsByClassName('row-item');
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            nodes[i*4+j].innerText = arr[i][j]===0?'':arr[i][j];
        }
    }
}
function addStyle(){
    var nodes = document.getElementsByClassName('row-item');
    for(var i=0;i<16;i++){
        var val = parseInt(nodes[i].innerText,10);
        if(val){
            nodes[i].className = `row-item active item-num-${val}`;
        }
        if(val === 2048){
            nodes[i].className += 'glory';
        }
    }
}