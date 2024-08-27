import { chkDiv } from "./characters.js";
import { thingDragged, dragDrop, setThingDragged } from "./drag.js";
import { bringToFront, createOrGetDirWindow, fadeIn } from './window.js';
import { MakeAvailableToHtml, GetRegisteredThing, MakeAvailableToParser, showThing, SetRegisteredThing } from './characters.js';
import { socket } from './main.js';



var folders = {
    Compendium: {},
    Party: {},
    Favorites: {},
    Uniques: {},
    Scenes: {},
};
var dirWindowCustomization = {
    Compendium: {},
    Party: { newButton: "newPlayer" },
    Favorites: {},
    Uniques: {},
    Scenes: {},
};
export function GetMainDirectories() {
    GetDirectory('Compendium').then((c) => { folders.Compendium = c; });
    GetDirectory('Party').then((c) => { folders.Party = c; });
    GetDirectory('Favorites').then((c) => { folders.Favorites = c; });
    GetDirectory('Uniques').then((c) => { folders.Uniques = c; });
    GetDirectory('Scenes').then((c) => { folders.Scenes = c; });
    setUpDirButton('Compendium');
    setUpDirButton('Party');
    setUpDirButton('Favorites');
    setUpDirButton('Uniques');
    setUpDirButton('Scenes');
}

function setUpDirButton(buttonName) {
    const compendiumButton = document.getElementById(buttonName);
    compendiumButton.onclick = function () {
        createDirWindow(buttonName)
    }
}
function createDirWindow(buttonName) {

    if (!folders[buttonName]) {
        alert("Have not yet receieved " + buttonName + "from server");
    } else {
        let w = createOrGetDirWindow(buttonName, .2, .6, .2, .2, dirWindowCustomization[buttonName]);
        bringToFront(w);
        showDirectoryWindow(buttonName, folders[buttonName]);
    }
}

export function processDirectory(jsonData) {

    for (let i = 0; i < jsonData.length; i++) {
        if (jsonData[i])
            try {
                jsonData[i] = JSON.parse(jsonData[i]);
                if (jsonData[i].page == "spell")
                    console.log(jsonData[i]);
            } catch (err) {

                console.log("Error in parsing " + i + " " + jsonData[i]);
            }
    }
    return jsonData;
}

async function GetDirectory(directory) {

    try {
        let response = await fetch("./" + directory);
        console.log("Fetch " + directory);
        const jsonData = await response.json();
        processDirectory(jsonData);
        return jsonData;
    } catch (err) {
        console.log("Failed to fetch" + err + " " + directory);
        return [];
    }


}

async function addToPlayerFromDropdown(thing_file, ownerid) {

    // await (ensureThingLoaded(thingName));
    //  let thing_to_add = GetRegisteredThing(thingName);

    console.log(thing_file);
    console.log(ownerid);

    socket.emit('addItem', {
        item: thing_file,
        thing: ownerid
    })

    // dropDownToggle('dropdown_' + ownerid);
}
MakeAvailableToHtml('addToPlayerFromDropdown', addToPlayerFromDropdown);


function extractFromCompendium(filter_array, thing) {

    if (!folders.Compendium) {
        return [];
    }
    let whole = folders.Compendium;

    let array = filter(whole, filter_array);

    let search_in_directory = new searchInDirectory(array);
    let searched = search_in_directory.search();

    let answer = "";
    answer += "<ul>";
    for (let i = 0; i < searched.length; i++) {

        let quote = '"';

        answer += "<li   onmousedown='htmlContext.addToPlayerFromDropdown("
            + JSON.stringify(searched[i]) + "," + quote + thing.id + quote + ")'>";
        answer += '<img src="' + searched[i].img + '" width="32" height="32"></img>';
        answer += searched[i].name;
        if (searched[i].price) answer += '<span class="bold"> ' + searched[i].price + "</span > "
        // li.references = array[i];
        // li.draggable = true;
        // li.onmousedown = function (event) { clickOne(this); };
        // li.ondblclick = clickOnThing;
        // li.ondragstart = function (event) {
        //     thingDragged = this.references;
        //     thingDragged.windowId = id;

        // }
        answer += "</li>";
    }
    answer += "</ul>";
    return chkDiv(answer);
}
MakeAvailableToParser('extractFromCompendium', extractFromCompendium);

function clickOnThing(event) {

    let name = this.references.file;

    // hack to handle scenes, which don't have a seperate file. TODO: make more readable
    if (name === undefined) {
        let thing = SetRegisteredThing("SCENE" + this.references, this.references);
        name = thing.registeredId;
    }

    showThing(name, this.references.page);
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
            if (array[i].name.toLowerCase().search(s) >= 0) {
                searched.push(array[i]);
            }
        }
        return searched;
    }
}

function filter(whole, buttons) {
    if (buttons.length === 0) { // none selected same as all selected
        let filtered = [];
        for (let i = 0; i < whole.length; i++) {
            if ("itemSummary" != whole[i].page)
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

    };

}




function refreshDirectoryWindow(id, whole) {

    let params = collectFilter(id);
    let window = document.getElementById("window_" + id);

    window.search_in_directory.set_array(whole); //search_input.array = array;

    let searched = window.search_in_directory.search();


    let array = filter(searched, params.filter);

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
        li.onmousedown = function (event) { clickOne(this); };
        li.ondblclick = clickOnThing;
        li.ondragstart = function (event) {
            setThingDragged(this.references);
            thingDragged.windowId = id;

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
    w = createOrGetDirWindow(id, .2, .6, .2, .2, dirWindowCustomization[id]);
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
        id = RemoveSlashes(id);

        ul.acceptDrag = function (thingDragged, event) {

            for (let i = 0; i < array.length; i++) {
                if (array[i].file == thingDragged.file) {
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

        let checkDiv = document.createElement('div');

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
        window.search_in_directory.searchHTML.appendChild(checkDiv);


    }



    refreshDirectoryWindow(id, array);


    fadeIn(window);

}