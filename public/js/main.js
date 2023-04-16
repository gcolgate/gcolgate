
import * as THREE from 'three';
const scene = new THREE.Scene();
let width = window.innerWidth;
let height = window.innerHeight;
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, -10, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// async function test() {
//     let response = await fetch("./testy");
//     const jsonData = await response.json();
//     console.log(jsonData);
// }

// add windows which are lists for the different buttons, hooking up logic
// each kind of window will make a request of the server, and have an endpoint
// sheets will be descriptions of display of json
// characters will be json
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

async function fetchJson(file) {

    let raw = await fetch(file, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });
    return await raw.json();

}


// mouse positions are also updated and sent each frame
// handle mouse movement reporting to other clients
addEventListener("mousemove", (event) => {
    socket.emit('mousemove', { x: event.clientX, y: event.clientY });

});
socket.on('mousemove', function (msg) {
    console.log(" got result %o", msg);
    cube.position.x = msg.x - window.innerWidth / 2;
    cube.position.y = -(msg.y - window.innerHeight / 2);

});
//
// error handling, for now simple stupid alerts, todo: better UI
socket.on('error_alert', function (msg) {
    alert('error_alert ' + msg);

});

socket.on('login_failure', function (msg) {
    alert('error_alert ' + msg);
    login.value = "Login";

});
////// login handling

let joined = false;
let players = {}
const login = document.getElementById("login");
async function init() {

    players.players = await fetchJson("./players/players.json");
    login.options.length = 0;

    let newOption = new Option("Login", "Login");
    login.add(newOption, undefined);

    for (let i = 0; i < players.players.length; i++) {
        let newOption = new Option(players.players[i].name, players.players[i].name);
        login.add(newOption, undefined);
    }
}
login.onchange = function (event) {
    // todo: nicer login than a orompt box, one that remembers your credentials
    let login = event.target.value;

    if (login == "login") { joined = null; return; }

    //try {
    let password = prompt("Please enter your password", "");
    if (!password) return;


    console.log('[socket]', 'join login :', login);
    socket.emit('join', { player: login, password: password });
    joined = login;
};

login.onchange = function (event) {
    // todo: nicer login than a orompt box, one that remembers your credentials
    let login = event.target.value;

    if (login == "login") { joined = null; return; }

    //try {
    let password = prompt("Please enter your password", "");
    if (!password) return;


    console.log('[socket]', 'join login :', login);
    socket.emit('join', { player: login, password: password });
    joined = login;
};
// character hgndling
let characters = {}
const characterButton = document.getElementById("characters");
characterButton.onclick = function () {
    if (!joined) {
        alert("Please log in");
    }
};

// main code falls through to here

init();
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
