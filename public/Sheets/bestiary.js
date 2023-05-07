
// create support for sheet


// support functions, store globally in window... maybe later elsewhere

window.DndAbilityBonus = function (thing, ability) {
    return Math.trunc((eval(ability) - 10) / 2);
}




window.DndAbility = function (thing, ability) {
    return Editable(thing, ability, "npcNum") +
        " (" + window.DndAbilityBonus(thing, ability)
        + ")";
}

window.DndSpeed = function (title, thing, ability, units) {
    if (!ability) return "";
    let value = Editable(thing, ability, "npcNumInput");
    return '<li><span class="npcBold">' + title + '</span>' + value + units + '</li>';
}

window.rollWeapon = function (ownerId, weaponId) {

    let owner = registeredThings[ownerId];
    let weapon = registeredThings[weaponId];

    console.log('Weapon %o', weapon);

    let bonus = window.DndAbilityBonus(owner, owner.system.abilities[weapon.system.ability].value);
    if (weapon?.properties?.fin) {
        let dex = window.DndAbilityBonus(owner, owner.system.abilities.dex.value);
        if (dex > bonus) {
            bonus = dex;
        }
    }
    // should check if proficient here
    let prof = owner.system.attributes.prof;
    let atk = weapon.system.attackBonus;

    socket.emit('roll', {
        title: owner.name + "'s " + weapon.name,
        style: "dual",
        roll: "1d20+" + prof + "+" + bonus + "+" + atk,

    });

    for (let i = 0; i < weapon.system.damage.parts.length; i++) {
        let damage = [...weapon.system.damage.parts[i]];
        let damageDice = damage[0].replace('@mod', bonus);
        damage.shift();
        let t = commaString(damage);

        socket.emit('roll',
            {
                title: "Damage",
                roll: damageDice,
                post: t
            }
        );
    }
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
    console.log("THing %o", thing);
    for (let i = 0; i < thing.items.length; i++) {
        let item = thing.items[i];
        text += "<li>";
        console.log("re " + item.file + " %o", registeredThings[item.file]);
        console.log("rs " + item.page + " %o", registeredThings[item.page]);

        text += parseSheet(registeredThings[item.file], item.page, undefined, thing); // no w
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

