import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export class Targets {

    constructor(scene) {

        this.scene = scene;

        this.targets = [];

        this.createTargets();
    }


    createTargets() {

        const positions = [

            [-8, 1.5, -12],
            [0, 1.5, -15],
            [8, 1.5, -12],

            [-12, 1.5, -25],
            [5, 1.5, -28],
            [15, 1.5, -20]

        ];


        positions.forEach(
            (position, index) => {

                this.createTarget(
                    position,
                    index
                );

            }
        );
    }


    createTarget(position, index) {

        const group =
            new THREE.Group();


        // Target body
        const bodyGeometry =
            new THREE.SphereGeometry(
                1.2,
                32,
                32
            );


        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xe52b32,
                roughness: 0.4
            });


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );


        body.position.y = 1.5;


        group.add(body);


        // Target center
        const centerGeometry =
            new THREE.SphereGeometry(
                0.45,
                24,
                24
            );


        const centerMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            });


        const center =
            new THREE.Mesh(
                centerGeometry,
                centerMaterial
            );


        center.position.set(
            0,
            1.5,
            0.95
        );


        group.add(center);


        // Target data
        group.userData.target = true;

        group.userData.health = 100;

        group.userData.index = index;

        group.userData.destroyed =
            false;


        group.position.set(
            position[0],
            0,
            position[2]
        );


        this.scene.add(group);

        this.targets.push(group);
    }


    checkHit(raycaster) {

        const objects = [];


        this.targets.forEach(
            target => {

                if (
                    !target.userData.destroyed
                ) {

                    target.traverse(
                        object => {

                            if (
                                object.isMesh
                            ) {

                                objects.push(
                                    object
                                );

                            }

                        }
                    );

                }

            }
        );


        const hits =
            raycaster.intersectObjects(
                objects,
                true
            );


        if (hits.length === 0) {

            return null;
        }


        let object =
            hits[0].object;


        // Find parent target
        while (
            object &&
            !object.userData.target
        ) {

            object =
                object.parent;

        }


        if (
            !object ||
            !object.userData.target
        ) {

            return null;
        }


        return object;
    }


    hitTarget(target) {

        if (!target) {
            return false;
        }


        if (
            target.userData.destroyed
        ) {
            return false;
        }


        // Damage
        target.userData.health -= 100;


        // Hit animation
        this.hitAnimation(
            target
        );


        if (
            target.userData.health <= 0
        ) {

            target.userData.destroyed =
                true;


            setTimeout(() => {

                this.scene.remove(
                    target
                );

            }, 150);


            return true;
        }


        return false;
    }


    hitAnimation(target) {

        target.scale.set(
            1.3,
            1.3,
            1.3
        );


        setTimeout(() => {

            if (
                !target.userData.destroyed
            ) {

                target.scale.set(
                    1,
                    1,
                    1
                );

            }

        }, 100);
    }


    getRemaining() {

        return this.targets.filter(
            target =>
                !target.userData.destroyed
        ).length;
    }
}