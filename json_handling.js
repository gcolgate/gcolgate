const fs = require('fs').promises;
const rawfs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

const { Level } = require('level');

const db = new Level('public/Compendium', { valueEncoding: 'json' })

async function iterateDB() {
    const iterator = db.iterator();
    for await (const [key, value] of iterator) {
        console.log(key, value.name);

    }
}

iterateDB().catch(err => {
    console.error('Error during iteration:', err);
});

async function deleteFromDB(key) {
    try {
        await db.del(key);
    } catch (error) {
        if (error.notFound) {
            console.log(`Key ${key} not found in the database.`);
        } else {
            console.error(`Error deleting key ${key}:`, error);
        }
    }
}

async function delete_entries(dir, key) {
    let k = dir + '_' + key;
    console.log("delete " + k);
    console.log("delete " + tagName(k));
    deleteFromDB(tagName(k));
    deleteFromDB(k);
}

async function readFromDB(key) {
    try {
        const value = await db.get(key);
        return value;
    } catch (error) {
        if (error.notFound) {
            return null;
        }
        throw error;
    }
}
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

function getFolderName(key) {
    if (isFileReference(key)) {
        let dir = path.dirname(key);
        return key;
    } else {
        let t = key.split('_');
        if (t.length >= 1) {
            return t[0];
        }
        return '';
    }
}

function set(key, json) {
    if (isFileReference(key)) {
        let fname = sanitize(key);
        let pathName = path.join(__dirname, 'public', key + '.json');
        return writeJsonFile(pathName, json);
    } else {
        return db.put(key, json, function (err) {
            if (err) {
                console.error("Error writing to DB: ", err);
            }
        });
    }
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



// TODO: get rid of files?

function optionallyAddExt(path, ext) {
    if (!path.endsWith(ext))
        return path + ext;
    else
        return path;
}

function isFileReference(thingName) {
    return (thingName.indexOf('\\') >= 0 || thingName.indexOf('/') >= 0);
}

async function get(thingName) {
    let thing = null;
    // see if this refers to a file or a db entry
    if (isFileReference(thingName)) {
        try {
            var filePath = path.normalize(
                path.join(__dirname, 'public', optionallyAddExt(thingName, '.json')));

            let result = await fs.readFile(filePath);
            thing = ParseJson(filePath, result);  // for eval to work we need a 
        } catch (e) {
            console.error("Error loading file ", filePath, e);
            return;
        }
    }
    else {
        thing = readFromDB(thingName);
    }
    return thing;
}

async function fillDirectoryTable(name, raw, is_image) {
    let directory = [];
    let i = 0;
    // we might consider making this async 
    try {
        for (i = 0; i < raw.length; i++) {
            if (!is_image && raw[i].endsWith('.json')) {
                try {
                    let file = (await (fs.readFile(path.join(__dirname, 'public', name, raw[i])))).toString();
                    let json = JSON.parse(file);
                    directory.push(json.tag);
                } catch (err) {
                    console.error("Unable to read " + path.join(__dirname, 'public', name, raw[i]) + ": " + err);
                }

            } else if (is_image) {
                console.log('{      \
                    "id": "' + raw[i] + '", \
                    "page": "image", \
                    "type": "image", \
                    "name": "' + raw[i] + '", \
                    "img": "' + raw[i] + '" \
                }');
                directory.push({
                    file: raw[i],
                    page: "image",
                    type: "image",
                    name: raw[i],
                    img: raw[i]
                });
            }
        }
    } catch (err) {
        console.error("Unable to read " + path.join(__dirname, 'public', name, raw[i]) + ": " + err);
    }
    return directory;
}

function tagName(name) { return 'tag_' + name; }

function getDir(name) {
    let t = name.split('_');
    if (t.length >= 1) {
        if (t[0] != 'tag') {
            return t[0];
        }
        if (t.length >= 2) {
            return t[1];
        }
    }
    return '';
}
function getFile(name) {

    let t = name.split('_');
    if (t.length >= 1) {
        if (t[0] == 'tag') t.shift();
        t.shift();
        return t.join('_');

    }
    return '';

}

async function fillDirectoryTableDB(name) {
    let directory = [];

    name = tagName(name);
    let i = 0;
    // we might consider making this async 
    console.log("fillDirectoryTableDB " + name);

    /* for await (const [key, value] of db.iterator()) {
         console.log(key + " " + name);
         if (key == name) { console.log("eq" + name); }
         if (key > name) { console.log("gt " + name); }
         if (key < name + '\xFF') { console.log("lt " + name + '\xFF'); }
         if (key >= name && key < name + '\xFF') {
             console.log(key)
         }
     }*/
    const iterator = db.iterator({ gte: name, lt: name + '\xFF' });
    // we would be better off using the DB and not an array for directory?
    for await (const [key, value] of iterator) {
        //   console.log(key, value);
        directory.push(value);
    }
    return directory;
}

async function writeToDB(dir, key, json, json_tags) {
    let k = dir + '_' + key;
    console.log("writeToDB " + k);
    console.log("writeToDB " + tagName(k));
    db.put(tagName(k), json_tags);
    db.put(k, json);

}
async function fillDirectoryTableScene(name, raw, is_image) {
    let directory = [];
    let i = 0;
    // we might consider making this async
    try {
        for (i = 0; i < raw.length; i++) {
            if (!is_image && raw[i].startsWith('tag_')) {
                try {
                    let file = (await (fs.readFile(path.join(__dirname, 'public', name, raw[i])))).toString();
                    directory.push(ParseJson(path.join(__dirname, 'public', name, raw[i]), file));
                } catch (err) {
                    console.error("Unable to read " + path.join(__dirname, 'public', name, raw[i]) + ": " + err);
                }
            } else if (is_image) {
                console.log('{      \
                    "id": "' + raw[i] + '", \
                    "page": "image", \
                    "type": "image", \
                    "name": "' + raw[i] + '", \
                    "img": "' + raw[i] + '" \
                }');
                directory.push({
                    "id": raw[i],
                    "page": "image",
                    "type": "image",
                    "name": raw[i],
                    "img": raw[i]
                })
            }
        }
    } catch (err) {
        console.error("Unable to read " + path.join(__dirname, 'public', name, raw[i]) + ": " + err);
    }
    return directory;
}

module.exports = { iterateDB, getFile, getDir, tagName, delete_entries, ParseJson, fillDirectoryTable, fillDirectoryTableScene, writeJsonFileInPublic, writeJsonFile, fillDirectoryTableDB, writeToDB, readFromDB, set, get, getFolderName };
