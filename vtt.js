

//const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const http = require('http');
const sockets = require("socket.io");
const init = require('./init.js');
const dice = require('./roller.js')
const ChangeThing = require('./sheeter.js')



const host = 'localhost';
const port = 8000;

const app = express();
const http_io = http.Server(app);
const io = sockets(http_io);
app.use(express.static(path.join(__dirname, 'public'))); //Serves resources from public folder

var passwords, players, Compendium;
var chats = []; // chats so far




/// TODO: put this in a module
function ParseJson(name, raw) {
    let json = null;

    try {
        json = JSON.parse(raw);
    } catch (err) {
        console.error("error parsing json ( " + err + ") for " + name);
    }
    return json;
}

async function fillDirectoryTable(directory, name, raw) {
    try {
        for (let i = 0; i < raw.length; i++) {
            if (raw[i].startsWith('tag_')) {
                let file = (await (fs.readFile(path.join(__dirname, 'public', name, raw[i])))).toString();
                directory.push(file);
            }
        }
    } catch (err) {
        console.error("Unable to fill " + name + ": " + err);
    }
}

async function InitialDiskLoad() {
    let promises = [];

    promises.push(fs.readFile(path.join(__dirname, 'passwords.json'))); // TODO: use file cache
    promises.push(fs.readFile(path.join(__dirname, 'public', 'players/players.json'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Compendium'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Favorites'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Party'))); // TODO: use file cache
    promises.push(fs.readdir(path.join(__dirname, 'public', 'Uniques'))); // TODO: use file cache


    let results = await Promise.all(promises);
    passwords = ParseJson('passwords.json', results[0]);
    players = ParseJson('players.json', results[1]);
    Compendium = [];
    Favorites = [];
    Party = [];
    Uniques = [];
    fillDirectoryTable(Compendium, "Compendium", results[2]);
    fillDirectoryTable(Favorites, "Favorites", results[3]);
    fillDirectoryTable(Party, "Party", results[4]);
    fillDirectoryTable(Uniques, "Uniques", results[5]);


    init.inited = true;

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
            user = entry.sub(5);
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
    if (!init.inited) { await init.until(); }

    if (passwords[credentials.player] != credentials.password) {
        console.log("Error Invalid credentials " + credentials.player);
        socket.emit("login_failure", "Invalid credentials " + credentials.player);
        return;
    }

    socket.join('user:' + credentials.player); // We are using room of socket io for login
    //console.log("Logins %o", io.sockets.adapter.rooms);
    //console.log("Room %o " + socket.rooms, socket.rooms);
}

async function CopyFiles(msg) {

    console.log("%o", msg);
    let p = path.parse(path.normalize(msg.from.file));

    let srcName = p.name;
    let srcDir = p.dir;
    let src = path.join(__dirname, "public", p.dir, p.name + '.json');
    let dest = path.join(__dirname, "public", msg.to + "Files", p.name + '.json');

    let src2 = path.join(__dirname, "public", p.dir.substring(0, p.dir.length - 5), "tag_" + p.name + '.json');
    let dest2 = path.join(__dirname, "public", msg.to, "tag_" + p.name + '.json');

    console.log(src + " to " + dest);
    console.log(src2 + " to " + dest2);

    await Promise.all([
        fs.copyFile(src, dest),
        fs.copyFile(src2, dest2)
    ]);



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
            chats.push('<span class=chatUser>' + sender + '</span>' + msg);
            console.log('chat', '<span class=chatUser">' + sender + '</span> <p>' + msg + '</p>');
            ReBroadCast(socket, 'chat', '<span class=chatUser">' + sender + '</span><p> ' + msg + '</p>');
        }
    });
    socket.on('change', (msg) => {
        ChangeThing(msg.thing, msg.change, io, msg);
    })

    socket.on('roll', (msg) => {
        let m = msg;
        console.log("%o", m);
        let sender = getUser(socket);
        if (m.title) {
            sender += " " + m.title;
        }
        if (sender) {
            console.log(m);
            console.log(sender);
            let r = dice(m.roll);
            let outmsg = ""
            if (msg.style == "dual") {
                r2 = dice(m.roll);
                outmsg = '<span class=chatUser>' + sender + '</span>' + r.expression
                    + "<br> <strong> " + r.val + ' </strong> (' + r.rolls + ')'
                    + "<br> <strong> " + r2.val + ' </strong> (' + r2.rolls + ')';
            } else {
                outmsg = '<span class=chatUser>' + sender + '</span>' + r.expression
                    + "<br> <strong> " + r.val + ' </strong> (' + r.rolls + ')';
            }
            chats.push(outmsg);
            if (msg.post) outmsg += " " + msg.post;
            chats.push(outmsg);
            console.log(outmsg);
            io.emit('chat', outmsg);
            console.log(outmsg);

        }
    });

    socket.on('copy_file', (msg) => {
        console.log("To" + msg.to);
        console.log("From" + msg.from);
        CopyFiles(msg);

        //   ChangeThing(msg.thing, msg.change, io, msg);
    })

});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/Compendium", (req, res) => {
    console.log("OK");
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(Compendium));
});

app.get("/Favorites", (req, res) => {
    console.log("OK");
    // Error here need to bulletproof server not being ready?
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(JSON.stringify(Favorites));
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
//test();