var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;

var mouseX = 0;
var mouseY = 0;
var mouseXT = 0;
var mouseYT = 0;
var prevMouseX = 0;
var prevMouseY = 0;
var mouseOffsetX = 0;
var mouseOffsetY = 0;
var mouseWheel = 0;
var drag = true;
var mouseButtons = [false, false, false];
var mouseButtonsDown = [false, false, false];

document.addEventListener("mousemove", function (e) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseXT = (e.clientX - c.width / 2) / zoom - mouseOffsetX;
    mouseYT = (e.clientY - c.height / 2) / zoom - mouseOffsetY;

    if (mouseButtons[0] && drag) {
        mouseOffsetX += (mouseX - prevMouseX) / zoom;
        mouseOffsetY += (mouseY - prevMouseY) / zoom;
    }
});

document.addEventListener("mousedown", function (e) {
    mouseButtons[e.which - 1] = true;
    mouseButtonsDown[e.which - 1] = true;
});

document.addEventListener("mouseup", function (e) {
    mouseButtons[e.which - 1] = false;
    mouseButtonsDown[e.which - 1] = false;
});

document.addEventListener("wheel", function (e) {
    mouseWheel = e.deltaY / 100;
}, false);

var keys = {};
var keysDown = {};

document.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    keysDown[e.key] = true;
}, false);
document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
    keysDown[e.key] = false;
}, false);

window.addEventListener("resize", function (e) {
    c.width = window.innerWidth;
    c.height = window.innerHeight;
});

function distance(a, b, c, d) {
    return Math.sqrt((a - c) ** 2 + (b - d) ** 2);
}

function between(a, b, value) {
    if (a < b) {
        return value > a && value < b;
    } else {
        return value < a && value > b;
    }
}

function withinRectangle(a, b, c, d, x, y) {
    return between(a, c, x) && between(b, d, y);
}

var colors = {
    background: "#EEEEEE",
    objects: "#333333",
    teams: []
};