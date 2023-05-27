const fs = require('fs').promises;
const rawfs = require('fs');
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

async function fillDirectoryTable(name, raw) {
    let directory = [];
    let i = 0;
    // we might consider making this async
    try {
        for (i = 0; i < raw.length; i++) {
            if (raw[i].startsWith('tag_')) {
                let file = (await (fs.readFile(path.join(__dirname, 'public', name, raw[i])))).toString();
                directory.push(file);
            }
        }
    } catch (err) {
        console.error("Unable to read " + path.join(__dirname, 'public', name, raw[i]) + ": " + err);
    }
    return directory;
}
module.exports = { ParseJson, fillDirectoryTable, writeJsonFileInPublic };
