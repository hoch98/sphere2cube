import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const cn = 120;
const n = cn**2;
const r = 4;
const cubeLD2 = 4;

const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

function d2r(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}

function interpolateLists(n1, n2, t) {
    if (n1.length !== n2.length) {
        throw new Error("Both lists must have the same length.");
    }

    if (t < 0 || t > 1) {
        throw new Error("Interpolation factor 't' must be between 0 and 1.");
    }

    return n1.map((num1, index) => {
        const num2 = n2[index];
        return num1 * (1 - t) + num2 * t;
    });
}

const sphereGeo = new THREE.BufferGeometry();
const cubeGeo = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
let sphereVertices =[]
let cubeVertices =[]

for(let i = 0; i < Math.sqrt(n); i++) {
    let x, y, z, Rn;
    x = 0
    z = r*Math.sin(d2r(180*i/Math.sqrt(n)-90))
    y = 0
    for (let j = 0; j < Math.sqrt(n); j++) {
        Rn = r*Math.sin(d2r(180*i/Math.sqrt(n)))
        x = Rn*Math.cos(d2r(360*j/Math.sqrt(n))-45)
        y = Rn*Math.sin(d2r(360*j/Math.sqrt(n))-45)
        sphereVertices.push(x)
        sphereVertices.push(y)
        sphereVertices.push(z)
        sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(sphereVertices), 3 ) );
    }

    if (i == 0 || i == Math.sqrt(n)-1) {
        Rn = r*3/4
        for (let j = 0; j < Math.sqrt(n); j++) {
            x = Rn*Math.cos(d2r(360*j/Math.sqrt(n))-45)
            y = Rn*Math.sin(d2r(360*j/Math.sqrt(n))-45)
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
            sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(sphereVertices), 3 ) );
        }
        // for (let i = 0; i < Math.sqrt(cn); i++) {
        //     for (let j = 0; j < Math.sqrt(cn); j++) {
        //         x = cubeLD2-2*cubeLD2*(i/Math.sqrt(cn))
        //         y = -cubeLD2+2*cubeLD2*(j/Math.sqrt(cn))
        //         cubeVertices.push(x)
        //         cubeVertices.push(y)
        //         cubeVertices.push(z)
        //     }
        // }
    } else {
        for (let i = 0; i < cn/4; i++) {
            x = cubeLD2
            y = -cubeLD2+2*cubeLD2*(4*i/cn)
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
        for (let i = cn/4; i < cn/2; i++) {
            x = cubeLD2-2*cubeLD2*((4*i-cn)/cn)
            y = cubeLD2
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
        for (let i = cn/2; i < cn*3/4; i++) {
            x = -cubeLD2
            y = cubeLD2-2*cubeLD2*((4*i-2*cn)/cn)
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
        for (let i = cn*3/4; i < cn; i++) {
            x = -cubeLD2+2*cubeLD2*((4*i-3*cn)/cn)
            y = -cubeLD2
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
    }
    cubeGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(cubeVertices), 3 ) );
}

const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 });
const redDotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xff0000 });
const dotSphere = new THREE.Points(sphereGeo, dotMaterial);
const dotCube = new THREE.Points(cubeGeo, redDotMaterial);
// scene.add(dotCube);
scene.add(dotSphere);

camera.position.z = 10;
camera.position.x = -10;
controls.update();

let t = 0;
function animate() {
    if (t < 1) {
        sphereVertices = interpolateLists(sphereVertices, cubeVertices, t);
        sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(sphereVertices), 3 ) );
        // cubeVertices = interpolateLists(cubeVertices, sphereVertices, t);
        // cubeGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(cubeVertices), 3 ) );
        t = t +0.00005
    }
	renderer.render( scene, camera );

}