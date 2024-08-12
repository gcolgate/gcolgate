
import * as THREE from 'three';
import { ddragDrop, setThingDragged } from './drag.js';
/////// TODO put in seperate file
import { socket } from './main.js';
import { ensureThingLoaded, GetRegisteredThing, showThing } from './characters.js';
import { getAppearanceImage } from './ptba.js';


let kGridSize = 100;
class InfiniteGrid extends THREE.Mesh {

    constructor(size1, size2, color, distance, axes = 'xyz') {


        color = color || new THREE.Color('white');
        size1 = size1 || 10;
        size2 = size2 || 100;

        distance = distance || 8000;



        const planeAxes = axes.substring(0, 2);

        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

        const material = new THREE.ShaderMaterial({

            side: THREE.DoubleSide,

            uniforms: {
                uSize1: {
                    value: size1
                },
                uSize2: {
                    value: size2
                },
                uColor: {
                    value: color
                },
                uDistance: {
                    value: distance
                }
            },
            transparent: true,
            vertexShader: `
       
       varying vec3 worldPosition;

       uniform float uDistance;

       void main() {
            vec3 pos = position.${axes} * uDistance;
            pos.${planeAxes} += cameraPosition.${planeAxes};
            worldPosition = pos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
       
       }
       `,

            fragmentShader: `
       varying vec3 worldPosition;

       uniform float uSize1;
       uniform float uSize2;
       uniform vec3 uColor;
       uniform float uDistance;
        
       float getGrid(float size) {
            vec2 r = worldPosition.${planeAxes} / size;
            vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
            float line = min(grid.x, grid.y);
            return 1.0 - min(line, 1.0);
        }
        
       void main() {
              float d = 1.0 - min(distance(cameraPosition.${planeAxes}, worldPosition.${planeAxes}) / uDistance, 1.0);
              float g1 = getGrid(uSize1);
              float g2 = getGrid(uSize2);
              gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
              gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
            
              if ( gl_FragColor.a <= 0.0 ) discard;
       }
       
       `,

            extensions: {
                derivatives: true
            }

        });

        super(geometry, material);

        this.frustumCulled = false;

    }

}

/////////////////////////////////


function three_renderer_dimensions() {
    let width = window.innerWidth - 32;
    let height = window.innerHeight - 32;
    return {
        width: width,
        height: height,
        aspect: (width / height)
    }
}

function three_setDimension() {

    // fetch target renderer size
    var rendererSize = three_renderer_dimensions();
    // notify the renderer of the size change
    three_renderer.setSize(rendererSize.width, rendererSize.height, true)
    // update the camera
    if (three_camera.isOrthographicCamera) {
        //const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        three_camera.left = rendererSize.width / - 2; three_camera.right = rendererSize.width / 2;
        three_camera.top = rendererSize.height / 2; three_camera.bottom = rendererSize.height / - 2;

    } else {
        three_camera.aspect = rendererSize.width / rendererSize.height
        three_camera.updateProjectionMatrix()
    }

}

function three_window_sizer_watcher(renderer, camera, dimension) {

    // bind the resize event
    window.addEventListener('resize', three_setDimension, false)
    // return .stop() the function to stop watching window resize
    return {
        trigger: function () {
            three_setDimension()
        },
        /**
         * Stop watching window resize */

        destroy: function () {
            window.removeEventListener('resize', three_setDimension)
        }
    }
}


const backgroundLayer = new THREE.Scene();
const tileLayer = new THREE.Scene();
const guiLayer = new THREE.Scene();
const tokenLayer = new THREE.Scene();
const gridLayer = new THREE.Scene();


const three_scenes = [backgroundLayer, tileLayer, gridLayer, tokenLayer, guiLayer];

var rendererSize = three_renderer_dimensions();


export const three_camera = new THREE.OrthographicCamera(rendererSize.width / - 2, rendererSize.width / 2,
    rendererSize.height / 2, rendererSize.height / - 2,
    -10, 1000);

export const three_renderer = new THREE.WebGLRenderer();
three_renderer.setSize(rendererSize.width, rendererSize.height, true);
document.body.appendChild(three_renderer.domElement);
three_renderer.domElement.style.resize = "both";



three_renderer.domElement.acceptsDropFile = true;

three_camera.position.z = 5;

three_window_sizer_watcher(three_renderer, three_camera);

export var current_scene =
{
    name: "",
    type: "2d", // types are 2d, theatre_of_the_mind, 3d
}

export var three_mouseShapes = {}

const mouse_geometry = new THREE.BoxGeometry(10, 10, 10);
const mouse_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const plane_geometry = new THREE.PlaneGeometry(1, 1);

var materials = {};

var layers = {
    tile: {
        selectables: [],        // for some reason I have both an array and map of this, maybe because I need array for THREE calls? TODO: investigate
        selectablesMap: {},
        protoSheetMap: {},      // if the object has a sheet with  with a file name, this will be the file name, like PlayerOne. TODO: better name
        layer: tileLayer,
    },
    token: {
        selectables: [],
        selectablesMap: {},
        protoSheetMap: {},
        layer: tokenLayer,
    },
};

// gets the layer associated with a key, logic here only needed because
// default is tile
function three_getLayer(n) {
    switch (n) {
        default:
            return layers.tile;
        case "token":
            return layers.token;
    }
}

var selection = [];



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
        guiLayer.add(cube);
        // TODO: kill cube on disconnect
    }
    return three_mouseShapes.who;
}

let baseMaterial = new THREE.MeshBasicMaterial({ color: 0x0, transparent: false });

async function three_setTileImage(tile, plane) {


    // TODO: Fix calling this with two kinds of parameters and get rid of this line   
    let tname = (typeof tile.texture == "string" ? tile.texture : tile.texture.img);

    if (!tname.startsWith("images/"))
        tname = "./images/" + tile.texture; // todo fix this so we are not adding paths in random places

    if (tile.sheet?.file) {

        await ensureThingLoaded(tile.sheet.file);
        // need to add style here
        let token = getAppearanceImage(GetRegisteredThing(tile.sheet.file), 'token');
        if (token) {
            tname = token;
        }

    }


    new THREE.TextureLoader().loadAsync(tname).then(texture => {

        let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff, transparent: true });
        let textureScaleX = tile.scale.x;
        let textureScaleY = tile.scale.y;
        plane.baseScale = new THREE.Vector2(texture.image.width, texture.image.height);
        plane.material = material;
        plane.scale.set(textureScaleX, textureScaleY, 1);

    });

}

export function three_addTile(tile) {
    fixTile(tile);
    const plane = new THREE.Mesh(plane_geometry, baseMaterial);


    plane.position.x = tile.x;
    plane.position.y = tile.y;
    plane.position.z = tile.z;
    plane.reference = tile;


    let layer = three_getLayer(tile.guiLayer);
    layer.layer.add(plane);
    layer.selectables.push(plane);
    layer.selectablesMap[tile.tile_id] = plane;
    let original = tile?.sheet?.file;
    if (original) {
        if (layer.protoSheetMap[original] == undefined) {

            layer.protoSheetMap[original] = [];
        }
        layer.protoSheetMap[original].push(plane);

    }

    plane.tile = tile;
    three_setTileImage(tile, plane);


}

function clearThree(obj) {
    if (obj.parent) {
        obj.parent.remove(obj);
    }
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



export function three_replaceScene(sceneName, sceneType, c) {
    current_scene.name = sceneName;
    current_scene.type = sceneType;

    Object.keys(layers).forEach((item) => {
        layers[item].selectables = [];
        layers[item].selectablesMap = {};
        layers[item].protoSheetMap = {};

    });

    for (let i = 0; i < three_scenes.length; i++) {
        clearThree(three_scenes[i]);
    }

    let grid = new InfiniteGrid(kGridSize, kGridSize);
    gridLayer.add(grid);
    let keys = Object.keys(c);
    for (let i = 0; i < keys.length; i++) {
        try {
            fixTile(c[keys[i]]);
            three_addTile(c[keys[i]]);
        } catch (err) {
            console.log("Could not load ", keys[i], c[keys[i]]);
        }
    }
}

export async function three_updateTile(tile) {
    let i = 0;
    fixTile(tile);

    let layer = three_getLayer(tile.guiLayer);

    let plane = layer.selectablesMap[tile.tile_id];

    if (plane) {

        plane.position.x = tile.x;
        plane.position.y = tile.y;
        plane.position.z = tile.z;
        let textureScaleX = tile.scale.x;
        let textureScaleY = tile.scale.y;
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
    three_renderer.autoClear = true;

    for (let i = 0; i < three_scenes.length; i++) {

        three_renderer.render(three_scenes[i], three_camera);
        three_renderer.autoClear = false;
        if (current_scene.type != "3d") {
            three_renderer.clearDepth()
        }
    }
}

let three_rayCaster = new THREE.Raycaster();
let three_lastMouse = null;
let three_lastRawMouse = null;

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
function worldToScreen(worldPos) {
    let dim = three_renderer_dimensions()
    var screenPos = worldPos.clone();
    screenPos.project(three_camera);
    screenPos.x = (screenPos.x + 1) * dim.width / 2;
    screenPos.y = (- screenPos.y + 1) * dim.height / 2;
    return screenPos;
}

function getPortrait(o) {
    if (o.file) {
        let thing = GetRegisteredThing(o.file);
        if (thing) {
            return getAppearanceImage(thing, 'portrait');
        }

    }
    return o.img;
}

var hud = null;
var card = null;
export function three_mouseMove(event) {
    //  event.preventDefault();

    if (document.elementFromPoint(event.clientX, event.clientY).nodeName != "CANVAS") return;

    let newMouse = three_mousePositionToWorldPosition(event);

    if (mouseButtonsDown[mainButton]) {
        switch (mouseMode) {
            // case "scrolling":
            //     if (!mouseButtonsDown[0]) {
            //         mouseMode = "none";
            //         break;
            //     }

            //     three_camera.position.x -= (newMouse.x - three_lastMouse.x);
            //     three_camera.position.y -= (newMouse.y - three_lastMouse.y);
            //     break;
            case "dragging":
                for (let i = 0; i < selection.length; i++) {
                    selection[i].tile.x += (newMouse.x - three_lastMouse.x);
                    selection[i].tile.y += (newMouse.y - three_lastMouse.y);
                    socket.emit('updateTile', { tile: selection[i].tile, scene: current_scene.name });
                }
                break;
            case "scaling":
                for (let i = 0; i < selection.length; i++) {
                    let plane = selection[i];
                    let scale = plane.tile.scale;

                    plane.tile.x += (newMouse.x - three_lastMouse.x) / 2;
                    plane.tile.y += (newMouse.y - three_lastMouse.y) / 2;

                    scale.x = scalingX ? (newMouse.x - three_lastMouse.x) + scale.x : scale.x;
                    scale.y = scalingY ? (newMouse.y - three_lastMouse.y) + scale.y : scale.y;

                    fixTile(plane.tile);
                    socket.emit('updateTile', { tile: plane.tile, scene: current_scene.name });
                }
                break;
        }
    }
    if (mouseButtonsDown[scrollButton]) {
        // if (three_camera.isOrthographicCamera) {
        let dim = three_renderer_dimensions()

        let zoomMulipleX = three_camera.right / (dim.width / 2);
        //     let zoomMulipleY = three_camera.top / (dim.width/2);
        three_camera.position.x -= (event.clientX - three_lastRawMouse.x) * zoomMulipleX;
        three_camera.position.y += (event.clientY - three_lastRawMouse.y) * zoomMulipleX;

        //    console.log(event.timeStamp, "x " + (newMouse.x - three_lastMouse.x) + " y " + (newMouse.y - three_lastMouse.y));
    }

    if (!mouseButtonsDown[mainButton] && !mouseButtonsDown[scrollButton]) {


        let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1);
        three_rayCaster.setFromCamera(pointer, three_camera);

        let intersect = three_intersect(event);
        //  console.log(intersect);
        if (intersect?.object) {
            let o = intersect.object?.tile?.reference;
            if (o) {

                let screenPos = worldToScreen(intersect.object.position);

                if (!hud) {
                    hud = document.createElement("div");
                    hud.id = "hud";
                    hud.style.zIndex = 2;
                    hud.className = "hud";
                    //  hud.style.position = "absolute";
                    //  hud.style.textAlign = "center";
                    // hud.style.zIndex = "200";
                    //  hud.style.display = "block";
                    //  hud.style.width = "256px";
                    document.body.appendChild(hud);


                }

                hud.style.left = Math.trunc(screenPos.x) + "px";
                hud.style.top = Math.trunc(screenPos.y) + "px";
                hud.innerHTML = o.name;


                if (!card) {
                    card = document.createElement("img");
                    card.id = "card";
                    card.className = "card";
                    card.style.zIndex = 1;

                    document.body.appendChild(card);


                }

                card.src = getPortrait(o);
                let dim = three_renderer_dimensions()

                card.style.top = (dim.height - 300) + "px";
                card.style.width = "auto";
                card.style.height = "300px";
            }


        }

    }

    three_lastRawMouse = { x: event.clientX, y: event.clientY };
    three_lastMouse = newMouse;
}
three_renderer.domElement.onwheel = (event) => {
    console.log(event.delta);
    let d = event.wheelDelta * 0.6;
    let wd = d * three_renderer_dimensions().aspect;
    three_camera.left += wd; three_camera.right -= wd;
    three_camera.top -= d; three_camera.bottom += d
    three_camera.updateProjectionMatrix()

};


function three_intersect(ev) {
    let pointer = new THREE.Vector2((ev.clientX / window.innerWidth) * 2 - 1,
        -(ev.clientY / window.innerHeight) * 2 + 1);
    let intersects = three_rayCaster.intersectObjects(layers.token.selectables);
    if (intersects.length > 0) {
        return intersects[0];
    }

    intersects = three_rayCaster.intersectObjects(layers.tile.selectables);
    if (intersects.length > 0) {
        return intersects[0];
    }

    return undefined;
}

three_renderer.domElement.ondblclick = (ev) => {
    event.preventDefault();
    console.log("Double click");
    three_lastMouse = three_mousePositionToWorldPosition(ev);
    let pointer = new THREE.Vector2((ev.clientX / window.innerWidth) * 2 - 1,
        -(ev.clientY / window.innerHeight) * 2 + 1);
    three_rayCaster.setFromCamera(pointer, three_camera);

    let intersect = three_intersect(ev);
    if (intersect?.object) {
        let o = intersect.object?.tile?.reference;
        if (o) {
            showThing(o.file, o.page);
        }
    }
}

three_renderer.domElement.oncontextmenu = function (event) {
    event.preventDefault();
    event.stopPropagation();
}

three_renderer.domElement.onmousedown = function (event) {
    event.preventDefault();
    selection = [];
    let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1);

    mouseButtonsDown[event.button] = true;
    three_lastMouse = three_mousePositionToWorldPosition(event);
    three_lastRawMouse = { x: event.clientX, y: event.clientY };

    three_rayCaster.setFromCamera(pointer, three_camera);



    if (mouseButtonsDown[0]) {
        let intersect = three_intersect(event);


        if (intersect?.object) {
            let obj = intersect.object;
            if (editMode && obj.tile.guiLayer == "tile") {
                const minim = 0.2;
                // this works only for tiles. To do make it a function added to each kind of thing
                scalingX = scalingX = intersect.uv.x < minim || intersect.uv.x > 1 - minim;
                scalingY = scalingY = intersect.uv.y < minim || intersect.uv.y > 1 - minim;
                if (scalingX ||
                    scalingY) {
                    mouseMode = 'scaling';
                    obj.material.color.set(0xff0000);

                } else {
                    mouseMode = 'dragging';
                    obj.material.color.set(0x0000ff);
                }
                selection.push(obj);

            } else if (!editMode && obj.tile.guiLayer == "token") {
                obj.material.color.set(0x0000ff);
                const minim = 0.2;
                mouseMode = 'dragging';
                selection.push(obj);

            }
        }
    }
}

export function three_deleteSelected() {
    // delete the image and tell the server to delete it
    for (let i = 0; i < selection.length; i++) {
        socket.emit('deleteTile', { tile: selection[i].tile, scene: current_scene.name });
    }

}

export function three_tileDeleted(tile) {
    let i = 0;
    fixTile(tile);

    let layer = three_getLayer(tile.guiLayer);

    let plane = layer.selectablesMap[tile.tile_id];

    if (plane) {

        for (let i = 0; i < selection.length; i++) {
            if (selection[i] == plane) {
                selection.splice(i, 1);

            }
        }

        delete layer.selectablesMap[tile.tile_id];
        clearThree(plane)

    }

}

export function three_updateAllUsingProto(id) {
    let keys = Object.keys(layers);
    keys.forEach((key, index) => {
        let layer = layers[key];
        let array = layer.protoSheetMap[id];

        if (array) {
            for (let i = 0; i < array.length; i++) {
                let plane = array[i];
                let tile = plane.reference;
                three_setTileImage(tile, plane);
            }
        }
    });
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

async function GetImageFor(thing) {
    // based on scene we may want to do something different
    let name = thing.file;

    console.log("Current scene", current_scene);
    console.log("Current scene t" + current_scene.type);

    switch (current_scene.type) {

        case "2d": {
            let t = await ensureThingLoaded(name, "");
            if (t.prototypeToken?.texture?.src)

                return {
                    img: t.prototypeToken.texture.src,
                    scaleX: t.prototypeToken.texture.scaleX,
                    scaleY: t.prototypeToken.texture.scaleY
                };
            return {
                img: thing.img,
                scaleX: 1,
                scaleY: 1
            };
        }
        default:
        case "theatreOfTheMind":
        case "3d":
            return {
                img: thing.img,
                scaleX: 1,
                scaleY: 1
            };

    }
    // {"file":"CompendiumFiles/_plus_1_allpurpose_tool_tce","page":"items","source":"TCE","droppable":"item","type":"equipment","name":"+1 All-Purpose Tool","img":"images/modules/plutonium/media/icon/crossed-swords.svg"}


}


three_renderer.domElement.onmouseup = function (event) {

    mouseButtonsDown[event.button] = false;

    if (!mouseButtonsDown[0]) {

        for (let i = 0; i < selection.length; i++) {

            selection[i].material.color.set(0xffffff);

            if (!event.altKey) {
                if (selection[i].tile.guiLayer == "token") {
                    ForceToGrid6(selection[i].tile)
                    socket.emit('updateTile', { tile: selection[i].tile, scene: current_scene.name });

                }

            }
        }

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
    setThingDragged(null);

};

ddragDrop(three_renderer.domElement, {
    onDrop: (files, pos, fileList, directories) => {
        console.log('Here are the dropped files', files)
        console.log('Dropped at coordinates', pos.x, pos.y)
        console.log('Here is the raw FileList object if you need it:', fileList)
        console.log('Here is the list of directories:', directories)
    },
    onDropText: (text, pos) => {
        console.log('Here is the dropped text:', text)
        console.log('Dropped at coordinates', pos.x, pos.y)
    },
    onDragEnter: (event) => { },
    onDragOver: (event) => { },
    onDragLeave: (event) => { }
});

function GridIfy(x) {
    let answer = Math.abs(x);
    answer = answer - (answer % kGridSize) + kGridSize / 2;
    if (x < 0) answer = - answer;
    return answer;
}
function toGrid(point) {
    // need to put exceptio for holding alt
    return {
        x: GridIfy(point.x),
        y: GridIfy(point.y),
    }
}

function ForceToGrid6(point) {
    point.x = GridIfy(point.x);
    point.y = GridIfy(point.y);
}

async function CreateToken(thingDragged, event) {
    let mouse = toGrid(three_mousePositionToWorldPosition(event));
    // todo handle non-instanced
    let newTile = { "x": mouse.x, "y": mouse.y, "z": 0, guiLayer: "token", sheet: thingDragged };

    let img = await GetImageFor(thingDragged);
    newTile.texture = img.img;
    newTile.scale = {
        x: img.scaleX * kGridSize, // todo should be tile size
        y: img.scaleY * kGridSize,
        z: 1
    };
    newTile.reference = thingDragged;
    console.log("Create Token New Tile ", newTile);
    socket.emit("add_token", { scene: current_scene.name, tile: newTile });

}

three_renderer.domElement.acceptDrag = function (thingDragged, event) {

    // for (let i = 0; i < array.length; i++) {
    //     if (array[i].file == thingDragged.file) {
    //         console.log("Dupe");

    //     }
    // }
    CreateToken(thingDragged, event);


}

