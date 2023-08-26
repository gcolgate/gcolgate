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
        if (element.className === "window") {
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
function CreateWindowTitle(w, windowName, Title, closes = true) {
    w.id = windowName;
    w.className = "window";
    let title = document.createElement("div");
    title.className = "windowtitle";
    title.id = windowName + "_title";
    let text = document.createTextNode(Title);
    title.appendChild(text);
    if (closes) {
        let closeButton = document.createElement("div");
        closeButton.innerHTML = "×";
        title.appendChild(closeButton);
        closeButton.onclick = function () {
            fadeOut(w);
        };
    }
    w.appendChild(title);
    dragElement(w, title);
    return title;

}

function createOrGetWindow(id, width, height, left, top) {

    let windowName = "window_" + id;
    let w = document.getElementById(windowName);

    if (!w) {
        let group = document.getElementById("windowGroup");
        w = document.createElement("div");

        width *= window.innerWidth;
        height *= window.innerHeight;
        left *= window.innerWidth;
        top *= window.innerHeight;


        w.contentHeight = height;

        let title = CreateWindowTitle(w, windowName, id, true);

        w.windowTitle = title;

        group.appendChild(w);

        let body = document.createElement("div");
        body.id = windowName + "_body";
        body.className = "windowbody";
        w.appendChild(body);
        w.body = body;
        w.body.style.height = (w.clientHeight - 40) + "px";

        w.style.zIndex = 9 + windows.length;
        w.style.backgroundColor = "#ffffff";


        // Event listener for clicks
        w.addEventListener('mousedown', clickToBringWindowIntoFocus);

        w.resizeObserver = new ResizeObserver((entries) => {
            // w.addEventListener('mouseup', function (evt) {6main.js
            //     console.log("Mou8se up");
            //     w = evt.currentTarget;
            //     w.body.style.height = (w.clientHeight - 40) + "px";
            //     // w.body.style.width = w.width;
            // });
            w.style.width = body.style.width;
            w.style.height = body.style.height + 40;
            console.log("Size changed");
        });
        windows.push(w);


        w.resizeObserver.observe(body);
    }

    fadeIn(w);

    return w;

}

function createOrGetChatWindow(id, width, height, left, top) {

    let windowName = "window_" + id;
    let w = document.getElementById(windowName);

    if (!w) {
        let group = document.getElementById("windowGroup");
        w = document.createElement("div");

        width *= window.innerWidth;
        height *= window.innerHeight;
        left *= window.innerWidth;
        top *= window.innerHeight;


        w.contentHeight = height - 80;

        CreateWindowTitle(w, windowName, id, true);



        let list = document.createElement("ul");
        list.className = "compendiumSyle";
        list.id = windowName + "_list";
        w.appendChild(list);
        group.appendChild(w);

        let body = document.createElement("div");
        body.id = windowName + "_body";
        w.appendChild(body);

        body.className = "windowBody";


        // variable styles
        w.style.top = top + "px";
        w.style.left = left + "px";
        w.style.zIndex = 9 + windows.length;
        w.style.backgroundColor = "#ffffff";
        w.style.width = width + "px";
        w.style.height = height + "px";


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



        CreateWindowTitle(w, windowName, id, true);


        let list = document.createElement("ul");
        list.className = "compendiumSyle";
        list.id = windowName + "_list";
        list.style.marginTop = "0px";

        w.appendChild(list);
        group.appendChild(w);

        // let body = document.createElement("div");
        // body.id = windowName + "_body";
        // w.appendChild(body);




        // some variable parameters
        w.style.top = top + "px";
        w.style.left = left + "px";
        w.style.zIndex = 9 + windows.length;
        w.style.width = width + "px";
        w.style.height = height + "px";
        // Event listener for clicks
        w.addEventListener('mousedown', clickToBringWindowIntoFocus);


        windows.push(w);
    }


    fadeIn(w);
    return w;

}

function clickOne(selected) {

    let ul = selected.parentElement;
    const listArray = [...ul.children];
    for (let i = 0; i < listArray.length; i++) {
        listArray[i].classList.remove('selected');
    }
    selected.classList.add('selected');


}

function createOrGetLoginWindow(width, height, left, top, players) {

    let id = "Login";

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
        CreateWindowTitle(w, windowName, id, false);


        let ul = document.createElement("ul");
        ul.className = "compendiumSyle";
        ul.style.marginTop = "0px";
        w.appendChild(ul);
        group.appendChild(w);


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

        const okButton = document.createElement('button')
        okButton.type = "submit"; // not sure I need this

        for (let i = 0; i < players.players.length; i++) {
            let li = document.createElement("li");

            li.onclick = () => {
                clickOne(li);
                okButton.selected = li;
            };

            li.appendChild(document.createTextNode(players.players[i].name));
            ul.appendChild(li);

        }



        // Set the button text to 'Can you click me?'
        okButton.innerText = 'OK'
        okButton.password = ''

        window.onkeydown = function (event) {
            if (event.key == "Enter") {
                okButton.click();
            }
        }

        let footer = document.createElement("footer");
        let passwordInput = document.createElement("input");
        passwordInput.title = "password";
        passwordInput.id = "password";

        passwordInput.onchange = function (evt) {
            okButton.password = evt.target.value;
        }
        passwordInput.type = "password";
        footer.appendChild(document.createTextNode("Password:"));
        footer.appendChild(passwordInput);
        footer.appendChild(okButton);
        ul.insertAdjacentElement('afterend', footer);
        okButton.onclick = function (evt) {
            if (okButton.selected) {
                socket.emit('join', { player: okButton.selected.innerText, password: okButton.password });
                fadeOut(w);
                window.onkeydown = function (event) {
                };
            }
            else { alert("Please select a player"); }
        }

        windows.push(w);
    }


    fadeIn(w);
    return w;

}
function dragElement(elmnt, header) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
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
        thingDragged = null;
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



