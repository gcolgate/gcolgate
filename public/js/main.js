
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

async function GetDirectory(directory) {
    let response = await fetch("./" + directory);
    const jsonData = await response.json();
    console.log(jsonData);


    for (let i = 0; i < jsonData.length; i++) {
        try {
            jsonData[i] = JSON.parse(jsonData[i]);
        } catch (err) {

            console.log("Error in parsing " + i + " " + jsonData[i]);
        }
    }
    return jsonData;
}


function clickOnThing(event) {

    const name = this.references.file;

    showThing(name, "", this.references.page);
}

function searchChanged() {
    console.log(this.value);
    refreshDirectoryWindow(this.windowId, this.array);
}
function normalMouseDown(e) {
    e.stopPropagation();
    // e.preventDefault();
}
function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function search(whole, search) {
    if (search === "") {
        return whole;
    } else {
        let searched = [];
        let s = escapeRegExp(search.toLowerCase()); // i couldn't figure out the incantations to make this ignore case
        for (let i = 0; i < whole.length; i++) {
            if (whole[i].name.toLowerCase().search(s) >= 0) {
                searched.push(whole[i]);
            }
        }
        return searched;
    }
}

function filter(whole, buttons) {
    if (buttons.length === 0) { // none selected same as all selected
        return whole;
    } else {
        let filtered = [];
        for (let i = 0; i < whole.length; i++) {
            if (buttons.some(element => element === whole[i].page))
                filtered.push(whole[i]);
        }
        return filtered;
    }
}

function collectSearchandFilter(id) {
    let title = document.getElementById("window_" + id + "_title");

    let filter = [];

    for (let i = 0; i < title.filterButtons.length; i++) {

        if (title.filterButtons[i].checked) {
            filter.push(title.filterTitles[i]);
        }
    }

    let search = document.getElementById("window_" + id + "_search").value;

    return {
        filter: filter,
        search: search
    };

}


function refreshDirectoryWindow(id, whole) {

    let params = collectSearchandFilter(id);
    let window = document.getElementById("window_" + id);

    let searched = search(whole, params.search);


    let array = filter(searched, params.filter);

    let title = document.getElementById("window_" + id + "_title");


    let ul = document.getElementById("window_" + id + "_list");

    ul.style.height = (window.clientHeight - ul.offsetTop) + "px";
    ul.style.overflow = "auto";
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for (let i = 0; i < array.length; i++) {
        let li = document.createElement("li");
        let text = document.createTextNode(array[i].name);
        // need better images 
        // if (array[i].img) {
        //     let img = document.createElement('img');
        //     img.src = array[i].img;
        //     img.width = "32"
        //     img.height = "32"
        //     li.appendChild(img);

        // }

        li.appendChild(text);
        li.references = array[i];
        li.addEventListener('dblclick', clickOnThing, false);
        ul.appendChild(li);
    }
}


function showDirectoryWindow(id, array) {


    let window = document.getElementById("window_" + id);

    let title = document.getElementById("window_" + id + "_title");

    let ul = document.getElementById("window_" + id + "_list");
    //   ul.style.height = "100%"

    let search = document.createElement("input");
    search.id = "window_" + id + "_search";
    title.appendChild(search);
    search.oninput = searchChanged;
    search.onmousedown = normalMouseDown;
    search.windowId = id;
    search.array = array;

    let allTypes = new Set();

    for (let i = 0; i < array.length; i++) {
        allTypes.add(array[i].page);
    }

    // title.whiteSpace = "normal";
    title.style.height = "90px";
    title.style.display = "block";

    title.filterButtons = [];
    title.filterTitles = [];
    for (const item of allTypes.keys()) {

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'chk' + item;
        checkbox.name = item;
        //  checkbox.checked = true;
        checkbox.windowId = id;
        checkbox.array = array;


        checkbox.onchange = function () {
            refreshDirectoryWindow(this.windowId, this.array);
        }

        title.filterButtons.push(checkbox);
        title.filterTitles.push(item);

        let label = document.createElement('label')
        label.htmlFor = 'chk' + item;
        label.appendChild(document.createTextNode(item + "      ")); // todo: use style, margin isnt working

        title.appendChild(checkbox);
        title.appendChild(label);


    }



    refreshDirectoryWindow(id, array);


    fadeIn(window);

}


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
//
// error handling, for now simple stupid alerts, todo: better UI
socket.on('error_alert', function (msg) {
    alert('error_alert ' + msg);

});

socket.on('login_failure', function (msg) {
    alert('error_alert ' + msg);
    login.value = "Login";

});

////// folder windows  put in sub file?
function createDirWindow(buttonName) {
    if (!joined) {
        alert("Please log in");
    }
    if (!Compendium) {
        alert("Have not yet receieved " + buttonName + "from server");
    } else {
        let w = createOrGetDirWindow(buttonName, .2, .6, .2, .2);
        bringToFront(w);
        showDirectoryWindow(buttonName, eval(buttonName));
    }
}

function setUpDirButton(buttonName) {
    const compendiumButton = document.getElementById(buttonName);
    compendiumButton.onclick = function () {
        createDirWindow(buttonName)
    }
}
let joined = false;
let players = {};
let Compendium = {};
let Party = {};
let Favorites = {};
let Uniques = {};

GetDirectory('Compendium').then((c) => { Compendium = c; });
GetDirectory('Party').then((c) => { Party = c; });
GetDirectory('Favorites').then((c) => { Favorites = c; });
GetDirectory('Uniques').then((c) => { Uniques = c; });


setUpDirButton('Compendium')
setUpDirButton('Party')
setUpDirButton('Favorites')
setUpDirButton('Uniques')
////// login handling
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



const chatButton = document.getElementById("Chat");
chatButton.onclick = function () {
    if (!joined) {
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


