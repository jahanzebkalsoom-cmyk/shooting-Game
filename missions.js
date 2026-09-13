export class Missions {

    constructor(hud, targets) {

        this.hud = hud;

        this.targets = targets;

        this.currentMission = 1;

        this.score = 0;

        this.startTime = Date.now();

        this.update();
    }


    targetHit() {

        this.score += 100;

        this.update();
    }


    getRemainingTargets() {

        return this.targets.targets.filter(
            target => target.visible
        ).length;
    }


    update() {

        const remaining =
            this.getRemainingTargets();

        this.hud.updateScore(
            this.score
        );

        this.hud.updateMission(
            `Mission 1: Hit all targets | Remaining: ${remaining}`
        );
    }
}