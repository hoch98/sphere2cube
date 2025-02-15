import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const cn = 36;
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

    return n1.map((num1, index) => {
        const num2 = n2[index];
        return num1 + t * (num2-num1);
    });
}

let easeFunctions = {
    "linear": (t) => {return t},
    "quadIn": (t) => {return t**2},
    "cubicIn": (t) => {return t**3},
    "sineIn": (t) => {return 1 - Math.cos((t * Math.PI) / 2);},
    "quadOut": (t) => {return 1 - (1 - t) * (1 - t);},
    "cubicOut": (t) => {return 1 - Math.pow(1 - t, 3)},
    "sineOut": (t) => {return Math.sin((t * Math.PI) / 2);},
}

const sphereGeo = new THREE.BufferGeometry();

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
let sphereVertices =[]
let cubeVertices =[]
let startingVertices = sphereVertices

for(let i = 0; i < Math.sqrt(n); i++) {
    let x, y, z, Rn;
    x = 0
    z = r*Math.sin(d2r(180*i/Math.sqrt(n)-90))
    y = 0
    for (let j = 0; j < Math.sqrt(n); j++) {
        Rn = r*Math.sin(d2r(180*i/Math.sqrt(n)))
        if (i == Math.sqrt(n)-1) {
            Rn = 0
        }
        x = Rn*Math.cos(d2r(45-360*j/Math.sqrt(n)))
        y = Rn*Math.sin(d2r(45-360*j/Math.sqrt(n)))
        sphereVertices.push(x)
        sphereVertices.push(y)
        sphereVertices.push(z)
    }

    if (i == 0 || i == Math.sqrt(n)-1) {
        // Rn = r*3/4
        // for (let j = 0; j < Math.sqrt(n); j++) {
        //     x = Rn*Math.cos(d2r(360*j/Math.sqrt(n))-45)
        //     y = Rn*Math.sin(d2r(360*j/Math.sqrt(n))-45)
        //     cubeVertices.push(x)
        //     cubeVertices.push(y)
        //     cubeVertices.push(z)
        // }
        
        let sn = Math.sqrt(Math.sqrt(n))
        for (let j = 0; j < sn; j++) {
            let topMargin = (j+1)*r*2/(sn+1)
            for (let k = 0; k < sn; k++) {
                let leftMargin = (k+1)*r*2/(sn+1)
                cubeVertices.push(-r+topMargin)
                cubeVertices.push(-r+leftMargin)
                cubeVertices.push(z)
            }
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
            y = cubeLD2-2*cubeLD2*(4*i/cn)
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
        for (let i = cn/4; i < cn/2; i++) {
            x = cubeLD2-2*cubeLD2*((4*i-cn)/cn)
            y = -cubeLD2
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
        for (let i = cn/2; i < cn*3/4; i++) {
            x = -cubeLD2
            y = -cubeLD2+2*cubeLD2*((4*i-2*cn)/cn)
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
        for (let i = cn*3/4; i < cn; i++) {
            x = -cubeLD2+2*cubeLD2*((4*i-3*cn)/cn)
            y = cubeLD2
            cubeVertices.push(x)
            cubeVertices.push(y)
            cubeVertices.push(z)
        }
    }
}

sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(startingVertices), 3 ) );

const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 });
const redDotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xff0000 });
const dotSphere = new THREE.Points(sphereGeo, dotMaterial);
scene.add(dotSphere);

camera.position.z = 10;
camera.position.x = -10;
controls.update();

let t = 0;
let sliderTouched = false;

document.getElementById ("pos" ).addEventListener( "input", function (e) {

    sliderTouched = true;
    t = parseFloat(e.target.value);
    startingVertices = interpolateLists(sphereVertices, cubeVertices, easeFunctions[document.getElementById("easeIn").value](t));
    sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(startingVertices), 3 ) );

} );

document.getElementById("reset").onclick = function () {
    t = 0
    sliderTouched = false;
}

function animate() {
    if (t <= 1 && !sliderTouched) {
        startingVertices = interpolateLists(sphereVertices, cubeVertices, easeFunctions[document.getElementById("easeIn").value](t));
        sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(startingVertices), 3 ) );
        
        t = t +0.0025
        document.getElementById ("pos" ).value = t+""
    }
	renderer.render( scene, camera );

}