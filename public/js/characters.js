import { createOrGetWindow, windowShowing, fetchRealWindow } from './window.js';
import { dragDrop } from './drag.js';
import { dragItems } from './ptba.js';
import { socket } from './client_main.js';
import { calculate } from './calculator.js';
import { getChat } from './chat.js';

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
ensureSheetLoaded("feats_rollmove");
ensureSheetLoaded("background");

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
    let id = thing.id; //SanitizeNonAlphanumeric(thing.id);

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

function construct_fetch_path(thingName) {
    let s = SanitizeSlashes(thingName);
    if (thingName.indexOf('/') >= 0) {
        let ext = '.json';
        if (!s.startsWith('./')) {
            if (!s.startsWith('/')) s = '/' + s;
            if (!s.startsWith('.')) s = '.' + s;
        }
        if (!s.endsWith(ext)) s += ext;
        return s;
    }
    else
        return '/data/' + thingName;
}


export async function ensureThingLoaded(thingName) {

    let file;
    if (!GetRegisteredThing(thingName)) {
        file = construct_fetch_path(thingName);

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

            thing.acceptDrag = dragItems; // todo do better



        } catch (err) {
            console.log(err + ". Unable to fetch " + file);
        }
    }


    let thing = GetRegisteredThing(thingName);
    try {
        if (thing === undefined) throw ("Could not load " + file);
        let promises = [];

        await Promise.all(promises);


    } catch (err) {
        console.log(err + ". Unable to fetch " + thingName + 'json');
    }

    return thing;

}

// async function asyncEval(code, thing, w, owner, notes, additionalParms, chat_id, chat) {
//     return new Promise((resolve, reject) => {
//         try {
//             resolve(eval(`(async () => { ${code} })()`));
//         } catch (error) {
//             reject(error);
//         }
//     });
// };

async function asyncEval(code, thing, w, owner, notes, additionalParms, chat_id, chat) {
    // try {
    // Await the result of the evaluated async function
    return await eval(`(async () => { return ${code} })()`);
    //  } catch (error) {
    //throw error;
    //}
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
                        await asyncEval(js);
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
    return registeredSheets[sheetName];
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

function tagName(name) { return 'tag_' + name; }

// hack for now
function AlsoChangeTags(clause, evaluation, id) {
    // todo: add images
    if (clause == "thing.name") {

        socket.emit('change', {
            change: evaluation,
            thing: tagName(id)
        })
    }
}

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
    });
    AlsoChangeTags(clause, evaluation, id);

}
MakeAvailableToParser('changeSheet', changeSheet);
MakeAvailableToHtml('changeSheet', changeSheet);


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
        s += ' <img src="' + dir + array[i] + ext + '" width="48" height="48" >'
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

export async function RedrawWindow(thingId) {

    let w = windowShowing(thingId); // GIL thing.id?
    if (w) {
        displayThing(thingId, w.sheet);
    }

}




export async function AddItemToNPC(change) {

    let thing = GetRegisteredThing(change.thing);
    if (!thing) {
        return; //  NPC has never been opened
    }
    let item = await ensureThingLoaded(change.item);
    if (!thing.items) thing.items = [];
    thing.items.push(item); // GIL thing.id?
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
            if (thing.items[i].id == change.itemId) {
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

// sheet context

export function parseSheetContext(thing, sheetName, window, owner, notes, additionalParms, chat_id) { // thing and w and owner are  required by evals, w or owner can be undefined
    return {
        thing: thing,
        sheetName: sheetName,
        window: window,
        owner: owner,
        notes: notes,
        additionalParms: additionalParms,
        chat_id: chat_id,


    };


}

export async function parseSheet(thing, sheetName, w, owner, notes, additionalParms) { // thing and w and owner are  required by evals, w or owner can be undefined
    let context = parseSheetContext(thing, sheetName, w, owner, notes, additionalParms);
    return await parseSheetWithContext(context);
}

export async function parseSheetWithContext(context) { // thing and w and owner are  required by evals, w or owner can be undefined


    let thing = context.thing;
    let sheetName = context.sheetName;
    let w = context.window;
    let owner = context.owner;
    let notes = context.notes;
    let additionalParms = context.additionalParms;
    let chat_id = context.chat_id;
    let chat = undefined;
    if (chat_id) chat = getChat(chat_id);
    let data = await ensureSheetLoaded(sheetName)
    let text = `${data}`; // makes a copy to destroy the copy,  TODO: maybe should make structure context
    let newText = "";
    let state = 0;
    let code = "";
    console.log("NOTES ", notes);
    if (window.bug) console.log(text);

    for (let i = 0; i < text.length; i++) {
        if (window.bug) console.log(text[i]);
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
                    if (window.bug) console.log('comment');

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
                            if (window.bug) console.log('1');
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
                    if (window.bug) console.log(code);

                    if (text[i + 1] === '}') { // not a real code block
                        newText += '}';
                        i = i + 1;
                        continue;
                    }
                    state--;
                    if (state == 0) {
                        //  try {

                        console.log("code " + code);

                        let a = await asyncEval(code, thing, w,
                            owner,
                            notes,
                            additionalParms,
                            chat_id,
                            chat);
                        console.log("a " + a);
                        if (String(a).includes("[object Promise]")) {
                            console.log("promise bad code " + code);
                            let b = await asyncEval(code, thing, w,
                                owner,
                                notes,
                                additionalParms,
                                chat_id,
                                chat);

                        }

                        newText += a;


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
    body.innerHTML = await parseSheet(thing, sheetName, w, undefined);



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
    return "<img class='image-holder' src='Sheets/trashcan.png' width='16' height='16' onclick=htmlContext.RemoveItemFromThing('" + ownerid + "','" + itemid + "') />";
}


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
