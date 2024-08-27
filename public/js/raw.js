
import { MakeAvailableToParser, div, Editable, span } from './characters.js';
let recursion = 0;

function indent(amt) {
    let answer = "";
    for (let i = 0; i < amt; i++) {

        answer += "⇀⇀"

    }
    return answer;
}


function RawEditorArray(current, thing, path) {
    let answer = "";
    if (!current)
        return "";

    if (recursion > 4) {
        return "";
    }
    for (let key = 0; key < current.length; key++) {
        let item = current[key];
        let keyText = "[" + key + "]";
        switch (typeof item) {
            case "string":
                answer += div(indent(recursion) + (span(keyText + ":   ", Editable(thing, "thing" + path + keyText, "itemsetheadershort")))); break;
            case "number":
                answer += div(indent(recursion) + (span(keyText + ":   ", Editable(thing, "thing" + path + keyText, "itemsetheadershort")))); break;
            case "bigint":
                console.log("BIgInt");
                break;
            case "boolean":
                console.log("boolean");
                break;
            case "symbol":
                console.log("symbol");
                break;
            case "undefined": break;
            case "object":
                recursion++;
                if (item instanceof Array) {
                    console.log("Array for " + keyText);
                    answer += div(indent(recursion - 1) + (keyText));
                    RawEditorArray(item, thing, path + keyText);

                }
                else if (item instanceof Map) {
                    answer += div(indent(recursion - 1) + (keyText));

                    answer += indent(recursion) + RawEditor(item, thing, path + keyText);

                    console.log("Map");
                } else if (item instanceof Set)
                    console.log("Set");
                else if (item instanceof Date)
                    console.log("Date");
                else {
                    answer += div(indent(recursion - 1) + (keyText));

                    answer += indent(recursion) + RawEditor(item, thing, path + keyText);

                }

                console.log("object");
                recursion--;
                break;
            case "function": break;

        }
    }
    return answer;
}

export function RawEditor(current, thing, path) {

    if (!current)
        return "";

    if (recursion > 4) {
        return "";
    }
    console.log("Path " + path);
    let keys = Object.keys(current);
    let answer = "";
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let item = current[key];
        let keyText = '.' + key;
        switch (typeof item) {
            case "string":
                console.log("path " + path + key);
                answer += div(indent(recursion) + (span(key + ":   ", Editable(thing, "thing" + path + keyText, "itemsetheadershort")))); break;
            case "number":
                answer += div(indent(recursion) + (span(key + ":   ", Editable(thing, "thing" + path + keyText, "itemsetheadershort")))); break;
            case "bigint":
                console.log("BIgInt");
                break;
            case "boolean":
                console.log("boolean");
                break;
            case "symbol":
                console.log("symbol");
                break;
            case "undefined": break;
            case "object":
                recursion++;
                if (item instanceof Array) {
                    console.log("Array for " + key);
                    answer += div(indent(recursion - 1) + (key));
                    RawEditorArray(item, thing, path + keyText);


                }
                else if (item instanceof Map) {
                    answer += div(indent(recursion - 1) + (key));

                    answer += indent(recursion) + RawEditor(item, thing, path + keyText);

                    console.log("Map");
                } else if (item instanceof Set)
                    console.log("Set");
                else if (item instanceof Date)
                    console.log("Date");
                else {
                    answer += div(indent(recursion - 1) + (key));

                    answer += indent(recursion) + RawEditor(item, thing, path + keyText);

                }

                console.log("object");
                recursion--;
                break;
            case "function": break;

        }
    }
    return answer;
}
MakeAvailableToParser('RawEditor', RawEditor);
