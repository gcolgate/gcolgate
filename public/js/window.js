// const metaTag = document.createElement("meta");
// metaTag.name = "viewport";
// metaTag.content = "user-scalable=0";
// document.getElementsByTagName("head")[0].appendChild(metaTag);

var contentHeight = 600 - 80;

function createWindow(id, width, height, left, top) {

    let windowName = "window_" + id;
    let w = document.getElementById(name);

    if (!w) {
        let group = document.getElementById("windowGroup");
        w = document.createElement("div");
        w.style = "display: initial;"

        w.style.position = "absolute";
        if (top === undefined) top = (window.innerHeight - height) / 2;
        if (left === undefined) left = (window.innerWidth - width) / 2;

        w.style.top = top + "px";
        w.style.left = left + "px";
        w.style.zIndex = "9";
        w.style.backgroundColor = "#ffffff";
        w.style.width = width + "px";
        w.style.height = height + "px";
        w.style.borderRadius = "8p 8px 0 0x";
        w.style.boxShadow = "8px 8px 6px -6px black";
        w.style.opacity = "0.9";
        w.style.display = "none";

        contentHeight = height - 80;

        w.id = windowName;
        w.class = "window";
        let title = document.createElement("div");
        title.class = "purple";
        title.innerHtml = id;
        let closeButton = document.createElement("b");
        closeButton.innerHTML = "×";
        title.appendChild(closeButton);

        title.style.padding = "10px";
        title.style.zIndex = "10";
        title.style.backgroundColor = "black";
        title.style.color = "#fff";
        title.style.borderRadius = "4px 4px 0 0";
        title.style.height = "40px";
        title.style.justifyContent = "space - between";
        title.style.display = "flex";
        title.style.touchAction = "none";


        let list = document.createElement("ul");
        list.class = "popup";
        list.id = windowName + "_list";
        w.appendChild(title);
        w.appendChild(list);
        group.appendChild(w);

        let body = document.createElement("div");
        body.id = windowName + "_body";
        w.appendChild(body);


        closeButton.onclick = function () {
            fadeOut(w);
            window.style.display = "none";
        };
        dragElement(w, title);

    }

    fadeIn(w);
    lastWindow = w;

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



