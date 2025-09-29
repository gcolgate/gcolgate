import { chkDiv } from "./characters.js";
import { uploadDroppedImages } from "./client_main.js"
import { thingDragged, dragDrop, setThingDragged } from "./drag.js";
import { bringToFront, clickOne, createOrGetDirWindow, fadeIn } from './window.js';
import { parseSheet, MakeAvailableToHtml, ensureThingLoaded, GetRegisteredThing, MakeAvailableToParser, showThing, SetRegisteredThing } from './characters.js';
import { socket } from './client_main.js';


export var folders = {
    Compendium: {},
    Party: {},
    //   Favorites: {},
    //  Uniques: {},
    Scenes: {},
    Documents: {},
    images: {},
};
var dirWindowCustomization = {
    Compendium: { dimensions: [.2, .6, .2, .2] },
    Party: { newButton: ["newPlayer"], dimensions: [.2, .6, .2, .2], deleteButton: true },
    //  Favorites: { dimensions: [.2, .6, .2, .2] },
    //    Uniques: { dimensions: [.2, .6, .2, .2] },
    Scenes: { newButton: ["newScene"], dimensions: [.2, .6, .2, .2] },
    Documents: { newButton: ["newPOI"], dimensions: [.2, .6, .2, .2] },
    images: { newButton: ["up", "refresh"], dimensions: [.6, .6, .2, .2], divHolder: "twocolumns" },
};
export function GetMainDirectories() {
    GetDirectory('Compendium', true).then((c) => { folders.Compendium = c; });
    GetDirectory('Party', true).then((c) => { folders.Party = c; });
    //   GetDirectory('Favorites', true).then((c) => { folders.Favorites = c; });
    //    GetDirectory('Uniques', true).then((c) => { folders.Uniques = c; });
    GetDirectory('Scenes', true).then((c) => { folders.Scenes = c; });
    GetDirectory('Documents', true).then((c) => { folders.Documents = c; });
    //GetDirectory('images').then((c) => { folders.images = c; }); // todo remove

    setUpDirButton('Compendium');
    setUpDirButton('Party');
    //   setUpDirButton('Favorites');
    //   setUpDirButton('Uniques');
    setUpDirButton('Scenes');
    setUpDirButton('images');
    setUpDirButton('Documents');
}

function setUpDirButton(buttonName) {
    const compendiumButton = document.getElementById(buttonName);
    compendiumButton.onclick = function () {
        createDirWindow(buttonName)
    }
}
function createDirWindow(buttonName) {

    if (!folders[buttonName] && buttonName != "images") {
        alert("Have not yet receieved " + buttonName + "from server");
    } else {
        let w = createOrGetDirWindow(buttonName, dirWindowCustomization[buttonName].dimensions[0],
            dirWindowCustomization[buttonName].dimensions[1],
            dirWindowCustomization[buttonName].dimensions[2], dirWindowCustomization[buttonName].dimensions[3], dirWindowCustomization[buttonName]);
        bringToFront(w);
        showDirectoryWindow(buttonName, folders[buttonName]);
    }
}

export function processDirectory(jsonData) {

    for (let i = 0; i < jsonData.length; i++) {
        if (typeof (jsonData[i]) == "string")
            if (jsonData[i] && jsonData[i] != "")
                try {
                    jsonData[i] = JSON.parse(jsonData[i]);

                } catch (err) {
                    console.log("Error in parsing " + i + " " + jsonData[i]);
                }
    }
    return jsonData;
}

export async function GetDirectory(directory, processDir) {

    try {
        let response = await fetch("./" + directory);
        console.log("Fetch " + directory);
        const jsonData = await response.json();
        console.log(jsonData);
        if (processDir) // todo, make this seperate function no flag
            processDirectory(jsonData);
        return jsonData;
    } catch (err) {
        console.log("Failed to fetch" + err + " " + directory);
        return [];
    }


}
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
async function addToPlayerFromDropdown(thing_file, ownerid) {

    // await (ensureThingLoaded(thingName));
    //  let thing_to_add = GetRegisteredThing(thingName);

    console.log(thing_file);
    console.log(ownerid);
    if (isObject(thing_file))
        thing_file = thing_file.id;

    socket.emit('addItem', {
        item: thing_file,
        thing: ownerid
    })

    // dropDownToggle('dropdown_' + ownerid);
}
MakeAvailableToHtml('addToPlayerFromDropdown', addToPlayerFromDropdown);


function itemToolTip(elem, name, owner, on) {
    elem.style.backgroundColor = on ? "yellow" : "white";
    let t = document.getElementById(name + owner);
    if (t) {
        if (on) {
            t.style.display = 'block';
            // Position tooltip relative to the ul element
            positionTooltipRelativeToUl(elem, t);
        } else {
            t.style.display = 'none';
        }
    }
}
MakeAvailableToHtml('itemToolTip', itemToolTip);

export function itemToolTipElem(name, owner) {
    return document.getElementById(name + owner);

}

export async function extractFromCompendium(filter_array, owner, elemId, type, matches) {

    if (!folders.Compendium) {
        return [];
    }
    let filter_by_type = type || "All";

    let answer = "";
    let whole = folders.Compendium;

    let array = filter(whole, filter_array);


    // filtering these requires loading them all first
    let search_in_directory = new searchInDirectory(array);
    let searched = search_in_directory.search();

    if (elemId) {
        answer += `<button class="cancel" onmousedown="htmlContext.dropDownToggle('${elemId}', window.document)">Cancel</button>`;
        answer += '<div class="dropdown-list" id="' + elemId + '_list">' + "<ul>";
    }
    else {
        answer += '<div class="dropdown-list">' + "<ul>";
    }
    for (let i = 0; i < searched.length; i++) {

        if (filter_by_type != "All" && !matches(searched[i], filter_by_type)) {
            continue;
        }

        let quote = '"';
        console.log(owner.id);
        answer += "<li class='compendiumSyle'  onmousedown='htmlContext.addToPlayerFromDropdown("
            + JSON.stringify(searched[i]) + "," + quote + owner.id + quote + ")'" + '  onMouseLeave="itemToolTip(this,\'' + searched[i].id + '\',\'' + owner.id + '\', false)"' +
            ' onMouseEnter="itemToolTip(this,\'' + searched[i].id + '\',\'' + owner.id + '\', true)" >';



        if (searched[i].page == "spell" || searched[i].page == "weapon" || searched[i].page == "feats" && searched[i].id) {
            answer += '<div class="tooltipcontainer">';
            answer += '<div class="tooltip_wide_left" id="' + searched[i].id + owner.id + '">';

            let data = await ensureThingLoaded(searched[i].id, searched[i].id + owner.id);

            let a = await parseSheet(GetRegisteredThing(searched[i].id), searched[i].page + "_tooltip", undefined, owner, "", { file: searched[i].id }); // no w

            answer += a;


            //parseSheet(thing, sheetName, w, owner, notes, additionalParms)
            answer += '</div>';
            answer += '</div>';
        }
        answer += `<img src = "${searched[i].img}" width = "32" height = "32" /> `;
        answer += searched[i].name;
        if (searched[i].price) answer += '<span class="bold"> ' + searched[i].price + "</span > "



        answer += "</li>";
    }
    answer += "</ul>";
    answer += "</div>";
    return chkDiv(answer);

}
MakeAvailableToParser('extractFromCompendium', extractFromCompendium);

function clickOnThing(event) {

    let name = this.references.id || this.references.file;

    // hack to handle scenes, which don't have a seperate file. TODO: make more readable
    if (name === undefined) {
        //let thing = SetRegisteredThing("SCENE" + this.references, this.references);
        // name = thing.registeredId;
        window.LoadScene({ name: this.references.name });
    } else {

        showThing(name, this.references.page);
    }
}




function searchChanged() {
    console.log(this.value);
    refreshDirectoryWindow(this.windowId, this.array);
}
function normalMouseDown(e) {
    e.stopPropagation();
    // e.preventDefault();
}
function escapeRegExp(stringToGoIntoTheRegex) { // htmlize these by inserting slash
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


function search(array, for_what) {
    if (for_what === "") {
        return array;
    } else {
        let searched = [];
        let s = escapeRegExp(for_what.toLowerCase()); // i couldn't figure out the incantations to make this ignore case
        for (let i = 0; i < array.length; i++) {
            try {
                if (array[i]?.name?.toLowerCase().search(s) >= 0) {
                    console.log(array[i]?.name?.toLowerCase() + " matches " + s);
                    searched.push(array[i]);
                }
            } catch (err) { console.log(i, array[i]); }
        }
        return searched;
    }
}

function filter(whole, buttons) {
    if (buttons.length === 0) { // none selected same as all selected
        let filtered = [];
        for (let i = 0; i < whole.length; i++) {

            filtered.push(whole[i]);
        }
        return filtered;
    } else {
        let filtered = [];
        for (let i = 0; i < whole.length; i++) {
            if (buttons.some(element => element === whole[i].page))
                filtered.push(whole[i]);
            else if (whole[i].powers) {
                for (let k = 0; k < whole[i].powers.length; k++)
                    if (buttons.some(element => element === whole[i].powers[k])) {
                        filtered.push(whole[i]);
                        break;
                    }

            }
        }
        return filtered;
    }
}

function collectFilter(id) {
    let title = document.getElementById("window_" + id + "_title");

    let filter = [];

    for (let i = 0; i < title.filterButtons.length; i++) {

        if (title.filterButtons[i].checked) {
            filter.push(title.filterTitles[i]);
        }
    }

    return {
        filter: filter,
        field: "page"

    };

}

function sortDirEntry(a, b) {

    if (a.dir && !b.dir) return -1;
    if (!a.dir && b.dir) return 1;
    if (!a.name && !b.name) return 0;
    if (!a.name) return 1;
    if (!b.name) return -1;
    return a.name.localeCompare(b.name);
}

export function GoUpOneDirectory(windowname) {
    let window = document.getElementById("window_" + windowname);
    if (window.subdir !== "") {
        let text = window.subdir;
        for (let i = 0; i < 2; i++) {
            let lastIndex = text.lastIndexOf('/');
            text = text.substring(0, lastIndex);
        }

        console.log(text);
        window.subdir = text;
        console.log(window.subdir);
        refreshDirectoryWindow(windowname, null);
    }
}

export function refreshDirectoryWindow(id, whole) {


    let window = document.getElementById("window_" + id);

    let array;
    if (id === "images") {
        if (!window.subdir) {
            window.subdir = "";
        }
        GetDirectory("images" + window.subdir, false).then(array => {



            let ul = document.getElementById("window_" + id + "_list");

            ul.style.height = (window.clientHeight - ul.offsetTop) + "px";
            ul.style.overflow = "auto";
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild);
            }


            window.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    console.log("%o", entry);
                    console.log('width', entry.contentRect.width);
                    console.log('height', entry.contentRect.height);
                    let ul = document.getElementById("window_" + id + "_list");
                    if (ul) { ul.style.height = (window.clientHeight - ul.offsetTop) + "px"; }
                    else {
                        console.log("WTF");
                    }
                });

            });

            window.resizeObserver.observe(window);
            window.resizeObserver.observe(ul);

            array.sort(sortDirEntry);

            for (let i = 0; i < array.length; i++) {
                let li = document.createElement("li");
                li.className = "speedline";
                let text = document.createTextNode(array[i].name);
                // need better images
                if (array[i].img) {
                    let img = document.createElement('img');
                    img.src = array[i].img;
                    img.width = "64"
                    img.height = "64"
                    li.appendChild(img);

                }

                li.appendChild(text);
                li.references = array[i];
                li.draggable = true;

                if (array[i].type !== "dir") {
                    li.className = "npcheader border";
                    li.onmousedown = function (event) { clickOne(this); };
                    li.ondblclick = clickOnThing;
                    li.ondragstart = function (event) {
                        setThingDragged(this.references);
                        thingDragged.windowId = id;

                    }
                } else {
                    li.className = "npcheader border";
                    li.onmousedown = function (event) {
                        // /images is 7 long
                        window.subdir = this.references.name.substring(7);

                        refreshDirectoryWindow(id, whole);

                    };


                }

                ul.appendChild(li);
            }

        });

        return;
    }

    let deleteButton = dirWindowCustomization[id].deleteButton;

    let params = collectFilter(id);
    let searched = window.search_in_directory.search();

    //

    window.search_in_directory.set_array(whole); //search_input.array = array;
    array = filter(searched, params.filter, params.field);




    // let title = document.getElementById("window_" + id + "_title");


    let ul = document.getElementById("window_" + id + "_list");

    ul.style.height = (window.clientHeight - ul.offsetTop) + "px";
    ul.style.overflow = "auto";
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }


    window.resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            console.log("%o", entry);
            console.log('width', entry.contentRect.width);
            console.log('height', entry.contentRect.height);
            let ul = document.getElementById("window_" + id + "_list");
            if (ul) { ul.style.height = (window.clientHeight - ul.offsetTop) + "px"; }
            else {
                console.log("WTF");
            }
        });

    });

    window.resizeObserver.observe(window);
    window.resizeObserver.observe(ul);

    array.sort(sortDirEntry);

    for (let i = 0; i < array.length; i++) {
        let li = document.createElement("li");
        let text = document.createTextNode(array[i].name);
        // need better images
        if (array[i].img) {
            let img = document.createElement('img');
            img.src = array[i].img;
            img.width = "32"
            img.height = "32"
            li.appendChild(img);

        }

        li.appendChild(text);
        li.references = array[i];
        li.draggable = true;
        if (deleteButton) {
            let deleteButton = document.createElement("button");
            deleteButton.className = "deleteButton";
            deleteButton.innerHTML = "X"; // todo: trash icon
            deleteButton.onclick = function (event) {
                event.stopPropagation();
                event.preventDefault();
                console.log(array[i].id);
                socket.emit("delete", { file: array[i].id });

            };
            li.appendChild(deleteButton);
        }
        if (!array[i].dir) {
            li.onmousedown = function (event) { clickOne(this); };
            li.ondblclick = clickOnThing;
            li.ondragstart = function (event) {
                setThingDragged(this.references);
                thingDragged.windowId = id;

            }
        } else {
            li.onmousedown = function (event) {

                array[i].open = array[i].open ? false : true;
                refreshDirectoryWindow(id, whole);

            };


        }

        ul.appendChild(li);
    }

}

function setDragStart(event, name) {
    let thing = GetRegisteredThing(name);
    setThingDragged(thing);
    thingDragged.windowId = null;
    console.log(thing);

}
MakeAvailableToHtml("setDragStart", setDragStart);

export async function updateDirectoryWindow(id, updatedFolder, makeFront) {

    folders[id] = updatedFolder;
    let windowName = "window_" + id;
    let w = document.getElementById(windowName);

    if (!w && !makeFront) { return; }
    w = createOrGetDirWindow(id, dirWindowCustomization[id].dimensions[0],
        dirWindowCustomization[id].dimensions[1],
        dirWindowCustomization[id].dimensions[2], dirWindowCustomization[id]);
    if (makeFront) bringToFront(w);
    showDirectoryWindow(id, folders[id]);

}


function RemoveSlashes(text) {
    text = text.replace(/\\/g, '/');
    return text;

}

class searchInDirectory {

    constructor(array) {
        this.input = document.createElement("input");
        // this.earchString.id = "window_" + id + "_search";
        this.searchHTML = document.createElement("div");
        this.searchHTML.className = "searchArea";
        this.searchHTML.appendChild(document.createTextNode("Search"));
        this.searchHTML.appendChild(this.input);
        this.searchHTML.style.backgroundColor = "burlywood";
        this.input.oninput = searchChanged;
        this.input.onmousedown = normalMouseDown;
        this.input.array = array;
    }
    // returns string
    get_search_string() { return this.input.value; }
    //sets array
    set_array(array) { this.input.array = array; }

    search() {
        return search(this.input.array, this.input.value);
    }

    addUITo(elem, id) {

        this.searchHTML.windowId = id;
        this.input.windowId = id;
        elem.insertAdjacentElement('afterend', this.searchHTML);


    }

};

function createFilterButtons(id, array, allTypes, checkDiv, title) {
    title.filterButtons = [];
    title.filterTitles = [];
    for (const item of allTypes.keys()) {

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'chk' + item;
        checkbox.name = item;
        //  checkbox.checked = true;
        checkbox.windowId = id;
        checkbox.array = array;
        checkbox.removable = true;


        checkbox.onchange = function () {
            refreshDirectoryWindow(this.windowId, this.array);
        }

        title.filterButtons.push(checkbox);
        title.filterTitles.push(item);

        let label = document.createElement('label')
        label.htmlFor = 'chk' + item;
        label.appendChild(document.createTextNode(item + "      ")); // todo: use style, margin isnt working
        label.removable = true;
        //checkDiv.className = "searchHTMLCheckBox";
        checkDiv.removable = true;
        checkDiv.appendChild(checkbox);
        checkDiv.appendChild(label);


    }
}

function showDirectoryWindow(id, array) {


    let window = document.getElementById("window_" + id);

    let title = document.getElementById("window_" + id + "_title");

    let ul = document.getElementById("window_" + id + "_list");



    if (!window.inited) {

        window.inited = true;
        dragDrop(ul, {
            onDrop: (files, pos, fileList, directories) => {
                console.log('Here are the dropped files', files)
                console.log('Dropped at coordinates', pos.x, pos.y)
                console.log('Here is the raw FileList object if you need it:', fileList)
                console.log('Here is the list of directories:', directories)
            },
            onDropText: (text, pos) => {
                console.log('Here is the dropped text:', text)
                console.log('Dropped at coordinates', pos.x, pos.y)
            },
            onDragEnter: (event) => { },
            onDragOver: (event) => { },
            onDragLeave: (event) => { console.log("Drag leave1"); }
        });

        if (id === "images") {
            ul.windowOwner = window;
            ul.ondrop = function (e) {
                if (thingDragged) {
                    // will be handled by canvas
                } else {
                    e.stopPropagation();
                    e.preventDefault();
                    uploadDroppedImages(e, this.windowOwner.subdir);
                    e.dataTransfer.effectAllowed = 'none'
                    e.dataTransfer.dropEffect = 'none'
                    return false;
                }
            };

        }
        id = RemoveSlashes(id);

        ul.acceptDrag = function (thingDragged, event) {

            for (let i = 0; i < array.length; i++) {
                if (array[i].id == thingDragged.id) {
                    console.log("Dupe");
                    return;
                }
            }
            id = RemoveSlashes(id);
            socket.emit("copy_files", { to: id, from: thingDragged });

        }
        window.search_in_directory = new searchInDirectory();


        window.search_in_directory.addUITo(title, id);


        title.style.height = "35px";

    }
    else {


        const children = window.search_in_directory.searchHTML.children;
        // or
        const listArray = [...children];
        listArray.forEach((item) => {
            if (item.removable == true) {
                item.remove();
            }

        });

    }

    window.search_in_directory.set_array(array); //search_input.array = array;

    let allTypes = new Set();

    for (let i = 0; i < array.length; i++) {
        allTypes.add(array[i].page);
        if (array[i].powers) {
            for (let k = 0; k < array[i].powers.length; k++) {
                if (array[i].powers[k])
                    allTypes.add(array[i].powers[k]);

            }

        }
    }

    // title.whiteSpace = "normal";
    //title.style.display = "block";
    let checkDiv = document.createElement('div');


    createFilterButtons(id, array, allTypes, checkDiv, title);

    window.search_in_directory.searchHTML.appendChild(checkDiv);


    refreshDirectoryWindow(id, array);


    fadeIn(window);

}

var uniqueCounter = 0;


export function UniqueId() {
    uniqueCounter++;
    return "filter_" + uniqueCounter;
}
MakeAvailableToParser('UniqueId', UniqueId);

async function filterDropDownByType(value, dropDownId) {

    const widgetElem = document.getElementById(dropDownId + '_widget');
    if (!widgetElem) {
        DropDownWidgets[dropDownId] = undefined;
        return;
    }

    // finishDropDownWidget is async — await its result and write into the DOM correctly
    try {
        const htmlString = await finishDropDownWidget(
            dropDownId,
            DropDownWidgets[dropDownId].filterId,
            DropDownWidgets[dropDownId].title,
            DropDownWidgets[dropDownId].type,
            DropDownWidgets[dropDownId].thing,
            DropDownWidgets[dropDownId].types,
            DropDownWidgets[dropDownId].matches,
            value
        );

        widgetElem.innerHTML = htmlString;

        // Ensure the dropdown content is visible/open
        const listElem = document.getElementById(dropDownId);
        if (listElem) {
            listElem.style.display = 'block';
        }

        // If there is a filter input, re-run the text filter so the displayed list is filtered
        const filterId = DropDownWidgets[dropDownId].filterId;
        const filterInput = document.getElementById(filterId);
        if (filterInput) {
            // html.filterDropDown is used elsewhere via the html object in your markup
            if (typeof html !== 'undefined' && typeof html.filterDropDown === 'function') {
                html.filterDropDown(filterId, dropDownId);
            } else if (typeof filterDropDown === 'function') {
                // fallback to local function
                filterDropDown(filterId, dropDownId);
            }
        }

        // If the type selector exists, set its selected value to the passed value
        const sel = document.getElementById(dropDownId + '_type_select');
        if (sel) {
            sel.value = value;
        }

    } catch (err) {
        console.error("filterDropDownByType error:", err);
    }

}
MakeAvailableToHtml('filterDropDownByType', filterDropDownByType);

var DropDownWidgets = {}; // DOTO: Cleanup old ones.

export async function MakeDropDownWidget(title, type, thing, types, matches) {
    let dropDownId = UniqueId();
    let filterId = UniqueId();


    DropDownWidgets[dropDownId] = {
        filterId: filterId,
        title: title, type: type, thing: thing, types: types, matches: matches
    };


    return finishDropDownWidget(dropDownId, filterId, title, type, thing, types, matches, 'All');
}
MakeAvailableToParser('MakeDropDownWidget', MakeDropDownWidget);

async function finishDropDownWidget(dropDownId, filterId, title, type, thing, types, matches, curSel) {

    let typeSelectorHtml = "";
    if (Array.isArray(types) && types.length > 0) {
        const selId = `${dropDownId}_type_select`;
        // build select without a blank option; show curSel (or "All") as the default first option
        typeSelectorHtml = `<div style="margin:4px 0;"><label>Type: <select id="${selId}" onchange="htmlContext.filterDropDownByType(this.value,'${dropDownId}')">`;
        const defaultVal = curSel || "All";
        typeSelectorHtml += `<option value="${defaultVal}"${defaultVal === curSel ? ' selected' : ''}>${defaultVal}</option>`;
        if (defaultVal !== "All") {
            typeSelectorHtml += `<option value="All">All</option>`;
        }
        for (const t of types) {
            const safe = String(t).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const selAttr = (safe === curSel) ? ' selected' : '';
            typeSelectorHtml += `<option value="${safe}"${selAttr}>${safe}</option>`;
        }
        typeSelectorHtml += `</select></label></div>`;
    }


    let answer = `<div id="${dropDownId}_widget"> <button onclick = "htmlContext.dropDownToggle('${dropDownId}',window.document,'${filterId}')"` +
        `class="injuryButton" > ${title} </button > ` +
        ` <div id = "${dropDownId}" class="dropdown-content itemsetheadershort" > ` +
        ` <input type = "text" placeholder = "Search.." id = "${filterId}"` +
        `onkeyup = "htmlContext.filterDropDown('${filterId}','${dropDownId}')" > ` +
        typeSelectorHtml +
        await extractFromCompendium([type], thing, dropDownId, curSel, matches) +

        '</div></div>';
    console.log(answer);
    return answer;
}
MakeAvailableToParser('MakeDropDownWidget', MakeDropDownWidget);

// Function to position tooltip relative to the ul element
function positionTooltipRelativeToUl(liElement, tooltip) {
    // Find the ul element (parent of the li)
    const ulElement = liElement.closest('ul');
    if (ulElement && tooltip) {
        const ulRect = ulElement.getBoundingClientRect();
        // const liRect = liElement.getBoundingClientRect();

        const ulScrollTop = ulElement.parentElement.scrollTop;
        // Use window scroll to convert viewport coords to document coords
        // Position tooltip at the right edge of the ul, aligned with the li's top
        const left = ulRect.right + 10 + (window.scrollX || 0);
        const top = ulRect.top + (window.scrollY || 0) + ulScrollTop;

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }
}
MakeAvailableToHtml('positionTooltipRelativeToUl', positionTooltipRelativeToUl);
