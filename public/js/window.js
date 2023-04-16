// const metaTag = document.createElement("meta");
// metaTag.name = "viewport";
// metaTag.content = "user-scalable=0";
// document.getElementsByTagName("head")[0].appendChild(metaTag);



function createWindow(id) {
    let windowId = document.getElementById("window_" + id);
    // let headerID = windowId.firstElementChild;

    windowId.style.display = "none";
    // headerID.id = "window_" + id + "_header";
    let header = document.getElementById("window_" + id + "_header");

    let closeButton = document.createElement("b");
    closeButton.innerHTML = "×";
    header.appendChild(closeButton);
    closeButton.onclick = function () {
        fadeOut(windowId);
    };
    // document.getElementById("button" + id).onclick = function () {
    //     if (windowId.style.display === "initial") {
    //         activeWindow(windowId);
    //     } else {
    //         windowId.style = "position: absolute;";
    //         windowId.style = "top: 80px;";
    //         fadeIn(windowId);
    //     }
    // };
    dragElement(windowId, header);
    lastWindow = windowId;

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
            activeWindow(elmnt);
        }, 50);
    } else {
        elmnt.style.opacity = "0.9";
        activeWindow(elmnt);
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
        elmnt.style.display = "none";
        activeWindow(elmnt);
    }
}

function activeWindow(elmnt) {
    //     for (let i = active.length - 1; i > -1; i--) {
    //         active[i].classList.remove("windowActive");
    //         elmnt.className += " windowActive";
    //     }
}


function showDirectoryWindow(id, array) {


    let window = document.getElementById("window_" + id);
    let ul = document.getElementById("window_" + id + "_list");

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for (let i = 0; i < array.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(array[i]));
        ul.appendChild(li);
    }
    fadeIn(window);

}