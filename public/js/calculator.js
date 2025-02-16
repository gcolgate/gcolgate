
function precedence(operator) {
    switch (operator) {
        case "^":
            // case 'dice':
            return 3;
        case "*":
        case "/":
            return 2;
        case "+":
        case "-":
            return 1;
        default:
            return 0;
    }
}

function infixToPostfix(expression) {
    let postfix = [];
    var infix = [];
    let dices = "";
    // Helper function to get the precedence of the operator


    for (var i = 0; i < expression.length; i++) {
        let c = expression[i].type;
        switch (c) {
            case "number": postfix.push(expression[i]); break;
            default:
                if (c === "+" || c === "-" || c === "*" || c === "/" || c === "^" || c === "dice") {
                    while (c != "dice" && infix.length > 0 && (precedence(c) <= precedence(infix[infix.length - 1].type))) {
                        postfix.push(infix.pop());
                    }
                    infix.push(expression[i])
                }
        }
    }
    while (infix.length > 0) {
        postfix.push(infix.pop());
    }
    let answer = [];
    for (let i = 0; i < postfix.length; i++) {
        let node = postfix[i];
        let c = node.type;
        switch (c) {
            // case "dice": {
            //     let sides = answer.pop();
            //     let numDice = answer.pop();
            //     let d = DiceTermRoll(numDice, sides);
            //     answer.push(d.value);
            //     dices += d.text;
            //     break;
            // }
            case "number":
                answer.push(node.value);
                break;
            case '+': {
                if (answer.length >= 2) {
                    let n = answer.pop();
                    let n2 = answer.pop();
                    answer.push(n + n2);
                }
            }
                break;
            case '-': {
                if (answer.length >= 2) {
                    let n = answer.pop();
                    let n2 = answer.pop();
                    answer.push(n2 - n);
                }
            }
                break;
            case '*': {
                if (answer.length >= 2) {
                    let n = answer.pop();
                    let n2 = answer.pop();
                    answer.push(n * n2);
                }
            }
                break;
            case '/': {
                if (answer.length >= 2) {
                    let n = answer.pop();
                    let n2 = answer.pop();
                    answer.push(n2 / n);
                }
            }
                break;
        }

    }


    return { val: answer[0], rolls: dices };
}

function isWhitespace(c) {
    return c === ' '
        || c === '\n'
        || c === '\t'
        || c === '\r'
        || c === '\f'
        || c === '\v'
        || c === '\u00a0'
        || c === '\u1680'
        || c === '\u2000'
        || c === '\u200a'
        || c === '\u2028'
        || c === '\u2029'
        || c === '\u202f'
        || c === '\u205f'
        || c === '\u3000'
        || c === '\ufeff'
};


function isOperator(c) {
    return c === '+' || c === '-' || c === '/' || c === '*';
}


function isVariable(c) {
    // because of the d20 notation, we can't support variabnles with numbers inside
    // lime myVariable3, it will be parsed as myVariable and 3
    // d3 would be d and 3
    // this would have to be handled outside excaping these variables somehow
    return !isWhitespace(c) && !isOperator(c) && (c < '0' || c > '9');

}


function stripHtml(s) { // this onlyu removes one level of html
    if (s.includes('<') && s.includes('>')) {
        // only works in browser
        let doc = new DOMParser().parseFromString(s, 'text/html');
        return doc.body.textContent || "";
    }
    return s;
}
// entry point
export function calculate(s) {
    let original = s.split('').join('');

    s = stripHtml(s);
    let state = 'start';
    let token = "";
    let node = [];
    let string = s.toLowerCase() + " ";
    for (let i = 0; i < string.length; i++) {
        let c = string[i];
        switch (state) {
            case 'start': // expect a number or a 'd'

                if (c >= '0' && c <= '9') {
                    token = "";
                    token += c;
                    state = "number";
                } else if (isVariable(c)) {
                    token = "";
                    token += c;
                    state = "word";
                } else if (c === '+') {
                    if (node.length == 0) node.push({ type: "number", value: 0 });
                    node.push({ type: "+" });
                } else if (c === '-') {
                    if (node.length == 0) node.push({ type: "number", value: 0 });
                    node.push({ type: "-" });
                } else if (c === '*') {
                    if (node.length == 0) node.push({ type: "number", value: 1 });
                    node.push({ type: "*" });
                } else if (c === '/') {
                    if (node.length == 0) node.push({ type: "number", value: 1 });
                    node.push({ type: "/" });
                }
                break;

            case "word":
                if (isVariable(c)) {
                    token += c;
                } else {
                    // skip variables for now
                    //  if (token === 'd') {
                    //       node.push({ type: "dice" });
                    //   } else {
                    //       node.push({ type: "eval", value: token });
                    //   }
                    state = "start";
                    i--;
                }
                break;


            case "number":
                if (c >= '0' && c <= '9') {
                    token += c;
                } else {
                    let count = parseInt(token);
                    node.push({ type: "number", value: count });
                    state = "start";
                    i--;
                }
                break;
        }

    }

    let answer = infixToPostfix(node);
    answer.expression = original

    return answer.val;
}
