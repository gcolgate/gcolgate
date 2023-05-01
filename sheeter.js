
const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');

function SanitizeThing(text) {
    text.replace(/\s|\"|\'|\(|\)/g, '');
    if (!text.startsWith('thing.')) { return null; }
    return text;
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


async function ChangeThing(thingName, replacement, io, msg) {
    console.log(thingName);
    console.log(replacement);
    replacement = SanitizeThing(replacement);
    console.log('sanitized ' + replacement);
    if (replacement) {
        // Need to put these in a cache and write them out over time for speed
        // this should go through a cache
        let filePath = path.join(__dirname, 'public', 'CompendiumFiles', thingName);
        let result = await fs.readFile(filePath);
        let thing = ParseJson(filePath, result); // for eval to work we need a thing


        eval(replacement);
        console.log("thing " + thing.name);
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


module.exports = ChangeThing;