import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let bbn = 4;
let cn = bbn**2;
let n = cn**2;
let r = 4;
const cubeLD2 = 4;

const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

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

let t = 0;
let sliderTouched = false;

const GUI = lil.GUI;
const gui = new GUI();

let obj = {
    t: 0,
    "sqrt(sqrt(n))": 4,
    reset: function() {
        t = 0
        sliderTouched = false;
    },
    "show vertices": true,
    "show faces": true, 
    "cast shadow": false,
    "ease in function": "linear"
}

let sphereGeo
let facedSphereGeo;
let sphereVertices =[]
let cubeVertices =[]
let facedSphereVertices = []
let facedCubeVertices = []
let organisedSphereVertices = []
let organisedCubeVertices = []
let startingVertices = sphereVertices
let facedStartingVertices = facedSphereVertices
const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0x00ff00 });
const solidMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide, } );
const shadowCastMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000, side: THREE.DoubleSide, } );
let dotSphere;
let facedSphere 

for (let i = 0; i < cn; i++) {
    organisedSphereVertices.push([])
    organisedCubeVertices.push([])
}

let light = new THREE.DirectionalLight(0xFFFFFF, 4.0);
light.position.set(20, 20, 20);
light.target.position.set(0, 0, 0);
light.castShadow = true;
scene.add(light);

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.

function createFace(a, b, c, cube) {
    let target = facedSphereVertices
    if (cube) {
        target = facedCubeVertices
    }
    target.push(a.x)
    target.push(a.y)
    target.push(a.z)

    target.push(b.x)
    target.push(b.y)
    target.push(b.z)

    target.push(c.x)
    target.push(c.y)
    target.push(c.z)
}

function processVertices() {
    sphereGeo = new THREE.BufferGeometry();
    sphereVertices =[]
    cubeVertices =[]
    startingVertices = sphereVertices

    facedSphereGeo = new THREE.BufferGeometry();
    facedSphereVertices =[]
    facedCubeVertices =[]
    facedStartingVertices = facedSphereVertices
    organisedSphereVertices = []
    organisedCubeVertices = []

    for (let i = 0; i < cn; i++) {
        organisedSphereVertices.push([])
        organisedCubeVertices.push([])
    }

    for(let i = 0; i < cn; i++) {
        let x, y, z, Rn;
        x = 0
        z = r*Math.sin(d2r(180*i/cn-90))
        y = 0
        for (let j = 0; j < cn; j++) {
            Rn = r*Math.sin(d2r(180*i/cn))
            if (i == cn-1) {
                Rn = 0
            }
            x = Rn*Math.cos(d2r(45-360*j/cn))
            y = Rn*Math.sin(d2r(45-360*j/cn))
            sphereVertices.push(x)
            sphereVertices.push(y)
            sphereVertices.push(z)
            organisedSphereVertices[i].push(new THREE.Vector3(x, y, z))
        }

        if (i == 0 || i == cn-1) {
            
            for (let c = 0; c < bbn; c++) {
                let topMargin = (c+1)*r*2/(bbn+1)
                for (let k = 0; k < bbn; k++) {
                    let leftMargin = (k+1)*r*2/(bbn+1)
                    cubeVertices.push(-r+topMargin)
                    cubeVertices.push(-r+leftMargin)
                    cubeVertices.push(z)
                    organisedCubeVertices[i].push(new THREE.Vector3(-r+topMargin, -r+leftMargin, z))
                }
            }
        } else {
            for (let k = 0; k < cn/4; k++) {
                x = cubeLD2
                y = cubeLD2-2*cubeLD2*(4*k/cn)
                cubeVertices.push(x)
                cubeVertices.push(y)
                cubeVertices.push(z)
                organisedCubeVertices[i].push(new THREE.Vector3(x, y, z))
            }
            for (let k = cn/4; k < cn/2; k++) {
                x = cubeLD2-2*cubeLD2*((4*k-cn)/cn)
                y = -cubeLD2
                cubeVertices.push(x)
                cubeVertices.push(y)
                cubeVertices.push(z)
                organisedCubeVertices[i].push(new THREE.Vector3(x, y, z))
            }
            for (let k = cn/2; k < cn*3/4; k++) {
                x = -cubeLD2
                y = -cubeLD2+2*cubeLD2*((4*k-2*cn)/cn)
                cubeVertices.push(x)
                cubeVertices.push(y)
                cubeVertices.push(z)
                organisedCubeVertices[i].push(new THREE.Vector3(x, y, z))
            }
            for (let k = cn*3/4; k < cn; k++) {
                x = -cubeLD2+2*cubeLD2*((4*k-3*cn)/cn)
                y = cubeLD2
                cubeVertices.push(x)
                cubeVertices.push(y)
                cubeVertices.push(z)
                organisedCubeVertices[i].push(new THREE.Vector3(x, y, z))
            }
        }
    }

    sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(startingVertices), 3 ) );
    dotSphere = new THREE.Points(sphereGeo, dotMaterial);
    scene.add(dotSphere);

    dotSphere.visible = obj["show vertices"]

    // creating faces

    for (let i = 0; i < cn-1; i++) {
        for (let j = 0; j < cn-1; j++) {
            createFace(organisedSphereVertices[i][j], organisedSphereVertices[i+1][j], organisedSphereVertices[i][j+1], false)
            createFace(organisedSphereVertices[i+1][j+1], organisedSphereVertices[i+1][j], organisedSphereVertices[i][j+1], false)
    
            createFace(organisedCubeVertices[i][j], organisedCubeVertices[i+1][j], organisedCubeVertices[i][j+1], true)
            createFace(organisedCubeVertices[i+1][j+1], organisedCubeVertices[i+1][j], organisedCubeVertices[i][j+1], true)
        }
        createFace(organisedSphereVertices[i][cn-1], organisedSphereVertices[i+1][cn-1], organisedSphereVertices[i][0], false)
        createFace(organisedSphereVertices[i+1][0], organisedSphereVertices[i+1][cn-1], organisedSphereVertices[i][0], false)
    
        createFace(organisedCubeVertices[i][cn-1], organisedCubeVertices[i+1][cn-1], organisedCubeVertices[i][0], true)
        createFace(organisedCubeVertices[i+1][0], organisedCubeVertices[i+1][cn-1], organisedCubeVertices[i][0], true)
    }

    facedSphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(facedStartingVertices), 3 ) );
    facedSphereGeo.computeVertexNormals()

    if (obj['cast shadow']) {
        facedSphere = new THREE.Mesh( facedSphereGeo, shadowCastMaterial );
    } else {
        facedSphere = new THREE.Mesh( facedSphereGeo, solidMaterial );
    }
    scene.add(facedSphere)

    facedSphere.visible = obj["show faces"]
    facedSphere.castShadow = false;
    facedSphere.receiveShadow = false;

}


processVertices()


camera.position.z = 10;
camera.position.x = -10;
controls.update();


let listener = gui.add(obj, "t", 0, 1, 0.01).onChange(value => {
    sliderTouched = true;
    t = value
    startingVertices = interpolateLists(sphereVertices, cubeVertices, easeFunctions[obj['ease in function']](t));
    sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(startingVertices), 3 ) );

    facedStartingVertices = interpolateLists(facedSphereVertices, facedCubeVertices, easeFunctions[obj['ease in function']](t));
    facedSphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(facedStartingVertices), 3 ) );
    facedSphereGeo.computeVertexNormals()
});
gui.add(obj, "sqrt(sqrt(n))", 4, 12, 2).onChange(value => {
    sliderTouched = true
    bbn = value
    cn = bbn**2
    n = cn**2
    scene.remove(dotSphere)
    scene.remove(facedSphere)
    processVertices()
    obj.reset()
});
gui.add(obj, "ease in function", ["linear", "quadIn", "cubicIn", "sineIn", "quadOut", "cubicOut", "sineOut"])
gui.add(obj, "show vertices").onChange(value => {
    dotSphere.visible = value
})
gui.add(obj, "show faces").onChange(value => {
    facedSphere.visible = value
})
gui.add(obj, "cast shadow").onChange(value => {
    if (value) {
        facedSphere.material = shadowCastMaterial
    } else {
        facedSphere.material = solidMaterial
    }
})
gui.add(obj, "reset")
gui.open()

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    if (t <= 1 && !sliderTouched) {
        startingVertices = interpolateLists(sphereVertices, cubeVertices, easeFunctions[obj['ease in function']](t));
        sphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(startingVertices), 3 ) );

        facedStartingVertices = interpolateLists(facedSphereVertices, facedCubeVertices, easeFunctions[obj['ease in function']](t));
        facedSphereGeo.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array(facedStartingVertices), 3 ) );
        facedSphereGeo.computeVertexNormals()
        
        t = t +0.0025
        obj.t = Math.round(t * 100) / 100
        listener.listen()
    }
	renderer.render( scene, camera );

}