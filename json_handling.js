const fs = require('fs').promises;
const rawfs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');


function writeJsonFile(fileName, json) {

    try {
        rawfs.writeFileSync(fileName, JSON.stringify(json));
    } catch (err) {
        console.log(json);

        console.log(err + " Error with " + fileName);
    }
}

function writeJsonFileInPublic(dir, fileName, json) {
    let fname = sanitize(fileName);
    let pathName = path.join(__dirname, 'public', dir, fname + '.json');
    writeJsonFile(pathName, json);
}

function ParseJson(name, raw) {
    let json = null;
    try {
        json = JSON.parse(raw);
    } catch (err) {
        console.error("error parsing json ( " + err + ") for " + name);
    }
    return json;
}

async function fillDirectoryTable(name, raw, is_image) {
    let directory = [];
    let i = 0;
    // we might consider making this async
    try {
        for (i = 0; i < raw.length; i++) {
            if (!is_image && raw[i].startsWith('tag_')) {
                let file = (await (fs.readFile(path.join(__dirname, 'public', name, raw[i])))).toString();
                directory.push(file);
            } else if (is_image) {
                console.log('{      \
                    "file": "' + raw[i] + '", \
                    "page": "image", \
                    "type": "image", \
                    "name": "' + raw[i] + '", \
                    "img": "' + raw[i] + '" \
                }');
                directory.push('{      \
                    "file": "' + raw[i] + '", \
                    "page": "image", \
                    "type": "image", \
                    "name": "' + raw[i] + '", \
                    "img": "' + raw[i] + '" \
                }')
            }
        }
    } catch (err) {
        console.error("Unable to read " + path.join(__dirname, 'public', name, raw[i]) + ": " + err);
    }
    return directory;
}

module.exports = { ParseJson, fillDirectoryTable, writeJsonFileInPublic, writeJsonFile };
