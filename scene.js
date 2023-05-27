


// eventually add a folder etc. For now have just one scene
const fs = require('fs').promises;
const rawfs = require('fs');
//const fsExtra = require('fs-extra');
const path = require('path');

const sanitize = require('sanitize-filename');

function writeJsonFileInPublic(dir, fileName, json) {
    let fname = sanitize(fileName);

    try {
        let pathName = path.join(__dirname, 'public', dir, fname + '.json');

        rawfs.writeFileSync(pathName, JSON.stringify(json));

    } catch (err) {
        console.log(err + " Error with " + dir + " " + fname);
    }
}

class Scene {
    constructor() {
        this.info = {
            topDown: true,
            gridScaleInPixels: 100,
            gridScaleInUnits: "5ft",
            typeOfGrid: "square",
            centerX: 0,
            centerY: 0,
            cameraStartX: 0,
            cameraStartY: 0,
            tiles: {},
            things: {},
            nextZ: 0,
            tile_id: 0
        };
    }

    addTile(tile) {
        console.log("Tile Z " + tile.z);
        tile.tile_id = this.info.tile_id; this.info.tile_id++;
        if (isNaN(tile.z) || tile.z === null || tile.z === undefined) {
            tile.z = this.info.nextZ;
            this.info.nextZ += 0.00001;
        }
        tile.scale = { x: 1, y: 1, z: 1 };
        console.log("now Tile Z " + tile.z);
        this.info.tiles[tile.tile_id] = tile;

        let name = tile.texture + "_" + tile.tile_id + "_" + ".json";

        writeJsonFileInPublic('/currentscene/', name, tile);
        return tile;
    }

    updateTile(tile) {

        if (!this.info.tiles[tile.tile_id]) {
            addTile(tile);
        }
        else {
            this.info.tiles[tile.tile_id] = tile;
            let name = tile.texture + "_" + tile.tile_id + "_" + ".json";
            writeJsonFileInPublic('/currentscene/', name, tile);
        }

    }
};


module.exports = Scene;
