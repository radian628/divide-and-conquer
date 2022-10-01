var o = [];

var select = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    stage: 0,
    objs: []
};

var zoom = 1;
var dzoom = 0;

function loop() {
    if (keysDown["Enter"]) {
        started = true;
    }
    if (started) {
        gametick(o);
    } else {
        texttick(o);
    }

    if (currentLevel.winCondition(o)) {
        nextLevel();
    }

    ctx.lineDashOffset += 0.3;
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.save();

    dzoom += mouseWheel / 100;
    zoom *= dzoom + 1;
    dzoom *= 0.9;

    ctx.translate(c.width / 2, c.height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(mouseOffsetX, mouseOffsetY);
    drawtick(o);

    if (select.stage == 1) {
        ctx.setLineDash([5 * Math.PI, 5 * Math.PI]);
        ctx.beginPath();
        ctx.rect(select.x, select.y, mouseXT - select.x, mouseYT - select.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    o.forEach(function (e) {
        if (select.objs.indexOf(e.id) != -1) {
            ctx.setLineDash([5 * Math.PI, 5 * Math.PI]);
            ctx.beginPath();
            ctx.rect(e.x - 20, e.y - 20, 40, 40);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });

    ctx.restore();

    if (mouseButtons[2]) {
        if (select.stage == 0) {
            select.x = mouseXT;
            select.y = mouseYT;
            select.dx = mouseXT;
            select.dy = mouseYT;
            select.stage = 1;
        }
    } else {
        if (select.stage == 1) {
            select.dx = mouseXT;
            select.dy = mouseYT;
            select.objs = [];
            o.forEach(function (e) {
                if ((withinRectangle(select.x, select.y, select.dx, select.dy, e.x, e.y) || distance(mouseXT, mouseYT, e.x, e.y) < 15) && e.team == 0 && e.tower) {
                    select.objs.push(e.id);
                }
            })
            select.stage = 0;
        }
    }

    if (keysDown["e"]) {
        o.forEach(function (e) {
            if (select.objs.indexOf(e.id) != -1 && withinCommandRange(o, e)) {
                e.orders.push({
                    x: mouseXT,
                    y: mouseYT
                })
            }
        });
    }

    if (keysDown["r"]) {
        loadLevel(o, currentLevel);
    }

    mouseWheel = 0;
    keysDown = {};
    mouseButtonsDown = [false, false, false];
    requestAnimationFrame(loop);
}