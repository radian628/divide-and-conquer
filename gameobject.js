function getAllEnemies(game, obj) {
    return game.filter(e => e.team != obj.team);
}

function getAllAllies(game, obj) {
    return game.filter(e => e.team == obj.team && e.id != obj.id && e.tower);
}

function getClosest(game, obj) {
    var minimumDistance = Infinity;
    var minimumDistanceIndex = NaN;
    game.forEach(function (e, i) {
        if (minimumDistance > distance(e.x, e.y, obj.x, obj.y)) {
            minimumDistance = distance(e.x, e.y, obj.x, obj.y);
            minimumDistanceIndex = i;
        }
    });
    if (isNaN(minimumDistanceIndex)) {
        return undefined;
    }
    return game[minimumDistanceIndex];
}

function getAllTowers(game) {
    return game.filter(e => e.tower);
}

function getClosestEnemy(game, obj) {
    return getClosest(getAllEnemies(getAllTowers(game), obj), obj);
}

function drawHealthBar(obj, context, size) {
    context.beginPath();
    context.arc(obj.x, obj.y, size, 0, obj.hp / obj.maxhp * Math.PI * 2);
    context.stroke();
}

function withinCommandRange(game, obj) {
    var controllers = game.filter(e => e.objtype == "controller" && e.team == obj.team);
    var toReturn = false;
    controllers.forEach(function (e) {
        if (distance(e.x, e.y, obj.x, obj.y) < e.range) {
            toReturn = true;
        }
    });
    return toReturn;
}

function attackClosestEnemyBehavior(game, obj, speed, range, attack) {
    var pointTo = getClosestEnemy(game, obj);
    direction = 0;
    if (pointTo && obj.orders.length == 0) {
        direction = Math.atan2(pointTo.y - obj.y, pointTo.x - obj.x);
        obj.move = true;
    } else if (obj.orders.length > 0) {
        direction = Math.atan2(obj.orders[0].y - obj.y, obj.orders[0].x - obj.x);
        obj.move = true;
        if (distance(obj.x, obj.y, obj.orders[0].x, obj.orders[0].y) < 30) {
            obj.orders.splice(0, 1);
        }
    }
    if (pointTo && distance(obj.x, obj.y, pointTo.x, pointTo.y) < range) {
        attack(obj, pointTo);
    }
    if (obj.move) {
        obj.dx += Math.cos(direction) * speed;
        obj.dy += Math.sin(direction) * speed;
    }
}

var gameObjects = {
    basic: {
        tickUpdate: function (game) {
            this.move = false;
            this.timer++;
            this.hptimer--;
            this.x += this.dx;
            this.y += this.dy;
            this.dx *= 0.8;
            this.dy *= 0.8;
            var allies = getAllAllies(game, this);
            for (var i = 0; allies.length > i; i++) {
                if (distance(allies[i].x, allies[i].y, this.x, this.y) < 15) {
                    var dirToAlly = Math.atan2(allies[i].y - this.y, allies[i].x - this.x);
                    this.dx += Math.cos(dirToAlly) * -2;
                    this.dy += Math.sin(dirToAlly) * -2;
                }
            }
            attackClosestEnemyBehavior(game, this, 0.35, 120, function (obj, enemy) {
                game.push(makeGameObject("laser", obj.x, obj.y, obj.team, [["target", enemy], ["damage", 1]]));
                if (obj.orders.length == 0) {
                    obj.move = false;
                }
            })
            if (this.hp < 0) {
                this.dead = true;
            }
        },
        draw: function (context) {
            context.fillStyle = "hsl(" + (this.team * 90) + ", 50%, 75%)";
            var direction = Math.atan2(this.dy, this.dx);
            context.save();
            context.translate(this.x, this.y);
            context.rotate(direction);
            context.beginPath();
            context.lineTo(-10, 10);
            context.lineTo(10, 0);
            context.lineTo(-10, -10);
            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
            if (this.hptimer > 0) {
                context.globalAlpha = this.hptimer / 200;
                drawHealthBar(this, context, 20);
                context.globalAlpha = 1;
            }
            context.globalAlpha = 0.2;
            context.setLineDash([5 * Math.PI, 5 * Math.PI]);
            context.beginPath();
            for (var i = 0; this.orders.length > i; i++) {
                i ? context.lineTo(this.orders[i - 1].x, this.orders[i - 1].y) : context.lineTo(this.x, this.y);
                context.lineTo(this.orders[i].x, this.orders[i].y);
            }
            context.stroke();
            context.setLineDash([]);
            context.globalAlpha = 1;
        },
        tower: true,
        custom: [],
        hp: 1000
    },
    heavy: {
        tickUpdate: function (game) {
            this.move = false;
            this.timer++;
            this.hptimer--;
            this.x += this.dx;
            this.y += this.dy;
            this.dx *= 0.8;
            this.dy *= 0.8;
            var allies = getAllAllies(game, this);
            for (var i = 0; allies.length > i; i++) {
                if (distance(allies[i].x, allies[i].y, this.x, this.y) < 15) {
                    var dirToAlly = Math.atan2(allies[i].y - this.y, allies[i].x - this.x);
                    this.dx += Math.cos(dirToAlly) * -2;
                    this.dy += Math.sin(dirToAlly) * -2;
                }
            }
            attackClosestEnemyBehavior(game, this, 0.35, 180, function (obj, enemy) {
                game.push(makeGameObject("laser", obj.x, obj.y, obj.team, [["target", enemy], ["damage", 0.2]]));
                if (obj.orders.length == 0) {
                    obj.move = false;
                }
            })
            if (this.hp < 0) {
                this.dead = true;
            }
        },
        draw: function (context) {
            context.fillStyle = "hsl(" + (this.team * 90) + ", 50%, 75%)";
            var direction = Math.atan2(this.dy, this.dx);
            context.save();
            context.translate(this.x, this.y);
            context.rotate(direction);
            context.beginPath();
            context.lineTo(-15, 15);
            context.lineTo(15, 0);
            context.lineTo(-15, -15);
            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
            if (this.hptimer > 0) {
                context.globalAlpha = this.hptimer / 200;
                drawHealthBar(this, context, 20);
                context.globalAlpha = 1;
            }
            context.globalAlpha = 0.2;
            context.setLineDash([5 * Math.PI, 5 * Math.PI]);
            context.beginPath();
            for (var i = 0; this.orders.length > i; i++) {
                i ? context.lineTo(this.orders[i - 1].x, this.orders[i - 1].y) : context.lineTo(this.x, this.y);
                context.lineTo(this.orders[i].x, this.orders[i].y);
            }
            context.stroke();
            context.setLineDash([]);
            context.globalAlpha = 1;
        },
        tower: true,
        custom: [],
        hp: 3000
    },
    laser: {
        tickUpdate: function (game) {
            this.target.hp -= this.damage;
            this.target.hptimer = 200;
            this.dead = true;
        },
        draw: function (context) {
            context.beginPath();
            context.lineTo(this.x, this.y);
            context.lineTo(this.target.x, this.target.y);
            context.stroke();
        },
        tower: false,
        custom: [["lifetime", 0]],
        hp: 0
    },
    controller: {
        tickUpdate: function () {
            if (this.hp < 0) {
                this.dead = true;
            }
        },
        draw: function (context) {
            context.fillStyle = "hsl(" + (this.team * 90) + ", 50%, 75%)"
            context.save();
            context.translate(this.x, this.y);
            context.beginPath();
            context.lineTo(-15, 15);
            context.lineTo(15, 15);
            context.lineTo(15, -15);
            context.lineTo(-15, -15);
            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
            context.setLineDash([5 * Math.PI, 5 * Math.PI]);
            context.beginPath();
            context.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            context.stroke();
            context.globalAlpha = 0.1;
            context.fill();
            context.globalAlpha = 1;
            context.setLineDash([]);
            if (this.hptimer > 0) {
                context.globalAlpha = this.hptimer / 200;
                drawHealthBar(this, context, 20);
                context.globalAlpha = 1;
            }
        },
        tower: true,
        custom: [["range", 800]],
        hp: 20000
    },
    goal: {
        tickUpdate: function (game) {
            this.containedAllies = 0;
            var allies = getAllAllies(game, this);
            for (var i = 0; allies.length > i; i++) {
                if (distance(allies[i].x, allies[i].y, this.x, this.y) < this.radius) {
                    this.containedAllies++;
                    this.touched = true;
                }
            }
        },
        draw: function (context) {
            context.setLineDash([5 * Math.PI, 5 * Math.PI]);
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
            context.setLineDash([]);
        },
        tower: false,
        custom: [],
        hp: Infinity
    },
    text: {
        tickUpdate: function (game) {
            if (keysDown["Enter"]) {
                this.dead = true;
            }
        },
        draw: function (context) {
            context.textAlign = "center";
            context.font = "18px Arial";
            context.fillStyle = "#333333";
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            for (var i = 0; this.text.length > i; i++) {
                context.fillText(this.text[i], c.width / 2, + i * 21 + c.height / 2 - this.text.length * 10);
            }
            context.restore();
        },
        tower: false,
        custom: [],
        hp: Infinity
    },
    titletext: {
        tickUpdate: function (game) {
            this.timer++;
            if (this.timer > 150) {
                this.dead = true;
            }
        },
        draw: function (context) {
            context.textAlign = "center";
            context.font = "72px Arial";
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.fillStyle = "rgba(255, 255, 255, " + ((this.timer > 100) ? (1 - (this.timer - 100) / 50) : 1) + ")";
            context.fillRect(0, 0, c.width, c.height);
            context.globalAlpha = (this.timer < 100) ? ((this.timer) / 50) : (1 - (this.timer - 100) / 50);
            context.fillStyle = "#333333";
            context.fillText(this.text, c.width / 2, c.height / 2);
            context.globalAlpha = 1;
            context.restore();
        },
        tower: false,
        custom: [],
        hp: Infinity
    }
}

var currentID = 0;
function gameObject(x, y, team, tickUpdate, draw, tower, hp, custom) {
    this.hptimer = 0;
    this.id = currentID++;
    this.hp = hp;
    this.maxhp = hp;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.team = team;
    this.timer = 0;
    this.tickUpdate = tickUpdate;
    this.draw = draw;
    this.tower = tower;
    this.orders = [];
    for (var i = 0; custom.length > i; i++) {
        this[custom[i][0]] = custom[i][1];
    }
}

function makeGameObject(type, x, y, team, custom) {
    if (!custom) custom = [];
    return new gameObject(x, y, team, gameObjects[type].tickUpdate, gameObjects[type].draw, gameObjects[type].tower, gameObjects[type].hp, gameObjects[type].custom.concat(custom).concat([["objtype", type]]));
}