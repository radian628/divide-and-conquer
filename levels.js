var currentLevel;
var currentLevelIndex = 0;
var started = false;

function loadLevel(game, level) {
    started = false;
    currentLevel = level;
    game.splice(0, game.length);
    console.log(level);
    level.startingArea.forEach(function (e) {
        game.push(makeGameObject(e.type, e.x, e.y, e.team, e.custom));
    });
    if (level.init) {
        level.init(game);
    }
}

function nextLevel() {
    loadLevel(o, levels[currentLevelIndex++]);
}

function findCustomID(game, id) {
    for (var i = 0; game.length > i; i++) {
        if (id == game[i].customID) {
            return i;
        }
    }
    return undefined;
}

var levels = [
    {
        startingArea: [
            {
                type: "basic",
                x: 0,
                y: 0,
                team: 0
            },
            {
                type: "controller",
                x: -50,
                y: 0,
                team: 0
            },
            {
                type: "goal",
                x: 250,
                y: 0,
                team: 0,
                custom: [["radius", 50], ["customID", 0]]
            },
            {
                type: "text",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", [
                    "Your goal: Move your unit (red triangle) to the goal area (the small circle).",
                    "Right click to select units.",
                    "Press 'E' to command them to move to a location.",
                    "Remember to stay inside of the red area.",
                    "This is the maximum communication distance for your units.",
                    "The red square is called a 'controller' and allows you to command your units.",
                    "Press 'R' to restart if necessary.",
                    "Press ENTER to remove this text, and start the level"
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 1: Tutorial"]]
            }
        ],
        winCondition: function (game) {
            return game[findCustomID(game, 0)].containedAllies > 0;
        }
    }, 
    {
        startingArea: [
            {
                type: "basic",
                x: 0,
                y: 0,
                team: 0
            },
            {
                type: "controller",
                x: -50,
                y: 0,
                team: 0
            },
            {
                type: "goal",
                x: 250,
                y: 0,
                team: 0,
                custom: [["radius", 50], ["customID", 0]]
            },
            {
                type: "goal",
                x: -250,
                y: 0,
                team: 0,
                custom: [["radius", 50], ["customID", 1]]
            },
            {
                type: "goal",
                x: 0,
                y: 250,
                team: 0,
                custom: [["radius", 50], ["customID", 2]]
            },
            {
                type: "goal",
                x: 0,
                y: -250,
                team: 0,
                custom: [["radius", 50], ["customID", 3]]
            },
            {
                type: "text",
                x: 0,
                y: -350,
                team: 0,
                custom: [["text", [
                    "Reach all of the goal areas.",
                    "You can queue multiple actions for any unit.",
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 2: More Goals"]]
            }
        ],
        winCondition: function (game) {
            var winCond = true;
            for (var i = 0; 4 > i; i++) winCond = winCond && game[findCustomID(game, i)].touched;
            return winCond;
        }
    }, 
    {
        startingArea: [
            {
                type: "basic",
                x: 0,
                y: -50,
                team: 0
            },
            {
                type: "basic",
                x: 0,
                y: 50,
                team: 0
            },
            {
                type: "basic",
                x: 1500,
                y: 0,
                team: 2
            },
            {
                type: "controller",
                x: -50,
                y: 0,
                team: 0
            },
            {
                type: "text",
                x: 0,
                y: -350,
                team: 0,
                custom: [["text", [
                    "Here is an enemy unit.",
                    "Yours will make quick work of it.",
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 3: Enemies Spotted"]]
            }
        ],
        winCondition: function (game) {
            return !getAllEnemies(game, { team: 0 }).length;
        }
    }, 
    {
        startingArea: [
            {
                type: "basic",
                x: 0,
                y: -300,
                team: 0
            },
            {
                type: "basic",
                x: 0,
                y: 300,
                team: 0
            },
            {
                type: "basic",
                x: 1500,
                y: 0,
                team: 2
            },
            {
                type: "basic",
                x: 0,
                y: 1500,
                team: 2
            },
            {
                type: "basic",
                x: 0,
                y: -1500,
                team: 2
            },
            {
                type: "controller",
                x: -50,
                y: 0,
                team: 0
            },
            {
                type: "text",
                x: 0,
                y: -350,
                team: 0,
                custom: [["text", [
                    "You may notice that you are outnumbered.",
                    "However, if you play your cards right, defeating the enemy is possible. Good luck."
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 4: Safety in Numbers"]]
            }
        ],
        winCondition: function (game) {
            return !getAllEnemies(game, { team: 0 }).length;
        }
    }, 
    {
        startingArea: [
            {
                type: "controller",
                x: 0,
                y: 0,
                team: 0,
                custom: [["range", 3000]]
            },
            {
                type: "controller",
                x: 2000,
                y: 0,
                team: 2,
                custom: [["range", 3000]]
            },
            {
                type: "text",
                x: 0,
                y: -350,
                team: 0,
                custom: [["text", [
                    "All you need to do this time is destroy the enemy's controller.",
                    "Be careful, as their numbers are far greater than yours."
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 5: Raid"]]
            }
        ],
        winCondition: function (game) {
            return game.filter(e => e.objtype == "controller" && e.team != 0).length == 0;
        },
        init: function (game) {
            for (var i = -3; 3 > i; i++) {
                for (var j = -3; 3 > j; j++) {
                    game.push(makeGameObject("basic", j * 150 + 50, i * 150 + 50, 0));
                }
            }
            for (var i = -5; 5 > i; i++) {
                for (var j = -5; 5 > j; j++) {
                    game.push(makeGameObject("basic", j * 150 + 3000, i * 150, 2));
                }
            }
        }
    }, 
    {
        startingArea: [
            {
                type: "controller",
                x: 0,
                y: 0,
                team: 0,
                custom: [["range", 5000]]
            },
            {
                type: "text",
                x: 0,
                y: -350,
                team: 0,
                custom: [["text", [
                    "This one will be especially difficult.",
                    "Stop reading this text and command your forces!"
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 6: Large-scale Battle"]]
            }
        ],
        winCondition: function (game) {
            return !getAllEnemies(game, { team: 0 }).length;
        },
        init: function (game) {
            for (var i = -4; 4 > i; i++) {
                for (var j = -4; 4 > j; j++) {
                    game.push(makeGameObject("basic", j * 250 + 50, i * 250 + 50, 0));
                }
            }
            for (var i = -4; 4 > i; i++) {
                for (var j = -4; 8 > j; j++) {
                    game.push(makeGameObject("basic", j * 250 + 400, i * 250 + 400, 2));
                }
            }
        }
    }, 
    {
        startingArea: [
            {
                type: "controller",
                x: 0,
                y: 0,
                team: 0,
                custom: [["range", 5000]]
            },
            {
                type: "text",
                x: 0,
                y: -350,
                team: 0,
                custom: [["text", [
                    "You have a new type of unit, the heavy unit.",
                    "The heavy unit is much more durable and has longer range than regular units, but does less damage."
                ]]]
            },
            {
                type: "titletext",
                x: 0,
                y: -200,
                team: 0,
                custom: [["text", "Level 7: Surrounded"]]
            }
        ],
        winCondition: function (game) {
            return !getAllEnemies(game, { team: 0 }).length;
        },
        init: function (game) {
            for (var i = 1; 5 > i; i++) {
                for (var j = 0; i * 6 > j; j++) {
                    if (i == 1) {
                        game.push(makeGameObject("heavy", 150 * i * Math.cos(j * Math.PI / i / 3), 150 * i * Math.sin(j * Math.PI / i / 3), 0));
                    } else {
                        game.push(makeGameObject("basic", 150 * i * Math.cos(j * Math.PI / i / 3), 150 * i * Math.sin(j * Math.PI / i / 3), 0));
                    }
                }
            }
            for (var i = 14; 16 > i; i++) {
                for (var j = 0; i * 3 > j; j++) {
                    game.push(makeGameObject("basic", 150 * i * Math.cos(j * Math.PI / i / 1.5), 150 * i * Math.sin(j * Math.PI / i / 1.5), 2));
                }
            }
        }
    }
]

nextLevel();

loop();