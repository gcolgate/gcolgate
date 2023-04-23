const chat_window_name = "window_chat";


function sendChat(msg) {
    socket.emit('chat', msg);
    let formatted = '<span class=chatUser">' + 'user:' + login.value + '</span> <p>' + msg + '</p>';

    addChat(formatted);
}



function showChatWindow(array) {

    createWindow("chat", 400, 900, window.innerWidth - 400, 80);
    let w = document.getElementById(chat_window_name);
    let ul = document.getElementById(chat_window_name + "_list");
    let body = document.getElementById(chat_window_name + "_body");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    ul.style.minHeight = "100%";
    ul.style.marginBottom = "-50px";

    for (let i = 0; i < array.length; i++) {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(array[i]));
        // li.addEventListener('click', clickOnNPC, false);
        ul.appendChild(li);
    }
    var footer = document.createElement("footer");
    var chatInput = document.createElement("input");
    footer.appendChild(chatInput);
    body.appendChild(footer);
    chatInput.onchange = function (evt) {
        sendChat(evt.target.value);
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


}