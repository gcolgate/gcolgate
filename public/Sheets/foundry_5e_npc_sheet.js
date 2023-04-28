
// create support for sheet


// support functions, store globally in window... maybe later elsewhere

window.DndAbility = function (ability) { return ability + " (" + Math.trunc((ability - 10) / 2) + ")" };

window.DndSpeed = function (name, ability, units) {
    if (!ability) return "";
    let value = Editable(sheet, ability, "npcNumInput");
    return '<li><span class="npcBold">' + name + '</span>' + value + units + '</li>';
}


// support styles (class=XXX), store globally in styles, maybe later elsewhere


createCSSSelector('.npcsetheader', "box-sizing: border-box; \
    color: rgb(88, 23, 13); \
    background-color: rgb(255, 215, 170); \
    color-scheme: light dark; \
    font-family: Mrs Eaves; \
    font-size: 30px; \
    font-variant-alternates: normal; \
    font-variant-caps: small-caps; \
    font-variant-east-asian: normal; \
    font-variant-ligatures: normal; \
    font-variant-numeric: normal; \
    font-variant-position: normal; \
    font-weight: 700; \
    line-height: 42px; \
    margin-bottom: -5px; \
    margin-left: 0px; \
    margin-right: 0px; \
    margin-top: -10px; \
    text-transform: capitalize");



createCSSSelector('.npcNumInput', ' \
    background-color: rgb(255, 215, 170); \
    border-top-style: hidden;\
    border-right-style: hidden;\
    border-left-style: hidden;\
    border-bottom-style: hidden;\
    color-scheme: light dark; \
    font-family: Mrs Eaves; \
    font-variant-alternates: normal; \
    font-variant-caps: small-caps; \
    font-variant-east-asian: normal; \
    font-variant-ligatures: normal; \
    font-variant-numeric: normal; \
    font-variant-position: normal; \
    font-weight: 300;');

createCSSSelector('.npcBold', "font-weight: 700;");

