import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const cubeGeo = new THREE.BufferGeometry();
let cubeVertices = [
    1, 1, 0,
    -1, 1, 0,
    -1, -1, 0,
    1, -1, 0
]

cubeGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(cubeVertices), 3 ) );

const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 });

const cube = new THREE.Points(cubeGeo, dotMaterial);
scene.add(cube);

camera.position.z = 10;
controls.update();

let t = 0;
function animate() {
    renderer.render( scene, camera );

}