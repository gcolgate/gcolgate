

//const debugfs = require('fs');
const fs = require('fs').promises;
const rawfs = require('fs');
const path = require('path');

const sanitize = require('sanitize-filename');


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

function writeJsonFileInPublic(dir, fileName, json) {

    try {
        let pathName = path.join(__dirname, 'public', dir, fileName + '.json');

        rawfs.writeFileSync(pathName, JSON.stringify(json));


    } catch (err) {
        console.log(err + " Error with " + dir + " " + fileName);
    }
}


async function doit() {
    // await fs.emptyDir(path.join(__dirname, 'public', 'Compendium'));
    //  await fs.emptyDir(path.join(__dirname, 'public', 'CompendiumFiles'));
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

        let artGeneratorFile = [];
        for (let fileIndex = 0; fileIndex < subfiles.length; fileIndex++) {
            try {

                json = JSON.parse(subfiles[fileIndex]);
                let tagsSource = json.flags.MAGIC_NUMBER;

                if (tagsSource) {

                    tagsSource.hash = tagsSource.hash.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    tagsSource.page = path.parse(tagsSource.page).name;
                    let name = json.name;
                    if (json.system.requirements) {
                        name += " : " + json.system.requirements;
                    } else {
                        name += " (" + tagsSource.page + ")";
                    }
                    /// change to split items off, change to have sheets load items, so that items are not embedded

                    if (json.items) {
                        for (let i = 0; i < json.items.length; i++) {
                            let item = json.items[i];
                            let subFile = tagsSource.hash + '_MITEM_' + (item.name);
                            subFile = subFile.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');


                            let tags = {
                                file: subFile,
                                page: "itemSummary",
                                source: item.source,
                                droppable: item.propDroppable,
                                type: item.type,
                                name: item.name,
                                img: item.img,
                            };
                            if (subFile == "adult20amethyst20dragon_ftd_MITEM_Claw") {

                                console.log(tags);
                                console.log(item);
                            }
                            writeJsonFileInPublic('Compendium', "tag_" + subFile, tags);
                            writeJsonFileInPublic('CompendiumFiles', subFile, item);

                            json.items[i] = tags;

                        }
                    }


                    let tags = {
                        file: tagsSource.hash,
                        page: tagsSource.page,
                        source: tagsSource.source,
                        droppable: tagsSource.propDroppable,
                        type: json.type,
                        name: json.name,
                        img: json.img,
                    };

                    writeJsonFileInPublic('Compendium', "tag_" + tagsSource.hash, tags);
                    writeJsonFileInPublic('CompendiumFiles', tagsSource.hash, json);



                    artGeneratorFile.push({ id: tagsSource.hash, name: json.name, type: tagsSource.type });

                };



            }
            catch (err) {
                console.error("error parsing json ( " + err + "+)");
            }

            // let outfile3 = path.join(path.join(__dirname, 'public', "artgenerator.json"));
            //  fs.writeFile(outfile3, JSON.stringify(artGeneratorFile));
        }


    }
}

doit();
