
const fs = require('fs').promises;
const rawfs = require('fs');
//const fsExtra = require('fs-extra');
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

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function writeJsonFileInPublic(dir, fileName, json) {

    try {
        let pathName = path.join(__dirname, 'public', dir, fileName + '.json');

        rawfs.writeFileSync(pathName, JSON.stringify(json));

    } catch (err) {
        console.log(err + " Error with " + dir + " " + fileName);
    }
}

// todo: put in subthing
const stringSimilarity = (a, b) =>
    _stringSimilarity(prep(a), prep(b))

const _stringSimilarity = (a, b) => {
    const bg1 = bigrams(a)
    const bg2 = bigrams(b)
    const c1 = count(bg1)
    const c2 = count(bg2)
    const combined = uniq([...bg1, ...bg2])
        .reduce((t, k) => t + (Math.min(c1[k] || 0, c2[k] || 0)), 0)
    return 2 * combined / (Math.max(bg1.length + bg2.length, 1))
}

const prep = (str) => // TODO: unicode support?
    str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ')

const bigrams = (str) =>
    [...str].slice(0, -1).map((c, i) => c + str[i + 1])

const count = (xs) =>
    xs.reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {})

const uniq = (xs) =>
    [... new Set(xs)]

async function doit() {
    //await fsExtra.emptyDir(path.join(__dirname, 'public', 'Compendium'));
    //await fsExtra.emptyDir(path.join(__dirname, 'public', 'CompendiumFiles'));
    let dir1 = await fs.readdir(path.join(__dirname, 'public', 'CompendiumFiles')); // 
    let dir = await fs.readdir(path.join(__dirname, 'public', 'toConvert2')); // 

    let xlation = {};
    for (let i = 0; i < dir1.length; i++) {
        let name = path.parse(dir1[i]).name;
        name = replaceAll(name, '20', ' ');
        name = replaceAll(name, '2c', ' of ');
        name = replaceAll(name, '2b', ' + ');
        let last = name.indexOf('_');
        if (last > 0) {
            name = name.slice(0, last);
        }
        name = name.trim();
        xlation[name] = dir1[i];
    }

    console.log("%o", dir);

    for (let i = 0; i < dir.length; i++) {

        let fname = path.join(__dirname, 'public', 'toConvert2', dir[i]);
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


        for (let fileIndex = 0; fileIndex < subfiles.length; fileIndex++) {
            try {


                json = JSON.parse(subfiles[fileIndex]);

                let nom = json.name;
                let prefixEnd = nom.indexOf(':');
                if (prefixEnd > 0) {
                    nom = nom.slice(prefixEnd + 1);
                }
                let suffixStart = nom.indexOf('(');
                if (suffixStart > 0) {
                    nom = nom.slice(0, suffixStart);
                }

                let plusStart = nom.indexOf('+');
                if (plusStart > 0) {
                    nom = nom.substr(plusStart, 2) + ' ' + nom.substr(0, plusStart);
                }
                nom = replaceAll(nom, "'", '');
                nom = replaceAll(nom, "-", '');
                nom = nom.trim();
                let best = 0; let bestString = "";
                Object.keys(xlation).forEach(key => {
                    let answer = stringSimilarity(key, nom);
                    if (answer > best) {
                        best = answer;
                        bestString = key;
                    }

                });
                if (best < 1 && best > 0.9)
                    console.log(nom + "  matches with " + bestString + " at " + best + ' and ' + xlation[bestString]);

                // if best> 0.9
                /* let tagsSource = json.flags. ;
    
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
                                 file: "CompendiumFiles\ + subFile,
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
                         file: "CompendiumFiles/" + tagsSource.hash,
                         page: tagsSource.page,
                         source: tagsSource.source,
                         droppable: tagsSource.propDroppable,
                         type: json.type,
                         name: json.name,
                         img: json.img,
                     };
    
                     writeJsonFileInPublic('Compendium', "tag_" + tagsSource.hash, tags);
                     writeJsonFileInPublic('CompendiumFiles', tagsSource.hash, json);
    
    
    
                     artGeneratorFile.push({ id: tagsSource.hash, name: json.name, type: tagsSource.type });*/





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
