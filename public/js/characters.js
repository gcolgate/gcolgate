
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

function Editable(sheet, s, className) {

    return '<input class="' + className + ' type="text" id="' + s + '" value="' + eval(s) + '">';

}

registeredSheets = {};


async function showNPC(name) {
    console.log(name);
    let w = createWindow(name, 0.4, 0.4, 0.3, 0.3); // todo better window placement
    let sheetName = "foundry_5e_npc_sheet";

    if (!registeredSheets[sheetName]) {
        // load sheet and js (change to promise all) for speed) for this sheet
        let response = await fetch("./Sheets/" + sheetName + ".html"); // TODO dont hardcode name
        const text = await response.text();
        response = await fetch("./Sheets/" + sheetName + ".js"); // TODO dont hardcode name
        const js = await response.text();
        eval(js);
        registeredSheets[sheetName] = text;
    }

    let text = `${registeredSheets[sheetName]}`;
    //  then get the sheet
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
                else if (text[i] == '}') throw new Error("Mismatched '} fileSOFar: " + newText + "\ncodeBeingEvaluated " + code);
                else newText += text[i];
                break;
            default:
                if (text[i] == '}') {
                    state--;
                    if (state == 0) {
                        try {
                            console.log("Eval " + code);
                            newText += eval(code);
                        } catch (error) {
                            throw new Error(error + "  fileSOFar: " + newText + "\ncodeBeingEvaluated " + code);
                        }
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
    document.getElementById("window_" + name + "_body").innerHTML = newText;
}

