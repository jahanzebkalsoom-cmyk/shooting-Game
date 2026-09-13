import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { Controls } from "./controls.js";
import { Player } from "./player.js";
import { Weapon } from "./weapon.js";
import { Targets } from "./enemies.js";
import { HUD } from "./hud.js";
import { Missions } from "./missions.js";


export class Game {

    constructor(container) {

        this.container = container;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111820);


        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );


        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        this.renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        this.container.appendChild(
            this.renderer.domElement
        );


        // Camera settings
        this.cameraDistance = 9;
        this.cameraHeight = 4;

        this.cameraYaw = 0;
        this.cameraPitch = 0.25;

        this.mouseSensitivity = 0.003;

        this.isPointerLocked = false;


        // Lights
        const ambient = new THREE.AmbientLight(
            0xffffff,
            1.5
        );

        this.scene.add(ambient);


        const sun = new THREE.DirectionalLight(
            0xffffff,
            2
        );

        sun.position.set(20, 30, 10);

        this.scene.add(sun);


        // Create arena
        this.createArena();


        // Controls
        this.controls = new Controls();


        // Player
        this.player = new Player(
            this.scene
        );


        // Targets
        this.targets = new Targets(
            this.scene
        );


        // HUD
        this.hud = new HUD();


        // Weapon
       this.weapon = new Weapon(
    this.camera,
    this.targets,
    this.player,
    this.scene
);



        // Missions
        this.missions = new Missions(
            this.hud,
            this.targets
        );


        this.clock = new THREE.Clock();

        this.running = true;


        this.setupEvents();

        this.animate();
    }


    createArena() {

        // Ground
        const groundGeometry =
            new THREE.PlaneGeometry(
                100,
                100
            );

        const groundMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x303840
            });

        const ground =
            new THREE.Mesh(
                groundGeometry,
                groundMaterial
            );

        ground.rotation.x =
            -Math.PI / 2;

        this.scene.add(ground);


        // Wall material
        const wallMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x59636e
            });


        // Back wall
        this.createWall(
            0,
            3,
            -48,
            100,
            6,
            2,
            wallMaterial
        );


        // Front wall
        this.createWall(
            0,
            3,
            48,
            100,
            6,
            2,
            wallMaterial
        );


        // Left wall
        this.createWall(
            -48,
            3,
            0,
            2,
            6,
            100,
            wallMaterial
        );


        // Right wall
        this.createWall(
            48,
            3,
            0,
            2,
            6,
            100,
            wallMaterial
        );


        // Obstacles
        for (let i = 0; i < 12; i++) {

            const geometry =
                new THREE.BoxGeometry(
                    4,
                    2,
                    4
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0x46515c
                });

            const box =
                new THREE.Mesh(
                    geometry,
                    material
                );

            box.position.set(
                (Math.random() - 0.5) * 70,
                1,
                (Math.random() - 0.5) * 60
            );

            this.scene.add(box);
        }
    }


    createWall(
        x,
        y,
        z,
        width,
        height,
        depth,
        material
    ) {

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const wall =
            new THREE.Mesh(
                geometry,
                material
            );

        wall.position.set(
            x,
            y,
            z
        );

        this.scene.add(wall);
    }


    setupEvents() {

        // Click game → lock mouse
        this.renderer.domElement.addEventListener(
            "click",
            () => {

                this.renderer.domElement.requestPointerLock();

            }
        );


        // Check mouse lock
        document.addEventListener(
            "pointerlockchange",
            () => {

                this.isPointerLocked =
                    document.pointerLockElement ===
                    this.renderer.domElement;

            }
        );


        // Mouse camera control
        document.addEventListener(
            "mousemove",
            (event) => {

                if (!this.isPointerLocked) {
                    return;
                }


                this.cameraYaw -=
                    event.movementX *
                    this.mouseSensitivity;


                this.cameraPitch -=
                    event.movementY *
                    this.mouseSensitivity;


                this.cameraPitch =
                    THREE.MathUtils.clamp(
                        this.cameraPitch,
                        -0.35,
                        0.8
                    );

            }
        );


        // Shooting
        window.addEventListener(
            "mousedown",
            (event) => {

                if (
                    event.button !== 0 ||
                    !this.running
                ) {
                    return;
                }


                const hit =
                    this.weapon.shoot();


                if (hit) {

                    const destroyed =
                        this.targets.hitTarget(
                            hit
                        );


                    if (destroyed) {

                        this.missions.targetHit();

                    }
                }


                this.updateHUD();

            }
        );


        // Reload
        window.addEventListener(
            "keydown",
            (event) => {

                if (event.code === "KeyR") {

                    this.weapon.reload();

                    this.updateHUD();

                }

            }
        );


        // Resize
        window.addEventListener(
            "resize",
            () => {

                this.camera.aspect =
                    window.innerWidth /
                    window.innerHeight;

                this.camera.updateProjectionMatrix();


                this.renderer.setSize(
                    window.innerWidth,
                    window.innerHeight
                );

            }
        );
    }


    updateHUD() {

        this.hud.updateHealth(
            this.player.health
        );

        this.hud.updateAmmo(
            this.weapon.ammo,
            this.weapon.reserveAmmo
        );

        this.missions.update();
    }


    updateCamera() {

        const player =
            this.player.object;


        // Camera looks at player
        const target =
            new THREE.Vector3(
                player.position.x,
                player.position.y + 1.5,
                player.position.z
            );


        // Camera horizontal distance
        const horizontalDistance =
            this.cameraDistance *
            Math.cos(this.cameraPitch);


        // Camera X
        const cameraX =
            player.position.x +
            Math.sin(this.cameraYaw) *
            horizontalDistance;


        // Camera Z
        const cameraZ =
            player.position.z +
            Math.cos(this.cameraYaw) *
            horizontalDistance;


        // Camera Y
        const cameraY =
            player.position.y +
            this.cameraHeight +
            Math.sin(this.cameraPitch) *
            this.cameraDistance;


        const desiredPosition =
            new THREE.Vector3(
                cameraX,
                cameraY,
                cameraZ
            );


        // Smooth camera
        this.camera.position.lerp(
            desiredPosition,
            0.12
        );


        // Look at player
        this.camera.lookAt(
            target
        );
    }


    animate() {

        requestAnimationFrame(
            () => this.animate()
        );


        if (!this.running) {
            return;
        }


        const delta =
            Math.min(
                this.clock.getDelta(),
                0.05
            );


        // Player movement
        this.player.update(
            delta,
            this.controls
        );


        // Camera
        this.updateCamera();


        // HUD
        this.updateHUD();


        // Render
        this.renderer.render(
            this.scene,
            this.camera
        );
    }
}