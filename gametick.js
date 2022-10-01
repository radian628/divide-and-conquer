function gametick(game) {
    game.forEach(function (e) {
        e.tickUpdate(game);
    });
    for (var i = 0; game.length > i; i++) {
        if (game[i].dead) {
            game.splice(i, 1);
            i--;
        }
    }
}

function texttick(game) {
    game.forEach(function (e) {
        if (e.objtype == "text" || e.objtype == "titletext") {
            e.tickUpdate(game);
        }
    });
    for (var i = 0; game.length > i; i++) {
        if (game[i].dead) {
            game.splice(i, 1);
            i--;
        }
    }
}

function drawtick(game) {
    ctx.strokeStyle = colors.objects;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    game.forEach(function (e) {
        if (!e.tower) {
            e.draw(ctx);
        }
    });
    game.forEach(function (e) {
        if (e.tower) {
            e.draw(ctx);
        }
    });
    game.forEach(function (e) {
        if (e.objtype == "text" || e.objtype == "titletext") {
            e.draw(ctx);
        }
    });
}