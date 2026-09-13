import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Weapon {

    constructor(camera, targets, player, scene) {

        this.camera = camera;
        this.targets = targets;
        this.player = player;
        this.scene = scene;

        this.magazineSize = 30;
        this.ammo = 30;
        this.reserveAmmo = 120;

        this.damage = 100;
        this.fireRate = 120;
        this.lastShot = 0;

        this.raycaster = new THREE.Raycaster();

        this.createGun();
        this.createEffects();
    }

    createGun() {

        this.gun = new THREE.Group();

        // Gun body
        const bodyGeometry = new THREE.BoxGeometry(
            0.25,
            0.25,
            1.4
        );

        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x20242a,
            metalness: 0.8,
            roughness: 0.3
        });

        const body = new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

        body.position.set(
            0,
            -0.15,
            -0.7
        );

        this.gun.add(body);

        // Barrel
        const barrelGeometry = new THREE.CylinderGeometry(
            0.06,
            0.06,
            0.8,
            16
        );

        const barrelMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.9
        });

        const barrel = new THREE.Mesh(
            barrelGeometry,
            barrelMaterial
        );

        barrel.rotation.x = Math.PI / 2;

        barrel.position.set(
            0,
            -0.15,
            -1.7
        );

        this.gun.add(barrel);

        // Handle
        const handleGeometry = new THREE.BoxGeometry(
            0.18,
            0.5,
            0.25
        );

        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x15181c
        });

        const handle = new THREE.Mesh(
            handleGeometry,
            handleMaterial
        );

        handle.position.set(
            0,
            -0.45,
            -0.45
        );

        handle.rotation.x = -0.2;

        this.gun.add(handle);

        // Gun position
        this.gun.position.set(
            0.65,
            -0.55,
            -1.2
        );

        this.gun.rotation.y = Math.PI;

        this.camera.add(this.gun);
    }

    createEffects() {

        // Muzzle flash
        const flashGeometry = new THREE.SphereGeometry(
            0.18,
            12,
            12
        );

        const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xffcc33
        });

        this.muzzleFlash = new THREE.Mesh(
            flashGeometry,
            flashMaterial
        );

        this.muzzleFlash.position.set(
            0.65,
            -0.7,
            -3.0
        );

        this.muzzleFlash.visible = false;

        this.camera.add(this.muzzleFlash);
    }

    shoot() {

        const now = performance.now();

        // Fire rate
        if (now - this.lastShot < this.fireRate) {
            return null;
        }

        // No ammo
        if (this.ammo <= 0) {
            this.playEmptySound();
            return null;
        }

        this.lastShot = now;
        this.ammo--;

        // Flash
        this.showMuzzleFlash();

        // Sound
        this.playShootSound();

        // Ray from screen center
        this.raycaster.setFromCamera(
            new THREE.Vector2(0, 0),
            this.camera
        );

        // Bullet start
        const startPoint = new THREE.Vector3();

        this.camera.getWorldPosition(
            startPoint
        );

        // Bullet direction
        const direction = new THREE.Vector3();

        this.camera.getWorldDirection(
            direction
        );

        // Bullet end
        const endPoint = startPoint.clone().add(
            direction.multiplyScalar(100)
        );

        // Check target hit
        const hit = this.targets.checkHit(
            this.raycaster
        );

        if (hit) {

            const hitPoint = new THREE.Vector3();

            hit.getWorldPosition(
                hitPoint
            );

            // Blue bullet tracer
            this.createTracer(
                startPoint,
                hitPoint
            );

        } else {

            // Tracer into distance
            this.createTracer(
                startPoint,
                endPoint
            );
        }

        return hit;
    }

    createTracer(startPoint, endPoint) {

        const geometry =
            new THREE.BufferGeometry().setFromPoints([
                startPoint,
                endPoint
            ]);

        const material =
            new THREE.LineBasicMaterial({
                color: 0x00bfff,
                transparent: true,
                opacity: 1
            });

        const tracer = new THREE.Line(
            geometry,
            material
        );

        this.scene.add(tracer);

        setTimeout(() => {

            this.scene.remove(tracer);

            geometry.dispose();
            material.dispose();

        }, 100);
    }

    showMuzzleFlash() {

        this.muzzleFlash.visible = true;

        setTimeout(() => {

            this.muzzleFlash.visible = false;

        }, 60);
    }

    reload() {

        if (this.ammo >= this.magazineSize) {
            return;
        }

        if (this.reserveAmmo <= 0) {
            return;
        }

        const needed =
            this.magazineSize - this.ammo;

        const amount =
            Math.min(
                needed,
                this.reserveAmmo
            );

        this.ammo += amount;

        this.reserveAmmo -= amount;
    }

    playShootSound() {

        try {

            const AudioContext =
                window.AudioContext ||
                window.webkitAudioContext;

            const audio = new AudioContext();

            const oscillator =
                audio.createOscillator();

            const gain =
                audio.createGain();

            oscillator.type = "square";

            oscillator.frequency.value = 130;

            gain.gain.setValueAtTime(
                0.08,
                audio.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audio.currentTime + 0.08
            );

            oscillator.connect(gain);

            gain.connect(
                audio.destination
            );

            oscillator.start();

            oscillator.stop(
                audio.currentTime + 0.08
            );

        } catch (error) {

            console.log(
                "Audio unavailable"
            );
        }
    }

    playEmptySound() {

        console.log(
            "CLICK - Reload required"
        );
    }
}