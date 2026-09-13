import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Player {

    constructor(scene) {

        this.scene = scene;

        this.position = new THREE.Vector3(0, 1.25, 8);

        this.velocityY = 0;

        this.speed = 6;

        this.sprintSpeed = 10;

        this.jumpPower = 8;

        this.onGround = true;

        this.health = 100;

        this.createPlayer();
    }


    createPlayer() {

        const group = new THREE.Group();

        // Body

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.5,
                1.3,
                4,
                8
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x2979ff
            });

        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        body.position.y = 1.2;

        group.add(body);


        // Head

        const headGeometry =
            new THREE.SphereGeometry(
                0.35,
                16,
                16
            );

        const headMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xf0c7a4
            });

        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );

        head.position.y = 2.35;

        group.add(head);


        this.object = group;

        this.object.position.copy(
            this.position
        );

        this.scene.add(this.object);
    }


    update(delta, controls) {

        let speed = this.speed;

        if (controls.isPressed("ShiftLeft")) {
            speed = this.sprintSpeed;
        }


        const direction =
            new THREE.Vector3();


        if (controls.isPressed("KeyW")) {
            direction.z -= 1;
        }

        if (controls.isPressed("KeyS")) {
            direction.z += 1;
        }

        if (controls.isPressed("KeyA")) {
            direction.x -= 1;
        }

        if (controls.isPressed("KeyD")) {
            direction.x += 1;
        }


        if (direction.length() > 0) {

            direction.normalize();

            this.object.position.x +=
                direction.x * speed * delta;

            this.object.position.z +=
                direction.z * speed * delta;

        }


        // Jump

        if (
            controls.isPressed("Space") &&
            this.onGround
        ) {

            this.velocityY =
                this.jumpPower;

            this.onGround = false;
        }


        // Gravity

        this.velocityY -=
            20 * delta;

        this.object.position.y +=
            this.velocityY * delta;


        // Ground collision

        if (this.object.position.y <= 0) {

            this.object.position.y = 0;

            this.velocityY = 0;

            this.onGround = true;
        }


        // Arena boundary

        this.object.position.x =
            THREE.MathUtils.clamp(
                this.object.position.x,
                -45,
                45
            );

        this.object.position.z =
            THREE.MathUtils.clamp(
                this.object.position.z,
                -45,
                45
            );
    }


    takeDamage(amount) {

        this.health -= amount;

        if (this.health < 0) {
            this.health = 0;
        }
    }
}