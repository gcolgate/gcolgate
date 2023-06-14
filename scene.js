


// eventually add a folder etc. For now have just one scene
const fs = require('fs').promises;
const rawfs = require('fs');
//const fsExtra = require('fs-extra');
const path = require('path');
const jsonHandling = require('./json_handling.js');

// a promise that resolves when the boolean function is true
function until(booleanFunction, pollTimeMs = 400) {
    const poll = resolve => {
        let ans = booleanFunction();
        if (ans == true) {
            return resolve();
        }
        else {
            setTimeout(_ => poll(resolve), pollTimeMs);
        }
    };
    return new Promise(poll);
}

// Next thing to do, add directory window for scene, and sheet for scene, start with a single default item
// sheet should have swap to button
var socket;
var scenes = {}

function getSceneFilePath(scene) {
    let a = path.join(__dirname, 'public', 'scenes', "tag_" + scene.directory + '.json');
    console.log(a);
    return a;
}

function sceneSetSocket(s) {
    socket = s;

}

// due to wierd javascript this handling, made static
function isLoaded(scene) {
    let ans = scene.loaded === "Yes";
    return ans;
}

async function waitForLoaded(scene) {
    if (scene.loaded === "NotStarted") {
        // this case might not work
        await loadScene(scene);

    }
    await until(() => {
        return isLoaded(scene);
    })

}

async function loadScene(scene) {

    if (scene.loaded == "Yes") return; // already loaded.

    scene.loaded == "InProgress";
    //  try {
    let filepath = getSceneFilePath(scene);

    let result = (await fs.readFile(filepath)).toString();

    info = jsonHandling.ParseJson(filepath, result); // for eval to work we need a thing


    let dir = await fs.readdir(path.join(__dirname, 'public', 'SceneFiles', scene.directory)); // TODO: use file cache



    for (let i = 0; i < dir.length; i++) {

        let result = (await fs.readFile(path.join(__dirname, 'public', 'SceneFiles',
            scene.directory, dir[i]))).toString();
        let tile = jsonHandling.ParseJson(dir[i], result); // for eval to work we need a thing
        scene.tiles[tile.tile_id] = tile;
    }
    scene.loaded = "Yes";

}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function cleanFileName(destString) {
    // just path a name, not a path
    destString = destString.replaceAll(" ", "_");
    destString = destString.replaceAll("%20%", "_");
    destString = destString.replaceAll("%2b%", "_plus_");
    destString = destString.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return destString;
}

function generateNewTileId(scene, tile) {
    // for now this is somewhat human readable, but it could be pure guid
    // it will have the name of the first texture used
    tile.tile_id = cleanFileName(tile.texture + "_" + uuidv4());
}

function getTileFileName(scene, tile) {
    return path.join(__dirname, 'public', 'SceneFiles', scene.directory, "tag_" + tile.tile_id + "_" + ".json");
}

function addTile(scene, tile) {


    if (tile.z === undefined || tile.z === null || isNaN(tile.z)) {
        console.log("Scene " + scene);
        tile.z = scene.nextZ;
        scene.nextZ += 0.00001;
    }
    if (!tile.tile_id) generateNewTileId(scene, tile);
    if (!tile.scale) tile.scale = { x: 1, y: 1, z: 1 };
    if (!tile.guiLayer) tile.guiLayer = "tile";
    scene.tiles[tile.tile_id] = tile;
    let name = getTileFileName(scene, tile);

    jsonHandling.writeJsonFile(name, tile);

    return tile;
}

function updateSceneTile(scene, tile) {

    if (!scene.tiles[tile.tile_id]) {
        addTile(scene, tile);
    }
    else {
        scene.tiles[tile.tile_id] = tile;
        let name = getTileFileName(scene, tile);
        jsonHandling.writeJsonFile(name, tile);
    }

}

function removeSceneTile(scene, tile) {

    if (!scene.tiles[tile.tile_id]) {
        console.log("Trying to delete empty tile");
    }
    else {
        let name = getTileFileName(scene, tile);
        console.log("Deleting " + name);
        fs.unlink(name);
        delete scene.tiles[tile.tile_id];

    }

}


module.exports = { loadScene, addTile, waitForLoaded, updateSceneTile, removeSceneTile, sceneSetSocket };
