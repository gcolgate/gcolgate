// const metaTag = document.createElement("meta");
// metaTag.name = "viewport";
// metaTag.content = "user-scalable=0";
// document.getElementsByTagName("head")[0].appendChild(metaTag);

var windows = [];



function bringToFront(w) {
    // this is not entirely up to code but it probably works
    // well enough
    // front window is zindex 9+number of windows.
    // other windows are behind but in an uncertain arrangement
    // I could sort the windows in the window variable and then
    // assign them in the order, which would be correct

    if (w.style.zIndex == windows.length + 9) { return; }
    for (let i = 0; i < windows.length; i++) {
        if (windows[i].style.zIndex == windows.length + 9) {
            windows[i].style.zIndex = window.length + 8;
        }
    }
    w.style.zIndex = windows.length + 9;
}


function clickToBringWindowIntoFocus(evt) {
    bringToFront(evt.currentTarget);
}

function getWindowId(element) {

    do {
        if (element.class === "window") {
            return element.id;
        }
        element = element.parentElement;
    } while (element);
    return null;
}

function windowShowing(name) {
    let windowName = "window_" + name;
    let w = document.getElementById(windowName);
    return w;
}

function createOrGetWindow(id, width, height, left, top) {

    let windowName = "window_" + id;
    let w = document.getElementById(windowName);

    if (!w) {
        let group = document.getElementById("windowGroup");
        w = document.createElement("div");
        w.style = "display: initial;"

        w.style.position = "absolute";
        width *= window.innerWidth;
        height *= window.innerHeight;
        left *= window.innerWidth;
        top *= window.innerHeight;



        w.contentHeight = height - 80;

        w.id = windowName;
        w.class = "window";
        let title = document.createElement("div");
        title.id = windowName + "_title";
        title.innerHtml = id;
        let closeButton = document.createElement("b");
        closeButton.innerHTML = "×";
        title.appendChild(closeButton);

        title.style.padding = "10px";
        title.style.zIndex = "10";
        title.style.backgroundColor = "grey";
        title.style.color = "#fff";
        title.style.borderRadius = "4px 4px 0 0";
        title.style.height = "40px";
        title.style.justifyContent = "space - between";
        title.style.display = "flex";
        title.style.touchAction = "none";


        let list = document.createElement("ul");
        list.class = "compendiumSyle";
        list.id = windowName + "_list";
        w.appendChild(title);
        w.appendChild(list);
        group.appendChild(w);

        let body = document.createElement("div");
        body.id = windowName + "_body";
        w.appendChild(body);


        closeButton.onclick = function () {
            fadeOut(w);
        };
        dragElement(w, title);
        w.style.top = top + "px";
        w.style.left = left + "px";
        w.style.zIndex = 9 + windows.length;
        w.style.backgroundColor = "#ffffff";
        w.style.width = width + "px";
        w.style.height = height + "px";
        w.style.borderRadius = "8p 8px 0 0x";
        w.style.boxShadow = "8px 8px 6px -6px black";
        w.style.opacity = "0.9";
        w.style.display = "none";
        w.style.resize = "both";

        // Event listener for clicks
        w.addEventListener('mousedown', clickToBringWindowIntoFocus);


        windows.push(w);
    }


    fadeIn(w);
    return w;

}



function createOrGetDirWindow(id, width, height, left, top) {

    let windowName = "window_" + id;
    let w = document.getElementById(windowName);

    if (!w) {
        let group = document.getElementById("windowGroup");
        w = document.createElement("div");
        w.style = "display: initial;"

        w.style.position = "absolute";
        width *= window.innerWidth;
        height *= window.innerHeight;
        left *= window.innerWidth;
        top *= window.innerHeight;



        w.contentHeight = height;

        w.id = windowName;
        w.class = "window";
        let title = document.createElement("div");
        title.id = windowName + "_title";
        title.innerHtml = id;
        let closeButton = document.createElement("b");
        closeButton.innerHTML = "×";
        title.appendChild(closeButton);

        title.style.padding = "10px";
        title.style.zIndex = "10";
        title.style.backgroundColor = "grey";
        title.style.color = "#fff";
        title.style.borderRadius = "4px 4px 0 0";
        title.style.height = "40px";
        title.style.justifyContent = "space - between";
        title.style.display = "flex";
        title.style.touchAction = "none";


        let list = document.createElement("ul");
        list.class = "compendiumSyle";
        list.id = windowName + "_list";
        list.style.marginTop = "0px";
        w.appendChild(title);
        w.appendChild(list);
        group.appendChild(w);

        let body = document.createElement("div");
        body.id = windowName + "_body";
        w.appendChild(body);


        closeButton.onclick = function () {
            fadeOut(w);
        };
        dragElement(w, title);
        w.style.top = top + "px";
        w.style.left = left + "px";
        w.style.zIndex = 9 + windows.length;
        w.style.backgroundColor = "#ffffff";
        w.style.width = width + "px";
        w.style.height = height + "px";
        w.style.borderRadius = "8p 8px 0 0x";
        w.style.boxShadow = "8px 8px 6px -6px black";
        w.style.opacity = "0.9";
        w.style.display = "none";
        w.style.resize = "both";

        // Event listener for clicks
        w.addEventListener('mousedown', clickToBringWindowIntoFocus);


        windows.push(w);
    }


    fadeIn(w);
    return w;

}

function dragElement(elmnt, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (header) {
        // if present, the header is where you move the DIV from:
        header.onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function fadeIn(elmnt) {
    elmnt.style.opacity = 0;
    elmnt.style.display = "initial";
    if (elmnt.classList.contains("fade")) {
        var opacity = 0;
        var timer = setInterval(function () {
            opacity += 30 / 70;
            if (opacity >= 1) {
                clearInterval(timer);
                opacity = 0.9;
            }
            elmnt.style.opacity = opacity;

        }, 50);
    } else {
        elmnt.style.opacity = "0.9";

    }

}

function fadeOut(elmnt) {
    if (elmnt.classList.contains("fade")) {
        var opacity = 1;
        var timer = setInterval(function () {
            opacity -= 30 / 70;
            if (opacity <= 0) {
                clearInterval(timer);
                opacity = 0;
                elmnt.style.display = "none";
            }
            elmnt.style.opacity = opacity;
        }, 50);
    } else {
        //elmnt.style.display = "none";
        elmnt.style.opacity = 100;
        for (let i = 0; i < windows.length; i++) {
            if (windows[i] === elmnt) {
                elmnt.remove();
                windows.splice(i, 1);
                break;
            }
        }


    }
}



