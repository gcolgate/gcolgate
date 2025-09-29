
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { ensureThingLoaded, GetRegisteredThing, MakeAvailableToHtml, parseSheet, showThing, emitChange } from './characters.js';
// import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

import { dragDrop, setThingDragged } from './drag.js';
/////// TODO put in seperate file
import { socket } from './client_main.js';
import { getAppearanceImage, getAppearanceTintForHTML } from './ptba.js';
import { waterShader, waterTexture } from './water_texture.js';


export const three_canvas = document.getElementById('canvas');
var ready = false;
var origTime = Date.now(); // current time
var theTime = 0; // current time since program start
var grid;
var hexgrid;
let kGridSize = 100;
var three_scaling_factor = 0;
const kWidthHeightOffsetTimesTwo = 32; // 2x the margins from the window to the canvas
const kThreeFarClippingPlane = 10000;
const kThreeNearClippingPlane = 0.1;
var perspectiveCameraScrollMultiplier = 0;
var scroll_last_client = {};
class InfiniteGrid extends THREE.Mesh {
    constructor(size1, size2, color, opacity, distance, axes = 'xyz') {
        color = color || new THREE.Color('white');
        opacity = opacity || 1.0;
        size1 = size1 || 10;
        size2 = size2 || 100;

        distance = distance || 8000;



        const planeAxes = axes.substring(0, 2);

        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

        const material = new THREE.ShaderMaterial({

            side: THREE.DoubleSide,

            uniforms: {
                uSize1: { value: size1 },
                uSize2: { value: size2 },
                uColor: { value: color },
                uOpacity: { value: opacity },
                uDistance: { value: distance }
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
       uniform float uOpacity;
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
              gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0)*uOpacity);
              gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);

              if ( gl_FragColor.a <= 0.0 ) discard;
       }

       `,

            extensions: { derivatives: true }

        });

        super(geometry, material);

        this.frustumCulled = false;
    }
}

var sqrt3 = Math.sqrt(3);

const kHexGridSize = kGridSize;

function cube_to_axial(cube) {
    var q = cube.q
    var r = cube.r
    return { q: q, r: r };
}

function axial_to_cube(hex) {
    var q = hex.q
    var r = hex.r
    var s = -q - r
    return { q: q, r: r, s: s };
}

function cube_round(frac) {
    let q = Math.round(frac.q);
    let r = Math.round(frac.r);
    let s = Math.round(frac.s);

    let q_diff = Math.abs(q - frac.q);
    let r_diff = Math.abs(r - frac.r);
    let s_diff = Math.abs(s - frac.s);


    if (q_diff > r_diff && q_diff > s_diff)
        q = -r - s;
    else if (r_diff > s_diff)
        r = -q - s;
    else
        s = -q - r;

    return { q: q, r: r, s: s };
}

// function axial_round(x, y) {
//   const xgrid = Math.round(x);
//   const ygrid = Math.round(y);
//   x -= xgrid, y -= ygrid;  // remainder
//   const dx = Math.round(x + 0.5 * y) * (x * x >= y * y);
//   const dy = Math.round(y + 0.5 * x) * (x * x < y * y);
//   return {q: xgrid + dx, r: ygrid + dy};
// }

function axial_round(hex) {
    return cube_to_axial(cube_round(axial_to_cube(hex)))
}

function convert_flat_hex_to_pixel(hex) {
    let x = kHexGridSize * (3. / 2 * hex.q);
    let y = kHexGridSize * (sqrt3 / 2 * hex.q + sqrt3 * hex.r);
    return { x: x, y: y };
}

function convert_pixel_to_flat_hex(point) {
    var q = (2. / 3 * point.x) / kHexGridSize;
    var r = (-1. / 3 * point.x + sqrt3 / 3 * point.y) / kHexGridSize;
    return axial_round({ q, r });
}
class InfiniteHexGrid extends THREE.Mesh {
    constructor(size1, size2, color, opacity, distance, axes = 'xyz') {
        color = color || new THREE.Color('white');
        size1 = size1 || 10;
        size2 = size2 || 100;
        opacity = opacity || 1.0;

        distance = distance || 8000;

        const planeAxes = axes.substring(0, 2);

        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

        const material = new THREE.ShaderMaterial({

            side: THREE.DoubleSide,

            uniforms: {
                uSize1: { value: size1 },
                uSize2: { value: size2 },
                uColor: { value: color },
                uOpacity: { value: opacity },
                uDistance: { value: distance },

            },

            transparent: true,
            vertexShader: `

       varying vec3 worldPosition;

       uniform float uSize1;

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
            uniform float uOpacity;

           // const vec2 s = vec2(1, 1.7320508);
             const vec2 s = vec2(  1.7320508,1);
             const float sqrt3 = 1.7320508;

            // 1 on edges, 0 in middle, smooth function
            // float hex(vec2 p) {
            //     p.x *= 0.57735*2.0;
            //     p.y += mod(floor(p.x), 2.0)*0.5;
            //     p = abs((mod(p, 1.0) - 0.5));
            //     return abs(max(p.x*1.5 + p.y, p.y*2.0) - 1.0);
            // }


            // void main( )
            // {
            //     vec2 pos = worldPosition.xy;
            //     vec2 p = pos/vec2(uSize1,uSize2);
            //     // varying the distance of the smoothsteps results in skinnier or thicker lines
            //     gl_FragColor  = vec4(smoothstep(0.05,0.0 , hex(p)))*vec4(uColor, uOpacity);

            // }


            // vec2 cube_to_axial(vec3 cube) {
            //     float q = cube.x;
            //     float r = cube.y;
            //     return vec2(q,r);
            // }

            vec3 axial_to_cube(vec2 hex){
                return vec3 (  hex.xy,  -hex.x-hex.y);
            }

            vec3 cube_round(vec3 frac) {
                vec3 q = round(frac);

                vec3 diff = abs(q - frac);

                if(diff.x > diff.y && diff.x > diff.z)
                    q.x = -q.y-q.z;
                else if (diff.y > diff.z)
                    q.y = -q.x-q.z;
                else
                    q.z = -q.x-q.y;

                return q;
            }

            // function axial_round(x, y) {
            //   const xgrid = Math.round(x);
            //   const ygrid = Math.round(y);
            //   x -= xgrid, y -= ygrid;  // remainder
            //   const dx = Math.round(x + 0.5 * y) * (x * x >= y * y);
            //   const dy = Math.round(y + 0.5 * x) * (x * x < y * y);
            //   return {q: xgrid + dx, r: ygrid + dy};
            // }

            vec2 axial_round(vec2 hex) {
                return (cube_round(axial_to_cube(hex))).xy;
            }

            float hex(vec2 p)
            {
                p = abs(p);

                return max(dot(p, s*.5), p.y); // Hexagon.

            }

            vec2 convert_flat_hex_to_pixel(vec2 hex) {
            float kHexGridSize = uSize1;

            float x = kHexGridSize * (3. / 2. * hex.x);
            float y = kHexGridSize * (sqrt3 / 2. * hex.x + sqrt3 * hex.y);
            return vec2(x,y);
            }

            vec2 convert_pixel_to_flat_hex(vec2 point) {
            float kHexGridSize = uSize1;
            float q = (2. / 3. * point.x) / kHexGridSize;
            float r = (-1. / 3. * point.x + sqrt3 / 3. * point.y) / kHexGridSize;
            return axial_round(vec2(q,r));
            }



            void main() {
            vec2 pos = worldPosition.xy;
            vec2 center = convert_flat_hex_to_pixel(convert_pixel_to_flat_hex(pos));
            pos -= center;
            vec3 color = uColor*2.;

             float kHexGridSize = uSize1;

             if(length(pos) > kHexGridSize) {
                color = vec3(1,0,0);
             }
            if(abs(pos.y) > kHexGridSize) {
                color = vec3(1,0,0);
             }
             pos /= kHexGridSize;

          gl_FragColor  = vec4(smoothstep(0.75,1., hex(pos.xy)))*vec4(color, uOpacity);
          //  gl_FragColor  = vec4(smoothstep(0.8,0.9999,  (length(pos))))*vec4(color, uOpacity);

          }

       `,

            extensions: { derivatives: true }
        });

        super(geometry, material);

        this.frustumCulled = false;
    }
}

/////////////////////////////////


function three_renderer_dimensions() {

    let width = three_canvas.width; //window.innerWidth - kWidthHeightOffsetTimesTwo;
    let height = three_canvas.height; //window.innerHeight - kWidthHeightOffsetTimesTwo;
    return {
        width: width,
        height: height,
        aspect: (width / height)
    }
}
var originalX, originalY;
function three_setDimension() {
    // fetch target renderer size
    var rendererSize = three_renderer_dimensions();
    // notify the renderer of the size change
    three_renderer.setSize(rendererSize.width, rendererSize.height, true)
    // update the camera
    if (three_camera.isOrthographicCamera) {
        // const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
        // window.innerHeight, 0.1, 1000);

        let d = three_scaling_factor;
        let wd = d * three_renderer_dimensions().aspect;

        originalX = rendererSize.width / -2;
        originalY = rendererSize.height / -2;

        three_camera.left = (rendererSize.width / -2) + wd;
        three_camera.right = (rendererSize.width / 2) - wd;
        three_camera.top = (rendererSize.height / 2) - d;
        three_camera.bottom = (rendererSize.height / -2) + d;
    }
    else {
        three_camera.aspect = rendererSize.width / rendererSize.height
        three_camera.updateProjectionMatrix();
    }
}

function three_window_sizer_watcher(renderer, camera, dimension) {
    // bind the resize event
    window.addEventListener('resize', three_setDimension, false)
    // return .stop() the function to stop watching window resize
    return {
        trigger:
            function () {
                three_setDimension()
            },
        /**
         * Stop watching window resize
         */

        destroy: function () {
            window.removeEventListener('resize', three_setDimension)
        }
    }
}



class Rings {

    constructor() {
        this.rings = [];


    }

    addARing(x, y, z, scale) {

        const ring = new THREE.Mesh(ring_geometry, ring_material);
        ring.onBeforeRender = function (renderer, scene, camera, geometry, material) {
            material.opacity = 1 - this.age / 3.0;
        }
        ring.position.x = x;
        ring.position.y = y;
        ring.position.z = z;
        ring.age = 0;
        ring.scale.x = scale;
        ring.scale.y = scale;
        ring.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI / 2);
        guiLayer.add(ring);
        this.rings.push(ring);

    }
    addRing(x, y, z) {


        //  this.addARing(x,y,z,-20);
        // this.addARing(x,y,z,-10);
        this.addARing(x, y, z, 0);
        // this.addARing(x,y,z,4);
    }

    update() {
        for (let i = 0; i < this.rings.length;) {
            let ring = this.rings[i];
            ring.scale.x += 0.5;
            ring.scale.y += 0.5;
            ring.age += 0.02;
            if (ring.age > 3.0) {
                clearThree(ring);
                this.rings.splice(i, 1);

            } else {
                i++;
            }

        }
    }
};

const rings = new Rings();

const backgroundLayer = new THREE.Scene();
const tileLayer = new THREE.Scene();
const guiLayer = new THREE.Scene();
const tokenLayer = new THREE.Scene();
const gridLayer = new THREE.Scene();
//const waterTexture = new WaterTexture({ debug: true });

// const kTileLayerIndex = 1;
// const kTokenLLayerIndex = 3;
const three_scenes =
    [backgroundLayer, tileLayer, gridLayer, tokenLayer, guiLayer];

class cleanRenderPass extends RenderPass {
    constructor(
        scene, camera, overrideMaterial = null, clearColor = null,
        clearAlpha = null) {
        super(scene, camera, overrideMaterial, clearColor, clearAlpha);
        this.clear = false;
        this.clearDepth = true;
    }
}

class firstRenderPass extends RenderPass {
    constructor(
        scene, camera, overrideMaterial = null, clearColor = null,
        clearAlpha = null) {
        super(scene, camera, overrideMaterial, clearColor, clearAlpha);
        this.clear = true;
        this.clearDepth = true;
    }
}
export var three_renderer;
export var three_camera;
export var current_scene;
export var three_mouseShapes = {}
var three_outlinePass_tile;
var three_outlinePass_token;
var three_composer;
var three_d = true;
var portraits = false;

const mouse_geometry = new THREE.BoxGeometry(10, 10, 10);
const mouse_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const plane_geometry = new THREE.PlaneGeometry(1, 1);

const ring_geometry = new THREE.RingGeometry(1, 1.2, 128);
const ring_material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true });


var materials = {};

var layers = {};

function resetCamera() {
    var rendererSize = three_renderer_dimensions();

    if (!three_d) {
        three_camera = new THREE.OrthographicCamera(
            rendererSize.width / -2, rendererSize.width / 2, rendererSize.height / 2,
            rendererSize.height / -2, -10, kThreeFarClippingPlane);
        three_camera.position.x = 0;
        three_camera.position.z = 1000;
        three_camera.position.y = 0;
    } else {

        three_camera = new THREE.PerspectiveCamera(
            45, rendererSize.width / rendererSize.height, kThreeNearClippingPlane, kThreeFarClippingPlane);
        three_camera.position.z = 1000;

        three_camera.position.x = 0;
        three_camera.position.z = 1000;
        three_camera.position.y = 0;

        three_camera.lookAt(0, 400, -10);

    }


}

function setUpComposers() {


    // postprocessing

    three_composer = new EffectComposer(three_renderer);

    three_composer.addPass(new firstRenderPass(backgroundLayer, three_camera));
    three_composer.addPass(new cleanRenderPass(tileLayer, three_camera));
    three_outlinePass_tile = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), tileLayer,
        three_camera);
    three_composer.addPass(three_outlinePass_tile);


    three_composer.addPass(new cleanRenderPass(gridLayer, three_camera));
    three_composer.addPass(new cleanRenderPass(tokenLayer, three_camera));
    three_outlinePass_token = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), tokenLayer,
        three_camera);
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

    // const textureLoader = new THREE.TextureLoader();
    const waterPass = new ShaderPass(waterShader);
    three_composer.addPass(waterPass);



    three_composer.addPass(new OutputPass());

    // var three_effectFXAA = new ShaderPass(FXAAShader);
    // three_effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1
    // / window.innerHeight); three_composer.addPass(three_effectFXAA);

}

window.onload = function () {
    three_renderer = new THREE.WebGLRenderer({ canvas: three_canvas });

    three_canvas.width = three_canvas.clientWidth;
    three_canvas.height = three_canvas.clientHeight;

    var rendererSize = three_renderer_dimensions();

    three_renderer.setSize(rendererSize.width, rendererSize.height, true);
    //document.body.appendChild(three_renderer.domElement);
    //three_canvas.style.resize = 'both';
    resetCamera();


    three_canvas.acceptsDropFile = true;


    //three_window_sizer_watcher(three_renderer, three_camera);

    current_scene = {
        name: '',

    }

    setUpComposers();

    layers = {
        tile: {
            selectables:
                [],  // for some reason I have both an array and map of this, maybe
            // because I need array for THREE calls? TODO: investigate
            selectablesMap: {},
            protoSheetMap:
                {},  // if the object has a sheet with  with a file name, this will be
            // the file name, like PlayerOne. TODO: better name
            layer: tileLayer,
        },
        token: {
            selectables: [],
            selectablesMap: {},
            protoSheetMap: {},
            layer: tokenLayer,
        },
        gui: {
            selectables: [],
            selectablesMap: {},
            protoSheetMap: {},
            layer: guiLayer,
        },
    };
    ready = true;
};
// gets the layer associated with a key, logic here only needed because
// default is tile
function three_getLayer(n) {
    switch (n) {
        default:
            return layers.tile;
        case 'token':
            return layers.token;
    }
}

var selection = [];

let shader_sets = {
    normal: {
        vertex_shader: "",
        texture_shader: "",

        uniforms: []
    },
    fireball: {
        vertex_shader: "Shaders/base_effect_vertex.glsl",
        fragment_shader: "Shaders/fireball.glsl",
        uniforms: {
            uTime: "Number"
        }
    }
}

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

let baseMaterial =
    new THREE.MeshBasicMaterial({ color: 0x0, transparent: false });


function HtmlHEXToThreeJsColor(rrggbb) {
    return parseInt(rrggbb.substr(1), 16);
}

async function three_setTileImage(tile, plane, noz) {
    if (tile.texture == undefined) {
        console.log('Error Bad texture for %o', tile);
        return;
    }
    let color = 0xffffff;

    // TODO: Fix calling this with two kinds of parameters and get rid of this
    // line
    let tname =
        (typeof tile.texture == 'string' ? tile.texture : tile.texture.img);

    if (!tname.startsWith('images/'))
        tname = './images/' + tile.texture;  // todo fix this so we are not adding
    // paths in random places

    if (tile.sheet?.id) {
        await ensureThingLoaded(tile.sheet.id);
        //   add style here
        let thing = GetRegisteredThing(tile.sheet.id);
        let token = getAppearanceImage(thing, 'token');
        if (token) {
            tname = token;
            color = HtmlHEXToThreeJsColor(getAppearanceTintForHTML(thing, 'token'));

        }
    }

    let loader = new THREE.TextureLoader();
    let texture = await loader.loadAsync(tname);

    let material;

    if (tile.shader_set && tile._shader_set != "normal") {

        let shader_set = shader_sets[tile.shader_set];
        let response = await fetch(shader_set.vertex_shader);
        let vertexShader = await response.text();

        response = await fetch(shader_set.fragment_shader);
        let fragmentShader = await response.text();

        let uniforms = {};

        let keys = Object.keys(shader_set.uniforms);

        for (let i = 0; i < keys.length; i++) {

            let key = keys[i];

            switch (tile.uniforms[keys[i]]) {
                case "Number":
                    uniforms[key] = { value: 1.0 };
                    break;
                case "vec2":
                    uniforms[key] = new THREE.Uniform(new THREE.Vector2())
                    break;
                default:
                    alert("need to enumerate the other kinds");


            }
        }

        material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: uniforms,
            transparent: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            extensions: { derivatives: true },
            onBeforeRender: function () {
                if (this.uniforms.uTime) {
                    this.uniforms.uTime.value = theTime / 1000.0;
                }
            }
        });
        material.highLight = function () { };
        material.unHighLight = function () { };
    } else {
        material = new THREE.MeshBasicMaterial({
            map: texture,
            color: color,
            transparent: true,
            // onBeforeCompile: (shader) => {
            //   console.log('ZZZYX');
            //   console.log(shader);
            // }
        });
        material.highLight = function () {

            let highlightcolor =
                ((Math.sin(theTime / 100) * 255 / Math.PI) & 255) | 128;
            this.color.set(
                (highlightcolor << 16) + (highlightcolor << 8) + highlightcolor);


        }.bind(material);
        material.unHighLight = function () {

            this.color.set(0xffffff);
        }.bind(material);;

        if (noz) {
            material.depthWrite = false;
        }

    }
    let textureScaleX = tile.scale.x;
    let textureScaleY = tile.scale.y;
    texture.colorSpace = THREE.SRGBColorSpace;
    // texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    plane.baseScale =
        new THREE.Vector2(texture.image.width, texture.image.height);
    plane.material = material;
    plane.scale.set(textureScaleX, textureScaleY, 1);

}

//   plane.position.x = 0;
//   plane.position.y = 0;
//   plane.position.z = 10;
//   plane.reference = null;


//   let layer = three_getLayer(\"token");
//   layer.layer.add(plane);

//   let material = new THREE.MeshBasicMaterial({
//     map: waterTexture.texture,
//     color: 0xffffff,
//     transparent: false,

//   });
//   let textureScaleX = 256;
//   let textureScaleY = 256;
//   waterTexture.colorSpace = THREE.SRGBColorSpace;
//   plane.baseScale =
//     new THREE.Vector2(64, 64);
//   plane.material = material;
//   plane.scale.set(textureScaleX, textureScaleY, 1);

// }

function FinishSetTile(tile, material) {
    const plane = new THREE.Mesh(plane_geometry, material);

    plane.position.x = tile.x;
    plane.position.y = tile.y;
    plane.position.z = tile.z;
    plane.reference = tile;
    plane.renderOrder = tile.sort ? tile.sort : 0;

    if (!tile.flat && three_d && tile.guiLayer != "tile") {
        // plane.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        //  plane.position.z += tile.scale.y / 2;
    }

    let layer = three_getLayer(tile.guiLayer);
    layer.layer.add(plane);
    layer.selectables.push(plane);
    layer.selectablesMap[tile.tile_id] = plane;
    let original = tile?.sheet?.id;
    if (original) {
        if (layer.protoSheetMap[original] == undefined) {
            layer.protoSheetMap[original] = [];
        }
        layer.protoSheetMap[original].push(plane);
    }

    plane.tile = tile;
    three_setTileImage(tile, plane, tile.guiLayer == "tile");
}

export async function three_addTile(tile) {
    fixTile(tile);  // if I used protobufs this would not happen


    FinishSetTile(tile, baseMaterial);


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
        // in case of map, bumpMap, normalMap, envMap ...
        Object.keys(obj.material).forEach(prop => {
            if (!obj.material[prop]) return;
            if (obj.material[prop] !== null &&
                typeof obj.material[prop].dispose === 'function')
                obj.material[prop].dispose();
        })
        obj.material.dispose();
    }
}



export async function three_replaceScene(sceneName, c, cameraPos) {
    current_scene.name = sceneName;
    current_scene.settings = await ensureThingLoaded("Scenes/tag_" + current_scene.name + ".json");
    Object.keys(layers).forEach((item) => {
        layers[item].selectables = [];
        layers[item].selectablesMap = {};
        layers[item].protoSheetMap = {};
    });

    for (let i = 0; i < three_scenes.length; i++) {
        clearThree(three_scenes[i]);
    }

    switch (current_scene.settings.view) {

        case "topdown":
        case "portraits":
            three_d = false;
            break;
        case "threeD":
            three_d = true;

    }

    resetCamera();
    setUpComposers();

    hexgrid = new InfiniteHexGrid(kGridSize, kGridSize);
    gridLayer.add(hexgrid);
    grid = new InfiniteGrid(kGridSize, kGridSize);
    gridLayer.add(grid);

    let name = ('Scenes/tag_' + sceneName + '.json');

    ensureThingLoaded(name).then(thing => {
        if (thing.typeOfGrid != 'hex') hexgrid.visible = false;
        if (thing.typeOfGrid != 'square') grid.visible = false;
        three_camera.position.x = thing.cameraStartX;
        three_camera.position.y = thing.cameraStartY;
        let dim = three_renderer_dimensions();
        if (thing.scalingFactor != undefined) {
            three_scaling_factor = thing.scalingFactor;
            three_setDimension();
            three_camera.updateProjectionMatrix();
        }
    });

    let keys = Object.keys(c);
    for (let i = 0; i < keys.length; i++) {
        try {
            fixTile(c[keys[i]]);
            three_addTile(c[keys[i]]);
        } catch (err) {
            console.log('Could not load ', keys[i], c[keys[i]]);
        }
    }
    if (cameraPos != undefined) {
        three_camera.position.x = cameraPos.x;
        three_camera.position.y = cameraPos.y;
    }
    // debugWaterTexture();
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

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight - 50;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size 
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        three_setDimension();
        console.log("Resized");
    }

    return needResize;
}

// main animation function for the game
export function three_animate() {
    requestAnimationFrame(three_animate);
    if (ready) {

        resizeCanvasToDisplaySize(three_canvas);

        theTime = Date.now() - origTime;

        //waterTexture.update();
        rings.update();

        for (const [key, cube] of Object.entries(three_mouseShapes)) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }
        three_renderer.autoClear = true;

        three_composer.render();
    }
}

let three_rayCaster = new THREE.Raycaster();
let three_lastMouse = null;
let three_lastRawMouse = null;
var three_lastRawMouseInWorld = null;
// change these when window size changes, for mouse calculations
let multiplier =
    new THREE.Vector2(2 / window.innerWidth, 2 / window.innerHeight);
let adder = new THREE.Vector2(-1, 1);



// the math here isn't right but it works but that's what you get not
// working in the morning on this project when I can do math
// TODO: quit job and only do hobbies


var mouseMode = 'none';
var scalingX = false;
var scalingY = false;
var editMode = false;
var editThingMode = false;
var mouseButtonsDown = [false, false, false, false, false, false];


const leftMouseButton = 0;
const middleMouseButton = 1;
const rightMouseButton = 2;

var mainButton = leftMouseButton;
var scrollButton = rightMouseButton;
var popupButton = rightMouseButton;

var stillScrolling = false;

function GetDimensions() {
    if (!three_canvas || !three_canvas.clientWidth) return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    return {
        left: 0,
        top: 0,
        width: three_canvas.clientWidth,
        height: three_canvas.clientHeight
    };
}
function normalizedDeviceCoordinates(x, y) {

    let dim = GetDimensions()
    x -= dim.left;
    y -= dim.top;
    // pick z halfway to clipping
    return new THREE.Vector3(
        (x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.9999);
}
var dbueg_ = false;
function three_xyinMouseToWorld(x, y) {

    if (dbueg_) console.log("x y " + x + " " + y);
    let vec = normalizedDeviceCoordinates(x, y);
    if (dbueg_) console.log("normalizedDeviceCoordinates" + vec.x + " " + vec.y + " " + vec.z);
    // (x / dim.width) * 2 - 1, -(y / dim.height) * 2 + 1, 0.5);
    vec.unproject(three_camera);
    if (!three_camera.isOrthographicCamera && false) {
        // point where z is zero
        vec.sub(three_camera.position).normalize();
        if (dbueg_) console.log("camera %o", three_camera.position);
        if (dbueg_) console.log("norm %o", vec);
        // as we don;t change the camera angle or height of the camera, hold the distance constant
        //as the three.js math seems to be subject to floatin gpoint error 
        let distance = -three_camera.position.z / vec.z;
        if (dbueg_) console.log("distance " + distance + " " + vec.z);
        let pos = new THREE.Vector3();
        pos.copy(three_camera.position).add(vec.multiplyScalar(distance));
        return pos;
    }

    dbueg_ = false;
    return vec;
}

// these only work right now on ortho views but it will be
// fun to make them work on 3d views
export function three_mousePositionToWorldPosition(event) {
    return three_xyinMouseToWorld(event.clientX, event.clientY);
}



function SetSceneStartingCamera(id) {
    let evaluation = 'thing.cameraStartX = ' + three_camera.position.x +
        '; thing.cameraStartY = ' + three_camera.position.y +
        '; thing.scalingFactor = ' + three_scaling_factor;
    emitChange(id, evaluation);
}
MakeAvailableToHtml('SetSceneStartingCamera', SetSceneStartingCamera);

export function three_setEditMode(on) {
    editMode = on;
    selection = [];

}

export function three_setEditThingMode(on) {
    editThingMode = on;
    selection = [];

}

function worldToScreen(worldPos) {

    let dim = three_renderer_dimensions()
    var screenPos = worldPos.clone();
    screenPos.project(three_camera);
    screenPos.x = (screenPos.x + 1) * (dim.width + 0.5 + kWidthHeightOffsetTimesTwo) / 2;
    screenPos.y = (- screenPos.y + 1) * (dim.height + 0.5 + kWidthHeightOffsetTimesTwo) / 2;

    // screenPos.x = (screenPos.x + 1) * (three_camera.projectionMatrixInverse.elements[0]);
    // screenPos.y = (-screenPos.y + 1) * (three_camera.projectionMatrixInverse.elements[5]);
    return screenPos;
}

function getPortrait(o) {
    if (o.id) {
        let thing = GetRegisteredThing(o.id);
        if (thing) {
            return getAppearanceImage(thing, 'portrait');
        }
    }
    return o.img;
}

function findTokenTile(id) {
    let scene = three_getLayer('token');
    for (let i = 0; i < scene.selectables.length; i++) {
        let o = scene.selectables[i].reference;
        if (o && o.tile_id == id) {
            return o;
        }
    }
    return undefined;
}

async function ChangeTileZ(id, changeAmt) {
    let tile = findTokenTile(id);
    if (tile) {
        tile.z += changeAmt;
        socket.emit('updateTile', { tile: tile, scene: current_scene.name });
        let hudSheet = 'hud';
        if (tile.reference.hud) {
            hudSheet = tile.reference.hud;
        }

        hud.innerHTML = await parseSheet(tile.reference, hudSheet, tile);
    }
}

MakeAvailableToHtml('ChangeTileZ', ChangeTileZ);


var hud = document.getElementById('hud');
var card = null;


export async function three_mouseMove(event) {

    pinger.mouseMove(event);


    //  event.preventDefault();
    three_outlinePass_token.selectedObjects = [];

    if (mouseMode == 'scrolling') {
        console.log('Scroll');
        if (!mouseButtonsDown[scrollButton]) {
            stillScrolling = false;
            mouseMode = 'none';
            return;
        }
    } else {
        let elem = document.elementFromPoint(event.clientX, event.clientY);
        if (!elem || (elem.nodeName != 'CANVAS')) {
            return;
        }
    }
    let newMouse = three_mousePositionToWorldPosition(event);

    if (mouseButtonsDown[mainButton]) {
        switch (mouseMode) {
            //     three_camera.position.x -= (newMouse.x - three_lastMouse.x);
            //     three_camera.position.y -= (newMouse.y - three_lastMouse.y);
            //     break;
            case 'dragging':
                for (let i = 0; i < selection.length; i++) {
                    selection[i].tile.x += (newMouse.x - three_lastMouse.x);
                    selection[i].tile.y += (newMouse.y - three_lastMouse.y);
                    socket.emit(
                        'updateTile',
                        { tile: selection[i].tile, scene: current_scene.name });
                    selection[i].material.highLight();

                    if (selection[i].tile.guiLayer == 'token')
                        three_outlinePass_token.selectedObjects.push(selection[i]);
                }
                break;
            case 'scaling':
                for (let i = 0; i < selection.length; i++) {
                    let plane = selection[i];
                    let scale = plane.tile.scale;

                    let cx = (newMouse.x - three_lastMouse.x);
                    let cy = (newMouse.y - three_lastMouse.y);

                    plane.tile.x += cx / 2;
                    plane.tile.y += cy / 2;

                    scale.x =
                        scalingX ? cx + scale.x : scale.x;
                    scale.y =
                        scalingY ? cy + scale.y : scale.y;
                    selection[i].material.highLight();

                    fixTile(plane.tile);
                    socket.emit(
                        'updateTile', { tile: plane.tile, scene: current_scene.name });
                }
                break;
        }
    }
    if (mouseButtonsDown[scrollButton] && !event.shiftKey) {


        if (!stillScrolling && three_d) {
            // scrolling in 3d is a hack because I don't want to change the camera used
            // for scrolling calcuations as the camera scrolls
            // It will not work if the camera is allowed to rotate but could be easily fixed
            // Note that the scrolling is too fast when zoomed, and too slow when zoomed out
            // which should be looked into
            // Right here we use the camera at the start of the scrolling to calculate the scrolling
            // from then on.
            var rawMouse = three_xyinMouseToWorld(event.clientX, event.clientY);

            let plusX = three_xyinMouseToWorld(event.clientX + 1, event.clientY);

            plusX.sub(rawMouse);
            perspectiveCameraScrollMultiplier = plusX.length();

            scroll_last_client = { x: event.clientX, y: event.clientY };
            stillScrolling = true;
            return;
        }
        dbueg_ = true
        if (!three_d) {
            let dim = three_renderer_dimensions()

            let zoomMulipleX = three_camera.right / (dim.width / 2);
            //     let zoomMulipleY = three_camera.top / (dim.width/2);
            three_camera.position.x -=
                (event.clientX - three_lastRawMouse.x) * zoomMulipleX;
            three_camera.position.y +=
                (event.clientY - three_lastRawMouse.y) * zoomMulipleX;
        } else {
            // sometimes the reported mouse position seems to jump a long distance
            // on the first frame of scrolling, this distance check hacks around that
            // by ignoring the first frame of scrolling when it is huge
            if (Math.abs(event.clientX - scroll_last_client.x) < 50 &&
                Math.abs(event.clientY - scroll_last_client.y) < 50) {

                // this doesn't obey camera rotation, will need to be fixed if we ever have that feature
                three_camera.position.x -= perspectiveCameraScrollMultiplier * (event.clientX - scroll_last_client.x);
                three_camera.position.y += perspectiveCameraScrollMultiplier * (event.clientY - scroll_last_client.y);
            }
            scroll_last_client.x = event.clientX;
            scroll_last_client.y = event.clientY;

        }
    } else if (!mouseButtonsDown[mainButton]) {

        //    let pointer = new THREE.Vector2(
        //   (event.clientX / window.innerWidth) * 2 - 1,
        //   -(event.clientY / window.innerHeight) * 2 + 1);
        let pointer = normalizedDeviceCoordinates(event.clientX, event.clientY);

        three_rayCaster.setFromCamera(pointer, three_camera);
        // if ortho

        let intersect = three_intersect(event);
        //  console.log(intersect);
        if (intersect?.object) {
            let o = intersect.object?.tile?.reference;
            if (o) {
                if (three_outlinePass_token.selectedObjects.length == 0)
                    three_outlinePass_token.selectedObjects = [intersect.object];
                let pos = intersect.object.position.clone();
                pos.x -= kGridSize;
                pos.y -= kGridSize / 2;
                let screenPos = worldToScreen(pos);


                let thang = intersect.object.tile?.reference;

                let thing = GetRegisteredThing(thang.id)
                hud.innerHTML = await parseSheet(thing, thing.hud ? thing.hud : 'hud', intersect.object.tile);

                hud.style.left = Math.trunc(screenPos.x) + 'px';
                hud.style.top = Math.trunc(screenPos.y) + 'px';


                if (!card) {
                    card = document.createElement('img');
                    card.id = 'card';
                    card.className = 'card';
                    card.style.zIndex = 1;

                    document.body.appendChild(card);
                }

                card.src = getPortrait(o);
                let dim = three_renderer_dimensions()
                card.style.display = 'block';
                card.style.top = (dim.height - 300) + 'px';
                card.style.width = 'auto';
                card.style.height = '300px';

            } else if (card)
                card.style.display = 'none';


        } else if (card)
            card.style.display = 'none';
    }

    three_lastRawMouse = { x: event.clientX, y: event.clientY };

    three_lastMouse = newMouse;
}
three_canvas.onwheel = (event) => {
    let d = event.wheelDelta * 0.6;

    if (!three_d) {
        let wd = d * three_renderer_dimensions().aspect;
        three_scaling_factor += d;
        three_camera.left += wd;
        three_camera.right -= wd;
        three_camera.top -= d;
        three_camera.bottom += d
    } else {
        three_camera.fov -= d / 50;
        if (three_camera.fov < 0.1)
            three_camera.fov = 0.1;
        if (three_camera.fov > 170)
            three_camera.fov = 170;

    }

    three_camera.updateProjectionMatrix();
};

three_canvas.onmouseup = (ev) => {
    pinger.mouseUp();
};

function three_intersect(ev) {

    // let pointer = new normalizedDeviceCoordinates(ev.clientX, ev.clientY);

    let intersects = three_rayCaster.intersectObjects(layers.token.selectables);
    if (intersects.length > 0) {
        return intersects[0];
    }

    //   for (let i = 0; i < layers.tile.selectables.length; i++) {
    //     let s = layers.tile.selectables[i];
    //     console.log(i + ') ' + s.position.z + ' ' + s.reference.texture);
    //   }

    intersects = three_rayCaster.intersectObjects(layers.tile.selectables);
    if (intersects.length > 0) {
        // for (let i = 0; i < intersects.length; i++) {
        //   let s = intersects[i].object;
        //   console.log(
        //       'intersect ' + i + ') ' + s.position.z + ' ' + s.reference.texture);
        // }

        return intersects[0];
    }

    return undefined;
}


class Pinger {

    constructor() {
        this.isMouseStill = false;
        this.initialMousePosition = { x: 0, y: 0 };
        this.mouseDownTimer = null;
        this.cameraToo = false;
    }
    mouseMove(event) {
        if (this.mouseDownTimer) {
            if (Math.abs(event.clientX - this.initialMousePosition.x) > 5
                || Math.abs(event.clientY - this.initialMousePosition.y) > 5) {
                this.isMouseStill = false;
                clearTimeout(this.mouseDownTimer); // Clear the timeout if mouse moves
                this.mouseDownTimer = null;
            }
        }
    };
    mouseUp() {
        if (this.mouseDownTimer) {
            clearTimeout(this.mouseDownTimer);
            this.mouseDownTimer = null;
        }
    }
    mouseDown(event) {
        if (this.mouseDownTimer) { alert("WTF"); }


        this.initialMousePosition = { x: event.clientX, y: event.clientY };
        this.isMouseStill = true;

        console.log("start ping " + theTime);
        this.mouseDownTimer = setTimeout(() => {
            pinger.ping();
        }, 1000);

        this.cameraToo = event.shiftKey;
    }

    async pingdo(msg) {
        if (msg.scene == current_scene.name) {
            for (let i = 0; i < 4; i++) {
                rings.addRing(msg.x, msg.y, 20);
                await new Promise(r => setTimeout(r, 300));
            }
        } else { console.log("Player on other map"); }
    };
    ping() {
        console.log("Ping " + theTime);
        let msg = three_xyinMouseToWorld(pinger.initialMousePosition.x, pinger.initialMousePosition.y);
        msg.scene = current_scene.name;
        socket.emit('pingDo', msg);
        if (this.cameraToo) {
            socket.emit('set_three_camera_xy', msg);
        }
        let dim = GetDimensions()
        let x = this.initialMousePosition.x -= dim.left;
        let y = this.initialMousePosition.y -= dim.top;
        let m = {
            x: x / window.innerWidth,
            y: y / window.innerHeight
        };

        waterTexture.addRing(m);
        this.pingdo(msg);
        clearTimeout(this.mouseDownTimer);
        this.mouseDownTimer = null;

    };
};

export function set_three_camera_xy(msg) {
    if (msg.scene == current_scene.name) {
        three_camera.position.x = msg.x;
        three_camera.position.y = msg.y;
    } else {


        window.LoadScene({ name: msg.scene, camera: msg });

    }

}

export var pinger = new Pinger();

three_canvas.ondblclick =
    (ev) => {
        ev.preventDefault();
        console.log('Double click');
        three_lastMouse = three_mousePositionToWorldPosition(ev);
        let pointer = normalizedDeviceCoordinates(ev.clientX, ev.clientY);

        three_rayCaster.setFromCamera(pointer, three_camera);

        let intersect = three_intersect(ev);
        if (intersect?.object) {
            let o = intersect.object?.tile?.reference;
            if (o) {
                showThing(o.id, o.page, editThingMode);
            }
        }
    }

three_canvas.oncontextmenu =
    function (event) {
        event.preventDefault();
        event.stopPropagation();
    }

function getBoundaryForScaling(x) {
    let b = x / 8;
    if (b < 8) b = 8;
    if (b > 64) b = 64;
    return b;

}
three_canvas.onmousedown =
    function (event) {
        event.preventDefault();
        selection = [];
        let pointer = normalizedDeviceCoordinates(event.clientX, event.clientY);


        mouseButtonsDown[event.button] = true;
        three_lastMouse = three_mousePositionToWorldPosition(event);
        three_lastRawMouse = { x: event.clientX, y: event.clientY };

        three_rayCaster.setFromCamera(pointer, three_camera);

        if (event.button == mainButton) {
            let intersect = three_intersect(event);


            if (intersect?.object) {
                let obj = intersect.object;
                if (editMode && obj.tile.guiLayer == 'tile') {
                    let tile = obj.tile;
                    // this works only for tiles. To do make it a function added to each
                    // kind of thing maybe better to do icon -> world
                    let maxx = 1 * tile.scale.x;
                    const minimX = getBoundaryForScaling(maxx);

                    let x = intersect.uv.x * maxx;
                    let maxy = 1 * tile.scale.y;
                    const minimY = getBoundaryForScaling(maxy);

                    let y = intersect.uv.y * maxy;
                    scalingX = scalingX = x < minimX || x > maxx - minimX;
                    scalingY = scalingY = y < minimY || y > maxy - minimY;
                    if (scalingX || scalingY) {
                        mouseMode = 'scaling';


                        obj.material.highLight();
                        three_outlinePass_tile.selectedObjects = [obj];
                        three_outlinePass_tile.visibleEdgeColor.set('#ff0000');

                    } else {
                        mouseMode = 'dragging';
                        obj.material.highLight();

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

                } else if (!editMode && obj.tile.guiLayer == 'token') {
                    mouseMode = 'dragging';
                    selection.push(obj);
                }
            }

            pinger.mouseDown(event);
        } else if (popupButton == event.button && event.shiftKey) {

            // Show context menu here 
            // One option is new point of interest
            // 1. create a new POI  socket.emit('newPOI');
            // add a new message to pick a subdirectory of the scene, maybe with routing  and a world coordinate
            //

            const popupMenu = document.getElementById("popupMenu");
            const ul = popupMenu.children[0]; // todo change to id
            ul.replaceChildren();
            let menuOptions = ["New Point of Interest"];
            for (let i = 0; i < menuOptions.length; i++) {
                let li = document.createElement("li");
                li.appendChild(document.createTextNode(menuOptions[i]));
                li.mouse_x = three_lastMouse.x;
                li.mouse_y = three_lastMouse.y;
                ul.appendChild(li);

                li.onmouseup = function () {

                    let msg = {
                        x: this.mouse_x,
                        y: this.mouse_y,
                        scene: current_scene.name,
                        scene_subdir_tag: './SceneFiles/' + current_scene.name + '/Documents/',
                        scene_subdir: './SceneFiles/' + current_scene.name + '/DocumentsFiles/'
                    };
                    socket.emit('newPOI', msg);
                };
            }

            popupMenu.style.display = "block";
            popupMenu.style.visibility = "visible";
            popupMenu.style.left = event.clientX + "px";
            popupMenu.style.top = event.clientY + "px";

            // have images remember the last folder you used. Maybe save this? 
        }
    }

export function
    three_deleteSelected() {
    // delete the image and tell the server to delete it
    for (let i = 0; i < selection.length; i++) {
        socket.emit(
            'deleteTile',
            { tile: selection[i].tile, scene: current_scene.name });
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
                three_setTileImage(tile, plane, tile.guiLayer == "tile");
            }
        }
    });
}

function
    uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(
            /[018]/g,
            c => (c ^
                crypto.getRandomValues(new Uint8Array(1))[0] &
                15 >> c / 4)
                .toString(16));
}

async function GetImageFor(thing) {
    // based on scene we may want to do something different
    let name = thing.id;

    console.log('Current scene', current_scene);
    console.log('Current scene t' + current_scene.settings.view);

    switch (current_scene.settings.view) {
        case 'topdown': case 'threeD': {
            let t = await ensureThingLoaded(name, '');
            if (t.prototypeToken?.texture?.src)

                return {
                    img: t.prototypeToken.texture.src,
                    scaleX: t.prototypeToken.texture.scaleX,
                    scaleY: t.prototypeToken.texture.scaleY
                };
            return { img: thing.img, scaleX: 1, scaleY: 1 };
        }
        case 'portraits':
        default:
            return { img: thing.img, scaleX: 1, scaleY: 1 };
    }
    // {"file":"CompendiumFiles/_plus_1_allpurpose_tool_tce","page":"items","source":"TCE","droppable":"item","type":"equipment","name":"+1
    // All-Purpose
    // Tool","img":"images/modules/plutonium/media/icon/crossed-swords.svg"}
}


window.onmouseup = function (event) {
    mouseButtonsDown[event.button] = false;

    if (!mouseButtonsDown[mainButton]) {
        three_outlinePass_tile.selectedObjects = [];

        for (let i = 0; i < selection.length; i++) {
            selection[i].material.unHighLight();

            if (!event.altKey) {
                if (selection[i].tile.guiLayer == 'token') {
                    ForceToGrid6(selection[i].tile)
                    socket.emit(
                        'updateTile',
                        { tile: selection[i].tile, scene: current_scene.name });
                }
            }
        }
    }

    // event.preventDefault();
    // let pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2
    // - 1,
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

dragDrop(three_canvas, {
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

// 1 on edges, 0 in middle, smooth function

function GridIfy(x) {
    let answer = Math.abs(x);
    answer = answer - (answer % kGridSize) + kGridSize / 2;
    if (x < 0) answer = -answer;
    return answer;
}
function toGrid(point) {
    if (grid.visible) {
        // need to put exceptio for holding alt
        return {
            x: GridIfy(point.x), y: GridIfy(point.y),
        }
    }
    if (hexgrid.visible) {
        let hexCoord = convert_pixel_to_flat_hex(point);
        console.log("point " + point.x + " " + point.y + " ---> " + hexCoord.q + " " + hexCoord.r);
        let answer = convert_flat_hex_to_pixel(hexCoord);
        console.log(hexCoord.q + " " + hexCoord.r + "====> " + answer.x + " " + answer.y);
        return answer;
    }
}

function ForceToGrid6(point) {
    if (grid.visible) {
        point.x = GridIfy(point.x);
        point.y = GridIfy(point.y);
    } else if (hexgrid.visible) {
        let hexCoord = convert_pixel_to_flat_hex(point);
        console.log("point " + point.x + " " + point.y + " ---> " + hexCoord.q + " " + hexCoord.r);
        let a = convert_flat_hex_to_pixel(hexCoord);
        console.log(hexCoord.q + " " + hexCoord.r + "====> " + a.x + " " + a.y);
        point.x = a.x;
        point.y = a.y;
    }
}

async function CreateToken(thingDragged, event) {
    let mouse = toGrid(three_mousePositionToWorldPosition(event));
    // todo handle non-instanced
    let newTile = {
        'x': mouse.x,
        'y': mouse.y,
        'z': 0,
        guiLayer: 'token',
        sheet: thingDragged
    };

    let img = await GetImageFor(thingDragged);
    newTile.texture = img.img;
    newTile.scale = {
        x: img.scaleX * kGridSize,  // todo should be tile size
        y: img.scaleY * kGridSize,
        z: 1
    };
    console.log(thingDragged);
    newTile.reference = thingDragged;

    console.log('Create Token New Tile ', newTile);
    socket.emit('add_token', { scene: current_scene.name, tile: newTile });
}


function topTileZ() {
    let maxZ = -100000;
    for (let i = 0; i < layers.tile.selectables.length; i++) {
        let sprite = layers.tile.selectables[i];

        if (sprite.position.z > maxZ) maxZ = sprite.position.z;
    }
    return maxZ;
}

three_canvas.acceptDrag =
    function (thingDragged, event) {
        if (thingDragged == undefined) {
            console.log("ERR");
            return;
        }
        switch (thingDragged.type) {
            case 'dir':
                break;
            case 'tile':
                let mouse = toGrid(three_mousePositionToWorldPosition(event));
                // todo handle non-instanced
                const img = new Image();
                img.src = thingDragged.img;
                img.onload = function () {
                    console.log(`Width: ${img.width}, Height: ${img.height}`);
                    let newTile = {
                        'x': mouse.x,
                        'y': mouse.y,
                        'z': undefined,
                        guiLayer: 'tile',
                        sheet: thingDragged
                    };
                    newTile.texture = thingDragged.img.substring('/images'.length + 1);
                    newTile.scale = {
                        x: img.width,  // todo should be tile size
                        y: img.height,
                        z: 1
                    };
                    console.log('Create tile New Tile ', newTile);

                    // boo evil dependency code fix
                    three_setEditMode(true);


                    const editMap = document.getElementById('EditMap');
                    editMap.checked = true;
                    socket.emit('add_tile', { scene: current_scene.name, tile: newTile });
                };
                break;
            default:
                CreateToken(thingDragged, event);
        }
    }

function ChangeGrid(value) {
    if (value === '') return;
    let id = 'Scenes/tag_' + current_scene.name +
        '.json';  // the window id is window_fullthingname
    console.log(id);
    let evaluation = 'thing.typeOfGrid = \'' + value + '\'';
    console.log(evaluation);

    socket.emit('change', { change: evaluation, thing: id });

    hexgrid.visible = true;
    grid.visible = true;
    console.log(value);
    if (value != 'hex') hexgrid.visible = false;
    if (value != 'square') grid.visible = false;
} MakeAvailableToHtml('ChangeGrid', ChangeGrid);


function ChangeView(value) {
    if (value === '') return;
    let id = 'Scenes/tag_' + current_scene.name +
        '.json';  // the window id is window_fullthingname
    console.log(id);
    let evaluation = 'thing.view = \'' + value + '\'';
    console.log(evaluation);

    socket.emit('change', { change: evaluation, thing: id });

    // need to send this to everyone
    var cameraPos = three_camera.position.clone();


    window.LoadScene({ name: current_scene.name, camera: cameraPos });


} MakeAvailableToHtml('ChangeView', ChangeView);