
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


export var scene_name = "";
export function setSceneName(s) {
    scene_name = s;
}

export var three_mouseShapes = {}

const mouse_geometry = new THREE.BoxGeometry(10, 10, 10);
const mouse_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const plane_geometry = new THREE.PlaneGeometry(1, 1);

var materials = {};

var selectables = [];
var selectablesMap = {}

var selection = [];

var socket;
export function setSocket(s) {
    socket = s;
}

function fixTile(tile) {

    tile.x = Number(tile.x);
    tile.y = Number(tile.y);
    tile.z = Number(tile.z);
    tile.scale.x = Number(tile.scale.x);
    tile.scale.y = Number(tile.scale.y);
    tile.scale.z = Number(tile.scale.z);

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
    fixTile(msg);
    let tname = "./images/" + msg.texture;
    let materialName = tname + "_simple";
    // if (!materials[materialName]) {

    let texture = await new THREE.TextureLoader().loadAsync(tname);



    let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff });
    const plane = new THREE.Mesh(plane_geometry, material);
    plane.position.x = msg.x;
    plane.position.y = msg.y;
    plane.position.z = msg.z;
    let textureScaleX = texture.image.width * msg.scale.x;
    let textureScaleY = texture.image.height * msg.scale.y;
    plane.baseScale = new THREE.Vector2(texture.image.width, texture.image.height);
    plane.scale.set(textureScaleX, textureScaleY, 1);
    three_scene.add(plane);
    selectables.push(plane);
    selectablesMap[msg.tile_id] = plane;

    plane.tile = msg;



}

function clearThree(obj) {
    while (obj.children.length > 0) {
        clearThree(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();

    if (obj.material) {
        //in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop])
                return;
            if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose();
        })
        obj.material.dispose();
    }
}



export function three_replaceScene(c) {

    selectables = [];
    selectablesMap = {}
    clearThree(three_scene);
    let keys = Object.keys(c);
    for (let i = 0; i < keys.length; i++) {
        fixTile(c[keys[i]]);
        three_addTile(c[keys[i]]);
    }
}


export async function three_updateTile(msg) {


    let i = 0;
    fixTile(msg);
    let plane = selectablesMap[msg.tile_id];

    if (plane) {
        if (selectables[i].tile.texture != msg.texture) {
            // update texture
            // TODO Make texture change work


        }

        plane.position.x = msg.x;
        plane.position.y = msg.y;
        plane.position.z = msg.z;
        let textureScaleX = plane.baseScale.x * msg.scale.x;
        let textureScaleY = plane.baseScale.y * msg.scale.y;
        plane.scale.set(textureScaleX, textureScaleY, 1);

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


var mouseMode = 'none';
var scalingX = false;
var scalingY = false;
var editMode = false;
var mouseButtonsDown = [false, false, false, false, false, false];


const leftMouseButton = 0;
const middleMouseButton = 1;
const rightMouseButton = 2;

var mainButton = leftMouseButton;
var scrollButton = middleMouseButton;


function three_xyinMouseToWorld(x, y) {
    let vec = new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1,
        - (y / window.innerHeight) * 2 + 1,
        0.5);

    vec.unproject(three_camera);
    if (!three_camera.isOrthographicCamera) {
        // point where z is zero
        vec.sub(three_camera.position).normalize();

        let distance = - three_camera.position.z / vec.z;

        pos.copy(camera.position).add(vec.multiplyScalar(distance));
        return pos;
    }


    return vec;
}

// these only work right now on ortho views but it will be
// fun to make them work on 3d views
export function three_mousePositionToWorldPosition(event) {

    return three_xyinMouseToWorld(event.clientX, event.clientY);

}




export function three_setEditMode(on) {

    editMode = on;
    selection = [];

}

export function three_mouseMove(event) {
    event.preventDefault();
    let rawMouse = three_mousePositionToWorldPosition(event);

    if (mouseButtonsDown[mainButton]) {
        switch (mouseMode) {
            case "dragging":
                for (let i = 0; i < selection.length; i++) {
                    selection[i].tile.x += (rawMouse.x - three_lastMouse.x);
                    selection[i].tile.y += (rawMouse.y - three_lastMouse.y);
                    socket.emit('updateTile', { tile: selection[i].tile, scene: scene_name });
                    fixTile(selection[i].tile);
                }
                break;
            case "scaling":
                for (let i = 0; i < selection.length; i++) {
                    let plane = selection[i];
                    let scale = selection[i].tile.scale;

                    plane.tile.x += (rawMouse.x - three_lastMouse.x) / 2;
                    plane.tile.y += (rawMouse.y - three_lastMouse.y) / 2;

                    scale.x = scalingX ? (rawMouse.x - three_lastMouse.x) / (2 * plane.baseScale.x) + scale.x : scale.x;
                    scale.y = scalingY ? (rawMouse.y - three_lastMouse.y) / (2 * plane.baseScale.y) + scale.y : scale.y;

                    fixTile(selection[i].tile);
                    socket.emit('updateTile', { tile: plane.tile, scene: scene_name });
                }
                break;
        }
    }
    if (mouseButtonsDown[scrollButton]) {
        three_camera.position.x -= rawMouse.x - three_lastMouse.x;
        three_camera.position.y -= rawMouse.y - three_lastMouse.y;
    }

    three_lastMouse = rawMouse;
}

three_renderer.domElement.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
}

three_renderer.domElement.onmousedown = function (event) {
    event.preventDefault();

    let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1);

    mouseButtonsDown[event.button] = true;
    three_lastMouse = three_mousePositionToWorldPosition(event);

    three_rayCaster.setFromCamera(pointer, three_camera);


    if (editMode && mouseButtonsDown[0]) { // only select tiles in edit mode
        const intersects = three_rayCaster.intersectObjects(selectables);

        for (let i = 0; i < intersects.length; i++) {

            intersects[i].object.material.color.set(0xff0000);

            const minim = 0.2;

            // this works only for tiles. To do make it a function added to each kind of thing
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
    }


}


three_renderer.domElement.onmouseup = function (event) {

    mouseButtonsDown[event.button] = false;

    if (!mouseButtonsDown[0]) {

        for (let i = 0; i < selection.length; i++) {

            selection[i].material.color.set(0xffffff);

        }
        selection = [];
    }

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