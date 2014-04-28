var MENU = 1000;
var GAME = 1001;
var PAUSE = 1002;

var Game = {
    'state': MENU,
    'canvas': null,
    'canvasPosition': null,
    'context': null,
    'timer': null
};

var mDoors = {
};

function Initialize() {
    Game.canvas = document.getElementById('game');
    Game.context = Game.canvas.getContext('2d');
    //#####PLAYER#####//   
    sounds.Initialize();
    score.Initialize();
    //#####Sprites#####//
    loadSprites();
    loadImages();
    Game.timer = setInterval("mainLoop();", 40);
}


function mainLoop()
{
    Game.canvasPosition = Game.canvas.getBoundingClientRect();
    clearCanvas();
    switch (Game.state) {
        case GAME:
            //MAP
            drawMap(player.Map);
            //COLLISIONS
            CheckCollisions();
            //DOORS
            updateRoom();
            //PLAYER
            player.Update();
            //SCORE
            score.Update();
            break;
        case MENU:
            menu.Use();
            break;
        case PAUSE:
            break;
    }
}

function CheckCollisions() {
    for (var i = 0; i < getAllDoorsInRoom(player.room).length; i++) {
        if ((getAllDoorsInRoom(player.room)[i].x + getAllDoorsInRoom(player.room)[i].width >= player.x && getAllDoorsInRoom(player.room)[i].x <= player.x + player.width) || (getAllDoorsInRoom(player.room)[i].x <= player.x + player.width && getAllDoorsInRoom(player.room)[i].x + getAllDoorsInRoom(player.room)[i].width >= player.x)) {
            if ((getAllDoorsInRoom(player.room)[i].y + getAllDoorsInRoom(player.room)[i].height >= player.y && getAllDoorsInRoom(player.room)[i].y <= player.y + player.height) || (getAllDoorsInRoom(player.room)[i].y <= player.y + player.height && getAllDoorsInRoom(player.room)[i].y + getAllDoorsInRoom(player.room)[i].height >= player.y)) {
                if (getAllDoorsInRoom(player.room)[i].lock == false) {
                    initRoom(player.Map, getRoomIdWithDoor(getAllDoorsInRoom(player.room)[i].arrival));
                    PopCoolDown = 120;
                    EnemyList = [];
                    player.Projectile = 0;
                    switch (getDoorWithId(getAllDoorsInRoom(player.room)[i].arrival).place) {
                        case TOP:
                            player.y = getDoorWithId(getAllDoorsInRoom(player.room)[i].arrival).y + getAllDoorsInRoom(player.room)[i].height + 7;
                            break;
                        case LEFT:
                            player.x = getDoorWithId(getAllDoorsInRoom(player.room)[i].arrival).x + getAllDoorsInRoom(player.room)[i].width + 7;
                            break;
                        case RIGHT:
                            player.x = getDoorWithId(getAllDoorsInRoom(player.room)[i].arrival).x - getAllDoorsInRoom(player.room)[i].width - 35;
                            break;
                        case BOTTOM:
                            player.y = getDoorWithId(getAllDoorsInRoom(player.room)[i].arrival).y - getAllDoorsInRoom(player.room)[i].height - 35;
                            break;
                    }
                    player.room = getRoomIdWithDoor(getAllDoorsInRoom(player.room)[i].arrival);
                } else {
                    if (player.object1 === getAllDoorsInRoom(player.room)[i].color || player.object2 === getAllDoorsInRoom(player.room)[i].color || player.object3 === getAllDoorsInRoom(player.room)[i].color) {
                        getAllDoorsInRoom(player.room)[i].lock = false;
                        getDoorWithId(getAllDoorsInRoom(player.room)[i].arrival).lock = false;
                    }
                }
            }
        }
    }
    for (var i = 0; i < getAllObjectsInRoom(player.room).length; i++) {
        if ((getAllObjectsInRoom(player.room)[i].x + getAllObjectsInRoom(player.room)[i].width >= player.x && getAllObjectsInRoom(player.room)[i].x <= player.x + player.width) || (getAllObjectsInRoom(player.room)[i].x <= player.x + player.width && getAllObjectsInRoom(player.room)[i].x + getAllObjectsInRoom(player.room)[i].width >= player.x)) {
            if ((getAllObjectsInRoom(player.room)[i].y + getAllObjectsInRoom(player.room)[i].height >= player.y && getAllObjectsInRoom(player.room)[i].y <= player.y + player.height) || (getAllObjectsInRoom(player.room)[i].y <= player.y + player.height && getAllObjectsInRoom(player.room)[i].y + getAllObjectsInRoom(player.room)[i].height >= player.y)) {
                if (getAllObjectsInRoom(player.room)[i].collidable)
                    return true;
            }
        }
    }
}

function WouldCollide(dX, dY) {
    for (var i = 0; i < getAllObjectsInRoom(player.room).length; i++) {
        if ((getAllObjectsInRoom(player.room)[i].x + getAllObjectsInRoom(player.room)[i].width >= player.x + dX && getAllObjectsInRoom(player.room)[i].x <= player.x + dX + player.width) || (getAllObjectsInRoom(player.room)[i].x <= player.x + dX + player.width && getAllObjectsInRoom(player.room)[i].x + getAllObjectsInRoom(player.room)[i].width >= player.x + dX)) {
            if ((getAllObjectsInRoom(player.room)[i].y + getAllObjectsInRoom(player.room)[i].height >= player.y + dY && getAllObjectsInRoom(player.room)[i].y <= player.y + dY + player.height) || (getAllObjectsInRoom(player.room)[i].y <= player.y + dY + player.height && getAllObjectsInRoom(player.room)[i].y + getAllObjectsInRoom(player.room)[i].height >= player.y + dY)) {
                if (getAllObjectsInRoom(player.room)[i].collidable)
                    return true;
            }
        }
    }
}

function tempChangerSalle() {
    player.room = 1 * document.getElementById("salle").value;
}

function updateRoom() {
    //#####PORTES#######
    for (var i = 0; i < getAllDoorsInRoom(player.room).length; i++) {
        var currentDoor = getAllDoorsInRoom(player.room)[i];
        if (currentDoor.color == null && (mDoors[currentDoor] <= 0 || !containsKey(mDoors, currentDoor))) {
            if (Math.floor((Math.random() * 10) + 1) > 4) {
                mDoors[currentDoor] = 60;
                currentDoor.lock = !currentDoor.lock;
            }
        } else {
            if (containsKey(mDoors, currentDoor)) {
                mDoors[currentDoor]--;
            }
        }
    }
    //#######ENEMIS########
    PopCoolDown--;
    if (PopCoolDown <= 0) {
        EnemyList.push(new enemy(Math.floor(Math.random() * 200) + 400, Math.floor(Math.random() * 200) + 400, Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)));
        PopCoolDown = 60;
    }
    EnemyList.forEach(function(entry) {
        entry.Update();
    });
}

function containsKey(array, key) {
    for (var v in array) {
        if (v == key)
            return true;
    }
    return false;
}

function contains(array, value) {
    array.forEach(function(entry) {
        if (entry == value)
            return true;
    });
    return false;
}
