
function details(s) {
    let array = [];
    let keys = Object.keys(s);

    keys.forEach((key, index) => {

        if (s[key] && s[key] != "") {
            array.push(s[key]);
        }
    });
    return array;
}

function commaString(array) {
    let text = "";
    let first = true;
    for (let i = 0; i < array.length; i++) {
        if (!first) text += ", ";
        first = false;
        text += array[i];
    }
    return text;
}

function get5eDetails(sheet) {
    let array = details(sheet.system.details.type);

    if (sheet.system.details.alignment) array.push(sheet.system.details.alignment);
    if (sheet.system.details.race) array.push(sheet.system.details.race);
    return commaString(array)
}

async function showNPC(name) {
    console.log(name);
    let response = await fetch("./Sheets/foundry_5e_npc_sheet.html"); // TODO dont hardcode name
    const text = await response.text();
    response = await fetch("./Compendium/" + name);
    const sheet = await response.json();

    let newText = "";
    let state = 0;
    let code = "";
    for (let i = 0; i < text.length; i++) {

        switch (state) {
            case 0:
                if (text[i] == '@') { newText = ""; break; };
                if (text[i] == '{') { state = 1; code = ""; }
                else if (text[i] == '}') throw new Error("Mismatched '}");
                else newText += text[i];
                break;
            default:
                if (text[i] == '}') {
                    state--;
                    if (state == 0) {
                        console.log("Eval " + code);
                        newText += eval(code);
                    }
                    else {
                        code += '}';
                    }
                } else if (text[i] == '{') {
                    state++; code += '{';
                } else {
                    code += text[i];
                }
        }
    }
    createWindow(name, 0.4, 0.4, 0.3, 0.3); // todo better window placement
    document.getElementById("window_" + name + "_body").innerHTML = newText;
}

