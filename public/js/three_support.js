
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

var selectables = [];

var selection = [];

var socket;
export function setSocket(s) {
    socket = s;
}

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

    let tname = "./images/" + msg.texture;
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
    let textureScaleX = texture.image.width * msg.scale.x;
    let textureScaleY = texture.image.height * msg.scale.y;
    plane.scale.set(textureScaleX, textureScaleY, 1);
    three_scene.add(plane);
    selectables.push(plane);

    plane.tile = msg;



}

export function three_replaceScene(c) {
    // TODO: delete old scene
    let keys = Object.keys(c);
    for (let i = 0; i < keys.length; i++) {
        three_addTile(c[keys[i]]);
    }
}


export async function three_updateTile(msg) {

    for (let i = 0; i < selectables.length; i++) {
        // todo: use map not array
        if (selectables[i].tile.tile_id == msg.tile_id) {

            if (selectables[i].tile.texture != msg.texture) {
                // update texture
                let tname = "./images/" + msg.texture;
                let materialName = tname + "_simple";
                // if (!materials[materialName]) {
                console.log("loaded texture " + Date.now());

                let texture = await new THREE.TextureLoader().loadAsync(tname);

                console.log("loaded texture " + tname);
                console.log(texture);



                let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
            }
            let plane = selectables[i];

            plane.position.x = msg.x;
            plane.position.y = msg.y;
            plane.position.z = msg.z;
            // let textureScaleX = texture.image.width * msg.scale.x;
            // let textureScaleY = texture.image.height * msg.scale.y;
            // plane.scale.set(textureScaleX, textureScaleY, 1);
            // three_scene.add(plane);
            // selectables.push(plane);
            // // double link
            // plane.tile = msg;
            // plane.tile.visual = plane; // maybe we don't need this


        }

    }

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

let three_rayCaster = new THREE.Raycaster();
let three_lastMouse = null;


// change these when window size changes, for mouse calculations
let multiplier = new THREE.Vector2(2 / window.innerWidth, 2 / window.innerHeight);
let adder = new THREE.Vector2(-1, 1);



// the math here isn't right but it works but that's what you get not
// working in the morning on this project when I can do math
// TODO: quit job and only do hobbies


var mouseMode = 'dragging';
var scalingX = false;
var scalingY = false;

export function three_mouseMove(event) {
    event.preventDefault();
    let rawMouse = new THREE.Vector2(event.clientX, event.clientY);


    let pointer = multiplier.clone().multiply(rawMouse).add(adder);


    three_rayCaster.setFromCamera(pointer, three_camera);
    // const intersects = three_rayCaster.intersectObjects(selectables);
    switch (mouseMode) {
        default:
            for (let i = 0; i < selection.length; i++) {
                console.log("drag " + (rawMouse.x - three_lastMouse.x) + " " + (rawMouse.y - three_lastMouse.y));
                selection[i].tile.x += rawMouse.x - three_lastMouse.x;
                selection[i].tile.y -= rawMouse.y - three_lastMouse.y;
                socket.emit('updateTile', selection[i].tile);
            }
            break;
        case "scaling":
            for (let i = 0; i < selection.length; i++) {
                let scale = selection[i].scale;
                console.log("scale " + (rawMouse.x - three_lastMouse.x) + " " + (rawMouse.y - three_lastMouse.y));

                let x = scalingX ? (rawMouse.x - three_lastMouse.x) / 2 + scale.x : scale.x;
                let y = scalingY ? (rawMouse.y - three_lastMouse.y) / 2 + scale.y : scale.y;
                selection[i].tile.x += (rawMouse.x - three_lastMouse.x) / 2;
                selection[i].tile.y -= (rawMouse.y - three_lastMouse.y) / 2;

                console.log("Diff " + x + " " + y);
                scale.set(x, y, 1);

                socket.emit('updateTile', selection[i].tile);
            }
            break;
    }

    three_lastMouse = rawMouse;
}

three_renderer.domElement.onmousedown = function (event) {
    event.preventDefault();
    let rawMouse = new THREE.Vector2(event.clientX, event.clientY);
    let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1);

    three_rayCaster.setFromCamera(pointer, three_camera);
    const intersects = three_rayCaster.intersectObjects(selectables);

    for (let i = 0; i < intersects.length; i++) {

        intersects[i].object.material.color.set(0xff0000);

        const minim = 0.2;

        // this works only for tiles. To do make it a function added to each kind of thing
        console.log(intersects[i].uv);
        console.log(intersects[i].uv.x + " and " + intersects[i].uv.y);
        scalingX = scalingX = intersects[i].uv.x < minim || intersects[i].uv.x > 1 - minim;
        scalingY = scalingY = intersects[i].uv.y < minim || intersects[i].uv.y > 1 - minim;
        if (scalingX ||
            scalingY) {
            mouseMode = 'scaling';

        } else {
            mouseMode = 'dragging';
        }


        selection.push(intersects[i].object);
        break;
    }
    three_lastMouse = rawMouse;
}


three_renderer.domElement.onmouseup = function (event) {

    for (let i = 0; i < selection.length; i++) {

        selection[i].material.color.set(0xffffff);

    }
    selection = [];
    // event.preventDefault();
    // let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
    //     -(event.clientY / window.innerHeight) * 2 + 1);

    // three_rayCaster.setFromCamera(pointer, three_camera);
    // const intersects = three_rayCaster.intersectObjects(selectables);

    // for (let i = 0; i < intersects.length; i++) {

    //     intersects[i].object.material.color.set(0xff0000);

    //     selection.push( intersects[i].object);
    //     break;
    // }
    // three_lastMouse = pointer;
}