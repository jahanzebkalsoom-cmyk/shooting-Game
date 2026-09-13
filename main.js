
import { Game } from "./game.js"; 
const gameContainer =
    document.getElementById(
        "game-container"
    );


const startScreen =
    document.getElementById(
        "start-screen"
    );


const hud =
    document.getElementById(
        "hud"
    );


const startButton =
    document.getElementById(
        "start-btn"
    );


let game = null;


startButton.addEventListener(
    "click",
    () => {

        startScreen.classList.add(
            "hidden"
        );

        hud.classList.remove(
            "hidden"
        );


        game =
            new Game(
                gameContainer
            );

    }
);
