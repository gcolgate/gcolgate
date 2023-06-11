


import { current_scene, three_camera, three_mouseMove, three_mousePositionToWorldPosition, three_setEditMode, three_renderer, three_animate, three_addTile, three_updateTile, three_findMouseShapes, setSocket, three_replaceScene } from "./three_support.js";

///////// 
let players = { hero: "" };

var folders = {
    Compendium: {},
    Party: {},
    Favorites: {},
    Uniques: {},
    Scenes: {},
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
    if (players.hero != undefined) {
        let worldPos = three_mousePositionToWorldPosition(event);
        // this is for top down and ortho fixed maps only, todo when supporting others
        socket.emit('mousemove', {
            who: players.hero,
            x: worldPos.x,
            y: worldPos.y
        });
        three_mouseMove(event);
    }

});


socket.on('mousemove', function (msg) {
    let cube = three_findMouseShapes(msg.who);
    cube.position.x = msg.x;
    cube.position.y = msg.y;;

});


socket.on('newTile', function (msg) {
    if (msg.scene.name == current_scene.name) {
        three_addTile(msg.tile);
    }
});


window.LoadScene = function (name) {
    socket.emit("loadScene", name);
}

socket.on('displayScene', function (msg) {
    three_replaceScene(msg.name, msg.sceneType, msg.array);
});

socket.on('updatedTile', function (msg) {
    if (msg.scene === current_scene.name)
        three_updateTile(msg.tile);
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
    players.hero = msg;
    setLogin(msg);
    Login.innerText = msg;
    GetDirectory('Compendium').then((c) => { folders.Compendium = c; });
    GetDirectory('Party').then((c) => { folders.Party = c; });
    GetDirectory('Favorites').then((c) => { folders.Favorites = c; });
    GetDirectory('Uniques').then((c) => { folders.Uniques = c; });
    GetDirectory('Scenes').then((c) => { folders.Scenes = c; });

    // GetDirectory('CurrentOpenScene').then((c) => { three_replaceScene(c); });
    setUpDirButton('Compendium')
    setUpDirButton('Party')
    setUpDirButton('Favorites')
    setUpDirButton('Uniques')
    setUpDirButton('Scenes')
});

////// folder windows  put in sub file?
function createDirWindow(buttonName) {
    if (!players.hero) {
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
    if (!players.hero) {
        alert("Please log in");
    } else {
        showChatWindow([]);
    }


};


const editMap = document.getElementById("EditMap");
editMap.onclick = function () {
    if (!players.hero) {
        alert("Please log in");
    } else {
        three_setEditMode(editMap.checked);
    };
}
// main code falls through to here

init();


showChatWindow([]);

class Scene {

    constructor(options) {
        this.topDown = options.topDown;
        this.gridScaleInPixels = options.gridScaleInPixels;
        this.gridScaleInUnits = options.gridScaleInPixels;
        this.typeOfGrid = options.gridScaleInUnits;
        this.tiles = options.tiles;
        this.things = options.things;

        three_camera.position.x = options.cameraStartX;
        three_camera.position.y = options.cameraStartY;

    }
};
// let currentScene = new Scene({
//     topDown: true,
//     gridScaleInPixels: 100,
//     gridScaleInUnits: "5ft",
//     typeOfGrid: "square",
//     cameraStartX: 0,
//     cameraStartY: 0,
//     tiles: [],
//     things: [],
// });

function noDragging(e) {
    if (thingDragged) return;
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

// input is drag and drop file
async function dropOneFile(file, additional) {
    try {
        let url = new URL(window.location.href).origin + '/upload';
        let formData = new FormData()
        formData.append('file', file);
        for (const [key, value] of Object.entries(additional)) {
            formData.append(key, value);
        }

        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        console.log("Success:", result);
        return true;


    } catch (error) {
        console.error("Error:  file %o" + error, file);
        return false;
    }
}
// TODO: check if already on server, if
// control held, ask user if he wants to replace
// existing if it is there already
// if control held, just make new tile but
// don't upload
function uploadDroppedImages(e) {

    let fd = new FormData();
    let files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
            continue;
        }
        let vec = three_mousePositionToWorldPosition(e);
        let additional = {
            x: vec.x,
            y: vec.y,
            z: null, // todo fix
            current_scene: current_scene.name
        }
        dropOneFile(file, additional);
    }
}

function noDropping(e) {
    // TODO:unhighliht
    if (thingDragged) return;

    if (!e.target.acceptsDropFile) {

        // e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'none'
            e.dataTransfer.dropEffect = 'none'
        }
        console.log("Not canvas")
        return;
    }

    e.stopPropagation();
    e.preventDefault();
    uploadDroppedImages(e);


    e.dataTransfer.effectAllowed = 'none'
    e.dataTransfer.dropEffect = 'none'
    return false;

}

window.ondragenter = function (e) { noDragging(e); };
window.ondragover = function (e) { noDragging(e); };
window.ondragEnter = function (e) { };
window.ondragLeave = function (e) { };
window.ondrop = function (e) { noDropping(e); };

three_renderer.domElement.ondrop = function (e) {
    if (thingDragged) {
        // will be handled by canvas
    } else {
        e.stopPropagation();
        e.preventDefault();
        uploadDroppedImages(e);
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
        return false;
    }
};

setSocket(socket);

three_animate();


