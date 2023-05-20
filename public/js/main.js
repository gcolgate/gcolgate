
import * as THREE from 'three';
const scene = new THREE.Scene();
let width = window.innerWidth - 32;
let height = window.innerHeight - 32;
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -10, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height, true);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

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
    socket.emit('mousemove', { x: event.clientX, y: event.clientY });

});
socket.on('mousemove', function (msg) {
    cube.position.x = msg.x - window.innerWidth / 2;
    cube.position.y = -(msg.y - window.innerHeight / 2);

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


function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();


