
const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');
const jsonHandling = require('./json_handling.js');

function SanitizeThing(text) {
    text.replace(/\s|\"|\'|\(|\)/g, '');
    if (!text.startsWith('thing.')) { return null; }
    return text;
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// TODO: got to make sure we have a consistent policy about extensions

function optionallyAddExt(path, ext) {
    if (!path.endsWith(ext))
        return path + ext;
    else
        return path;
}

async function ChangeThing(thingName, replacement, io, msg) {
    console.log(thingName);
    console.log(replacement);

    // replacement = SanitizeThing(replacement); // protect vs hacks, todo: see if screws up string assignments
    console.log('sanitized ' + replacement);
    if (replacement) {
        // Need to put these in a cache and write them out over time for speed
        // this should go through a cache 

        let filePath = path.normalize(path.join(__dirname, 'public', optionallyAddExt(thingName, ".json")));
        console.log('filePath ', filePath);

        let result = await fs.readFile(filePath);
        let thing = jsonHandling.ParseJson(filePath, result); // for eval to work we need a thing
        // console.log(thing);
        console.log(replacement);


        console.log("thing ", thing);

        eval(replacement); // actually change the thing

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
        console.log("done");
        io.emit('change', msg);
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
    console.log(thingName);
    console.log(item_tag);

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

        let item_filePath = path.normalize(path.join(__dirname, 'public', item_tag.file + ".json"));
        let out_item_filePath = path.normalize(path.join(__dirname, 'public', (thingName) + "_" + baseItemName + "_" + uuid + ".json"));
        promises.push(fs.copyFile(item_filePath, out_item_filePath));



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

module.exports = { ChangeThing: ChangeThing, AddItem: AddItem };