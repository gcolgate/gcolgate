


// eventually add a folder etc. For now have just one scene



class Scene {
    constructor() {
        this.currentScene = {
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
            nextZ: 0
        };
    }
    addTile(tile) {
        console.log("Tile Z " + tile.z);
        if (isNaN(tile.z) || tile.z === null || tile.z === undefined) {
            tile.z = this.currentScene.nextZ;
            this.currentScene.nextZ += 0.00001;
        }
        console.log("now Tile Z " + tile.z);
        this.currentScene.tiles.push(tile);
        return tile;
    }
};


module.exports = Scene;
