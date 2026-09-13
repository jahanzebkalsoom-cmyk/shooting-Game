export class HUD {

    constructor() {

        this.health =
            document.getElementById("health");

        this.ammo =
            document.getElementById("ammo");

        this.score =
            document.getElementById("score");

        this.mission =
            document.getElementById("mission-info");
    }


    updateHealth(value) {

        this.health.textContent =
            Math.round(value);
    }


    updateAmmo(current, reserve) {

        this.ammo.textContent =
            `${current} / ${reserve}`;
    }


    updateScore(value) {

        this.score.textContent =
            value;
    }


    updateMission(text) {

        this.mission.textContent =
            text;
    }
}