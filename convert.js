

//const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');


//  TODO: Put this section is a module, it is for formatting console log output
//////////// hack to get line numbers on log statements like in the browser
//////////// it makes a fake error to get the stack trace
/////////// and formats it, in a way you can click on the stack trace to go to code in VS code
let redTerminal = "\u001b[31m";
let resetTerminal = "\u001b[39m";
['log', 'warn', 'error', 'info'].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
        let initiator = 'unknown place';
        try {
            throw new Error();
        } catch (e) {
            if (typeof e.stack === 'string') {
                let isFirst = true;
                for (const line of e.stack.split('\n')) {
                    const matches = line.match(/^\s+at\s+(.*)/);
                    if (matches) {
                        if (!isFirst) { // first line - current function
                            // second line - caller (what we are looking for)
                            initiator = matches[1];
                            break;
                        }
                        isFirst = false;
                    }
                }
            }
        }
        initiator.replace('\n', '');
        let s = initiator.indexOf('(');
        let e = initiator.indexOf(')');
        if (s != -1 && e != -1 && e > s) {
            initiator = initiator.slice(s + 1, e);
        }
        originalMethod.apply(console, [redTerminal, `${initiator}` + resetTerminal + '\t\t', ...args]);
    };
});

async function doit() {


    // promises.push(fs.readFile(path.join(__dirname, 'passwords.json'))); // TODO: use file cache
    // promises.push(fs.readFile(path.join(__dirname, 'public', 'players/players.json'))); // TODO: use file cache
    let dir = await fs.readdir(path.join(__dirname, 'public', 'toConvert')); // 

    console.log("%o", dir);

    for (let i = 0; i < dir.length; i++) {

        let fname = path.join(__dirname, 'public', 'toConvert', dir[i]);
        console.log("Loading " + fname);
        let text = (await fs.readFile(fname)).toString();
        let level = 0;
        let inQuotes = false;
        let subfiles = [];
        let oneEntry = "";
        let quoted = "";
        badNews = false;
        let test = false;
        console.log("My test");
        for (let i = 0; i < text.length; i++) {
            oneEntry += text[i];
            if (!inQuotes) {
                switch (text[i]) {
                    case '"': inQuotes = true; break;
                    case '{': level++; //console.log("up:" + level);
                        // console.log(oneEntry);
                        break;
                    case '}': level--;
                        // console.log("down:" + level); console.log(oneEntry);
                        if (level < 0) {
                            console.log("Error in conversion");
                            console.log(oneEntry);
                            exit(-1);
                        }
                        if (level === 0) {
                            //    console.log("Writing size " + oneEntry.length);
                            subfiles.push(oneEntry);
                            oneEntry = "";
                        } break;
                    default: break;
                }
            }
            else {
                //  if (text[i] === '@') { badNews = true; }

                if (!badNews) {
                    if (text[i] === '"' && text[i - 1] !== '/') { inQuotes = false; }
                } else {
                    if (text[i] == '{') badNews = false;
                    else {
                        oneEntry = oneEntry.slice(0, -1);
                    }
                }
            }
        }

        console.log("Num SubFiles " + subfiles.length);
        for (let i = 0; i < subfiles.length; i++) {
            try {

                json = JSON.parse(subfiles[i]);


                if (json.flags.MAGICWORD.hash) {

                    let outfile = path.join(__dirname, 'public', 'CompendiumFiles', json.flags.plutonium.hash + ".json");

                    await fs.writeFile(outfile, subfiles[i], (err) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("File written successfully\n");
                            console.log("The written has the following contents:");
                            //  console.log(fs.readFileSync("books.txt", "utf8"));
                        }
                    });

                    let tagsSource = json.flags.MAGICWORD;
                    let tags = {
                        file: tagsSource.hash + '.json',
                        page: tagsSource.page,
                        source: tagsSource.source,
                        droppable: tagsSource.propDroppable,
                        type: json.type,
                        name: json.name,
                        img: json.img,
                    };
                    let outfile2 = path.join(path.join(__dirname, 'public', 'Compendium', "tag_" + json.flags.plutonium.hash + ".json"));


                    fs.writeFile(outfile2, JSON.stringify(tags), (err) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("File written successfully\n");
                            console.log("The written has the following contents: %o", tags);
                            //  console.log(fs.readFileSync("books.txt", "utf8"));
                        }
                    });
                }
            }
            catch (err) {
                console.error("error parsing json ( " + err + "+)" + json.flags.plutonium.hash);
            }


        }


    }
}

doit();
