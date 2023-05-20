
// create support for sheet



window.DndAbilityBonus = function (thing, ability) {
    return Math.trunc((eval(ability) - 10) / 2);
}

window.GetStatSpellPowerBonus = function (owner) {
    let stat = owner.system.attributes.spellcasting;
    if (stat) {
        return window.DndAbilityBonus(owner, owner.system.abilities[stat].value);
    }
    return -4;
}

window.GetProficiency = function (owner) {
    if (owner.system.attributes.prof) {
        return owner.system.attributes.prof;
    }
    return 0;
}


// support functions, store globally in window maybe later elsewhere
window.dndNiceStatNames = {
    str: "Strength", int: "Intelligence", con: "Constitution",
    dex: "Dexterity", cha: "Charisma", wis: "Wisdom"
}


window.rollStat = function (ownerId, stat, isSave) {

    let owner = registeredThings[ownerId];


    let bonus = window.DndAbilityBonus(owner, owner.system.abilities[stat].value);

    // should check if proficient here
    let prof = 0;

    if (isSave) {
        if (owner.system.abilities[stat].proficient)
            prof = owner.system.attributes.prof;
        socket.emit('roll', {
            title: owner.name + ' ' + window.dndNiceStatNames[stat] + " Save ",
            style: "dual",
            roll: "1d20+" + prof + "+" + bonus
        });

    } else {
        prof = owner.system.attributes.prof;
        socket.emit('roll', {
            title: owner.name + ' ' + window.dndNiceStatNames[stat] + " Check ",
            style: "dual",
            roll: "1d20+" + bonus
        });
    }
}


window.DndAbility = function (thing, stat) {
    let answer = Editable(thing, thing.system.abilities[stat].value, "npcNum") +
        " (" + window.DndAbilityBonus(thing, thing.system.abilities[stat].value)
        + ')<input type ="checkbox"' + (thing.system.abilities[stat].proficient != 0 ? " checked " : "") + " > Prof</input > "; // todo use label not text word prof

    answer += "<button  onclick=\"window.rollStat('" + thing.id + "','" + stat + "', false)\">Check</button>";
    answer += "<button  onclick=\"window.rollStat('" + thing.id + "','" + stat + "', true)\">Save</button>";
    return answer;

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


    let rolls = [];

    rolls.push({
        title: owner.name + "'s " + weapon.name,
        style: "dual",
        roll: "1d20+" + prof + "+" + bonus + "+" + atk,

    });

    for (let i = 0; i < weapon.system.damage.parts.length; i++) {
        let damage = [...weapon.system.damage.parts[i]];
        let damageDice = damage[0].replace('@mod', bonus);
        damage.shift();
        let t = commaString(damage);

        rolls.push(
            {
                title: weapon.name + " " + t + " damage",
                roll: damageDice,

            }
        );

    }

    socket.emit('rolls', rolls);
}


window.rollSpell = function (ownerId, spellId) {

    let owner = registeredThings[ownerId];
    let spell = registeredThings[spellId];


    let bonus = window.DndAbilityBonus(owner, owner.system.abilities[spell.system.ability].value);
    if (weapon?.properties?.fin) {
        let dex = window.DndAbilityBonus(owner, owner.system.abilities.dex.value);
        if (dex > bonus) {
            bonus = dex;
        }
    }
    // should check if proficient here
    let prof = owner.system.attributes.prof;
    let atk = weapon.system.attackBonus;

    let rolls = [];

    rolls.push({
        title: owner.name + "'s " + weapon.name,
        style: "dual",
        roll: "1d20+" + prof + "+" + bonus + "+" + atk,

    });

    for (let i = 0; i < weapon.system.damage.parts.length; i++) {
        let damage = [...weapon.system.damage.parts[i]];
        let damageDice = damage[0].replace('@mod', bonus);
        damage.shift();
        let t = commaString(damage);


        rolls.push(
            {
                title: weapon.name + " " + t + " damage",
                roll: damageDice
            }
        );
    }
    socket.emit('rolls', rolls);

};

window.GetArmorClass = function (thing) {

    let ac = 0;

    if (thing.system.attributes.ac.flat) { ac = thing.system.attributes.ac.flat; }
    // assumes default calculation
    let startingAc = 10;
    let adds = 0;
    let dexMax = 100000;

    for (let i = 0; i < thing.items.length; i++) {
        let item = registeredThings[thing.items[i].file];
        if (item.system.equipped && item.system.armor && item.system.armor.value) {

            switch (item.system.armor.type) {
                case "light": case "medium": case "heavy":
                    startingAc = item.system.armor.value;
                    break;
                case "shield":
                default:
                    adds += item.system.armor.value;
                    break;
            }
            if (item.system.armor.dex) {
                if (item.system.armor.dex < dexMax) {
                    dexMax = item.system.dex;
                }
            }
        }
    }
    let dexBonus = window.DndAbilityBonus(thing, thing.system.abilities.dex.value);
    if (dexBonus > dexMax) dexBonus = dexMax;
    let ac2 = startingAc + adds + dexBonus;
    return Math.max(ac, ac2);

};


window.rollSpellSaveAsWeaponAsAttackHomebrew = function (ownerId, spellId) {

    let owner = registeredThings[ownerId];
    let spell = registeredThings[spellId];

    let bonus = window.SpellSaveDC(spell, owner) - 10;

    let stat = window.GetStatSpellPowerBonus(owner);
    let rolls = [];

    rolls.push({
        title: owner.name + "'s " + spell.name + " roll or constant " + (bonus + 10),
        style: "dual",
        roll: "1d20+" + bonus + " vs " + spell.system.save.ability

    });

    for (let i = 0; i < spell.system.damage.parts.length; i++) {
        let damage = [...spell.system.damage.parts[i]];
        let damageDice = damage[0].replace('@mod', stat);
        damage.shift();
        let t = commaString(damage);

        rolls.push(
            {
                title: t + " damage",
                roll: damageDice,

            }
        );
    }
    socket.emit('rolls', rolls);

};


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
        let item = thing.items[i];
        text += "<div>";
        console.log("re " + item.file + " %o", registeredThings[item.file]);
        console.log("rs " + item.page + " %o", registeredThings[item.page]);

        text += parseSheet(registeredThings[item.file], item.page, undefined, thing); // no w
        text += "</div>";
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

