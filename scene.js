


// eventually add a folder etc. For now have just one scene
const fs = require('fs').promises;
const rawfs = require('fs');
//const fsExtra = require('fs-extra');
const path = require('path');
const jsonHandling = require('./json_handling.js');

// a promise that resolves when the boolean function is true
function until(booleanFunction, pollTimeMs = 400) {
    const poll = resolve => {
        console.log("Polling", booleanFunction);
        let ans = booleanFunction();
        console.log(ans);
        if (ans == true) {
            console.log("Resolved");
            return resolve();
        }
        else {
            setTimeout(_ => poll(resolve), pollTimeMs);
        }
    };
    return new Promise(poll);
}



var socket;
class Scene {
    constructor(dir) {
        this.info = {
            topDown: true,
            directory: dir,
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
            next_tile_id: 0,
            loaded: "NotStarted",
        };

        this.loadScene();
    }

    static setSocket(s) {
        socket = s;

    }

    // due to wierd javascript this handling, made static
    isLoaded() {
        let ans = this.info.loaded === "Yes";
        console.log("IsLoaded", this.info.loaded, ans);
        return ans;
    }

    async waitForLoaded() {
        if (this.info.loaded === "NotStarted") {
            await this.loadScene();
        }
        let scene = this;
        await until(() => {
            return scene.isLoaded();
        })
    }

    async loadScene() {
        this.info.loaded === "InProgress";
        try {
            let dir = await fs.readdir(path.join(__dirname, 'public', this.info.directory));
            console.log("Read dir", dir);
            let tiles = await jsonHandling.fillDirectoryTable(this.info.directory, dir);
            console.log("Loaded " + tiles.length + "itms from " + dir);
            for (let i = 0; i < tiles.length; i++) {
                console.log(i, tiles[i]);
                this.info.tiles[tiles[i].tile_id] = tiles[i];
            }
            console.log("Loaded 2" + tiles.length + "itms from " + dir);
            this.info.loaded = "Yes";
        } catch (error) {
            this.info.loaded = "NotStarted";
            console.log(error + "  loading : " + this.info.directory);
        }
    }

    generateNewTileId(tile) {
        // for now this is somewhat human readable, but it could be pure guid
        // it will have the name of the first texture used
        tile.tile_id = tile.texture + "_" + this.info.next_tile_id; this.info.next_tile_id++;
    }

    getTileFileName(tile) {
        return "tag_" + tile.tile_id + "_" + ".json";
    }

    addTile(tile) {
        console.log("Tile Z " + tile.z);
        if (isNaN(tile.z) || tile.z === null || tile.z === undefined) {
            tile.z = this.info.nextZ;
            this.info.nextZ += 0.00001;
        }
        this.generateNewTileId(tile);
        tile.scale = { x: 1, y: 1, z: 1 };
        this.info.tiles[tile.tile_id] = tile;
        let name = this.getTileFileName(tile);

        jsonHandling.writeJsonFileInPublic('/currentscene/', name, tile);
        return tile;
    }

    updateTile(tile) {
        if (!this.info.tiles[tile.tile_id]) {
            console.log("Cannot find tile for ", tile);
            this.addTile(tile);
        }
        else {
            this.info.tiles[tile.tile_id] = tile;
            let name = this.getTileFileName(tile);
            jsonHandling.writeJsonFileInPublic('/currentscene/', name, tile);
        }

    }
};


module.exports = Scene;
