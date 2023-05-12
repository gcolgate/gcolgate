const chat_window_name = "window_chat";


function sendChat(msg) {
    socket.emit('chat', msg);
    let formatted = '<span class=chatUser">' + 'user:' + joined + '</span> <p>' + msg + '</p>';

    addChat(formatted);
}



function showChatWindow(array) {

    let w = createOrGetWindow("chat", .2, .9, .8, 0);
    bringToFront(w);
    let ul = document.getElementById(chat_window_name + "_list");
    ul.style.height = (w.clientHeight - ul.offsetTop - 60) + "px";
    ul.style.overflow = "auto";
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    //  ul.style.minHeight = "100%";
    //  ul.style.marginBottom = "-50px";

    for (let i = 0; i < array.length; i++) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(array[i]));

        ul.appendChild(li);
    }
    var footer = document.createElement("footer");
    var chatInput = document.createElement("input");
    footer.appendChild(chatInput);
    ul.insertAdjacentElement('afterend', footer);
    chatInput.onchange = function (evt) {
        if (evt.target.value.trim().startsWith('/r ')) {
            console.log(evt.target.value.substr(3));
            socket.emit('roll', { roll: evt.target.value.substr(3) })

        } else if (evt.target.value.trim().startsWith('/roll ')) {
            console.log(evt.target.value.substr(6));
            socket.emit('roll', { roll: evt.target.value.substr(6) });
        }
        else {
            sendChat(evt.target.value);
        }

        evt.target.value = "";
    };

    fadeIn(w);

}

function addChat(text) {
    let ul = document.getElementById(chat_window_name + "_list");

    var li = document.createElement("li");
    var msg = document.createElement('div');
    msg.innerHTML = text;
    li.appendChild(msg);
    ul.appendChild(li);
    li.scrollIntoView();

}