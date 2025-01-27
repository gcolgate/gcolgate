import { bringToFront, createOrGetChatWindow, fadeIn } from './window.js';
import { socket } from './main.js';

import { parseSheet, GetRegisteredThing, ensureThingLoadedElem } from './characters.js';



var login;
var savedChats = [];

export function sendChat(msg) {

    socket.emit('chat', msg);
     
}

function stripRoll(id) {
    if (id.startsWith("roll_")) {
        return id.substr(5);
    }
    return id;
}

export function setLogin(name) {
    login = name;
}

export function update_roll(change) {
 
    let d =  document.getElementById(change.thing);
   // await ensureThingLoadedElem(rollMove.ownerId, rollMove.ownerId);
    let rollMove = savedChats[stripRoll(change.thing)];
    let owner = GetRegisteredThing(rollMove.ownerId);

    let thing = rollMove; // do I need to register it? 
    eval(change.change);
  
    d.innerHTML =  parseSheet(thing, "moveroll", null, owner, undefined);
 

}
function compareChatTimes(a, b) {
    return a.time - b.time;
  }

export function showChatWindow(chatObject) {
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

    let keys = Object.keys(chatObject);
    let array = [];
    for (let i = 0; i < keys.length; i++) {
        array.push(chatObject[keys[i]]);

    } 
     array.sort(compareChatTimes);

    for (let i = 0; i < array.length; i++) {
        console.log(array[i].time)
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
            sendChat({ chat: evt.target.value});
        }

        evt.target.value = "";
    };

    fadeIn(w);

}

export async function addChat(chat) {
    const chat_window_name = "window_chat";
    let ul = document.getElementById(chat_window_name + "_list");

    var li = document.createElement("div");

    console.log("Add chat %o" , chat);
    let text = chat.chat; 
    let rollMove = chat.rollMove;
    if(rollMove) {
        await ensureThingLoadedElem(rollMove.ownerId, rollMove.ownerId);
        let owner = GetRegisteredThing(rollMove.ownerId);

        savedChats[chat.id] = rollMove;
    
        let thing = rollMove; // do I need to register it? 
        text = parseSheet(thing, "moveroll", null, owner, undefined);
    
    
    }
    li.insertAdjacentHTML('beforeend', "<div class='chatsender' id='"+ chat.id +"'>" + chat.sender + "</div>" + text  );
    


    ul.appendChild(li);
    li.scrollIntoView();

}
 


// export async function addChatRollMove(rollMove) {
//     const chat_window_name = "window_chat";
//     let ul = document.getElementById(chat_window_name + "_list");

//     var li = document.createElement("div");
 

//     await ensureThingLoadedElem(rollMove.ownerId, rollMove.ownerId);
//     let owner = GetRegisteredThing(rollMove.ownerId);

//     let thing = rollMove; // do I need to register it? 
//     let text = parseSheet(thing, "moveroll", null, owner, undefined);



//     console.log("Roll chat :" + text);
//     li.insertAdjacentHTML('beforeend', text);


//     ul.appendChild(li);
//     li.scrollIntoView();

// }

