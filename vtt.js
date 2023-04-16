
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const http = require('http');
const sockets = require("socket.io");
const init = require('./init.js');



const host = 'localhost';
const port = 8000;

const app = express();
const http_io = http.Server(app);
const io = sockets(http_io);
app.use(express.static(path.join(__dirname, 'public'))); //Serves resources from public folde

var passwords, players;

function ParseJson(name, raw) {
    let json = null;

    try {
        json = JSON.parse(raw);
    } catch (err) {
        console.log("error parsing json ( " + err + ") for " + name);
    }
    return json;
}



async function load_passwords() {
    let promises = [];

    promises.push(fs.readFile(path.join(__dirname, 'passwords.json'))); // TODO: use file cache
    promises.push(fs.readFile(path.join(__dirname, 'public', 'players/players.json'))); // TODO: use file cache

    let results = await Promise.all(promises);
    passwords = ParseJson('passwords.json', results[0]);
    players = ParseJson('players.json', results[1]);

    init.inited = true;

}

try {
    load_passwords();
} catch (err) {
    console.log("Unable to initialize" + err);
    exit(-1);
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
        console.log('a user connected %o', socket.rooms.values());
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('mousemove', (msg) => {
        let user = "";
        const entries = socket.rooms.values();
        for (const entry of entries) {
            if (entry.startsWith('user:')) {
                user = entry;
                break;
            }
        }
        if (user != "") {
            let a = socket.broadcast.emit('mousemove', msg);
        }

    });
});

// app
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// app.get("/testy", (req, res) => {
//     let books = { hi: "HI", there: "there" };
//     res.setHeader("Content-Type", "application/json");
//     res.writeHead(200);
//     res.end(JSON.stringify(books));

// });


http_io.listen(port, () => console.info(`VTT listening on port ${port}`))

// requests required
// send initial view
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