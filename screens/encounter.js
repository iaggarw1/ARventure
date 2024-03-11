import React from 'react';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

export default function ObjViewer({ objFile }) {
    // 'objFile' is the required local .obj file passed as a prop to this component
    // For example, you can pass it like <ObjViewer objFile={require('./assets/model.obj')} />

    const onContextCreate = async (gl) => {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
        camera.position.z = 2;

        const ambientLight = new THREE.AmbientLight(0xaaaaaa);
        scene.add(ambientLight);

        // Load the .obj file
        const objLoader = new OBJLoader();
        objLoader.load(
            // Convert the asset to a URI and use it in the loader
            objFile,
            (object) => {
                scene.add(object);
                object.scale.set(0.1, 0.1, 0.1); // Scale the object to a reasonable size
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('An error happened', error);
            },
        );

        const animate = () => {
            requestAnimationFrame(animate);
            // You can add rotation to the object here if you want to see it from different angles
            // object.rotation.x += 0.01;
            // object.rotation.y += 0.01;
            renderer.render(scene, camera);
            gl.endFrameEXP();
        };

        animate();
    };

    return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}
