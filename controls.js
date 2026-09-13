export class Controls {
    constructor() {
        this.keys = {};

        this.mouse = {
            x: 0,
            y: 0,
            clicked: false
        };

        window.addEventListener("keydown", (event) => {
            this.keys[event.code] = true;
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.code] = false;
        });

        window.addEventListener("mousedown", (event) => {
            if (event.button === 0) {
                this.mouse.clicked = true;
            }
        });

        window.addEventListener("mouseup", (event) => {
            if (event.button === 0) {
                this.mouse.clicked = false;
            }
        });
    }

    isPressed(key) {
        return !!this.keys[key];
    }
}