

//const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const http = require('http');
const sockets = require("socket.io");
require('./init.js');
const dice = require('./roller.js')
const sheeter = require('./sheeter.js')
const fileUpload = require('express-fileupload');
const Scene = require('./scene.js');
const jsonHandling = require('./json_handling.js');
const probeImage = require('probe-image-size');

const host = 'localhost';
const port = 8000;
//const port = 30000;

const app = express();
const http_io = http.Server(app);
const io = sockets(http_io);
app.use(express.static(path.join(__dirname, 'public'))); //Serves resources from public folder

var passwords, players;

var chats = []; // chats so far
app.use(fileUpload());

var init = { inited: false }

function waitInit() {
    const poll = resolve => {
        if (init.inited == true) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }
    return new Promise(poll);
}

async function justAnUpload(res, req) {

    let file = req.files.file;
    console.log(req.files);
    if (!file.mimetype.startsWith('image')) {
        console.log("Must be image not " + file.mimetype);
        return res.sendStatus(400);
    }
    try {

        console.log(path.normalize(__dirname + '/public/images/uploaded/' + file.name));
        await file.mv(path.normalize(__dirname + '/public/images/uploaded/' + file.name));
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function doTheUpload(res, req) {

    let file = req.files.file;
    console.log(req.files);

    // Log the files to the console
    // Upload expects a file, an x, a y, and a z
    // and it will create a new image
    // If does not have image mime type prevent from uploading
    if (!file.mimetype.startsWith('image')) {
        console.log("Must be image not " + file.mimetype);
        return res.sendStatus(400);
    }
    // Move the uploaded image to our upload folder
    try {

        let probed = probeImage.sync(req.files.file.data);


        let tile = { x: req.body.x, y: req.body.y, z: req.body.z, texture: file.name, scale: { x: probed.width, y: probed.height, z: 1 } };
        let scene_name = req.body.current_scene;
        let t = Date.now();

        await file.mv(path.normalize(__dirname + '/public/images/' + tile.texture));
        res.sendStatus(200);

        let scene = sheeter.folders.ScenesParsed[scene_name];
        let fixedTile = Scene.addTile(scene, tile);

        io.emit('newTile', { scene: scene, tile: fixedTile });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

app.post('/upload', (req, res) => {
    // Log the files to the console
    // Upload expects a file, an x, a y, and a z
    // and it will create a new image



    // If no image submitted, exit
    if (!req.files || !req.files.file) {
        console.log("Cant find image");
        return res.sendStatus(400);
    }
    doTheUpload(res, req);

});


async function toUploadToDir(res, req) {

    let file = req.files.file;
    console.log(req.files);

    // Log the files to the console
    // Upload expects a file, an x, a y, and a z
    // and it will create a new image
    // If does not have image mime type prevent from uploading
    if (!file.mimetype.startsWith('image')) {
        console.log("Must be image not " + file.mimetype);
        return res.sendStatus(400);
    }
    // Move the uploaded image to our upload folder
    try {

        let probed = probeImage.sync(req.files.file.data);
        let newDir = req.body.newDir;
        let t = Date.now();

        await file.mv(path.normalize(__dirname + '/public/images/' + newDir + file.name));
        res.sendStatus(200);

        await refreshDirThatHasBeenAddedTo(__dirname + '/public/images/' + newDir);

        io.emit('updateDir', { id: "images", folder: sheeter.folders["images"] });

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
app.post('/uploadToDir', (req, res) => {
    // Log the files to the console
    // Upload expects a file, an x, a y, and a z
    // and it will create a new image



    // If no image submitted, exit
    if (!req.files || !req.files.file) {
        console.log("Cant find image");
        return res.sendStatus(400);
    }
    toUploadToDir(res, req);

});




app.post('/uploadFromButton', (req, res) => {
    // Log the files to the console
    // Upload expects a file, an x, a y, and a z
    // and it will create a new image
    // If no image submitted, exit
    if (!req.files || !req.files.file) {
        console.log("Cant find image");
        return res.sendStatus(400);
    }
    justAnUpload(res, req);

});
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function InitialDiskLoad() {
    let promises = [];

    promises.push(fs.readFile(path.join(__dirname, 'passwords.json'))); // TODO: use file cache
    promises.push(fs.readFile(path.join(__dirname, 'public', 'players/players.json'))); // TODO: use file cache

    promises.push(fs.readdir(path.join(__dirname, 'public', 'Compendium'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Favorites'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Party'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Uniques'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Scenes'))); // TODO: use file cache

    let results = await Promise.all(promises);
    passwords = jsonHandling.ParseJson('passwords.json', results[0]);
    players = jsonHandling.ParseJson('players.json', results[1]);

    promises = [];

    promises.push(jsonHandling.fillDirectoryTable("Compendium", results[2]));
    promises.push(jsonHandling.fillDirectoryTable("Favorites", results[3]));
    promises.push(jsonHandling.fillDirectoryTable("Party", results[4]));
    promises.push(jsonHandling.fillDirectoryTable("Uniques", results[5]));
    promises.push(jsonHandling.fillDirectoryTable("Scenes", results[6]));


    results = await Promise.all(promises);

    sheeter.folders.Compendium = results[0];
    sheeter.folders.Favorites = results[1];
    sheeter.folders.Party = results[2];
    sheeter.folders.Uniques = results[3];
    sheeter.folders.Scenes = results[4];
    sheeter.folders.uploadedImages = results[7];


    for (i = 0; i < sheeter.folders.Scenes.length; i++) {
        let unparsed = sheeter.folders.Scenes[i];
        let scene = jsonHandling.ParseJson(i, unparsed);
        let nom = scene.name;
        sheeter.folders.ScenesParsed[nom] = scene;

    }


    //  await delay(5000);

    init.inited = true;
    console.log("Ready to go");

}

//try {
InitialDiskLoad();
// } catch (err) {
//     console.log("Unable to initialize" + err);
//     exit(-1);
//}
function getUser(socket) {

    let user = "";
    const entries = socket.rooms.values();
    for (const entry of entries) {
        if (entry.startsWith('user:')) {
            user = entry.substr(5);
            return user;
        }
    }
    return undefined
}
function ReBroadCast(socket, msgType, msg) {

    if (getUser(socket)) {
        let a = socket.broadcast.emit(msgType, msg);
        return true;
    }
    return false;
}


async function login(socket, credentials) {
    await waitInit();

    if (passwords[credentials.player] != credentials.password) {
        console.log("Error Invalid credentials " + credentials.player);
        socket.emit("login_failure", "Invalid credentials " + credentials.player);
        return;
    }

    socket.join('user:' + credentials.player); // We are using room of socket io for login
    socket.emit('login_success', credentials.player);
    Scene.sceneSetSocket(socket);

    sendScene({ name: "default_scene" }, socket); // TODO: it's supposed to be saved

    //console.log("Logins %o", io.sockets.adapter.rooms);
    //console.log("Room %o " + socket.rooms, socket.rooms);
}


async function CopyThingFIles(socket, msg) {



    let p = path.parse(path.normalize(msg.from.file));
    //   let indexFolderDir = p.dir.substring(0, p.dir.length - 5);


    // let srcName = p.name;
    // let srcDir = p.dir;
    let src = path.join(__dirname, "public", p.dir, p.name + '.json');
    let dest = path.join(__dirname, "public", msg.to + "Files", p.name + '.json');

    // let src2 = path.join(__dirname, "public", indexFolderDir, "tag_" + p.name + '.json');
    let dest2 = path.join(__dirname, "public", msg.to, "tag_" + p.name + '.json');

    // console.log(src + " to " + dest);
    // console.log(src2 + " to " + dest2);
    // warning overwrites msg.from.file, poor form
    msg.from.file = SanitizeSlashes(msg.to + "Files/" + p.name + '.json');

    await Promise.all([
        fs.writeFile(dest2, JSON.stringify(msg.from)),
        fs.copyFile(src, dest)
    ]);
    sheeter.folders[msg.to].push(msg.from);

    socket.emit('updateDir', { id: msg.to, folder: sheeter.folders[msg.to] });


}

let RandomNames = [
    "dhirhan",
    "ilenor",
    "iqor",
    "arasior",
    "vaqinn",
    "aless",
    "anodor",
    "oro",
    "arabras",
    "dhidarin",


    "urick",
    "uniwyn",
    "ivibahn",
    "aras",
    "owix",
    "inorim",
    "elafaris",
    "agekius",
    "izashan",
    "azasim",


    "aqille",
    "amorith",
    "aphyx",
    "oqiohne",
    "ephevia",
    "moqille",
    "ibaris",
    "iphior",
    "illuvira",
    "idirune",

    "Cenwiu",
    "Finy Benthey",
    "Gauwill",
    "Chenry",
    "Aldfric",
    "Walda",
    "Brida",
    "Wulfa",
    "Anthond Woodaye",
    "Eadworht",

    "Cece",
    "Suse",
    "Witha",
    "Anor",
    "Wena",
    "Bricta",
    "Beatrey",
    "Burga",
    "Wenflu",
    "Sane",
    "Stomes Sharcey",
    "Bando",
    "Herib Rowich",
    "Cotme Bairnell",
    "Hamond Balley",
    "Willas",
    "Ibras",
    "Hildo",
    "Helrey",
    "Sonas",

];

function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}


function doesPathExist(path) {
    try {
        fs.accessSync(path, fs.constants.R_OK)
        return true
    } catch (e) {
        return false
    }
};



async function UniqueName(dir, ext) {
    do {
        let baseName = RandomNames[randInt(0, RandomNames.length - 1)];
        let name = path.join(dir, baseName + ext);

        if (!doesPathExist(path)) return baseName;

        // todo if every name is taken!

    } while (true);
}


async function NewPlayer(socket, msg) {

    let dir = "Party";

    let baseName = await UniqueName(path.join(__dirname, "public", dir), ".json");
    //   let indexFolderDir = dir.substring(0, dir.length - 5);

    console.log("New baseName " + baseName);
    let newPartyMember = {
        isptba: true,
        appearance: [{
            name: "armed", portrait: { image: "images/questionMark.png" },
            token: { image: "images//questionMark.png" },
            slots: {
                X: "X", armor: "", pockets: "",
                sidearm: "", head: "", pockets0: "", pockets1: "", pockets2: "",
                pockets3: "", pockets4: ""
            }
        }, {
            name: "sleeping", portrait: { image: "images/questionMark.png" },
            token: { image: "images/questionMark.png", rotation: "90" },
            slots: { X: "X" }
        }, {
            name: "relaxation",
            portrait: { image: "images/questionMark.png" },
            token: { image: "images/questionMark.png" },
            slots: { X: "X" }
        }, {
            name: "fancy", portrait: { image: "images/questionMark.png" },
            token: { image: "images/questionMark.png" },
            slots: { X: "X" }
        }, {
            name: "bathing", portrait: { image: "images/questionMark.png" },
            token: { image: "images/questionMark.png" },
            slots: { X: "X" }
        }],
        current_appearance: "armed", name: baseName,
        stats: { avoidance: 0, allure: 0, bravery: 0, caring: 0, cunning: 0, intelligence: 0, strength: 0, will: 0, health: 0 },
        counters: {
            hurt: { cur: 0, long_rest: "subtract1", haven: "reset_to_zero", display: "special" },
            manaInAura: { cur: 0, scene: "reset_to_zero", display: "special" },
            exhaustion: { cur: 0, long_rest: "subtract1", haven: "reset_to_zero", display: "special" },

        },
        ui: {
            damageToTakeAmt: 0,
            damageToTakeType: "bludgeoning"
        },
        languages: { FarDuric: true, Dwarvish: false, Firespeech: false, PrittanianLow: false, ImperialCourt: false },
        items: [], tab: "stats",
        featsChosen: {}

    };

    let newPartyMemberTag = {
        file: "PartyFiles/" + baseName,
        page: "Player",
        source: "",
        type: "",
        name: baseName,
        img: "images/questionMark.png"
    };


    // let srcName = p.name;
    // let srcDir = dir;

    console.log("New baseName " + baseName);

    let dest1 = path.join(__dirname, "public", dir + "Files", baseName + '.json');

    // let src2 = path.join(__dirname, "public", indexFolderDir, "tag_" + name + '.json');
    let dest2 = path.join(__dirname, "public", dir, "tag_" + baseName + '.json');

    console.log(" to " + dest1);
    console.log(" to " + dest2);
    // warning overwrites msg.from.file, poor form


    await Promise.all([
        fs.writeFile(dest1, JSON.stringify(newPartyMember)),
        fs.writeFile(dest2, JSON.stringify(newPartyMemberTag)),

    ]);
    sheeter.folders[dir].push(newPartyMemberTag);

    socket.emit('updateDir', { id: dir, folder: sheeter.folders[dir] });


}



async function NewScene(socket, msg) {

    let dir = "Scenes";

    let baseName = path.join(__dirname, "public", dir, "tag_" + msg.name + ".json");

    let sceneDir = path.join(__dirname, "public", "SceneFiles", msg.name);
    //   let indexFolderDir = dir.substring(0, dir.length - 5);
    if (doesPathExist(baseName)) {

        socket.emit('error', { message: "scene " + baseName + " already exists" });
        return;
    }

    console.log("New baseName " + baseName);
    let newSceneTag =
    {
        name: msg.name,
        page: "scene",
        image: "modules/plutonium/media/icon/mighty-force.svg",
        topDown: true,
        directory: msg.name,
        gridScaleInPixels: 100,
        gridScaleInUnits: "5ft",
        typeOfGrid: "hex",
        cameraStartX: 0,
        cameraStartY: 0,
        nextZ: 0.00001,
        next_tile_id: 0,
        count: 0
    }

        ;



    // let src2 = path.join(__dirname, "public", indexFolderDir, "tag_" + name + '.json');



    console.log(" to " + baseName);
    console.log(" to " + sceneDir);
    // warning overwrites msg.from.file, poor form

    // this is not good, let's try to change to leveldb soon


    await Promise.all([

        fs.writeFile(baseName, JSON.stringify(newSceneTag)),
        fs.mkdir(sceneDir, { recursive: true }),

    ]);

    let result = await fs.readdir(path.join(__dirname, 'public', 'Scenes'));

    sheeter.folders.Scenes = await jsonHandling.fillDirectoryTable("Scenes", result);
    for (i = 0; i < sheeter.folders.Scenes.length; i++) {
        let unparsed = sheeter.folders.Scenes[i];
        let scene = jsonHandling.ParseJson(i, unparsed);
        let nom = scene.name;
        sheeter.folders.ScenesParsed[nom] = scene;
    }


    //   sheeter.folders.ScenesParsed.push(newSceneTag);
    socket.emit('refresh_scenes');
    socket.emit('updateDir', { id: dir });





}


async function ChangeName(dir, thingName, newName, io, msg, updateAppearance) {

    /// this could be done better with more callbacks instead of async
    let tagDir = dir.slice(0, -5);
    let folder = sheeter.folders[tagDir];

    console.log("Tag dir (" + tagDir + ")");
    let filePath = path.normalize(path.join(__dirname, 'public', dir, sheeter.optionallyAddExt(thingName, ".json")));
    let tag_filePath = path.normalize(path.join(__dirname, 'public', tagDir, "tag_" + sheeter.optionallyAddExt(thingName, ".json")));
    console.log("filePath " + filePath);
    console.log("tag_filePath " + tag_filePath);

    let result = await fs.readFile(filePath);
    let thing = jsonHandling.ParseJson(filePath, result);

    result = await fs.readFile(tag_filePath);
    let tag = jsonHandling.ParseJson(tag_filePath, result);

    for (let i = 0; i < folder.length; i++) {

        let entry = jsonHandling.ParseJson("inline", folder[i]);
        console.log(entry.file + " vs " + tag.file);
        console.log("%o", folder[i]);

        if (entry.file == tag.file) {
            entry.name = newName;
            folder[i] = JSON.stringify(entry);
            break;
        }
    }

    thing.name = newName;
    tag.name = newName;

    await fs.writeFile(filePath, JSON.stringify(thing), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            //  console.log(fs.readFileSync("books.txt", "utf8"));
        }
    });
    await fs.writeFile(tag_filePath, JSON.stringify(tag), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
            //  console.log(fs.readFileSync("books.txt", "utf8"));
        }
    });
    io.emit('refresh_scenes');

}

async function sendScene(msg, socket) {

    let found = 0;/// todo fix bad form


    let scene = sheeter.folders.ScenesParsed[msg.name];


    await Scene.loadScene(scene);
    let array = [];
    let keys = Object.keys(scene.tiles);
    for (let i = 0; i < keys.length; i++) {
        array.push(scene.tiles[keys[i]]);
    }
    socket.emit('displayScene', { name: msg.name, sceneType: "2d", array: array, camera: msg.camera });

}
// io
io.on('connection', (socket) => {
    console.log('a user connected ');
    socket.on('join', function (credentials) {
        console.log("Login:" + credentials.player);
        let user = null;
        const entries = socket.rooms.values();
        for (const entry of entries) {
            if (entry.startsWith('user:')) {
                user = entry;
                break;
            }
        }
        if (user) {
            socket.leave(user);
        }
        login(socket, credentials);
        console.log('Login connection: %o', socket.rooms.values());
    });

    socket.on('newPlayer', (msg) => {
        NewPlayer(socket, msg);
    });
    socket.on('newScene', (msg) => {
        NewScene(socket, msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('mousemove', (msg) => {
        ReBroadCast(socket, 'mousemove', msg);
    });
    socket.on('pingDo', (msg) => {
        ReBroadCast(socket, 'pingDo', msg);
    });
    socket.on('set_three_camera_xy', (msg) => {
        ReBroadCast(socket, 'set_three_camera_xy', msg);
    });
    socket.on('chat', (msg) => {
        let sender = getUser(socket);
        if (sender) {
            let formatted = '<div class=chatsender>' + sender + '</div><div classname="chattext">' + msg + '</div';
            chats.push(formatted);
            ReBroadCast(socket, formatted);
        }
    });
    socket.on('changeName', (msg) => {
        ChangeName(msg.dir, msg.thingName, msg.newName, io, msg, true);
    });
    socket.on('updateTile', (msg) => {

        let sender = getUser(socket);
        if (sender) {
            let scene = sheeter.folders.ScenesParsed[msg.scene];

            Scene.updateSceneTile(scene, msg.tile);   // change to in place and update
            io.emit('updatedTile', msg);
        }
    });
    socket.on('change_appearance', (msg) => {
        sheeter.ChangeThing(msg.thing, msg.change, io, msg, true);
    });

    socket.on('deleteTile', (msg) => {
        console.log("delete file");
        let sender = getUser(socket);
        if (sender) {
            let scene = sheeter.folders.ScenesParsed[msg.scene];
            console.log("scene");

            Scene.removeSceneTile(scene, msg.tile);   // change to in place and update

            io.emit('deletedTile', msg);
        }
    });
    socket.on("add_token", (msg) => {

        let sender = getUser(socket);
        if (sender) {
            let scene = sheeter.folders.ScenesParsed[msg.scene];

            console.log(msg.tile);
            let ref = msg.tile.reference;
            if (ref.windowId == "Compendium" || ref.windowId === "Favorites") {
                let instance = path.join('SceneFiles', msg.scene, path.basename(ref.file) + Scene.uuidv4());

                fs.copyFile(path.join(__dirname, "public", ref.file + '.json'),
                    path.join(__dirname, "public", instance + '.json')
                );
                ref.file = (instance);
                msg.tile.sheet = ref;
                ref.file = msg.tile.sheet.file = path.join(instance + '.json');

            }

            msg.scene = { name: msg.scene };
            Scene.updateSceneTile(scene, msg.tile);
            io.emit('newTile', msg);
        }

    });

    socket.on("add_tile", (msg) => {

        let sender = getUser(socket);
        if (sender) {
            let scene = sheeter.folders.ScenesParsed[msg.scene];

            msg.scene = { name: msg.scene };
            Scene.updateSceneTile(scene, msg.tile);
            io.emit('newTile', msg);
        }

    });

    socket.on('loadScene', (msg) => {
        sendScene(msg, socket);
    }
    );


    socket.on('change', (msg) => {
        sheeter.ChangeThing(msg.thing, msg.change, io, msg, false);
    });
    socket.on('addItem', (msg) => {

        sheeter.AddItem(msg.thing, msg.item, io, msg);
    })
    // to do in utilities class
    function div(className, text) {
        return '<div class="' + className + '">' + text + "</div>";
    }
    function strong(text) {
        return '<strong>' + text + '</strong>';
    }
    function parens(text) {
        return '(' + text + ')';
    }

    const fail = '<span style="color:#FF0000">Fail</span>';
    const crit = '<span style="color:#0000ff">CRIT</span>';

    function ptbaDescr(nat, r) {
        // assumes 2d10
        if (nat == 2) return fail;
        if (nat == 20) return crit;
        if (r < 10) return fail;
        if (r < 16) return "Mixed";
        if (r < 23) return '<span style="color:#008888">Success</span>';
        return crit;
    }

    function ptbaFormat(str) {
        return str;
    }

    function ptbaResult(nat, r, resultsTable) {

        console.log(resultsTable);
        console.log(resultsTable.Critical);
        if (nat == 2) return ptbaFormat(resultsTable.fail);
        if (nat == 20) return ptbaFormat(resultsTable.Critical.empty() ? resultsTable.success : resultsTable.Critical);
        if (r < 10) return ptbaFormat(resultsTable.fail);
        if (r < 16) return ptbaFormat(resultsTable.mixed);
        if (r < 23) return ptbaFormat(resultsTable.success);
        return ptbaFormat(resultsTable.Critical == "" ? resultsTable.success : resultsTable.Critical);
    }

    function processRoll(m) {

        let outmsg = ""
        // if (m.title.length > 15)
        //    outmsg += div("rolltitle", m.title);
        //else
        outmsg += div("centeredtext rolltitle", m.title);


        let r = dice(m.roll);

        if (m.style == "dual-move") {
            console.log("dual-move");
            console.log(r);

            switch (m.advantage) {

                default: {
                    let r2 = dice(m.roll);
                    let d1 = ptbaDescr(r.rolls, r.val);
                    let d2 = ptbaDescr(r2.rolls, r2.val);
                    outmsg += div("diceexpression", r.expression) +
                        div("twocolumns",
                            div("oneroll", strong(r.val) + ' ' + parens(r.rolls) + ' ' + d1 +
                                div("oneroll", strong(r2.val) + parens(r2.rolls) + ' ' + d2)));
                    outmsg += div("outlined", strong(d1) + ' ' + ptbaResult(r.rolls, r.val, m.resultsTable));
                    if (d1 != d2)
                        outmsg += div("outlined", strong(d2) + ' ' + ptbaResult(r2.rolls, r2.val, m.resultsTable));
                } break;
                case 0: {
                    outmsg += div("centeredtext rolltitle", "normal");
                    let d1 = ptbaDescr(r.rolls, r.val);
                    outmsg += div("diceexpression", r.expression) +
                        div("oneroll", strong(r.val) + parens(r.rolls) + ' ' + d1 +
                            div("outlined", strong(d1) + ' ' + ptbaResult(r.rolls, r.val, m.resultsTable)));

                } break;
                case 1: {
                    outmsg += div("centeredtext rolltitle", strong("Advantage"));
                    let r2 = dice(m.roll);
                    let d1 = ptbaDescr(r.rolls, r.val);
                    let d2 = ptbaDescr(r2.rolls, r2.val);
                    outmsg += div("diceexpression", r.expression) +
                        div("oneroll", (r.val > r2.val ? strong(r.val) : r.val) + parens(r.rolls) + ' vs ' +
                            (r.val < r2.val ? strong(r2.val) : r2.val) + ' ' + parens(r2.rolls));
                    if (r.val > r2.val)
                        outmsg += div("outlined", strong(d1) + ' ' + ptbaResult(r.rolls, r.val, m.resultsTable));
                    else
                        outmsg += div("outlined", strong(d2) + ' ' + ptbaResult(r2.rolls, r2.val, m.resultsTable));
                } break;
                case -1: {
                    outmsg += div("centeredtext rolltitle", strong("Disadvantage"));
                    let r2 = dice(m.roll);
                    let d1 = ptbaDescr(r.rolls, r.val);
                    let d2 = ptbaDescr(r2.rolls, r2.val);
                    outmsg += div("diceexpression", r.expression);
                    outmsg += div("oneroll", (r.val < r2.val ? strong(r.val) : r.val) + parens(r.rolls) + ' vs ' +
                        (r.val > r2.val ? strong(r2.val) : r2.val) + '   ' + parens(r2.rolls));
                    if (r.val < r2.val) {
                        outmsg += div("outlined", strong(d1) + ' ' + ptbaResult(r.rolls, r.val, m.resultsTable));
                    }
                    else {
                        console.log("winner 2 d1 " + r.val + " d2 " + r2.val);
                        outmsg += div("outlined", strong(d2) + ' ' + ptbaResult(r2.rolls, r2.val, m.resultsTable));
                    }
                } break;
            }

        } else
            if (m.style == "dual") {
                let r2 = dice(m.roll);
                outmsg += div("diceexpression", r.expression) +
                    div("twocolumns",
                        div("oneroll", strong(r.val) + parens(r.rolls)) +
                        div("oneroll", strong(r2.val) + parens(r2.rolls)));


            } else {
                outmsg +=
                    div("twocolumns",
                        div("diceexpression", r.expression) +
                        div("oneroll", strong(r.val) + parens(r.rolls)));
            }
        if (m.damage) {
            let damageString = "";

            for (let d = 0; d < m.damage.length; d++) {
                let dam = m.damage[d];
                let r = dice(dam.damage + (d == 0 ? "+" + m.damage_bonus : ""));
                damageString += div("oneroll", "Damage " + strong(r.val)
                    + (r.rolls ? parens(r.rolls) : "")
                    + (dam.condition ? dam.condition : "")
                    + dam.type + " " + (dam.when ? dam.when : ""));


            }

            outmsg += div("", damageString);

        }

        if (m.post) outmsg += div("msgpost", m.post);

        return outmsg;

    }


    socket.on('roll', (msg) => {

        let sender = getUser(socket);


        if (sender) {
            let outmsg = div('chatsender', sender);
            outmsg += processRoll(msg);
            io.emit('chat', div("chatmsg", outmsg));
        }
    });

    socket.on('rolls', (msg) => {
        let sender = getUser(socket);
        if (sender) {
            let outmsg = div('chatsender', sender);
            for (let i = 0; i < msg.length; i++) {
                outmsg += processRoll(msg[i]);
            }
            io.emit('chat', div("chatmsg", outmsg));
        }
    });

    socket.on('copy_files', (msg) => {

        CopyThingFIles(socket, msg);
    });


    socket.on('RemoveItemFromThing', (msg) => {

        sheeter.RemoveItemFromThing(socket, msg);

    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


// todo make shorter
app.get("/Compendium", (req, res) => {
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(sheeter.folders.Compendium));
});

app.get("/Scenes", (req, res) => {
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(sheeter.folders.Scenes));
});

function fixImageFileName(file) {

    let stemIndex = file.indexOf("public") + "public".length;
    let stem = file.substring(stemIndex);
    stem = stem.replaceAll('\\', '/');
    return stem.replaceAll('//', '/');

}
let tabrecur = 0;
function spaces(t) {
    let answer = ""
    while (t > 0) {
        answer += " ";
        t--;
    }
    return answer;
}

var imageDirMap = {};

async function recurseReadImageDir(dir) {

    let results = [];
    fs.readdir(dir).then(list => {
        tabrecur++;
        let seeDir = fixImageFileName(dir) + '/';

        for (let i = 0; i < list.length; i++) {

            let file = list[i];
            if (!file) {
                console.log("Error with element " + i + " of  " + spaces(tabrecur) + dir);
                return results;
            }
            file = path.resolve(dir, file);

            try {
                fs.stat(file).then((stat) => {
                    if (stat && stat.isDirectory()) {

                        if (!imageDirMap[seeDir]) {
                            imageDirMap[seeDir] = [];

                        }
                        let seeFile = fixImageFileName(file);
                        imageDirMap[seeDir].push({ name: seeFile + '/', img: "", type: "dir" });
                        try {
                            recurseReadImageDir(file);
                        } catch (e) { console.log(e); }

                    } else if (stat) {
                        let seeFile = fixImageFileName(file);
                        if (!imageDirMap[seeDir]) {
                            imageDirMap[seeDir] = [];

                        }
                        imageDirMap[seeDir].push({ name: seeFile, img: seeFile, type: "tile" });
                    }
                });
            } catch (err) { console.log(err); console.log("Unable to stat " + file); }
        }
        tabrecur--;
    });

}

function locateFileInDir(list, seeFile) {

    const results = list.filter(entry => entry.name === seeFile);
    return results.length > 0;
}

async function refreshDirThatHasBeenAddedTo(dir) {

    let results = [];
    fs.readdir(dir).then(list => {
        tabrecur++;
        let seeDir = fixImageFileName(dir);

        for (let i = 0; i < list.length; i++) {

            let file = list[i];
            if (!file) {
                console.log("Error with element " + i + " of  " + spaces(tabrecur) + dir);
                return results;
            }
            file = path.resolve(dir, file);

            try {
                fs.stat(file).then((stat) => {
                    if (stat && stat.isDirectory()) {

                        if (!imageDirMap[seeDir]) {
                            imageDirMap[seeDir] = [];

                        }
                        let seeFile = fixImageFileName(file);
                        if (!locateFileInDir(imageDirMap[seeDir], seeFile)) {
                            imageDirMap[seeDir].push({ name: seeFile + '/', img: "", type: "dir" });
                            try {
                                recurseReadImageDir(file);
                            } catch (e) { console.log(e); }
                        }

                    } else if (stat) {
                        let seeFile = fixImageFileName(file);
                        if (!imageDirMap[seeDir]) {
                            imageDirMap[seeDir] = [];

                        }
                        if (!locateFileInDir(imageDirMap[seeDir], seeFile)) {
                            imageDirMap[seeDir].push({ name: seeFile, img: seeFile, type: "tile" });
                        }
                    }
                });
            } catch (err) { console.log(err); console.log("Unable to stat " + file); }
        }
        tabrecur--;
    });

}

recurseReadImageDir(path.join(__dirname, 'public', 'images'));


app.use("/images", (req, res, next) => {

    console.log("images");
    console.log(req.originalUrl);


    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    console.log(imageDirMap[req.originalUrl]);

    let answer = imageDirMap[req.originalUrl];
    res.end(JSON.stringify(answer));

});

app.get("/Favorites", (req, res) => {

    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(sheeter.folders.Favorites));
});


app.get("/Uniques", (req, res) => {

    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(sheeter.folders.Uniques));
});


app.get("/Party", (req, res) => {

    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(sheeter.folders.Party));
});

// TO DO: could stringify chats once for multiple players loading at the same time
// will speed up reloads into game
app.get("/previous_chats", (req, res) => {

    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(chats));

});


http_io.listen(port, () => console.log(`VTT listening on port ${port}`))

// requests required
// send initial view
// Items:
//      Unique      .... these items always are not instanced
//      Party
//      Favorites
//      instances   .... these are instances in the current scene
//                          may not be a list that is seen like unique ones,
//                          but are created when templates dragged into the scene.
//                          these are written with the scene (maybe just diffs? Advanced).
//
//      Compendium   .... these are not instanced, but when added to a scene are instanced.
//                       need 'edit' checkbox to prevent accidental editing.
// show sheets
//      classify sheets, so npc,pc, item, etc
//        classify sheet templates
//          focus -- full view with tabs
//          short -- short view
//          actions -- shows only actions
//          inventory -- show for placement in another sheet
//          mystery -- for player seeing items gm has prepared
//          less mystery -- staget 2 for player seeing items gm has prepared
// open sheet (sub window)
//      stats,
//      inventory... sheets for inventory
//      assign images
//      counters
//      rolls
//      roll modifiers
//      actions
//      transactions / spreadsheet
//      link instances to sheet
//      sheet was updated, sheet was reupdated
// adjust stat
// add item
// remove item
// import sheet
// export sheet
//
//
// show scenes
// scene format design
// show art directory and switch
// open scene
// move art
// mode top down
// mode theatre of the mind
// mode 45 degree
// mode 3d
// create actor by dragging sheet
// lights and fx
// import scene
// export scene

// permissionms
// player  identity
//  per item/sheet/scene
//  per template, view
//  per function

// things to do
// 1. New Button
// 2. Drag equipment or moves etc
// 3. shop

console.log(`Server is running on http://${host}:${port}`);