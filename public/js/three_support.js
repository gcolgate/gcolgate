
import * as THREE from 'three';

const three_scene = new THREE.Scene();


let width = window.innerWidth - 32;
let height = window.innerHeight - 32;
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
export const three_camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -10, 1000);


export const three_renderer = new THREE.WebGLRenderer();
three_renderer.setSize(width, height, true);
document.body.appendChild(three_renderer.domElement);

three_renderer.domElement.acceptsDropFile = true;

three_camera.position.z = 5;



export var three_mouseShapes = {}

const mouse_geometry = new THREE.BoxGeometry(10, 10, 10);
const mouse_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const plane_geometry = new THREE.PlaneGeometry(1, 1);

var materials = {};




export function three_findMouseShapes(who) {
    if (three_mouseShapes.who === undefined) {
        // todo: use different matierals for each player
        // todo: show player name on mouse
        const cube = new THREE.Mesh(mouse_geometry, mouse_material);
        three_mouseShapes.who = cube;
        three_scene.add(cube);
        // TODO: kill cube on disconnect
    }
    return three_mouseShapes.who;
}

export async function three_addTile(msg) {

    let tname = "./images/" + msg.name;
    let materialName = tname + "_simple";
    // if (!materials[materialName]) {
    console.log("loaded texture " + Date.now());

    let texture = await new THREE.TextureLoader().loadAsync(tname);

    console.log("loaded texture " + tname);
    console.log(texture);


    let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
    const plane = new THREE.Mesh(plane_geometry, material);
    plane.position.x = msg.x;
    plane.position.y = msg.y;
    plane.position.z = msg.z;
    plane.scale.set(64, 64, 1);
    three_scene.add(plane);


}


// main animation function for the game
export function three_animate() {
    requestAnimationFrame(three_animate);

    for (const [key, cube] of Object.entries(three_mouseShapes)) {

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    three_renderer.render(three_scene, three_camera);
}