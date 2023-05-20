
import * as THREE from 'three';
const three_scene = new THREE.Scene();
let width = window.innerWidth - 32;
let height = window.innerHeight - 32;
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const three_camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -10, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, true);
document.body.appendChild(renderer.domElement);

renderer.domElement.acceptsDropFile = true;

three_camera.position.z = 5;

/////////
let player = { name: "" }

let players = {};

var folders = {
    Compendium: {},
    Party: {},
    Favorites: {},
    Uniques: {},
};
////////

// add windows which are lists for the different buttons, hooking up logic
// each kind of window will make a request of the server, and have an endpoint
// sheets will be descriptions of display of json
// Compendium will be jsons
// items will be json
// add button for graphic sheets
// scenes will be json, but deal with graphic sheets
// data are things like sheet.data.strength
// which could be a number, a string, an object, or a reference @url to another sheet which goes here as an object
// the reference can be instance or true reference depeding
// when items change, send message to server.

// sheet will be html with items like
//<b> ~name(sheet.data.strength) </b>  ~val(sheet.data.strength) where ~ is escape for evaluating the script.
// a sheet can be ~all(sheets.data) <b> ~name(sheet.data.) </b>  ~val(sheet.data.)

// a graphic sheet will have
// width:n , height:n image:url fx:effect x:x y:y z:z z:order mode:
// mode is top-down, uses zorder. draws image
// mode is theatre, same drawing
// mode is ortho45, uses 3d position and zorder
// mode is threed, uses 3d position, zorder indicates flat, sprite, or model
// dragging sends a message to tell route drag to and speed
// utility functions.. move to utility file


// mouse positions are also updated and sent each frame
// handle mouse movement reporting to other clients
addEventListener("mousemove", (event) => {
    socket.emit('mousemove', {
        who: players.name,
        x: event.clientX + currentScene.scrollX,
        y: event.clientY + currentScene.scrollY
    });

});

let miceFor = {}

const mouse_geometry = new THREE.BoxGeometry(10, 10, 10);
const mouse_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
function findMiceFor(who) {
    if (miceFor.who === undefined) {
        // todo: use different matierals for each player
        // todo: show player name on mouse
        const cube = new THREE.Mesh(mouse_geometry, mouse_material);
        miceFor.who = cube;
        three_scene.add(cube);
        // TODO: kill cube on disconnect
    }
    return miceFor.who;
}


socket.on('mousemove', function (msg) {
    let cube = findMiceFor(msg.who);
    cube.position.x = msg.x - window.innerWidth / 2 - currentScene.scrollX;
    cube.position.y = -(msg.y - window.innerHeight / 2 - currentScene.scrollY);

});

socket.on('chat', function (msg) {
    console.log(" got result %o", msg);
    addChat(msg);
});

socket.on('change', function (msg) {
    UpdateNPC(msg);
});

socket.on('updateDir', function (msg) {

    updateDirectoryWindow(folders, msg);

});
//
// error handling, for now simple stupid alerts, todo: better UI
socket.on('error_alert', function (msg) {
    alert('error_alert ' + msg);

});

socket.on('login_failure', function (msg) {
    Login.innerText = "";
    createOrGetLoginWindow(0.9, 0.9, 0.05, 0.05, players);
    alert('error_alert ' + msg);
});

socket.on('login_success', function (msg) {
    player.name = msg;
    setLogin(msg);
    Login.innerText = msg;
    GetDirectory('Compendium').then((c) => { folders.Compendium = c; });
    GetDirectory('Party').then((c) => { folders.Party = c; });
    GetDirectory('Favorites').then((c) => { folders.Favorites = c; });
    GetDirectory('Uniques').then((c) => { folders.Uniques = c; });


    setUpDirButton('Compendium')
    setUpDirButton('Party')
    setUpDirButton('Favorites')
    setUpDirButton('Uniques')
});

////// folder windows  put in sub file?
function createDirWindow(buttonName) {
    if (!player.name) {
        alert("Please log in");
    }
    if (!folders[buttonName]) {
        alert("Have not yet receieved " + buttonName + "from server");
    } else {
        let w = createOrGetDirWindow(buttonName, .2, .6, .2, .2);
        bringToFront(w);
        showDirectoryWindow(buttonName, folders[buttonName]);
    }
}

function setUpDirButton(buttonName) {
    const compendiumButton = document.getElementById(buttonName);
    compendiumButton.onclick = function () {
        createDirWindow(buttonName)
    }
}

////// login handling
const Login = document.getElementById("Login");
async function init() {

    players.players = await fetchJson("./players/players.json");
    createOrGetLoginWindow(0.9, 0.9, 0.05, 0.05, players);

}

Login.onClick = function (event) {
    // todo: nicer login than a orompt box, one that remembers your credentials
    createOrGetLoginWindow(0.9, 0.9, 0.05, 0.05, players);
};




const chatButton = document.getElementById("Chat");
chatButton.onclick = function () {
    if (!player.name) {
        alert("Please log in");
    }
    showChatWindow([]);


};

// main code falls through to here

init();


showChatWindow([]);

class Scene {

    constructor(options) {
        this.topDown = options.topDown;
        this.gridScaleInPixels = options.gridScaleInPixels;
        this.gridScaleInUnits = options.gridScaleInPixels;
        this.typeOfGrid = options.gridScaleInUnits;
        this.centerX = options.centerX;
        this.centerY = options.centerY;
        this.scrollX = options.cameraStartX;
        this.scrollY = options.cameraStartY;
        this.tiles = options.tiles;
        this.things = options.things;

        three_camera.position.x = this.scrollX;
        three_camera.position.y = this.scrollY;
    }

};
let currentScene = new Scene({
    topDown: true,
    gridScaleInPixels: 100,
    gridScaleInUnits: "5ft",
    typeOfGrid: "square",
    centerX: 0,
    centerY: 0,
    cameraStartX: 0,
    cameraStartY: 0,
    tiles: [],
    things: [],

});

function noDragging(e) {
    console.log(e.target.id);
    if (!e.target.acceptsDropFile) {

        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'none'
            e.dataTransfer.dropEffect = 'none'
        }
    } else {
        e.stopPropagation();
        e.preventDefault();
    }

}

function noDropping(e) {
    // TODO:unhighliht

    console.log("Drop %o", e.target);
    if (!e.target.acceptsDropFile) {

        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'none'
            e.dataTransfer.dropEffect = 'none'
        }
        console.log("Not canvas")
        return;
    }
    console.log("CANVAS");


    e.stopPropagation();
    e.preventDefault();
    let fd = new FormData();
    let files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
            continue;
        }
        //   const img = document.getElementById("avatar");
        fd.append(files[i].name, files[i], files[i].name);
    }
    let x = new XMLHttpRequest();
    x.onreadystatechange = function () {
        console.log("%o", x);
        if (x.readyState == 4) {
            //  progress.innerText = progress.style.width = "";
            // form.filesfld.value = "";
            //   dragLeave(label); // this will reset the text and styling of the drop zone
            // if (x.status == 200) {
            //     var images = JSON.parse(x.responseText);
            //     for (var i = 0; i < images.length; i++) {
            //         var img = document.createElement("img");
            //         img.src = images[i];
            //         document.body.appendChild(img);
            //     }
            console.log("%o", x);
        }
        else {
            // failed - TODO: Add code to handle server errors
            alert("Failed to upload");
        }
    }
    x.open("post", "/upload", true);
    x.send(fd);

    e.dataTransfer.effectAllowed = 'none'
    e.dataTransfer.dropEffect = 'none'
    return false;

}

window.ondragenter = function (e) { noDragging(e); };
window.ondragover = function (e) { noDragging(e); };
window.ondragEnter = function (e) { };
window.ondragLeave = function (e) { };
window.ondrop = function (e) { console.log("onDrop"); noDropping(e); };

renderer.domElement.ondrop = function (e) { console.log("onDrop2"); noDropping(e); };



function animate() {
    requestAnimationFrame(animate);

    for (const [key, cube] of Object.entries(miceFor)) {

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    renderer.render(three_scene, three_camera);
}
animate();


