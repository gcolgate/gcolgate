

//const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const http = require('http');
const sockets = require("socket.io");
require('./init.js');
const dice = require('./roller.js')
const ChangeThing = require('./sheeter.js')
const fileUpload = require('express-fileupload');
const Scene = require('./scene.js');
const jsonHandling = require('./json_handling.js');
const probeImage = require('probe-image-size');

const host = 'localhost';
const port = 8000;

const app = express();
const http_io = http.Server(app);
const io = sockets(http_io);
app.use(express.static(path.join(__dirname, 'public'))); //Serves resources from public folder

var passwords, players;
var folders = { Compendium: [], Favorites: [], Uniques: [], Party: [], Scenes: [], ScenesParsed: [] };
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
        console.log("Writing to " + __dirname + '/images/' + tile.texture);
        let t = Date.now();
        console.log("start time " + t);

        await file.mv(path.normalize(__dirname + '/public/images/' + tile.texture));
        res.sendStatus(200);
        console.log("done time ", file);

        console.log(scene_name);
        let scene = folders.ScenesParsed[scene_name];
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

    console.log(" req ", req);

    // If no image submitted, exit
    if (!req.files || !req.files.file) {
        console.log("Cant find image");
        return res.sendStatus(400);
    }
    doTheUpload(res, req);

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

    console.log(results[3]);
    console.log(results[6]);

    results = await Promise.all(promises);

    folders.Compendium = results[0];
    folders.Favorites = results[1];
    folders.Party = results[2];
    folders.Uniques = results[3];
    folders.Scenes = results[4];
    console.log(results[1]);
    console.log('ddddddddddddddd');
    console.log(results[4]);

    //  await delay(5000);

    init.inited = true;
    console.log("Ready to go");

}

try {
    InitialDiskLoad();
} catch (err) {
    console.log("Unable to initialize" + err);
    exit(-1);
}
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

    sendScene("default_scene", socket); // TODO: it's supposed to be saved

    //console.log("Logins %o", io.sockets.adapter.rooms);
    //console.log("Room %o " + socket.rooms, socket.rooms);
}

async function CopyThingFIles(socket, msg) {


    console.log("From ", msg.from);
    console.log("To ", msg.to);
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
    msg.from.file = msg.to + "Files/" + p.name + '.json';
    console.log(msg.from);

    await Promise.all([
        fs.writeFile(dest2, JSON.stringify(msg.from)),
        fs.copyFile(src, dest)
    ]);
    console.log(path.join(__dirname, 'public', msg.to + '.json'));
    folders[msg.to].push(msg.from);

    socket.emit('updateDir', msg.to);


}

async function sendScene(name, socket) {
    console.log(folders.Scenes);
    console.log(name);
    let found = 0;/// todo fix bad form
    for (i = 0; i < folders.Scenes.length; i++) {
        //      console.log(folders.Scenes[i], name);
        if (folders.Scenes[i].name == name) {
            found = i;
            break;
        }
    }
    let unparsed = folders.Scenes[found];
    console.log(typeof unparsed);
    console.log(unparsed);
    folders.ScenesParsed[name] = jsonHandling.ParseJson(name, unparsed);

    let scene = folders.ScenesParsed[name];


    await Scene.loadScene(scene);
    let array = [];
    let keys = Object.keys(scene.tiles);
    for (let i = 0; i < keys.length; i++) {
        array.push(scene.tiles[keys[i]]);
    }
    socket.emit('displayScene', { name: name, sceneType: "2d", array: array });
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

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('mousemove', (msg) => {
        ReBroadCast(socket, 'mousemove', msg);
    });
    socket.on('chat', (msg) => {
        let sender = getUser(socket);
        if (sender) {
            let formatted = '<div class=chatsender>' + sender + '</div><div classname="chattext">' + msg + '</div';
            chats.push(formatted);
            ReBroadCast(socket, formatted);
        }
    });
    socket.on('updateTile', (msg) => {

        let sender = getUser(socket);
        if (sender) {
            let scene = folders.ScenesParsed[msg.scene];

            Scene.updateSceneTile(scene, msg.tile);   // change to in place and update
            io.emit('updatedTile', msg);
        }
    });

    socket.on('deleteTile', (msg) => {
        console.log("delete file");
        let sender = getUser(socket);
        if (sender) {
            let scene = folders.ScenesParsed[msg.scene];
            console.log("scene");

            Scene.removeSceneTile(scene, msg.tile);   // change to in place and update
            console.log("emit", msg);
            io.emit('deletedTile', msg);
        }
    });
    socket.on("add_token", (msg) => {
        let sender = getUser(socket);
        if (sender) {
            let scene = folders.ScenesParsed[msg.scene];

            console.log(msg.tile);
            let ref = msg.tile.reference;
            if (ref.windowId == "Compendium" || ref.windowId === "Favorites") {
                console.log("Do it");
                let instance = path.join('SceneFiles', msg.scene, path.basename(ref.file) + Scene.uuidv4());
                console.log(instance);
                console.log(path.join(__dirname, "public", ref.file));
                console.log(path.join(__dirname, "public", instance));
                fs.copyFile(path.join(__dirname, "public", ref.file + '.json'),
                    path.join(__dirname, "public", instance + '.json')
                );
                ref.file = instance;
                msg.tile.sheet = ref;
            }

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
        console.log('change', msg);
        ChangeThing(msg.thing, msg.change, io, msg);
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
        if (r < 16) return "Mixed Success";
        if (r < 23) return '<span style="color:#008888">Success</span>';
        return crit;
    }

    function processRoll(m) {

        let outmsg = ""
        if (m.title.length > 15)
            outmsg += div("rolltitle", m.title);
        else
            outmsg += div("centeredtext rolltitle", m.title);

        let r = dice(m.roll);

        if (m.style == "dual-move") {

            let r2 = dice(m.roll);
            outmsg += div("diceexpression", r.expression) +
                div("twocolumns",
                    div("oneroll", strong(r.val) + ' ' + parens(r.rolls) + ' ' + ptbaDescr(r.rolls, r.val)) +
                    div("oneroll", strong(r2.val) + ' ' + parens(r2.rolls) + ' ' + ptbaDescr(r2.rolls, r2.val)));


        } else
            if (m.style == "dual") {
                let r2 = dice(m.roll);
                outmsg += div("diceexpression", r.expression) +
                    div("twocolumns",
                        div("oneroll", strong(r.val) + ' ' + parens(r.rolls)) +
                        div("oneroll", strong(r2.val) + ' ' + parens(r2.rolls)));


            } else {
                outmsg +=
                    div("twocolumns",
                        div("diceexpression", r.expression) +
                        div("oneroll", strong(r.val) + ' ' + parens(r.rolls)));
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
        console.log("To" + msg.to);
        console.log("From", msg.from);
        CopyThingFIles(socket, msg);

        //   ChangeThing(msg.thing, msg.change, io, msg);
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
    res.end(JSON.stringify(folders.Compendium));
});

app.get("/Scenes", (req, res) => {
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(folders.Scenes));
});




app.get("/Favorites", (req, res) => {
    console.log("OK");
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(folders.Favorites));
});


app.get("/Uniques", (req, res) => {
    console.log("OK");
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(folders.Uniques));
});


app.get("/Party", (req, res) => {
    console.log("OK");
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(folders.Party));
});

// TO DO: could stringify chats once for multiple players loading at the same time
// will speed up reloads into game
app.get("/previous_chats", (req, res) => {
    console.log("OK");
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


// async function requestListener(req, res) {
//     //  res.writeHead(200);
//     //   res.end("My first server!");


//     console.log('req.url ' + req.url);
//     switch (req.url) {
//         case "/books":
//             res.setHeader("Content-Type", "application/json");
//             res.writeHead(200);
//             res.end('books');
//             break
//         case "/":
//             req.url = '/index.html';

//         default:

//             console.log(__dirname + req.url);
//             let fname = __dirname + path.normalize(req.url);
//             try {
//                 let contents = await fs.readFile(fname); // TODO: use file cache
//                 let type = Mime.getType(path.extname(fname));
//                 if (type != "application/javascript") { type = 'text/javascript'; }
//                 console.log(type);

//                 res.setHeader("Content-Type", type);

//                 console.log('read ' + fname);
//                 res.writeHead(200);
//                 res.end(contents);
//             } catch (error) {
//                 console.error(error);
//             }
//     }

// };

// const server = http.createServer(requestListener);
// server.listen(port, host, () => {
//     console.log(`Server is running on http://${host}:${port}`);
// }); 

console.log(`Server is running on http://${host}:${port}`);