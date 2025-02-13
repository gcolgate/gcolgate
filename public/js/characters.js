import { createOrGetWindow, windowShowing, fetchRealWindow } from './window.js';
import { dragDrop } from './drag.js';
import { dragCareersAndItems, sumCareerFeats } from './ptba.js';
import { socket } from './main.js';
import { calculate } from './calculator.js';

function SanitizeNonAlphanumeric(id) {

    return id.replace(/[^a-z0-9]/gi, '');

}
/// todo: need to clean these out as you close windows
var registeredThings = {};

export function GetRegisteredThing(path) {
    return registeredThings[SanitizeSlashes(path)];
}
export function SetRegisteredThing(path, thing) {
    let index = SanitizeSlashes(path);
    registeredThings[index] = thing;
    thing.registeredId = index;
    return thing;
}


export function MakeAvailableToHtml(fnName, fn) {
    window[fnName] = fn;
    htmlContext[fnName] = fn;
}

// export function MakeAvailableToPopup(fName, fn) {

//     popupContent[fnName] = fn;

// }

export function MakeAvailableToParser(fnName, fn) { // for now use window, soon make array
    window[fnName] = fn;
}

var registeredSheets = {};
var sheetDependencies = null;
// preload
ensureSheetLoaded("hud");
ensureSheetLoaded("tooltip_hud");
ensureSheetLoaded("itemSummary");
ensureSheetLoaded("spell_chat");
ensureSheetLoaded("spell_tooltip");
ensureSheetLoaded("weapon_tooltip");
ensureSheetLoaded("moveroll");
ensureSheetLoaded("feats");

function ClickCollapsible(evt, ownerid, id) {


    let s = evt.currentTarget.nextSibling.style;

    if (s.maxHeight === "0px") {
        s.maxHeight = "100%";
        s.visibility = "visible";
        socket.emit('change', {
            change: 'ensureExists (thing, template, "notCollapsed"); thing.notCollapsed[ "' + id + '"] = true',
            thing: ownerid
        });

    } else {
        s.maxHeight = "0px";
        s.visibilitiy = false;
        s.visibility = "hidden";
        socket.emit('change', {
            change: 'ensureExists (thing, template, "notCollapsed"); thing.notCollapsed[ "' + id + '"] = false',
            thing: ownerid
        });
    }

}
MakeAvailableToHtml('ClickCollapsible', ClickCollapsible);

function Collapsible(text, owner, thing) {
    let shown = false;
    let id = SanitizeNonAlphanumeric(thing.id);

    if (!owner) return "";
    else
        if (owner.notCollapsed)
            shown = owner.notCollapsed[id];

    let a = '<button class=lbl-collapsible-toggle ' +
        ' onclick="htmlContext.ClickCollapsible(event, \'' + owner.id + '\',\'' + id + '\')">' + text + ' </button>';
    a += (shown ? '<div style="max-height:100%" visibility:visible>' : '<div style="max-height:0px; visibility:hidden">');

    return a;
}
MakeAvailableToParser('Collapsible', Collapsible);

function EndCollapsible() {
    return '</div>';
}
MakeAvailableToParser('EndCollapsible', EndCollapsible);


function cyrb53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// function constructInnocuousId(prefix, s) {

//     return '"' + prefix + cyrb53(s).toString() + '"';
// }

// format a number as +N or -N
export function signed(num) {
    let n = Number(num);
    if (n > 0)
        return "+" + n;
    else if (n < 0)
        return n;
    else return "+0";  // you can have -0
}

export function details(s) {
    let array = [];
    let keys = Object.keys(s);

    keys.forEach((key, index) => {

        if (s[key] && s[key] != "") {
            array.push(s[key]);
        }
    });
    return array;
}

export function commaString(array) {
    let text = "";
    let first = true;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === null) continue;
        if (!first) text += ", ";
        first = false;
        text += array[i];
    }
    return chkDiv(text);
}
export function span(title, contents, classname) {
    if (!classname)
        return "<span>" + title + "</span>" + contents;
    return "<span class=" + classname + "> " + title + "</span > " + contents;

}
// returns x or stringo or ""
function maybe(x, stringo) {

    if (x) return (stringo ? stringo : x);
    else return "";

};

function SanitizeSlashes(a) {
    a.replace('\\', '/');
    a.replace('//', '/');
    return a;
}

function construct_fetch_path(thingName, ext) {
    let s = SanitizeSlashes(thingName);
    if (!s.startsWith('./')) {
        if (!s.startsWith('/')) s = '/' + s;
        if (!s.startsWith('.')) s = '.' + s;
    }
    if (!s.endsWith(ext)) s += ext;
    return s;
}
export async function ensureThingLoadedElem(thingName, id) {
    await ensureThingLoaded(thingName);
    return id;
}

export async function ensureThingLoaded(thingName) {

    let file;
    if (!GetRegisteredThing(thingName)) {
        file = construct_fetch_path(thingName, '.json');

        console.log(file);
        try {
            let response = await fetch(file);
            //  console.log("Fetched " + file);
            let thing = await response.json();
            // console.log("json " + file);
            thing.id = (thingName);

            if (thing.template) {
                let response = await fetch(thing.template);
                const t = await response.json();
                thing.origValue = t;
                thing = { ...t, ...thing };
            }


            SetRegisteredThing(thingName, thing);

            thing.acceptDrag = dragCareersAndItems; // todo do better



        } catch (err) {
            console.log(err + ". Unable to fetch " + file);
        }
    }


    let thing = GetRegisteredThing(thingName);
    try {
        if (thing === undefined) throw ("Could not load " + file);
        let promises = [];
        if (thing.items) {
            // promises.push(ensureSheetLoaded("itemSummary"));
            for (let i = 0; i < thing.items.length; i++) {
                console.log("Adding thingie" + i + " " + thing.items[i].file);
                if (thing.items[i].file) {
                    console.log(thing.items[i].file);
                    promises.push(EnsureLoaded(thing.items[i].page, thing.items[i].file));
                }
            }

        }
        if (thing?.feats != undefined) { // should combine with items
            for (let i = 0; i < thing.feats.length; i++) {
                console.log("Adding feat" + i + " " + thing.feats[i]);
                promises.push(EnsureLoaded("items", "CompendiumFiles/" + thing.feats[i]));
            }

        }
        await Promise.all(promises);


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

async function EnsureLoaded(sheetName, thingName) {

    let promise = ensureThingLoaded(thingName);
    let promise2 = ensureSheetLoaded(sheetName);
    await Promise.all([promise, promise2]);


}

// change this log.
// each editable will have a thing id
// and a field id


export function emitChange(id, evaluation) {

    socket.emit('change', {
        change: evaluation,
        thing: id
    })

}
MakeAvailableToParser('emitChange', emitChange);
MakeAvailableToHtml('emitChange', emitChange);

function SanitizeText(x) {
    return JSON.stringify(x).slice(1, -1); // does not fix ' but fixes " so use " when building these
}

function SanitizeNum(x) {
    return JSON.stringify(x).slice(1, -1); // does not fix ' but fixes " so use " when building these
}

function changeSheetNum(button) {

    let id = button.dataset.thingid; // the window id is window_fullthingname
    console.log(id);
    if (!button.innterHTML) button.innterHTML = "0";
    let clause = button.dataset.clause; // the window id is window_fullthingname
    let evaluation = clause + ' = ' + calculate(button.innerHTML);
    console.log(clause);
    console.log(evaluation);

    socket.emit('change', {
        change: evaluation,
        thing: id
    })


}
MakeAvailableToParser('changeSheetNum', changeSheetNum);
MakeAvailableToHtml('changeSheetNum', changeSheetNum);

function changeSheet(button) {
    let id = button.dataset.thingid; // the window id is window_fullthingname
    console.log(id);
    let clause = button.dataset.clause; // the window id is window_fullthingname
    let evaluation = clause + ' = "' + SanitizeText(button.innerHTML) + '"';
    console.log(clause);
    console.log(evaluation);

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
MakeAvailableToParser('changeSheet', changeSheet);
MakeAvailableToHtml('changeSheet', changeSheet);


async function ChangeName(button) {

    // let thing = GetRegisteredThing(change.thing);
    // if (!thing) {
    //     return; //  NPC has never been opened
    // }

    let id = button.dataset.thingid; // the window id is window_fullthingname
    let newName = button.value;


    let split = id.split('/');

    socket.emit('changeName', { dir: split[0], thingName: split[1], newName: newName });
}
MakeAvailableToHtml('ChangeName', ChangeName);

function DrawArray(array) {

    let s = "";
    if (!array) return s;
    for (let i = 0; i < array.length; i++) {
        s += array[i] + " ";
    }
    return s;

}

MakeAvailableToHtml('DrawArray', DrawArray);

function DrawImageArray(dir, array, ext) {

    let s = "";
    for (let i = 0; i < array.length; i++) {
        s += ' <img src="' + dir + array[i] + ext + '" width="48" height="48")> </img>'
    }
    return s;

}

MakeAvailableToHtml('DrawImageArray', DrawImageArray);

function HandleEnter(event, button) {
    if (event.keyCode == 13) {
        changeSheetNum(button);
        event.stopPropagation();
    }
}

MakeAvailableToHtml('HandleEnter', HandleEnter);

export function Editable(thing, clause, className, listName) { // thing must be here because the eval might use it
    console.log("clause " + clause);
    let t = eval(clause);

    let id = thing.id;

    if (className.includes("npcNum") || className.includes("numeric")) { // if numeric, don't allow bold, italic, etc.
        if (listName != undefined) {
            return '<div contenteditable="true" ' +
                'tabindex="0" ' +
                'onkeydown="htmlContext.HandleEnter(event,this)" ' +
                'list="' + listName + '" class="' + className + '" ' +
                'data-clause="' + clause + '"  data-thingid="' + id + '"' +
                'onfocusout="htmlContext.changeSheetNum(this)">' + t + ' </div>';
        }
        return '<div contenteditable="true" ' +
            'class="' + className + '" type="text" data-clause="' + clause + '"  data-thingid="' + id + '" ' +
            'tabindex="0" onfocusout="htmlContext.changeSheetNum(this)" ' +
            'onkeydown="htmlContext.HandleEnter(event,this)" >' + t + ' </div>';
    }

    // if (className.includes("npcNum") || className.includes("numeric")) { // if numeric, don't allow bold, italic, etc.
    //     if (listName != undefined) {
    //         return '<input list="' + listName + '" class="' + className + '" data-clause="' + clause + '"  data-thingid="' + id + '" value="' + t +
    //             '" onchange="htmlContext.changeSheetNum(this)">';
    //     }
    //     return '<input class="' + className + '" type="text" data-clause="' + clause + '"  data-thingid="' + id + '" value="' + t +
    //         '" onchange="htmlContext.changeSheetNum(this)">';
    // }
    if (listName != undefined) {
        return '<div contenteditable list="' + listName + '" class="' + className + '" data-clause="' + clause + '"  data-thingid="' + id + ' onfocusout="htmlContext.changeSheet(this)">' + t + ' </div>';
    }
    return '<div contenteditable class="' + className + '" type="text" data-clause="' + clause + '"  data-thingid="' + id +
        '" onfocusout="htmlContext.changeSheet(this)">' + t + ' </div>';
}
MakeAvailableToParser('Editable', Editable);


// function MultilineEditText(thing, clause, className, rows, columns) { // thing must be here because the eval might use it
//     let t = eval(clause);

//     let id = thing.id;
//     return '<textarea class="' + className + '" type="text"  cols="' + columns + '" rows="' + rows + '" data-clause="' + clause + '"  data-thingid="' + id +
//         '" onchange="htmlContext.changeSheet(this)">' + t + '</textarea>';
// }


export async function showThing(name, sheet, editMode) {
    //  then get the sheet
    let key = SanitizeSlashes(name);

    let s = sheet;
    if (editMode) s = sheet + "_edit";

    await EnsureLoaded(s, key);


    displayThing(key, s);
}

function showThingInline(thing, sheet) {
    //  then get the sheet
    let key = SanitizeSlashes(name);

    //   EnsureLoaded(sheet, key).then(np


    return parseSheet(thing, sheet, undefined, undefined);

}

function ParentId(id) {
    // todo, using _ in names would break this
    let index = id.indexOf("_");
    return id.substring(0, index);

}

export async function UpdateNPC(change) {

    let thing = GetRegisteredThing(change.thing);
    if (!thing) {
        return; //  NPC has never been opened
    }
    let template = thing.origValue;
    eval(change.change);
    let id = thing.owner ? thing.owner : thing.registeredId;


    let w = windowShowing(thing.registeredId);
    if (w) {
        await EnsureLoaded(w.sheet, thing.registeredId);
        displayThing(thing.registeredId, w.sheet);
    }
    if (thing.owner) {
        w = windowShowing(thing.owner);
        if (w) {
            await EnsureLoaded(w.sheet, thing.owner);
            displayThing(thing.owner, w.sheet);
        }
    }
}

export async function RedrawWindow(thing) {

    let w = windowShowing(thing.registeredId); // GIL thing.id?
    if (w) {
        displayThing(thing.registeredId, w.sheet);
    }

}

export async function AddItemToNPC(change) {

    let thing = GetRegisteredThing(change.thing);
    if (!thing) {
        return; //  NPC has never been opened
    }
    thing.items.push(change.item); // GIL thing.id?
    console.log("Add item to npc");
    let w = windowShowing(thing.registeredId);
    if (w) {
        await EnsureLoaded(w.sheet, thing.registeredId);

        displayThing(thing.registeredId, w.sheet);
    }

}

export async function RemoveFromNPC(change) {
    let thing = GetRegisteredThing(change.thingId);
    if (!thing) {
        return; //  NPC has never been opened
    }

    if (thing.items) {
        for (let i = 0; i < thing.items.length; i++) {
            if (thing.items[i].file == change.itemId) {
                thing.items.splice(i, 1);
                break;
            }
        }
    }

    let w = windowShowing(thing.registeredId);
    if (w) {
        displayThing(thing.registeredId, w.sheet);
    }

}

function isToken(text, i, token) {

    let tok = text.substring(i, token.length);
    return (tok == token)
}

export function parseSheet(thing, sheetName, w, owner, notes, additionalParms) { // thing and w and owner are  required by evals, w or owner can be undefined
    let text = `${registeredSheets[sheetName]}`; // makes a copy to destroy the copy,  TODO: maybe should make structure context
    let newText = "";
    let state = 0;
    let code = "";
    console.log("NOTES ", notes);
    for (let i = 0; i < text.length; i++) {

        switch (state) {
            case 0:
                let nextOne = text[i];
                // remove these characters they cause problems down the line
                if (nextOne == '\n' || nextOne == '\r') {
                    newText += ' ';
                    break;
                }
                // remove comments by going to state 2
                if (isToken(text, i, '<!--')) {
                    state = -1;
                }
                else {
                    // I don't remember why these are bad, I didn't comment before
                    // if (nextOne == '@') {
                    //     newText = ""; break;
                    // }
                    // let nextTwo = text.substring(i, i + 1);
                    // if (nextTwo == "{{") {
                    //     newText += '{';
                    //     i++;
                    //     break;
                    // }
                    // if (nextTwo == "}}") {
                    //     newText += '}';
                    //     i++;
                    //     break;
                    // }
                    // if it is code we want to execute, got to steate 1
                    if (nextOne == '{') {
                        if (text[i + 1] === '{') {
                            newText += '{';
                            i = i + 1;
                        } else {
                            state = 1; code = "";
                        }
                    }
                    // assert for mismatched }
                    else if (nextOne == '}') {
                        if (text[i + 1] === '}') {
                            newText += '}';
                            i = i + 1;
                        } else {
                            throw new Error("Mismatched '} fileSOFar: " + newText + "\ncodeBeingEvaluated " + code);
                        }
                    }
                    else newText += nextOne;
                }
                break;
            case -1:
                if (isToken(text, i, '-->')) state = 0; // comment
                break;

            default: // states go >1 in recursive code blocks
                // remove these characters they cause problems down the line
                if (text[i] == '\n' || text[i] == '\r') {
                    code += ' ';
                    break;
                }
                // reach end of code block
                if (text[i] == '}') {

                    if (text[i + 1] === '}') { // not a real code block
                        newText += '}';
                        i = i + 1;
                        continue;
                    }
                    state--;
                    if (state == 0) {
                        //  try {

                        newText += eval(code);


                        //   } catch (error) {
                        //       throw new Error(error + "  fileSOFar: " + newText + "\ncodeBeingEvaluated " + error.stack + "\n" + code);
                        //   }
                    }
                    else {
                        code += '}';
                    }
                } else if (text[i] == '{') {
                    state++; code += '{'; // recusive code block
                } else {
                    code += text[i];
                }
        }
    }

    return newText;
}

async function displayThing(fullthingname, sheetName) {

    /// TODO: needs to save and restore any scrolling or window resizing
    fullthingname = SanitizeSlashes(fullthingname);
    let w = createOrGetWindow(fullthingname, 0.6, 0.4, 0.3, 0.3, true, true); // todo better window placement
    if (w.when_closed) w.when_closed();
    w.sheet = sheetName;
    let rw = fetchRealWindow(fullthingname);
    if (!rw)
        w.style.visibility = "visible";

    let thing = GetRegisteredThing(fullthingname);
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

export function formatRemoveButton(ownerid, itemid) {
    return "<img class='image-holder' src='Sheets/trashcan.png' width='16' height='16' onclick=htmlContext.RemoveItemFromThing('" + ownerid + "','" + itemid + "')  </img>";
}

function LineOfCareer(owner, thing, notes) {
    if (!thing) return "";
    if (notes == undefined && owner != undefined)
        return div(
            div(Editable(thing, "thing.name", "itemsetheadershort crit")) +
            div(span("Level ", Editable(thing, "thing.owner_level", "npcNum shortwidth"), "crit")) +
            div(span("Feats chosen", " " + sumCareerFeats(thing) + "/" + thing.owner_level, "shortwidth coloring basicFont bodyText crit")) +
            //  div(span("CP spent", Editable(thing, "thing.owner_careerPointsSpent", "shortwidth coloring basicFont bodyText crit"), "crit")) +
            formatRemoveButton(owner.id, thing.id),
            'class="fourcolumncareers"');
    else if (notes)
        return div(
            div("Career:", 'class="basicFont italic"') +
            div(thing.name, "itemsetheadershort") +
            div(span("Level ", thing.owner_level, "shortwidth coloring basicFont bodyText crit", "crit")) +
            //  div(span("CP spent", Editable(thing, "thing.owner_careerPointsSpent", "shortwidth coloring basicFont bodyText crit"), "crit")),
            'class="fourcolumncareers2"');
    else {
        return div(
            div("Career:", 'class="basicFont italic"') +
            div(thing.name, "itemsetheadershort"));


    }
}
MakeAvailableToHtml('LineOfCareer', LineOfCareer);


// recover tooltip that has been refreshed from the server while the tooltup
// was opened and been reassigned 'tooltip_open" class
function hidebogusTooltip(elem) {

    elem.className = "tooltip";;
}
MakeAvailableToHtml('hidebogusTooltip', hidebogusTooltip);


export function chkDiv(x, s) {



    let divfront = x.toString().split("<div");;
    let divback = x.toString().split("</div>");;

    if (divfront?.length != divback?.length) {
        console.log("Error, div_front " + divfront?.length + " vs div_back " + divback?.length);
        return "Error  div_front + " + divfront?.length + " vs div_back " + divback?.length;;
    }

    return x;
}

export function div(x, s) {
    if (s === undefined) { s = ""; }



    let divfront = x.toString().split("<div");;
    let divback = x.toString().split("</div>");;

    if (divfront?.length != divback?.length) {
        console.log("Error, div_front " + divfront?.length + " vs div_back " + divback?.length);
        return "Error  div_front + " + divfront?.length + " vs div_back " + divback?.length;;

    }

    return "<div " + s + ">" + x + "</div> ";
}