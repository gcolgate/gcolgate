import { bringToFront, createOrGetChatWindow, fadeIn } from './window.js';
import { socket } from './main.js';




var login;

export function sendChat(msg) {
    socket.emit('chat', msg);
    let formatted = '<div class="chatsender">' + 'user:' + login + '</div> <div class="chattext">' + msg + '</div>';

    addChat(formatted);
}

export function setLogin(name) {
    login = name;
}


export function showChatWindow(array) {
    const chat_window_name = "window_chat";
    let w = createOrGetChatWindow("chat", .2, .9, .8, 0);
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
        addChat(array[i]);

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

export function addChat(text) {
    const chat_window_name = "window_chat";
    let ul = document.getElementById(chat_window_name + "_list");

    var li = document.createElement("div");

    console.log(text);
    li.insertAdjacentHTML('beforeend', text);


    ul.appendChild(li);
    li.scrollIntoView();

}


