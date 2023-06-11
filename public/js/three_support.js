
import * as THREE from 'three';

/////// TODO put in seperate file

let kGridSize = 100;
class InfiniteGrid extends THREE.Mesh {

    constructor(size1, size2, color, distance, axes = 'xyz') {


        color = color || new THREE.Color('white');
        size1 = size1 || 10;
        size2 = size2 || 100;

        distance = distance || 8000;



        const planeAxes = axes.substring(0, 2);

        const geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1);

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
        guiLayer.add(cube);
        // TODO: kill cube on disconnect
    }
    return three_mouseShapes.who;
}

export async function three_addTile(msg) {
    fixTile(msg);
    // TODO: Fix calling this with two kinds of parameters
    if (typeof msg.texture == "string") console.log("WTF", msg);

    let tname = (typeof msg.texture == "string" ? msg.texture : msg.texture.img);

    if (!tname.startsWith("images/"))
        tname = "./images/" + msg.texture; // todo fix this so we are not adding paths in random places
    let materialName = tname + "_simple";
    // if (!materials[materialName]) {

    let texture = await new THREE.TextureLoader().loadAsync(tname);



    let material = new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff, transparent: true });
    const plane = new THREE.Mesh(plane_geometry, material);
    plane.position.x = msg.x;
    plane.position.y = msg.y;
    plane.position.z = msg.z;
    let textureScaleX = msg.scale.x;
    let textureScaleY = msg.scale.y;
    plane.baseScale = new THREE.Vector2(texture.image.width, texture.image.height);
    plane.scale.set(textureScaleX, textureScaleY, 1);
    switch (msg.guiLayer) {
        default:
            tileLayer.add(plane); break;
        case "token":
            tokenLayer.add(plane); break;

    }

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



export function three_replaceScene(sceneName, sceneType, c) {
    current_scene.name = sceneName;
    current_scene.type = sceneType;

    selectables = [];
    selectablesMap = {}
    for (let i = 0; i < three_scenes.length; i++) {
        clearThree(three_scenes[i]);
    }

    let grid = new InfiniteGrid(kGridSize, kGridSize);
    gridLayer.add(grid);
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
        let textureScaleX = msg.scale.x;
        let textureScaleY = msg.scale.y;
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

export function three_mouseMove(event) {
    //  event.preventDefault();
    let newMouse = three_mousePositionToWorldPosition(event);

    if (mouseButtonsDown[mainButton]) {
        switch (mouseMode) {
            case "dragging":
                for (let i = 0; i < selection.length; i++) {
                    selection[i].tile.x += (newMouse.x - three_lastMouse.x);
                    selection[i].tile.y += (newMouse.y - three_lastMouse.y);
                    socket.emit('updateTile', { tile: selection[i].tile, scene: current_scene.name });
                    fixTile(selection[i].tile);
                }
                break;
            case "scaling":
                for (let i = 0; i < selection.length; i++) {
                    let plane = selection[i];
                    let scale = selection[i].tile.scale;

                    plane.tile.x += (newMouse.x - three_lastMouse.x) / 2;
                    plane.tile.y += (newMouse.y - three_lastMouse.y) / 2;

                    scale.x = scalingX ? (newMouse.x - three_lastMouse.x) + scale.x : scale.x;
                    scale.y = scalingY ? (newMouse.y - three_lastMouse.y) + scale.y : scale.y;

                    fixTile(selection[i].tile);
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
    three_lastRawMouse = { x: event.clientX, y: event.clientY };
    three_lastMouse = newMouse;
}
three_renderer.domElement.onwheel = (event) => {
    console.log(event.delta);
    let d = event.wheelDelta * 0.6;
    let wd = d * three_renderer_dimensions().aspect

    three_camera.left += wd; three_camera.right -= wd;
    three_camera.top -= d; three_camera.bottom += d
    three_camera.updateProjectionMatrix()

};

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
    three_lastRawMouse = { x: event.clientX, y: event.clientY };

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
    thingDragged = null;

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

async function CreateToken(thingDragged, event) {
    let mouse = toGrid(three_mousePositionToWorldPosition(event));
    let newTile = { "x": mouse.x, "y": mouse.y, "z": 0, guiLayer: "token", };

    let img = await GetImageFor(thingDragged);
    newTile.texture = img.img;
    newTile.scale = {
        x: img.scaleX * kGridSize, // todo should be tile size
        y: img.scaleY * kGridSize,
        z: 1
    };
    socket.emit("add_token", { scene: current_scene.name, thingDragged: thingDragged, tile: newTile });

}

three_renderer.domElement.acceptDrag = function (thingDragged, event) {

    // for (let i = 0; i < array.length; i++) {
    //     if (array[i].file == thingDragged.file) {
    //         console.log("Dupe");

    //     }
    // }
    CreateToken(thingDragged, event);


}