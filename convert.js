
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

function writeJsonFileInPublic(dir, fileName, json) {

    try {
        let pathName = path.join(__dirname, 'public', dir, fileName + '.json');

        rawfs.writeFileSync(pathName, JSON.stringify(json));

    } catch (err) {
        console.log(err + " Error with " + dir + " " + fileName);
    }
}

const EnsureDestinationExists = async (fullFilePath) => {

    let dir = path.dirname(path.normalize(fullFilePath));
    if (rawfs.existsSync(dir)) return;
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error("Error making directory " + dir, error);
    }

}

function cleanFileName(destString) {
    // just path a name, not a path
    destString = destString.replaceAll(" ", "_");
    destString = destString.replaceAll("%20%", "_");
    destString = destString.replaceAll("%2b%", "_plus_");
    destString = destString.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return destString;
}

function cleanPath(destString) {
    // just path a name, not a path 
    destString = destString.replaceAll(" ", "_");
    destString = destString.replaceAll("%20%", "_");
    destString = destString.replaceAll("%2b%", "_plus_");
    return destString;
}

function nameOk(name) {
    // stupid data has "null" in some fields as a string
    return name != "null" && name != null && name != undefined && name != "";
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
//

async function readDir(dir) {
    const files = await fs.readdir(path.normalize(dir), { recursive: true });
    const entries = files.map((filename) => path.normalize(`${dir}/${filename}`));
    return entries;
}

let imgExtension = {};
imgExtension[".webp"] = true;
imgExtension[".jpg"] = true;
imgExtension[".jpeg"] = true;
imgExtension[".gif"] = true;
imgExtension[".png"] = true;
imgExtension[".svg"] = true;

let sourceImages = [];
let sourceBaseNames = [];
let founds = {};
//

function reverseString(str) {
    return str.split("").reverse().join("");
}

function binarySearch(arr, el, compare_fn) {
    let m = 0;
    let n = arr.length - 1;
    let tabs = "";
    while (m <= n) {
        let k = (n + m) >> 1;
        let cmp = compare_fn(el, arr[k]);
        if (cmp > 0) {
            m = k + 1;
        } else if (cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return ~m;
}

async function findSource(inputPath, recur = 0) {


    if (founds[inputPath]) return founds[inputPath];


    let reversed = reverseString(inputPath);

    if (sourceImages.length == 0) {

        let files = await readDir("C:/Users/gcolg/AppData/Local/FoundryVTT/Data");

        sourceImages = files;
        files = await readDir("C:/Program Files/FoundryVTT/resources/app/public");
        sourceImages = sourceImages.concat(files);


        sourceImages = sourceImages.filter(file => {
            return imgExtension[path.extname(file).toLowerCase()] === true;
        });

        for (let i = 0; i < sourceImages.length; i++) {

            sourceImages[i] = reverseString(sourceImages[i]);
        }

        sourceImages = sourceImages.sort(function (a, b) {
            return a.localeCompare(b);
        });

        for (let i = 0; i < sourceImages.length; i++) {

            sourceBaseNames.push(path.basename(reverseString(sourceImages[i])));
        }
        console.log(sourceImages);
    }

    let best = 0; let answer = -1;
    let i = binarySearch(sourceImages, reversed, function (a, b) {
        let c = b.substring(0, a.length);
        return a.localeCompare(c);
    })

    if (i >= 0) {
        return reverseString(sourceImages[i]);
    }
    console.log("No exact match " + inputPath);

    let baseName = path.basename(inputPath)

    for (let i = 0; i < sourceBaseNames.length; i++) {
        let res = stringSimilarity(sourceBaseNames[i], baseName);
        if (res > best) {
            best = res;
            answer = i;
            if (best >= 0.9999999999999999) break;
        }
    }

    if (answer >= 0) {
        let resultPath = reverseString(sourceImages[answer]);
        console.log(inputPath + " " + best + " " + resultPath)
        founds[inputPath] = resultPath;
        return resultPath;
    }
    founds[inputPath] = "";

    return "";
}



async function processImage(imagePath, tagsSource) {
    if (imagePath.startsWith("http")) {

        const fileType = path.extname(imagePath);
        if (!tagsSource) tagsSource = {};
        if (!tagsSource?.hash) {
            tagsSource.hash = path.normalize(imagePath.substring(6));
        }
        let destFile = tagsSource?.hash;
        destFile = cleanFileName(destFile);
        destFile = path.normalize(path.join(__dirname, 'public', 'images', 'fetched', destFile + fileType));
        let relativeName = path.normalize(path.join('images', 'fetched', tagsSource.hash + fileType));
        if (!rawfs.existsSync(destFile)) {

            try {
                let response = await fetch(imagePath);
                //  console.log(imagePath);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                //  console.log(fileType);


                await EnsureDestinationExists(destFile);
                //  console.log("Would copy " + imagePath + " to " + destFile);

                await rawfs.createWriteStream(destFile).write(buffer);
                return FixSlashes(relativeName);

            }

            catch (error) {
                console.log(error, "Cannot fetch " + imagePath);
                return "";
            }
        } else {
            return FixSlashes(relativeName);
        }
    } else {

        let a = path.normalize(imagePath);
        sourceFile = await findSource(a, 0);
        if (!(nameOk(sourceFile))) {
            console.error("Cannot find " + a);
            return "";
        }
        a = cleanPath(a);
        let relativeName = path.normalize(path.join('images', a));
        let destFile = path.normalize(path.join(__dirname, 'public', 'images', a));
        if (typeof destFile != "string") throw ("WTF1");
        if (!rawfs.existsSync(destFile)) {

            await EnsureDestinationExists(destFile);

            try {
                await fs.copyFile(sourceFile, destFile);
                //  console.log("Would copy " + sourceFile + " to " + destFile);
            } catch (error) { console.log("Error Could not copy ", '"' + sourceFile + '"', " to ", '"' + destFile + '"'); }
            let a = FixSlashes(relativeName);
            if (typeof a != "string") throw ("WTF3");
            return a;

        } else {
            let a = FixSlashes(relativeName);
            if (typeof a != "string") throw ("WTF5");
            return a;
        }


    }

}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function FixSlashes(a) {
    a = a.replaceAll("\\", "/"); // replaces \ with /
    a = a.replaceAll("//", "/"); // replaces // with /
    return a;
}

async function doit() {
    //await fsExtra.emptyDir(path.join(__dirname, 'public', 'Compendium'));
    //await fsExtra.emptyDir(path.join(__dirname, 'public', 'CompendiumFiles'));
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
        let last = 0;
        let audit = false;
        for (let fileIndex = 0; fileIndex < subfiles.length; fileIndex++) {
            if (fileIndex > last + 50) { console.log(fileIndex + " of " + subfiles.length); last = fileIndex; audit = true; }
            try {
                json = JSON.parse(subfiles[fileIndex]);
                let tagsSource = json?.flags?.plutonium;
                if (audit) console.log(tagsSource.page);

                if (tagsSource) {
                    if (!tagsSource.hash)
                        tagsSource.hash = uuidv4();


                    tagsSource.hash = cleanFileName(tagsSource.hash);
                    if (json.img) {
                        json.img = await processImage(json.img, tagsSource);
                    }

                    if (json?.prototypeToken) {


                        let t = json.prototypeToken;


                        let token = {};
                        if (t.texture.src) {
                            t.texture.src = await processImage(t.texture.src);
                            // todo, design tokens

                        }
                    }

                    if (audit) console.log(tagsSource.page);
                    tagsSource.hash = cleanFileName(tagsSource.hash);
                    if (audit) console.log(tagsSource.page);
                    tagsSource.page = path.parse(tagsSource.page).name;
                    if (audit) console.log(tagsSource.page);
                    tagsSource.image = json.img;
                    tagsSource.prototypeToken = json.protoTypeToken;
                    json.protoTypeToken = undefined;
                    let name = json.name;
                    if (json.system.requirements) {
                        name += " : " + json.system.requirements;
                    } else {
                        name += " (" + tagsSource.page + ")";
                    }
                    /// change to split items off, change to have sheets load items, so that items are not embedded
                    audit = false;
                    if (json.items) {
                        for (let i = 0; i < json.items.length; i++) {
                            let item = json.items[i];
                            let subFile = tagsSource.hash + '_MITEM_' + (item.name);
                            subFile = cleanFileName(subFile);
                            item.img = processImage(item.img);

                            let tags = {
                                file: "CompendiumFiles/" + subFile,
                                page: "itemSummary",
                                source: item.source,
                                droppable: item.propDroppable,
                                type: item.type,
                                name: item.name,
                                img: item.img,
                            };

                            writeJsonFileInPublic('Compendium', "tag_" + subFile, tags);
                            writeJsonFileInPublic('CompendiumFiles', subFile, item);

                            json.items[i] = tags;

                        }
                    }

                    let tags = {
                        file: "CompendiumFiles/" + tagsSource.hash,
                        page: tagsSource.page,
                        source: tagsSource.source,
                        //droppable: tagsSource.propDroppable,
                        type: json.type,
                        name: json.name,
                        img: json.img,
                        prototypeToken: tagsSource.prototypeToken
                    };
                    //     console.log("ptype1 " + tagsSource.prototypeToken);

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
