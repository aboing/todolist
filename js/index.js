//点击切换
var textarea = $("#textarea");
var state = "wait";
rewrite();
$(".btn div").click(function () {
    $(".btn div")
        .removeClass("active")
        .filter(this)
        .addClass("active")
    if ($(".wait").hasClass("active")) {
        state = "wait";
    } else {
        state = "done";
    }
    rewrite();
});
//添加
$(".edir").click(function () {
    $("#main")
        .css("filter", "blur(3px)")
        .next()
        .css("display", "block")
        .next()
        .addClass("show")
});
//提交
$(".dell").click(function () {
    $("#main")
        .css("filter", "")
        .next()
        .css("display", "none")
        .next()
        .removeClass("show")
});
function getData() {
    return localStorage.list ? JSON.parse(localStorage.list) : [];
}
function savaData(data) {
    localStorage.list = JSON.stringify(data);
}
$("#submit").click(function () {
    var text = textarea.val();
    if (text === "") {
        return;
    }
    textarea.val("");
    let data = getData();
    var times = new Date().getTime();
    data.push({con: text, time: datefull(times), hms: hms(times), wait: 0, isDone: 0});
    savaData(data);
    rewrite();
    $("#main")
        .css("filter", "")
        .next()
        .css("display", "none")
        .next()
        .removeClass("show")
});
//重绘页面
function rewrite() {
    textarea.empty();
    var data = getData();
    var str = "";
    $(data).each(function (index, val) {
        if (state === "wait") {
            if (val.isDone === 0) {
                str += "<li id=" + index + "><span class='con'>" + val.con + "</span><span>" + hms() + "</span><span class='date'>" + datefull() + "</span><span><i class='iconfont'>&#xe6dc;</i></span><div class='pos'><div class='dosuc'>完成</div></div></li>";
            }
        } else if (state == "done") {
            if (val.isDone === 1) {
                str += "<li id=" + index + "><span class='con'>" + val.con + "</span><span>" + hms() + "</span><span class='date'>" + datefull() + "</span><div class='pos'><div class='del'>删除</div></div></li>";
            }
        }
    });
    $(".content").html(str);
    addEvent();
}
rewrite();
//日期函数
function datefull() {
    var date = new Date();
    var year = date.getFullYear();
    var month = addzero(date.getMonth() + 1);
    var day = addzero(date.getDay());
    return year + "-" + month + "-" + day;
}
//时分秒函数
function hms() {
    var date = new Date();
    var hour = addzero(date.getHours());
    var minute = addzero(date.getMinutes());
    var second = addzero(date.getSeconds());
    return hour + ":" + minute + ":" + second;
}
//加0
function addzero(num) {
    return num < 10 ? "0" + num : num;
}
//添加事件
// var li = document.querySelector(".content li");
// var sx, mx;
// var max = 100;
// var state = "start";
// console.log(li);
// function addEvent() {
//     li.addEventListener("touchstart", function (e) {
//         sx = e.changedTouches[0].clientX;
//     })
//     li.addEventListener("touchmove", function (e) {
//         var cx = e.changedTouches[0].clientX;
//         mx = cx - sx;
//         if (state === "start") {
//             if (mx > 0 || mx < -max) {
//                 return;
//             }
//         }
//         if (state === "end") {
//             if (mx < 0) {
//                 return;
//             }
//             mx = -max + mx;
//         }
//         li.style.transform = "translate3d(" + mx + "px,0,0)";
//     });
//     li.addEventListener("touchend", function () {
//         if (Math.abs(mx) > (max / 2)) {
//             li.style.transform = "translate3d(" + (-max) + "px,0,0)";
//             state = "end";
//         } else {
//             li.style.transform = "translate3d(0,0,0)";
//             state = "start";
//         }
//         li.style.translation = "all 1s";
//     })
// }
// addEvent();
//点击收藏
var max=100;
function addEvent() {
    var li = $(".bottom ul li");
    li.each(function (index, ele) {
        var hammer = new Hammer(ele);
        var mx;
        var state = "start"
        hammer.on("panstart", function (e) {
            $(ele).css("transition", "none")
        })
        hammer.on("pan", function (e) {
            mx = e.deltaX;
            if (state === "start") {
                if (mx > 0) {
                    return;
                }
            } else {
                if (mx < 0) {
                    return;
                }
                mx = mx - max;
            }

            if (Math.abs(mx) > max) {
                return;
            }
            $(ele).css("transform", "translate3d(" + mx + "px,0,0)")
        })
        hammer.on("panend", function () {
            $(ele).css("transition", "all .5s");
            if (Math.abs(mx) > max / 2) {
                state = "end"
                $(ele).css("transform", "translate3d(" + (-max) + "px,0,0)")
            } else {
                state = "start"
                $(ele).css("transform", "translate3d(0,0,0)")
            }
        })

    })
}
//完成事件
$(".dosuc").click(function () {
    var data = getData();
    var index = $(this).parent().parent().attr("id");
    data[index].isDone = 1;
    data.reverse();
    savaData(data);
    rewrite();
});
//删除事件
$(".bottom").on("click",".del",function(){
    // alert(1);
    var data = getData();
    var index = $(this).parent().attr('id');
    data.reverse();
    data.splice(index, 1);
    savaData(data);
    rewrite();
});
//收藏
var flag = true;
$("li i").on("click", function () {
    if (flag) {
        flag = false;
        $(this).css("color", "#ff8004");
    } else {
        flag = true;
        $(this).css("color", "#35163c");
    }
});