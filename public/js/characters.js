/// todo: need to clean these out as you close windows
var registeredThings = {};
var registeredSheets = {};
var sheetDependencies = null;
// preload
ensureSheetLoaded("itemSummary");


function ClickCollapsible(evt) {

    console.log(evt);
    let s = evt.currentTarget.nextSibling.style;

    if (s.visibility === "hidden") {
        s.visibility = "visible";
    } else {
        s.visibility = "hidden";
    }

}

function Collapsible(text) {
    return '<button  onclick="ClickCollapsible(event)">' + text + ' </button>';
}

// format a number as +N or -N
function signed(num) {
    let n = Number(num);
    if (n > 0)
        return "+" + n;
    else if (n < 0)
        return n;
    else return "+0";  // you can have -0
}

function details(s) {
    let array = [];
    let keys = Object.keys(s);

    keys.forEach((key, index) => {

        if (s[key] && s[key] != "") {
            array.push(s[key]);
        }
    });
    return array;
}

function commaString(array) {
    let text = "";
    let first = true;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === null) continue;
        if (!first) text += ", ";
        first = false;
        text += array[i];
    }
    return text;
}
function span(title, contents, classname) {
    if (!classname)
        return "<span>" + title + "</span>" + contents;
    return "<span class=" + classname + "> " + a + "</span > " + b;

}
// returns x or stringo or ""
function maybe(x, stringo) {

    if (x) return (stringo ? stringo : x);
    else return "";

};

function SanitizeSlashes(a) {
    a.replace('\\', '/');
    return a;
}

async function ensureThingLoaded(thingName, instance) {

    thingName = SanitizeSlashes(thingName);
    console.log(thingName);
    if (!registeredThings[thingName + instance]) {
        let file = thingName.endsWith('.json') ? thingName : thingName + '.json';

        console.log(file);

        try {
            response = await fetch(file);
            const thing = await response.json();
            thing.id = SanitizeSlashes(thingName + instance);


            registeredThings[thingName + instance] = thing;

            thing.acceptDrag = dragCareersAndItems; // todo do better

            console.log("OK");

        } catch (err) {
            console.log(err + ". Unable to fetch " + thingName + 'json');
        }
    }


    thing = registeredThings[thingName + instance];
    if (thing === undefined) throw ("Could not load");
    try {
        let promises = [];
        if (thing.items) {
            // promises.push(ensureSheetLoaded("itemSummary"));
            for (let i = 0; i < thing.items.length; i++) {
                if (thing.items[i].file) {
                    console.log(thing.items[i].file);
                    promises.push(EnsureLoaded(thing.items[i].page, thing.items[i].file, instance));
                }
            }

        }
        if (thing?.system?.feats) { // should combine with items
            for (let i = 0; i < thing.system.feats.length; i++) {
                promises.push(EnsureLoaded("items", "CompendiumFiles/" + thing.system.feats[i], instance));
            }

        }
        await Promise.all(promises);
        console.log(promises);

    } catch (err) {
        console.log(err + ". Unable to fetch " + thingName + 'json');
    }

    return thing;

}
async function ensureSheetLoaded(sheetName) {
    if (!registeredSheets[sheetName]) {
        let js, curfile;
        try {
            if (sheetDependencies == null);
            // load sheet and js (change to promise all) for speed) for this sheet
            let response = await fetch("./Sheets/dependencies.json"); // TODO dont hardcode name
            let dependencies = await response.json();
            if (dependencies[sheetName]) {
                let depends = dependencies[sheetName];
                for (let d = 0; d < depends.length; d++) {
                    curfile = depends[d];
                    let response = await fetch("./Sheets/" + depends[d]);
                    if (depends[d].endsWith('.js')) {
                        js = await response.text();
                        eval(js);
                    }
                    else if (depends[d].endsWith('.html')) {
                        const text = await response.text();
                        js = "";
                        registeredSheets[depends[d].slice(0, depends[d].length - 5)] = text;
                    }
                }
            }
            response = await fetch("./Sheets/" + sheetName + ".html");
            const text = await response.text();

            registeredSheets[sheetName] = text;
        } catch (error) {
            console.error("Could not load " + sheetName + " " + error + "\n" + error.stack);
            alert("Could not load " + curfile + " " + error);
        }

    }
}

async function EnsureLoaded(sheetName, thingName, instance) {


    let promise = ensureThingLoaded(thingName, instance);
    let promise2 = ensureSheetLoaded(sheetName);
    await Promise.all([promise, promise2]);


}

// change this log.
// each editable will have a thing id
// and a field id

function changeSheet(button) {
    let id = button.dataset.thingid; // the window id is window_fullthingname
    let clause = button.dataset.clause; // the window id is window_fullthingname
    let evaluation = clause + ' = ' + button.value;
    console.log('id is ' + id);
    console.log('evaluation is ' + evaluation);
    socket.emit('change', {
        change: evaluation,
        thing: id
    })

    // if (!typeof button.value === "string") { // no should be if button.value evaluates to number
    //     eval(button.id + ' = ' + button.value);  // the button id is code like thing.strength.value
    //     socket.emit('change', {
    //         change: button.id + ' = ' + button.value,
    //         thing: id
    //     })
    // } else {
    //     let t = button.value.replace(/\"/g, '\''); // double quotes to single quotes
    //     eval(button.id + ' = "' + t + '"');  // the button id is code like thing.strength.value
    //     socket.emit('change', {
    //         change: button.id + ' = "' + t + '"',
    //         thing: id
    //     })
    // };

    // do do this displayThing should be called after network round trip
    // server should not do eval so server update has to be different, or it could evaluate the incoming thing
    // to be only characters and dots



}

function Editable(thing, clause, className, listName) { // thing must be here because the eval might use it
    let t = eval(clause);

    let id = thing.id;

    if (listName != undefined) {
        return '<input list="' + listName + '" class="' + className + '" data-clause="' + clause + '"  data-thingid="' + id + '" value="' + t +
            '" onchange="changeSheet(this)">';


    } else
        return '<input class="' + className + '" type="text" data-clause="' + clause + '"  data-thingid="' + id + '" value="' + t +
            '" onchange="changeSheet(this)">';
}


async function showThing(name, instance, sheet) {
    //  then get the sheet
    let key = SanitizeSlashes(name + instance);

    await EnsureLoaded(sheet, key, instance);


    displayThing(key, sheet);
}

async function UpdateNPC(change) {

    if (!registeredThings[change.thing]) {
        return; //  NPC has never been opened
    }
    let thing = registeredThings[change.thing];
    eval(change.change);
    w = windowShowing(change.thing);
    if (w) {

        displayThing(change.thing, w.sheet);
    }

}

async function AddItemToNPC(change) {

    if (!registeredThings[change.thing]) {
        return; //  NPC has never been opened
    }
    let thing = registeredThings[change.thing];
    thing.items.push(change.item);
    console.log("Add item to npc");
    w = windowShowing(change.thing);
    if (w) {
        displayThing(change.thing, w.sheet);
    }

}

function parseSheet(thing, sheetName, w, owner) { // thing and w and owner are  required by evals, w or owner can be undefined
    let text = `${registeredSheets[sheetName]}`; // makes a copy to destroy the copy,  TODO: maybe should make structure context
    let newText = "";
    let state = 0;
    let code = "";
    for (let i = 0; i < text.length; i++) {

        switch (state) {
            case 0:
                if (text[i] == '@') { newText = ""; break; };
                if (text[i] == '{') { state = 1; code = ""; }
                else if (text[i] == '}') throw new Error("Mismatched '} fileSOFar: " + newText + "\ncodeBeingEvaluated " + code);
                else newText += text[i];
                break;
            default:
                if (text[i] == '}') {
                    state--;
                    if (state == 0) {
                        try {
                            console.log("Eval " + code);
                            newText += eval(code);
                        } catch (error) {
                            throw new Error(error + "  fileSOFar: " + newText + "\ncodeBeingEvaluated " + error.stack + "\n" + code);
                        }
                    }
                    else {
                        code += '}';
                    }
                } else if (text[i] == '{') {
                    state++; code += '{';
                } else {
                    code += text[i];
                }
        }
    }
    return newText;
}


async function displayThing(fullthingname, sheetName) {

    /// TODO: needs to save and restore any scrolling or window resizing
    console.log(fullthingname);


    fullthingname = SanitizeSlashes(fullthingname);
    let w = createOrGetWindow(fullthingname, 0.4, 0.4, 0.3, 0.3); // todo better window placement

    w.sheet = sheetName;



    let thing = registeredThings[fullthingname]
    let body = document.getElementById("window_" + fullthingname + "_body");
    body.innerHTML = parseSheet(thing, sheetName, w, undefined);

    let draggables = body.getElementsByClassName("dragitem");
    for (let i = 0; i < draggables.length; i++) {
        dragDrop(draggables.item(i), {});
        draggables.item(i).acceptDrag = (thingDragged, event) => {
            if (thing.acceptDrag) {
                thing.acceptDrag(thingDragged, event);
            }
        };
    }
}


