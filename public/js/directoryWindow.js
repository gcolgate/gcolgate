

async function GetDirectory(directory) {

    try {
        let response = await fetch("./" + directory);
        console.log("Fetch " + directory);
        const jsonData = await response.json();
    } catch (err) {
        console.log("Failed to fetch" + err + " " + directory);
        return [];
    }

    for (let i = 0; i < jsonData.length; i++) {
        try {
            jsonData[i] = JSON.parse(jsonData[i]);
        } catch (err) {

            console.log("Error in parsing " + i + " " + jsonData[i]);
        }
    }
    return jsonData;
}


function clickOnThing(event) {

    let name = this.references.file;

    // hack to handle scenes, which don't have a seperate file. TODO: make more readable
    if (name === undefined) {
        registeredThings["SCENE" + this.references] = this.references;
        name = "SCENE" + this.references;
    }

    showThing(name, "", this.references.page);
}


function dragstart(event) {
    thingDragged = this.references;


}


function searchChanged() {
    console.log(this.value);
    refreshDirectoryWindow(this.windowId, this.array);
}
function normalMouseDown(e) {
    e.stopPropagation();
    // e.preventDefault();
}
function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


function search(whole, search) {
    if (search === "") {
        return whole;
    } else {
        let searched = [];
        let s = escapeRegExp(search.toLowerCase()); // i couldn't figure out the incantations to make this ignore case
        for (let i = 0; i < whole.length; i++) {
            if (whole[i].name.toLowerCase().search(s) >= 0) {
                searched.push(whole[i]);
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
        }
        return filtered;
    }
}

function collectSearchandFilter(id) {
    let title = document.getElementById("window_" + id + "_title");

    let filter = [];

    for (let i = 0; i < title.filterButtons.length; i++) {

        if (title.filterButtons[i].checked) {
            filter.push(title.filterTitles[i]);
        }
    }

    let search = document.getElementById("window_" + id + "_search").value;

    return {
        filter: filter,
        search: search
    };

}



function refreshDirectoryWindow(id, whole) {

    let params = collectSearchandFilter(id);
    let win = document.getElementById("window_" + id);



    let searched = search(whole, params.search);


    let array = filter(searched, params.filter);

    let title = document.getElementById("window_" + id + "_title");


    let ul = document.getElementById("window_" + id + "_list");

    ul.style.height = (win.clientHeight - ul.offsetTop) + "px";
    ul.style.overflow = "auto";
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }


    win.resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            console.log("%o", entry);
            console.log('width', entry.contentRect.width);
            console.log('height', entry.contentRect.height);
            let ul = document.getElementById("window_" + id + "_list");
            ul.style.height = (win.clientHeight - ul.offsetTop) + "px";

        });

    });

    win.resizeObserver.observe(win);
    win.resizeObserver.observe(ul);

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
        li.ondragstart = dragstart;

        ul.appendChild(li);
    }

}

async function updateDirectoryWindow(folders, id) {

    folders[id] = await GetDirectory(id);
    let w = createOrGetDirWindow(id, .2, .6, .2, .2);
    bringToFront(w);
    showDirectoryWindow(id, folders[id]);
}

async function GetDirectory(directory) {
    let response = await fetch("./" + directory);
    const jsonData = await response.json();
    console.log(jsonData);


    for (let i = 0; i < jsonData.length; i++) {
        try {
            jsonData[i] = JSON.parse(jsonData[i]);
        } catch (err) {

            console.log("Error in parsing " + i + " " + jsonData[i]);
        }
    }
    return jsonData;
}


function showDirectoryWindow(id, array) {


    let window = document.getElementById("window_" + id);

    let title = document.getElementById("window_" + id + "_title");

    let ul = document.getElementById("window_" + id + "_list");

    let search = null;

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
            onDragLeave: (event) => { }
        });

        ul.acceptDrag = function (thingDragged) {

            for (let i = 0; i < array.length; i++) {
                if (array[i].file == thingDragged.file) {
                    console.log("Dupe");
                    return;
                }
            }

            socket.emit("copy_file", { to: id, from: thingDragged });

        }
        search = document.createElement("input");
        search.id = "window_" + id + "_search";
        searchArea = document.createElement("div");

        title.insertAdjacentElement('afterend', searchArea);
        searchArea.id = "window_" + id + "_searchArea";

        searchArea.appendChild(document.createTextNode("Search"));
        searchArea.appendChild(search);
        searchArea.style.backgroundColor = "burlywood";
        search.oninput = searchChanged;
        search.onmousedown = normalMouseDown;
        search.windowId = id;
        title.style.height = "35px";
    }
    else {



        search = document.getElementById("window_" + id + "_search");

        searchArea = document.getElementById("window_" + id + "_searchArea");

        const children = searchArea.children;
        // or
        const listArray = [...children];
        listArray.forEach((item) => {
            if (item.removable == true) {
                item.remove();
            }

        });

    }

    search.array = array;

    let allTypes = new Set();

    for (let i = 0; i < array.length; i++) {
        allTypes.add(array[i].page);
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


        checkbox.onchange = function () {
            refreshDirectoryWindow(this.windowId, this.array);
        }

        title.filterButtons.push(checkbox);
        title.filterTitles.push(item);

        let label = document.createElement('label')
        label.htmlFor = 'chk' + item;
        label.appendChild(document.createTextNode(item + "      ")); // todo: use style, margin isnt working
        label.removable = true;

        searchArea.appendChild(checkbox);
        searchArea.appendChild(label);


    }



    refreshDirectoryWindow(id, array);


    fadeIn(window);

}