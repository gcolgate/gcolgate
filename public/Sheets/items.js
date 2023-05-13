
// create support for sheet



window.ItemArmor = function (thing) {
    let s = thing.system;
    if (s.armor && s.armor.type && s.armor.value) {
        return span(s.armor.type + "Armor", s.armor.value);
    }
    return "";
};

window.MaybeDescription = function (description) {

    if (description.startsWith("Melee Weapon Attack:")) return "";
    if (description.startsWith("Ranged Weapon Attack:")) return "";
    return description;
};

window.ItemWeapon = function (thing, owner, full) {

    let s = thing.system;
    let atk = s.attackBonus;
    let damage = s.damage.parts;
    if (!atk) { atk = 0; }
    let answer = ""
    if (owner != undefined) {
        answer += "<button  onclick=\"window.rollWeapon('" + owner.id + "','" + thing.id + "')\">Attack</button>";

    }
    if (full) answer += "<div><span>Attack</span>" + atk + "<span> Damage: </span>" + commaString(damage);
    if (s.damage.versatile && s.damage.versatile != "")
        answer += "<div><span>Versatile</span>" + s.damage.versatile + "</div>";
    let props = [];
    if (s.properties.fin) props.push("Finesse");
    if (s.properties.lgt) props.push("Light");
    if (s.properties.thr) props.push("Thrown");
    if (s.properties.mgc) props.push("Magic");
    answer += "<div> " + commaString(props) + "</div>";
    if (s.range && s.range.value) {
        let longString = "";
        if (s.range.long && s.range.long != 0) {
            longString = "/" + s.range.long;
        }

        answer += "<div><span>Range</span>" + s.range.value + longString
            + " " + s.range.units + "</div>"

    }

    return answer;
};

window.SpellIsAreaEffect = function (thing, owner) {

    let area = thing.system.target.value;

    return (typeof area == "number");
}


window.SpellSaveDC = function (thing, owner) {

    if (thing.system.actionType != "save" || !thing.system.save) {
        return undefined;
    }
    let save = thing.system.save;

    if (save.dc != null) { // hadcoded save
        return save.dc
    }
    else {
        return (8 + window.GetStatSpellPowerBonus(owner) + window.GetProficiency(owner));
    }
}


window.DisplaySpellSaveDC = function (thing, owner) {

    if (thing.system.actionType != "save" || !thing.system.save) {
        return null;
    }
    let save = thing.system.save;
    let answer = save.ability + " Save  DC ";
    if (save.dc != null) { // hadcoded save
        answer += save.dc + " hardcoded";
        if (owner != undefined) {
            answer += "<button  onclick=\"window.rollSpellSaveAsWeaponAsAttackHomebrew('" + owner.id + "','" + thing.id + "')\">Attack</button>";

        }
    }
    else {
        answer += (8 + window.GetStatSpellPowerBonus(owner) + window.GetProficiency(owner));
        if (owner != undefined) {
            answer += "<button  onclick=\"window.rollSpellSaveAsWeaponAsAttackHomebrew('" + owner.id + "','" + thing.id + "')\">Attack</button>";

        }
    }
    return answer;
}


window.ItemSpell = function (thing, owner, full) {

    let answer = "";
    let area = window.SpellIsAreaEffect(thing, owner);
    if (area) {
        answer += "Area Effect " + area + " ";;

    }
    answer += window.DisplaySpellSaveDC(thing, owner);
    // let s = thing.system;
    // let atk = s.attackBonus;
    // let damage = s.damage.parts;
    // if (!atk) { atk = 0; }
    // let answer = ""
    // if (owner != undefined) {
    //     answer += "<button  onclick=\"window.rollWeapon('" + owner.id + "','" + thing.id + "')\">Roll</button>";

    // }
    // if (full) answer += "<div><span>Attack</span>" + atk + "<span> Damage: </span>" + commaString(damage);
    // if (s.damage.versatile && s.damage.versatile != "")
    //     answer += "<div><span>Versatile</span>" + s.damage.versatile + "</div>";
    // let props = [];
    // if (s.properties.fin) props.push("Finesse");
    // if (s.properties.lgt) props.push("Light");
    // if (s.properties.thr) props.push("Thrown");
    // if (s.properties.mgc) props.push("Magic");
    // answer += "<div> " + commaString(props) + "</div>";
    // if (s.range && s.range.value) {
    //     let longString = "";
    //     if (s.range.long && s.range.long != 0) {
    //         longString = "/" + s.range.long;
    //     }

    //     answer += "<div><span>Range</span>" + s.range.value + longString
    //         + " " + s.range.units + "</div>"

    // }

    return answer;
};

window.ItemMaybe = function (x, stringo) {
    if (x) return stringo;
    else return "";
};


createCSSSelector('.itemsetheader', "box-sizing: border-box; \
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



createCSSSelector('.itemSsetheader', "box-sizing: border-box; \
    color: rgb(88, 23, 13); \
    background-color: rgb(255, 215, 170); \
    color-scheme: light dark; \
    font-family: Mrs Eaves; \
    font-size: 20px; \
    font-variant-alternates: normal; \
    font-variant-caps: small-caps; \
    font-variant-east-asian: normal; \
    font-variant-ligatures: normal; \
    font-variant-numeric: normal; \
    font-variant-position: normal; \
    font-weight: 700; \
    margin-bottom: 0px; \
    margin-left: 0px; \
    margin-right: 0px; \
    margin-top: 0px; \
    text-transform: capitalize");

createCSSSelector('.itemNumInput', ' \
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

createCSSSelector('.itemBold', "font-weight: 700;");

