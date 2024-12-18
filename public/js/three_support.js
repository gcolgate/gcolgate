
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
//import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
//import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

import { dragDrop, setThingDragged } from './drag.js';
/////// TODO put in seperate file
import { socket } from './main.js';
import { parseSheet, ensureThingLoaded, GetRegisteredThing, showThing, MakeAvailableToHtml } from './characters.js';
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

const kTileLayerIndex = 1;
const kTokenLLayerIndex = 3;
const three_scenes = [backgroundLayer, tileLayer, gridLayer, tokenLayer, guiLayer];

var rendererSize = three_renderer_dimensions();

class cleanRenderPass extends RenderPass {
    constructor(scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null) {
        super(scene, camera, overrideMaterial, clearColor, clearAlpha);
        this.clear = false;
        this.clearDepth = true;

    }

}

class firstRenderPass extends RenderPass {
    constructor(scene, camera, overrideMaterial = null, clearColor = null, clearAlpha = null) {
        super(scene, camera, overrideMaterial, clearColor, clearAlpha);
        this.clear = true;
        this.clearDepth = true;

    }

}
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


//postprocessing
{


    var three_composer = new EffectComposer(three_renderer);

    three_composer.addPass(new firstRenderPass(backgroundLayer, three_camera));
    three_composer.addPass(new cleanRenderPass(tileLayer, three_camera));
    var three_outlinePass_tile = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), tileLayer, three_camera);
    three_composer.addPass(three_outlinePass_tile);


    three_composer.addPass(new cleanRenderPass(gridLayer, three_camera));
    three_composer.addPass(new cleanRenderPass(tokenLayer, three_camera));
    var three_outlinePass_token = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), tokenLayer, three_camera);
    three_composer.addPass(three_outlinePass_token);
    three_composer.addPass(new cleanRenderPass(guiLayer, three_camera));

    three_outlinePass_tile.edgeStrenth = 4.79;
    three_outlinePass_tile.edgeGlow = 4.698;
    three_outlinePass_tile.edgeThickness = 3.72;
    three_outlinePass_tile.pulsePeriod = 1.9;
    three_outlinePass_tile.visibleEdgeColor.set('#ffffff');
    three_outlinePass_token.hiddenEdgeColor.set('#190a05');
    three_outlinePass_token.edgeStrenth = 4.79;
    three_outlinePass_token.edgeGlow = 4.698;
    three_outlinePass_token.edgeThickness = 1.72;
    three_outlinePass_token.pulsePeriod = 2.9;
    three_outlinePass_token.visibleEdgeColor.set('#ffffff');
    three_outlinePass_token.hiddenEdgeColor.set('#190a05');

    //const textureLoader = new THREE.TextureLoader();

    three_composer.addPass(new OutputPass());

    // var three_effectFXAA = new ShaderPass(FXAAShader);
    // three_effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    // three_composer.addPass(three_effectFXAA);
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
    if (tile.scale) {
        tile.scale.x = Number(tile.scale.x);
        tile.scale.y = Number(tile.scale.y);
        tile.scale.z = Number(tile.scale.z);
    }

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


    if (tile.texture == undefined) {
        console.log("Error Bad texture for %o", tile);
        return;
    }
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

        let material = new THREE.MeshBasicMaterial({
            map: texture, color: 0xffffff, transparent: true,
            onBeforeCompile: (shader) => {
                console.log("ZZZYX");
                console.log(shader);
            }
        });
        let textureScaleX = tile.scale.x;
        let textureScaleY = tile.scale.y;
        texture.colorSpace = THREE.SRGBColorSpace;
        plane.baseScale = new THREE.Vector2(texture.image.width, texture.image.height);
        plane.material = material;
        plane.scale.set(textureScaleX, textureScaleY, 1);

    });

}

export function three_addTile(tile) {
    fixTile(tile); // if I used protobufs this would not happen
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

    three_composer.render();


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
        let pos = new THREE.Vector3();
        pos.copy(three_camera.position).add(vec.multiplyScalar(distance));
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

function findTokenTile(id) {
    let scene = three_getLayer("token");
    for (let i = 0; i < scene.selectables.length; i++) {
        let o = scene.selectables[i].reference;
        if (o && o.tile_id == id) {
            return o;
        }
    }
    return undefined;
}

function ChangeTileZ(id, changeAmt) {
    let tile = findTokenTile(id);
    if (tile) {
        tile.z += changeAmt;
        socket.emit('updateTile', { tile: tile, scene: current_scene.name });
        hud.innerHTML = parseSheet(tile.reference, "hud", tile)
    }
}
MakeAvailableToHtml('ChangeTileZ', ChangeTileZ);


var hud = document.getElementById("hud");
var card = null;
export function three_mouseMove(event) {
    //  event.preventDefault();
    three_outlinePass_token.selectedObjects = [];

    if (mouseMode == "scrolling") {
        console.log("Scroll");
        if (!mouseButtonsDown[scrollButton]) {
            mouseMode = "none";
            return;
        }
    } else {
        let elem = document.elementFromPoint(event.clientX, event.clientY);
        if (!elem || (elem.nodeName != "CANVAS")) {
            return;
        }
    }
    let newMouse = three_mousePositionToWorldPosition(event);

    if (mouseButtonsDown[mainButton]) {
        switch (mouseMode) {


            //     three_camera.position.x -= (newMouse.x - three_lastMouse.x);
            //     three_camera.position.y -= (newMouse.y - three_lastMouse.y);
            //     break;
            case "dragging":
                for (let i = 0; i < selection.length; i++) {
                    selection[i].tile.x += (newMouse.x - three_lastMouse.x);
                    selection[i].tile.y += (newMouse.y - three_lastMouse.y);
                    socket.emit('updateTile', { tile: selection[i].tile, scene: current_scene.name });
                    let highlightcolor = ((Math.sin(event.timeStamp / 100) * 255 / Math.PI) & 255) | 128;
                    selection[i].material.color.set((highlightcolor << 16) + (highlightcolor << 8) + highlightcolor);

                    if (selection[i].tile.guiLayer == "token")
                        three_outlinePass_token.selectedObjects.push(selection[i]);
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
                    let highlightcolor = ((Math.sin(event.timeStamp / 100) * 255 / Math.PI) & 255) | 128;
                    selection[i].material.color.set((highlightcolor << 16) + (highlightcolor << 8) + highlightcolor);

                    fixTile(plane.tile);
                    socket.emit('updateTile', { tile: plane.tile, scene: current_scene.name });
                }
                break;
        }
    }
    if (mouseButtonsDown[scrollButton]) {
        // if (three_camera.isOrthographicCamera) {
        console.log("Scroll");
        let dim = three_renderer_dimensions()

        let zoomMulipleX = three_camera.right / (dim.width / 2);
        //     let zoomMulipleY = three_camera.top / (dim.width/2);
        three_camera.position.x -= (event.clientX - three_lastRawMouse.x) * zoomMulipleX;
        three_camera.position.y += (event.clientY - three_lastRawMouse.y) * zoomMulipleX;

        //    console.log(event.timeStamp, "x " + (newMouse.x - three_lastMouse.x) + " y " + (newMouse.y - three_lastMouse.y));
    }
    else
        if (!mouseButtonsDown[mainButton]) {


            let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1);
            three_rayCaster.setFromCamera(pointer, three_camera);

            let intersect = three_intersect(event);
            //  console.log(intersect);
            if (intersect?.object) {
                let o = intersect.object?.tile?.reference;
                if (o) {


                    if (three_outlinePass_token.selectedObjects.length == 0)
                        three_outlinePass_token.selectedObjects = [intersect.object];
                    let screenPos = worldToScreen(intersect.object.position);


                    hud.style.left = Math.trunc(screenPos.x) + "px";
                    hud.style.top = Math.trunc(screenPos.y) + "px";
                    let thang = intersect.object.tile?.reference;
                    if (thang) {

                        hud.innerHTML = parseSheet(thang, "hud", intersect.object.tile);
                    }
                    else hud.innerHTML = o.name;;


                    if (!card) {
                        card = document.createElement("img");
                        card.id = "card";
                        card.className = "card";
                        card.style.zIndex = 1;

                        document.body.appendChild(card);


                    }

                    card.src = getPortrait(o);
                    let dim = three_renderer_dimensions()
                    card.style.display = 'block';
                    card.style.top = (dim.height - 300) + "px";
                    card.style.width = "auto";
                    card.style.height = "300px";

                } else if (card)
                    card.style.display = 'none';


            } else if (card)
                card.style.display = 'none';

        }

    three_lastRawMouse = { x: event.clientX, y: event.clientY };
    three_lastMouse = newMouse;
}
three_renderer.domElement.onwheel = (event) => {
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

    for (let i = 0; i < layers.tile.selectables.length; i++) {
        let s = layers.tile.selectables[i];
        console.log(i + ") " + s.position.z + " " + s.reference.texture);

    }

    intersects = three_rayCaster.intersectObjects(layers.tile.selectables);
    if (intersects.length > 0) {

        for (let i = 0; i < intersects.length; i++) {
            let s = intersects[i].object;
            console.log("intersect " + i + ") " + s.position.z + " " + s.reference.texture);
        }

        return intersects[0];
    }

    return undefined;
}

three_renderer.domElement.ondblclick = (ev) => {
    ev.preventDefault();
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

    if (event.button == mainButton) {
        let intersect = three_intersect(event);


        if (intersect?.object) {
            let obj = intersect.object;
            if (editMode && obj.tile.guiLayer == "tile") {
                const minim = 64;
                let tile = obj.tile;
                // this works only for tiles. To do make it a function added to each kind of thing
                // maybe better to do icon -> world
                let maxx = 1 * tile.scale.x;
                let x = intersect.uv.x * maxx;
                let maxy = 1 * tile.scale.y;
                let y = intersect.uv.y * maxy;
                scalingX = scalingX = x < minim || x > maxx - minim;
                scalingY = scalingY = y < minim || y > maxy - minim;
                if (scalingX ||
                    scalingY) {
                    mouseMode = 'scaling';

                    let highlightcolor = (Math.sin(event.timeStamp / 100) * 255 / Math.PI) & 255;

                    obj.material.color.set((highlightcolor << 16) + (highlightcolor << 8) + highlightcolor);
                    three_outlinePass_tile.selectedObjects = [obj];
                    three_outlinePass_tile.visibleEdgeColor.set('#ff0000');

                } else {
                    mouseMode = 'dragging';
                    let highlightcolor = (Math.sin(event.timeStamp / 100) * 255 / Math.PI) & 255;
                    obj.material.color.set((highlightcolor << 16) + (highlightcolor << 8) + highlightcolor);
                    // obj.material.color.set(0x0000ff);
                    //   if (intersect?.object) {
                    //  let obj = intersect.object;
                    //   if (editMode && obj.tile.guiLayer == "tile") {

                    three_outlinePass_tile.visibleEdgeColor.set('#ffffff');
                    three_outlinePass_tile.selectedObjects = [obj];
                    //  } else if (!editMode && obj.tile.guiLayer == "token") {
                    //     three_outlinePass.selectedObjects = [obj];
                    //}
                }

                selection.push(obj);

            } else if (!editMode && obj.tile.guiLayer == "token") {
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


window.onmouseup = function (event) {

    mouseButtonsDown[event.button] = false;

    if (!mouseButtonsDown[mainButton]) {

        three_outlinePass_tile.selectedObjects = [];

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

dragDrop(three_renderer.domElement, {
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


function topTileZ() {
    let maxZ = -100000;
    for (let i = 0; i < layers.tile.selectables.length; i++) {
        let sprite = layers.tile.selectables[i];

        if (sprite.position.z > maxZ) maxZ = sprite.position.z;
    }
    return maxZ;
}

three_renderer.domElement.acceptDrag = function (thingDragged, event) {


    switch (thingDragged.type) {
        case "dir": break;
        case "tile":
            let mouse = toGrid(three_mousePositionToWorldPosition(event));
            // todo handle non-instanced
            const img = new Image();
            img.src = thingDragged.img;
            img.onload = function () {
                console.log(`Width: ${img.width}, Height: ${img.height}`);
                let newTile = { "x": mouse.x, "y": mouse.y, "z": topTileZ() + 1, guiLayer: "tile", sheet: thingDragged };
                newTile.texture = thingDragged.img.substring("/images".length + 1);
                newTile.scale = {
                    x: img.width, // todo should be tile size
                    y: img.height,
                    z: 1
                };
                console.log("Create tile New Tile ", newTile);

                // boo evil dependency code fix
                three_setEditMode(true);


                const editMap = document.getElementById("EditMap");
                editMap.checked = true;
                socket.emit("add_tile", { scene: current_scene.name, tile: newTile });
            };
            break;
        default:
            CreateToken(thingDragged, event);
    }

}

