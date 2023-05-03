
// create support for sheet


// support functions, store globally in window... maybe later elsewhere

window.DndAbilityBonus = function (ability) {
    return Math.trunc((eval(ability) - 10) / 2);
}




window.DndAbility = function (thing, ability) {
    return Editable(thing, ability, "npcNum") +
        " (" + window.DndAbilityBonus(ability)
        + ")";
}

window.DndSpeed = function (title, thing, ability, units) {
    if (!ability) return "";
    let value = Editable(thing, ability, "npcNumInput");
    return '<li><span class="npcBold">' + title + '</span>' + value + units + '</li>';
}

window.rollWeapon = function (owner, weapon) {

    let bonus = window.DndAbilityBonus(thing, owner.system.abilities.str.value);
    if (weapon.properties.fin) {
        let dex = window.DndAbilityBonus(thing, owner.system.abilities.dex.value);
        if (dex > bonus) {
            bonus = dex;
        }
    }
    let atk = weapon.attackBonus;
    let damage = weapon.damage.parts[0];
    socket.emit('roll', {
        roll: "1d20+" + owner.system.abilities.prof + "+" + bonus + atk,
        title: owner.name + "'s '" + weapon.name
    });
    socket.emit('roll',
        {
            roll: "1d20+" + owner.system.abilities.prof + "+" + bonus + atk
        });
    socket.emit('roll',
        { roll: damage + "+" + bonus }
    );
}

window.get5eDetails = function (thing) {
    // founddry 5e is poor, maybe write foudry cleaner and ahve cleaner sheets
    if (thing.system) {
        let array = thing.system.details.type ? details(thing.system.details.type) :
            [thing.system.details.background,]
            ;

        if (thing.system.details.alignment) { array.push(thing.system.details.alignment); }
        if (thing.system.details.race) { array.push(thing.system.details.race); }
        return commaString(array);
    } else {
    }
    return "";
};

window.drawItems = function (thing, node) {
    let text = "";
    for (let i = 0; i < thing.items.length; i++) {

        text += "<li>";
        text += parseSheet(thing.items[i], "itemSummary"); // no w
        text += "</li>";
    }
    return text;
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

