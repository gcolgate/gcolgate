


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

function generateNewTileId(scene, tile) {
    // for now this is somewhat human readable, but it could be pure guid
    // it will have the name of the first texture used
    tile.tile_id = tile.texture + "_" + scene.next_tile_id; scene.next_tile_id++;
}

function getTileFileName(scene, tile) {
    return path.join(__dirname, 'public', 'SceneFiles', scene.directory, "tag_" + tile.tile_id + "_" + ".json");
}

function addTile(scene, tile) {


    if (isNaN(tile.z) || tile.z === null || tile.z === undefined) {
        tile.z = scene.nextZ;
        scene.nextZ += 0.00001;
    }
    generateNewTileId(scene, tile);
    tile.scale = { x: 1, y: 1, z: 1 };
    scene.tiles[tile.tile_id] = tile;
    let name = getTileFileName(scene, tile);

    jsonHandling.writeJsonFile(name, tile);

    return tile;
}

function updateSceneTile(scene, tile) {
    console.log("Scene", scene);
    console.log("Tile", tile);
    if (!scene.tiles[tile.tile_id]) {
        console.log("Cannot find tile for ", tile);
        addTile(tile);
    }
    else {
        scene.tiles[tile.tile_id] = tile;
        let name = getTileFileName(scene, tile);
        jsonHandling.writeJsonFile(name, tile);
    }

}


module.exports = { loadScene, addTile, waitForLoaded, updateSceneTile, sceneSetSocket };
