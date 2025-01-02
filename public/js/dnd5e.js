import { socket } from './main.js';
import { parseSheet, details, Editable, MakeAvailableToHtml, chkDiv, div, GetRegisteredThing, MakeAvailableToParser, signed, span, commaString, formatRemoveButton } from './characters.js';



function ItemArmor(thing) {
    let s = thing;
    if (s.armor && s.armor.type && s.armor.value) {
        return span(s.armor.type + "Armor", s.armor.value);
    }
    return "";
};
MakeAvailableToParser('ItemArmor', ItemArmor);

function rolldice(dice) {
    let rolls = []

    rolls.push(
        {
            title: dice,
            roll: dice,

        }
    );

    socket.emit('rolls', rolls);
}
MakeAvailableToHtml('rolldice', rolldice);


function MaybeDescription(description) {
    if (!description) return "";

    if (description.startsWith("Melee Weapon Attack:")) return "";
    if (description.startsWith("Ranged Weapon Attack:")) return "";
    let outDescription = '<div class="itemtext"  >';


    let state = "normal";
    let roll = "";
    //this could be faster but this is simple
    // go through the text and change certain things to meaningful things
    // did not come up with this scheme. TODO: DO this on convert instead.
    for (let i = 0; i < description.length; i++) {
        let c = description[i];
        if (state === "normal") {
            if (c === "@") { // links. for now ignore
                state = "link";
                continue;

            } else if (c === "[") {
                state = 0;
                continue;
            }
            outDescription += description[i];
        } else
            /// links. for now ignore just print link name
            if (state === "link") {
                if (c.match(/[a-zA-Z]/))
                    continue;
                if (c === "[") {
                    state = "word";
                    continue;
                }
                state = 0;
            } else
                // rolls
                if (typeof state == "number") {

                    if (c === "[") {
                        state++;
                        continue;
                    }
                    if (c == "]") {
                        state--;
                        if (state < 0) {
                            state = "normal";
                            outDescription += "<button  onclick=\"htmlContext.rolldice('" + roll.substring(2) + "')\">" + roll.substring(2) + "</button>";
                            roll = "";
                        }
                        continue;
                    }
                    roll += description[i];
                } else if (state === "word") {

                    if (c === "]") {
                        state = 0;
                        continue
                    }
                    outDescription += description[i];
                }
    }
    outDescription += "</div>";
    return outDescription;
}
MakeAvailableToParser('MaybeDescription', MaybeDescription);


function ItemWeapon(thing, owner, full) {

    let s = thing;
    let atk = s.attackBonus;
    let damage = s.damage.parts;
    if (!atk) { atk = 0; }
    let answer = '';
    if (owner != undefined && !owner.isptba) {
        answer += "<button  onclick=\"htmlContext.rollWeapon('" + owner.id + "','" + thing.id + "')\">Damage</button>";
        //  include applydamage button on roll need to decide who is target
    }
    if (full && atk != 0) answer += div(" <span>Attack</span> " + atk + "<span> Damage: </span>" + commaString(damage));
    else if (full) answer += div("<span> Damage: </span > " + commaString(damage));
    if (s.damage.versatile && s.damage.versatile != "")
        answer += div("<span>Versatile</span>" + s.damage.versatile);



    answer += div(commaString(thing.types));
    if (s.range && s.range.value) {
        let longString = "";
        if (s.range.long && s.range.long != 0) {
            longString = "/" + s.range.long;
        }

        answer += div("<span>Range</span> " + s.range.value + longString
            + " " + s.range.units);

    }
    if (career_value) {
        answer = answer.split("@mod").join(career_value + " ");
    }

    return div(answer);
}
MakeAvailableToParser('ItemWeapon', ItemWeapon);

function SpellIsAreaEffect(thing, owner) {

    let area = thing?.target?.value;

    return (typeof area == "number" && area > 1);
}


function SpellSaveDC(thing, owner) {

    if (thing.actionType != "save" || !thing.save) {
        return undefined;
    }
    let save = thing.save;

    if (save.dc != null) { // hadcoded save
        return save.dc
    }
    else {
        return (8 + GetStatSpellPowerBonus(owner) + GetProficiency(owner));
    }
}


function DisplaySpellSaveDC(thing, owner) {

    if (thing.actionType != "save" || !thing.save) {
        return "";
    }
    let save = thing.save;
    let answer = String(save.ability).toUpperCase() + " save  DC ";
    if (save.dc != null) { // hadcoded save
        answer += save.dc + " hardcoded";
        if (owner != undefined) {
            answer += "<button  onclick=\"htmlContext.rollSpellSaveAsWeaponAsAttackHomebrew('" + owner.id + "','" + thing.id + "')\">Attack</button>";

        }
    }
    else {
        answer += (8 + GetStatSpellPowerBonus(owner) + GetProficiency(owner));
        if (owner != undefined) {
            answer += "<button  onclick=\"htmlContext.rollSpellSaveAsWeaponAsAttackHomebrew('" + owner.id + "','" + thing.id + "')\">Attack</button>";

        }
    }
    return answer;
}


function ItemSpellOrFeat(thing, owner, spell) {

    let answer = '';

    let circle = " &#x25EF; "

    if (spell)
        answer += "level " + thing.level + circle + thing.school + circle;


    if (thing?.school?.components) {
        let space = false;
        if (thing.school.components.vocal) { answer += space + "V"; space = true; }
        if (thing.school.components.somatic) { answer += space + "S"; space = true; }
        if (thing.school.components.material) { answer += space + "M"; space = true; }
        if (space) answer += " ";
        if (thing.school.components.ritual) answer += "ritual "
        if (thing.school.components.comcentration) answer += "conc. "
        answer += circle;
    }
    if (thing?.activation?.type) {
        answer += thing.activation.type + " ";;
        if (thing.activation.cost > 1) {
            answer += thing.activation.cost + " ";;
        }
        if (thing.activation.condition) {
            answer += thing.activation.condition + " ";;
        }
        answer += circle;
    }

    if (SpellIsAreaEffect(thing, owner)) {
        answer += "Area Effect " + thing.target.value + " ";;
        answer += circle;

    } else {
        if (thing?.target?.value == 1)
            answer += "1 Target ";
        answer += circle;
    }
    if (thing?.range?.value) {
        answer += "Range " + thing.range.value + " " + thing.range.units;
        answer += circle;

    }

    if (thing?.duration?.value > 0) {
        answer += "Duration " + thing.duration.value + " " + thing.duration.units;
        answer += circle;

    }
    if (thing?.uses?.value) {
        // should add a counter instead
        answer += "Uses " + thing.uses.value + "/" + thing.uses.max;
        if (thing.uses.recovery) answer += " per " + thing.uses.recovery;
        answer += circle;

    }
    if (thing?.consume?.type) {
        // should add a counter instead, also fix in converter
        let path = "owner." + thing.consume.target;
        path = path.substring(0, path.lastIndexOf("."));
        answer += "Consumes " + niceMiscName(thing.consume.target) + " " + thing.consume.amount + " of " + eval(path + ".value") + "/" + eval(path + ".max")

        answer += circle;

    }
    answer += DisplaySpellSaveDC(thing, owner);
    // let s = thing;
    // let atk = s.attackBonus;
    // let damage = s.damage.parts;
    // if (!atk) { atk = 0; }
    // let answer = ""
    // if (owner != undefined) {
    //     answer += "<button  onclick=\"rollWeapon('" + owner.id + "','" + thing.id + "')\">Roll</button>";

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
}
MakeAvailableToParser('ItemSpellOrFeat', ItemSpellOrFeat);

// function ItemMaybe(x, stringo) {
//     if (x) return stringo;
//     else return "";
// };

function niceMiscName(s) {
    if (s == "resources.legres.value") {
        return "Legendary Resistance";
    }
    if (s == "resources.legact.value") {
        return "Legendary Action";
    }
    return s

}
MakeAvailableToParser('niceMiscName', niceMiscName);


// create support for sheet



function DndAbilityBonus(thing, ability) {
    return Math.trunc((eval(ability) - 10) / 2);
}

function GetStatSpellPowerBonus(owner) {
    let stat = owner.attributes.spellcasting;
    if (stat) {
        return DndAbilityBonus(owner, owner.abilities[stat].value);
    }
    return -4;
}

function GetProficiency(owner) {
    if (owner.attributes.prof) {
        return owner.attributes.prof;
    }
    return 0;
}


// support functions, store globally in window maybe later elsewhere
// we should store these in a template sheet
var dndNiceStatNames = {
    str: "Strength", int: "Intelligence", con: "Constitution",
    dex: "Dexterity", cha: "Charisma", wis: "Wisdom"
}

var dndNiceSkillNames = {
    acr: "Acrobatics",
    ani: "Animal Handling",
    arc: "Arcana",
    ath: "Atheletics",
    dec: "Deception",
    his: "History",
    ins: "Insight",
    itm: "Intimidation",
    inv: "Investigate",
    med: "Medecine",
    nat: "Nature",
    prc: "Perception",
    prf: "Performance",
    per: "Persuade",
    rel: "Religion",
    slt: "Sleight of Hand",
    ste: "Stealth",
    sur: "Survival",
};

function rollStat(ownerId, stat, isSave) {

    let owner = GetRegisteredThing(ownerId);
    let bonus = DndAbilityBonus(owner, owner.abilities[stat].value);

    // should check if proficient here
    let prof = 0;

    if (isSave) {
        if (owner.abilities[stat].proficient)
            prof = owner.attributes.prof;
        socket.emit('roll', {
            title: owner.name + ' ' + dndNiceStatNames[stat] + " Save ",
            style: "dual",
            roll: "1d20" + signed(prof) + signed(bonus)
        });

    } else {
        prof = owner.attributes.prof;
        socket.emit('roll', {
            title: owner.name + ' ' + dndNiceStatNames[stat] + " Check ",
            style: "dual",
            roll: "1d20" + signed(bonus)
        });
    }
}
MakeAvailableToParser('rollStat', rollStat);
MakeAvailableToHtml('rollStat', rollStat);


function DndAbility(thing, stat) {
    let answer = Editable(thing, thing.abilities[stat].value, "npcNum") +
        " (" + DndAbilityBonus(thing, thing.abilities[stat].value)
        + ')<input type ="checkbox"' + (thing.abilities[stat].proficient != 0 ? " checked " : "") + " > Prof</input > "; // todo use label not text word prof

    answer += "<button  onclick=\"htmlContext.rollStat('" + thing.id + "','" + stat + "', false)\">Check</button>";
    answer += "<button  onclick=\"htmlContext.rollStat('" + thing.id + "','" + stat + "', true)\">Save</button>";
    return answer;

}

function DnDAbilities(thing) {
    let answer = "";
    let keys = Object.keys(thing.abilities);
    for (let i = 0; i < keys.length; i++) {
        answer += '<div class=outlined style = "font-weight: 700;display: inline-block">';
        answer += '<span>' + keys[i].toUpperCase() + '</span><br>';
        answer += '<div style="font-weight: 400; font-size: 15px;">';
        answer += DndAbility(thing, keys[i]);
        answer += '</div>';
        answer += '</div>';
    }
    return answer;
}
MakeAvailableToParser('DnDAbilities', DnDAbilities);

function rollSkill(ownerId, skillid) {
    let owner = GetRegisteredThing(ownerId);
    let skill = owner.skills[skillid];
    let stat = skill.ability;
    let statBonus = DndAbilityBonus(owner, owner.abilities[stat].value);
    let prof = (skill.value != 0 ? owner.attributes.prof : 0);
    socket.emit('roll', {
        title: owner.name + ' ' + dndNiceStatNames[stat] + " Check ",
        style: "dual",
        roll: "1d20" + signed(statBonus) + signed(prof)
    });
}
MakeAvailableToHtml('rollSkill', rollSkill);


function DndSkill(thing, skillid) {
    let skill = thing.skills[skillid];
    let stat = skill.ability;
    let statBonus = DndAbilityBonus(thing, thing.abilities[stat].value);
    let prof = (skill.value != 0 ? thing.attributes.prof : 0);
    let answer = "<div class=outlined>";
    answer += '<span class=npcBold>' + dndNiceSkillNames[skillid] + '</span><br>';

    answer += signed(statBonus + prof);


    // let answer = Editable(thing, thing.abilities[stat].value, "npcNum") +
    //     " (" +
    //     + ')<input type ="checkbox"' + (thing.abilities[stat].proficient != 0 ? " checked " : "") + " > Prof</input > "; // todo use label not text word prof

    answer += "<button  onclick=\"rollSkill('" + thing.id + "','" + skillid + "', false)\">Check</button>";
    answer += "</div>";
    return answer;

}


function DnDSkills(thing, showDefault) {
    let answer = "";
    let keys = Object.keys(thing.skills);

    for (let i = 0; i < keys.length; i++) {
        if (showDefault || thing.skills[keys[i]].value) {

            answer += DndSkill(thing, keys[i]);

        }

    }
    return answer;
}
MakeAvailableToParser('DnDSkills', DnDSkills);

function DndSpeed(title, thing, ability, units) {
    if (!eval(ability)) return "";
    let value = Editable(thing, ability, "numberinput");
    return '<li class="speedline"><span class="npcBold">' + title + '</span>' + value + units + '</li>';
}
MakeAvailableToParser('DndSpeed', DndSpeed);


function rollDamage(ownerId, weaponId, bonus, rolls) {
    let weapon = GetRegisteredThing(weaponId);


    for (let i = 0; i < weapon.damage.parts.length; i++) {
        let damage = [...weapon.damage.parts[i]];
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
}



function rollWeaponDamage(ownerId, weaponId, bonus) {
    let rolls = [];
    rollDamage(ownerId, weaponId, bonus, rolls);
    socket.emit('rolls', rolls);

}
MakeAvailableToParser('rollWeaponDamage', rollWeaponDamage);

function rollWeapon(ownerId, weaponId) {

    let owner = GetRegisteredThing(ownerId);
    let weapon = GetRegisteredThing(weaponId);




    let bonus = DndAbilityBonus(owner, owner.abilities[weapon.ability].value);
    if (weapon?.properties?.fin) {
        let dex = DndAbilityBonus(owner, owner.abilities.dex.value);
        if (dex > bonus) {
            bonus = dex;
        }
    }
    // should check if proficient here
    let prof = owner.attributes.prof;
    let atk = weapon.attackBonus;


    let rolls = [];

    rolls.push({
        title: owner.name + "'s " + weapon.name,
        style: "dual",
        roll: "1d20" + signed(prof) + signed(bonus) + signed(atk)

    });

    rollDamage(ownerId, weaponId, bonus, rolls)

    socket.emit('rolls', rolls);
}
MakeAvailableToHtml('rollWeapon', rollWeapon);


// function rollSpell(ownerId, spellId) {

//     let owner = GetRegisteredThing(ownerId);
//     let spell = GetRegisteredThing(spellId);


//     let bonus = DndAbilityBonus(owner, owner.abilities[spell.ability].value);
//     if (weapon?.properties?.fin) {
//         let dex = DndAbilityBonus(owner, owner.abilities.dex.value);
//         if (dex > bonus) {
//             bonus = dex;
//         }
//     }
//     // should check if proficient here
//     let prof = owner.attributes.prof;
//     let atk = weapon.attackBonus;

//     let rolls = [];

//     rolls.push({
//         title: owner.name + "'s " + weapon.name,
//         style: "dual",
//         roll: "1d20" + signed(prof) + signed(bonus) + signed(atk)

//     });

//     for (let i = 0; i < weapon.damage.parts.length; i++) {
//         let damage = [...weapon.damage.parts[i]];
//         let damageDice = damage[0].replace('@mod', bonus);
//         damage.shift();
//         let t = commaString(damage);


//         rolls.push(
//             {
//                 title: weapon.name + " " + t + " damage",
//                 roll: damageDice
//             }
//         );
//     }
//     socket.emit('rolls', rolls);

// };

function GetArmorClass(thing) {

    let ac = 0;

    if (thing.attributes.ac.flat) { ac = thing.attributes.ac.flat; }
    // assumes default calculation
    let startingAc = 10;
    let adds = 0;
    let dexMax = 100000;

    if (thing.items) for (let i = 0; i < thing.items.length; i++) {
        let item = GetRegisteredThing(thing.items[i].file);
        if (!item) console.log("Error fetching " + thing.items[i].file);
        if (item && item.equipped && item.armor && item.armor.value) {

            switch (item.armor.type) {
                case "light": case "medium": case "heavy":
                    startingAc = item.armor.value;
                    break;
                case "shield":
                default:
                    adds += item.armor.value;
                    break;
            }
            if (item.armor.dex) {
                if (item.armor.dex < dexMax) {
                    dexMax = item.dex;
                }
            }
        }
    }
    let dexBonus = DndAbilityBonus(thing, thing.abilities.dex.value);
    if (dexBonus > dexMax) dexBonus = dexMax;
    let ac2 = startingAc + adds + dexBonus;
    return Math.max(ac, ac2);

};
MakeAvailableToParser('GetArmorClass', GetArmorClass);


function rollSpellSaveAsWeaponAsAttackHomebrew(ownerId, spellId) {

    let owner = GetRegisteredThing(ownerId);
    let spell = GetRegisteredThing(spellId);

    let bonus = SpellSaveDC(spell, owner) - 10;

    let stat = GetStatSpellPowerBonus(owner);
    let rolls = [];

    rolls.push({
        title: owner.name + "'s " + spell.name + " roll or constant " + (bonus + 10),
        style: "dual",
        roll: "1d20" + signed(bonus) + " vs " + spell.save.ability

    });

    for (let i = 0; i < spell.damage.parts.length; i++) {
        let damage = [...spell.damage.parts[i]];
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
MakeAvailableToHtml('rollSpellSaveAsWeaponAsAttackHomebrew', rollSpellSaveAsWeaponAsAttackHomebrew);


function get5eDetails(thing) {
    // founddry 5e is poor, maybe write foudry cleaner and ahve cleaner sheets
    // if (thing) {
    //     let array = thing.details.type ? details(thing.details.type) :
    //         [thing.details.background,]
    //         ;

    //     if (thing.details.alignment) { array.push(thing.details.alignment); }
    //     if (thing.details.race) { array.push(thing.details.race); }
    //     return commaString(array);
    // } else {
    // }
    return "";
};
MakeAvailableToParser('get5eDetails', get5eDetails);

export function RemoveItemFromThing(thingId, itemId) {

    socket.emit("RemoveItemFromThing", { thingId: thingId, itemId: itemId });

}

MakeAvailableToHtml('RemoveItemFromThing', RemoveItemFromThing);

function IsInjury(item) {
    return (item.page == "injuries");


}
MakeAvailableToHtml('IsInjury', IsInjury);

function IsInventoryItem(item) {
    switch (item.page) {
        case "armor": return true;
        case "careers": return false;
        case "bestiary": return true;
        case "expensive": return true;
        case "items": return true;
        case "weapon": return true;
        case "magic_items": return true;
        case "spell": return false;
        case "background": return false;
        case "background": return false;
        case "injuries": return false;
        case "conditions": return false;
        default:
            console.log("Unkown type ", item.page);
            throw ("Uknown type" + item);


    }
}
MakeAvailableToParser("IsInventoryItem", IsInventoryItem);

function IsSpellItem(item) {
    switch (item.page) {
        case "spell": return true;
    }
    return false;

}
MakeAvailableToParser("IsSpellItem", IsSpellItem);

function hasItemOfType(thing, ffunction) {

    for(let i = 0; i < thing.items.length; i++) {
        if(ffunction(thing.items[i])) return true;
    }
    return false;
}
MakeAvailableToParser("hasItemOfType", hasItemOfType);



function IsSpellIngredient(item) {
    if (IsInventoryItem(item)) {
        let o = GetRegisteredThing(item.file);
        if (o && o.use) {
            for (let i = 0; i < o.use.length; i++)
                if (o.use[i].mana) {
                    return true;
                }
        }
    }
    return false;
}
MakeAvailableToParser("IsSpellIngredient", IsSpellIngredient);

function IsCareerItem(item) {

    switch (item.page) {
        case "careers": return true;
    }
    return false;
}
MakeAvailableToParser("IsCareerItem", IsCareerItem);


function IsBackgroundItem(item) {

    switch (item.page) {
        case "background": return true;
    }
    return false;
}
MakeAvailableToParser("IsBackgroundItem", IsBackgroundItem);

function ItemFiltered(item, filter) {
    if (!filter) return false;
    return !(filter(item));

}
function drawDnDItems(thing) {


    let text = "";
    if (!thing.items) thing.items = [];
    for (let i = 0; i < thing.items.length; i++) {
        let item = thing.items[i];

        let a = parseSheet(GetRegisteredThing(item.file), item.page, undefined, thing, undefined, { file: item.file }); // no w

        text += div(a);
    }
    return (text);

}
MakeAvailableToParser("drawDnDItems", drawDnDItems);

function drawItems(thing, filter, notes) {
    let text = "";
    if (!thing.items) thing.items = [];
    for (let i = 0; i < thing.items.length; i++) {
        let item = thing.items[i];

        if (ItemFiltered(item, filter)) { continue; }
        let a = parseSheet(GetRegisteredThing(item.file), item.page, undefined, thing, notes, { file: item.file }); // no w
        // if (item.page != "careers" && item.page != "weapon" && item.page != "spell")
        //     a += formatRemoveButton(thing.id, item.file);;
        text += div(a);
    }
    return (text);
}
MakeAvailableToParser("drawItems", drawItems);



function Spell(thing) {

    let s = thing;
    let damage = s.damage.parts;


    let answer = "<div>" + commaString(damage) + "</div>";
    if (s.save && s.save.ability) {
        answer += "<div" + s.save.ability + " save ";
        if (s.save.dc != null)
            answer += " dc " + s.save.dc;
        else
            answer += s.save.scaling;
        answer += + "</div>";
    }
    answer += "<div>" + span("Level", s.level) + "</div>";
    answer += "<div>" + span("School", s.school) + "</div>";

    let props = [];

    if (s.components.vocal) props.push("Vocal");
    if (s.components.somatic) props.push("Somatic");
    if (s.components.material) props.push("Material");
    if (s.components.ritual) props.push("Ritual");
    if (s.components.concentration) props.push("Concentration");
    if (s.components.value) props.push(s.components.value);
    answer += "<div> " + commaString(props) + "</div>";
    if (s.range && s.range.value) {

        answer += "<div><span>Range</span>" + s.range.value +
            (s.range.long ? "/" + s.range.long : "") +
            +" " + s.range.units + "</div>";
    }
    return answer;
}
MakeAvailableToHtml("Spell", Spell);
