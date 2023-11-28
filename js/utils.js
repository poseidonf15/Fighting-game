function checkBox(rect){
    c.fillStyle = "white"
    c.fillRect(rect.position.x, rect.position.y, 1, rect.height)
    c.fillRect(rect.position.x + rect.width, rect.position.y, 1, rect.height)
}

function rectCollision({rect1, rect2}) {
    if (0 < rect1.dirX * rect1.attackBox.offset.x){   
        return(
            rect1.position.x + rect1.width / 2 + rect1.dirX * rect1.attackBox.offset.x <= rect2.position.x + rect2.width &&
            rect1.position.x + rect1.width / 2 + rect1.dirX * rect1.attackBox.offset.x + rect1.dirX * rect1.attackBox.width >= rect2.position.x &&
            rect1.position.y + rect1.height / 2 + rect1.attackBox.offset.y <= rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height / 2 + rect1.attackBox.offset.y + rect1.attackBox.height >= rect2.position.y 
        )
    }else {
        return(
            rect1.position.x + rect1.width / 2 + rect1.dirX * rect1.attackBox.offset.x >= rect2.position.x &&
            rect1.position.x + rect1.width / 2 + rect1.dirX * rect1.attackBox.offset.x + rect1.dirX * rect1.attackBox.width <= rect2.position.x + rect2.width &&
            rect1.position.y + rect1.height / 2 + rect1.attackBox.offset.y <= rect2.position.y + rect2.height &&
            rect1.position.y + rect1.height / 2 + rect1.attackBox.offset.y + rect1.attackBox.height >= rect2.position.y 
        )
    }
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId);
    if (player.health == enemy.health) {
        document.querySelector("#displayText").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
        document.querySelector("#displayText").innerHTML = "Player 1 Wins";
    } else if (enemy.health > player.health) {
        document.querySelector("#displayText").innerHTML = "Player 2 Wins";
    }
    document.querySelector("#displayText").style.display = "flex";
}

let timer = 60;
let timerId;
function decreaseTimer(){1
    if (timer > 0){
        timerId = setTimeout(decreaseTimer, 1000);
        timer -= 1;
        document.querySelector("#timer").innerHTML = timer;
    }
    else{
        determineWinner({player, enemy, timerId});
    }
}
