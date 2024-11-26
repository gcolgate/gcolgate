
//const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');
const jsonHandling = require('./json_handling.js');
var folders = { Compendium: [], Favorites: [], Uniques: [], Party: [], Scenes: [], ScenesParsed: [] };


function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function ensureExists(thing, template, field) {
    if (thing[field] == undefined) {
        if (template) {
            if (template[field]) {
                thing[field] = template[field];
            } else
                thing[field] = {}; // adding a temp field
        }
        else {
            thing[field] = {};
        }
    }
}
global.ensureExists = ensureExists;

function findInNamedArray(array, name) {

    if (name) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    }
    return undefined;
}

// TODO: got to make sure we have a consistent policy about extensions

function optionallyAddExt(path, ext) {
    if (!path.endsWith(ext))
        return path + ext;
    else
        return path;
}


var missingImage = "images/questionMark.png";

function getAppearanceImage(thing, type) {

    console.log("Thing %o", thing);
    if (thing.appearance) {
        let answer = findInNamedArray(thing.appearance, thing.current_appearance);
        console.log(answer);
        if (!answer) return missingImage;
        answer = answer[type];
        console.log(answer);
        if (!answer) return missingImage;
        console.log(answer.image);
        return answer.image ? answer.image : missingImage;

    } return missingImage;
}

function getPortrait(thing) {

    return getAppearanceImage(thing, 'portrait');

}
/*** 
 *  ChangeThing
 *  
 * @param thingname: thing to change
 * @param replacement: line of code to run on thing
 * @param io : network io
 * @param msg : change = msg to return (TODO get rid of thingname and replacement and read from msg)
 * @param updateAppearance : appearance of tokens for this thing might have changed
**/
async function ChangeThing(thingName, replacement, io, msg, updateAppearance) {
    console.log(thingName);
    console.log(replacement);

    // replacement = SanitizeThing(replacement); // protect vs hacks, todo: see if screws up string assignments
    if (replacement) {
        // Need to put these in a cache and write them out over time for speed
        // this should go through a cache 

        let filePath = path.normalize(path.join(__dirname, 'public', optionallyAddExt(thingName, ".json")));

        let result = await fs.readFile(filePath);
        let thing = jsonHandling.ParseJson(filePath, result); // for eval to work we need a thing
        // console.log(thing);
        let template = undefined;
        if (thing.template && replacement.indexOf("template" >= 0)) {
            let filePath = path.normalize(path.join(__dirname, 'public', optionallyAddExt(thing.template, ".json")));
            let result = await fs.readFile(filePath);
            template = jsonHandling.ParseJson(filePath, result);
        }
        console.log("rep" + replacement);
        if (replacement.indexOf("]") >= 0) {

            console.log("Do something");
        }
        eval(replacement); // actually change the thing
        console.log(thing);

        //  console.log('writeFile ', filePath);
        await fs.writeFile(filePath, JSON.stringify(thing), (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                //  console.log(fs.readFileSync("books.txt", "utf8"));
            }
        });
        msg.updateAppearance = updateAppearance;
        io.emit('change', msg);
        if (updateAppearance && thing.appearance && msg.updatePortrait) {
            let fileName = path.basename(thingName);
            let dir = path.dirname(thingName);
            let tagDir = dir.slice(0, -5);
            let folder = folders[tagDir];

            console.log("Tag dir (" + tagDir + ")");
            let tag_filePath = path.normalize(path.join(__dirname, 'public', tagDir, "tag_" + optionallyAddExt(fileName, ".json")));
            console.log("tag_filePath " + tag_filePath);


            result = await fs.readFile(tag_filePath);
            let tag = jsonHandling.ParseJson(tag_filePath, result);

            for (let i = 0; i < folder.length; i++) {

                let entry = jsonHandling.ParseJson("inline", folder[i]);
                console.log(entry.file + " vs " + tag.file);
                console.log("%o", folder[i]);

                if (entry.file == tag.file) {
                    entry.image = getPortrait(thing);
                    folder[i] = JSON.stringify(entry);
                    await fs.writeFile(tag_filePath, folder[i], (err) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("File written successfully\n");
                            console.log("The written has the following contents:");
                            //  console.log(fs.readFileSync("books.txt", "utf8"));
                        }
                    });
                    io.emit('updateDir', { id: tagDir, folder: folders[tagDir], makeFront: false });
                    break;
                }
            }
        }
    }
}

function RemoveDanglingRefs(io, thing, thingId, itemId) { // this is clunky

    for (let i = 0; i < thing.appearance.length; i++) {

        let slots = thing.appearance[i].slots;
        if (!slots) continue;

        let keys = Object.keys(slots);

        keys.forEach((key, index) => {

            if (slots[key] == itemId) {
                slots[key] = "";
                let evaluation = 'findInNamedArray(thing.appearance, thing.current_appearance).slots["' + key + '"] = ""';
                io.emit('change', { thing: thingId, change: evaluation });
            }
        });
    }

}


async function RemoveItemFromThing(io, msg) {

    let thingId = msg.thingId;
    let itemId = msg.itemId;

    console.log(thingId);
    console.log(itemId);


    let filePath = path.normalize(path.join(__dirname, 'public', optionallyAddExt(thingId, ".json")));
    console.log('filePath ', filePath);
    ok = false;
    let result = await fs.readFile(filePath);
    let thing = jsonHandling.ParseJson(filePath, result); // for eval to work we need a thing
    // console.log(thing);
    if (thing && thing.items) {
        for (let i = 0; i < thing.items.length; i++) {
            if (thing.items[i].file == itemId) {
                thing.items.splice(i, 1);
                ok = true;
                if (thing.appearance) {
                    RemoveDanglingRefs(io, thing, msg.thingId, itemId); // this is clunky
                }
                break;
            }
        }
    }
    if (ok) {
        console.log("thing ", thing);
        //  console.log('writeFile ', filePath);
        await fs.writeFile(filePath, JSON.stringify(thing), (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                //  console.log(fs.readFileSync("books.txt", "utf8"));
            }
        });


        let src = path.join(__dirname, "public", msg.itemId);
        console.log("Erasing ", src);
        await fs.unlink(src);

        io.emit('removeItemFromNpc', msg);
    }
}


function MakeTag(nom) {

    let name = path.normalize(nom);
    console.log(name);
    let dirname = path.dirname(name);
    console.log(dirname);

    let basename = path.basename(name);
    console.log(basename);

    if (dirname.endsWith('Files')) {
        dirname = dirname.slice(0, -('Files'.length));
        console.log(dirname);
    }
    return path.join(dirname, "tag_" + basename);

}

async function AddItem(thingName, item_tag, io, msg) {

    if (item_tag) {
        // Need to put these in a cache and write them out over time for speed
        // this should go through a cache 
        let baseItemName = path.basename(item_tag.file);
        let promises = [];

        let uuid = uuidv4();

        // 1. read thingname so we can edit it
        let filePath = path.normalize(path.join(__dirname, 'public', thingName + ".json"));
        console.log(filePath);
        let result = await fs.readFile(filePath);
        let thing = jsonHandling.ParseJson(filePath, result); // for eval to work we need a thing

        // copy the file to the same dir 
        // get the main file maybe just a copy?

        // let item_filePath = path.normalize(path.join(__dirname, 'public', item_tag.file + ".json"));
        let out_item_filePath = path.normalize(path.join(__dirname, 'public', (thingName) + "_" + baseItemName + "_" + uuid + ".json"));
        // promises.push(fs.copyFile(item_filePath, out_item_filePath));


        let outPutFile = { template: item_tag.file + ".json", owner: thingName };

        promises.push(fs.writeFile(out_item_filePath, JSON.stringify(outPutFile), (err) => {
            {
                if (err)
                    console.log(err);
                else {
                    console.log("File written successfully\n");
                    console.log("The written has the following contents:");
                    //  console.log(fs.readFileSync("books.txt", "utf8"));
                }
            }
        }));



        item_tag.file = thingName + "_" + baseItemName + "_" + uuid + ".json";


        // add the item to the thing and write it
        if (!thing.items) thing.items = [];
        thing.items.push(item_tag);
        console.log("thing " + thing.name);
        promises.push(fs.writeFile(filePath, JSON.stringify(thing), (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                //  console.log(fs.readFileSync("books.txt", "utf8"));
            }
        }));
        await Promise.all(promises);
        console.log("done");
        io.emit('addItem', msg);
    }

}

module.exports = { ChangeThing: ChangeThing, AddItem: AddItem, folders: folders, findInNamedArray, RemoveItemFromThing: RemoveItemFromThing, optionallyAddExt: optionallyAddExt };