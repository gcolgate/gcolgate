
const fs = require('fs').promises;
const { type } = require('express/lib/response');
const rawfs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const sanitize = require('sanitize-filename');


// todo: figure this out
var baseFeats = {
    Strength: {
        name: "Strength",
        description: "Being big and tall and imposing. You also can get bonus feats.\nWill let you wield larger weapons and possibly inflict more harm. This will give you a bonus  to Steel  as well.). You can carry and lift more. You can perform feats of strength. Each level of strength increases your Health points by 1.\n" +
            "4 = A Freak of Nature\n" +
            "3 = Massive\n" +
            "2 = Huge\n" +
            "1 = Muscular\n" +
            "0 = Average, or short and muscular\n" +
            "-2= short or frail\n",
        feats: [
            "Brawler",
            "Wrestler",
            "Tough",
            "Reach",],
        languages: [],
        tools: ""
    },
    Health: {
        name: "Health",
        description: " Players start with 20 hit points plus 5 * Health + 1 * strength. \n",
        feats: [],
        languages: [],
        tools: ""
    },
    Will: {
        name: "Will",
        description: "Each level of Will increases your Effort by 1. Effort is used to fuel some abilities. Players start with 2. If you treat Will as your dump stat you will have none\n",
        feats: [],
        languages: [],
        tools: ""
    },
};

var injuries = {
    FootWound: {
        name: "Foot Wound",
        description: "Foot wound",
        condition: "Slowed",
        armor: "Feet",
        stackable: "Yes",
    },

    BleedingWoundThroat: {
        name: "Bleeding Cut in your throat",
        description: "Bleeding cut",
        condition: "Bleeding",
        armor: "Chest",
        stackable: "Yes",
    },
    BleedingWoundBelly: {
        name: "Bleeding Cut in your belly",
        description: "Bleeding cut",
        condition: "Bleeding",
        armor: "Chest",
        stackable: "Yes",
    },
    Concussion: {
        name: "Head concussion",
        description: "Head concussion",
        condition: "Concussed",
        armor: "Head",
        stackable: "Yes",
    },
    EyeInjury: {
        name: "Eye Injury",
        description: "Head Partially blinded",
        condition: "Partially blinded",
        armor: "Head",
        stackable: "Yes, becomes Blinded",
    },

};
var conditions = {

    Slowed: {
        name: "Slowed",
        description: "You move at 50% speed",
        stackable: "Yes",
    },
    Distracted: {
        name: "Distracted",
        description: "You can take only actions or reactions this next turn",
        stackable: "No",
    },
    Cowed: {
        name: "Cowed",
        description: "You can take only  reactions this next turn",
        stackable: "No",
    },
    Burning: {
        name: "You are burning",
        description: "You must roll On Fire each turn until extinguished",
        stackable: "Yes, adds damage"
    },
    Bleeding: {
        name: "Bleeding",
        description: "You lose 1 health each turn.",
        stackable: "Yes, add damge",
    },
    Concussed: {
        name: "Concussed",
        description: "May take actions OR reactions each turn until your concussion is healed.",
        stackable: "No",
    },
    Prone: {
        name: "Prone",
        description: "Your only movement option is to crawl, unless you stands up (takes 50% movement). The creature has disadvantage on attack rolls. An attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the attack roll has disadvantage.",
        stackable: "No",
    },
    Stunned: {
        name: "Stunned",
        description: "You cannot take actions or reactions until no longer stunned, creatures can roll 'Must Keep going' each action  after they miss one round,some results indicate you are not stunned",
        stackable: "No",
    },
    Blinded: {
        name: "Blinded",
        description: "A blinded creature can’t see and automatically fails any ability check that requires sight. Attack rolls against the creature have advantage, and the creature’s attack rolls have disadvantage.",
        stackable: "No",
    },
    PartiallyBlinded: {
        name: "Partially Blinded",
        description: "Blinded in one eye, disadvantage on next roll",
        stackable: "Yes, becomes blinded",
    },
    Charmed: {
        name: "Charmed",
        description: "You can’t attack the charmer or target the charmer with harmful abilities or magical effects. The charmer has advantage on any ability check to interact socially with you.",
        stackable: "No",
    },
    Deafened: {
        name: "Deafened",
        description: "A Deafened creature automatically fails any checks that require hearing",
        stackable: "No",
    },
    Frightened: {
        name: "Frightned",
        description: "A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can’t willingly move closer to the source of its fear.",
    },
    Panicked: {
        name: "Frightned",
        description: "A panicked creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature must move away from the source of his fear.",
    },
    Frenzied: {
        name: "Frenzied",
        description: "A Frenzied creature has advantage on attack rolls against the source of his frenzy.",
    },
    Wrestled: {
        name: "Wrestled",
        description: "A wrestled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed. The condition ends if the grappler is incapacitated (see the condition).  The condition also ends if an effect removes the grappled creature from the reach of the grappler or grappling effect, such as when a creature is hurled away by the thunderwave spell.",
    },
    Invisible: {
        name: "Invisible",
        description: "An invisible creature is impossible to see without the aid of magic or a special sense. For the purpose of hiding, the creature is heavily obscured. The creature’s location can be detected by any noise it makes or any tracks it leaves or in some cases by it's smell. Attack rolls against the creature have disadvantage, and the creature’s attack rolls have advantage."
    },
    Incapacitated: {
        name: "Incapacitated",
        description: "An incapacitated creature can’t take actions or reactions.",
    },
    Unconcious: {
        name: "Unconcious",
        description: "An unconcous  creature is prone and paralyzed"
    },

    Paralyzed: {
        name: "Paralyzed",
        description: "A paralyzed creature  can't take actions, reactions, and can’t move or speak. Attack rolls against the creature have advantage. Any attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.",
    },
    Sickened: { name: "Sickened", description: "A sickened creature must roll 'Must Keep going' to act whenever it tries" },

};

//  TODO: Put this section is a module, it is for formatting console log output
//////////// hack to get line numbers on log statements like in the browser
//////////// it makes a fake error to get the stack trace
/////////// and formats it, in a way you can click on the stack trace to go to code in VS code
let redTerminal = "\u001b[31m";
let resetTerminal = "\u001b[39m";
['log', 'warn', 'error', 'info'].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
        let initiator = 'unknown place';
        try {
            throw new Error();
        } catch (e) {
            if (typeof e.stack === 'string') {
                let isFirst = true;
                for (const line of e.stack.split('\n')) {
                    const matches = line.match(/^\s+at\s+(.*)/);
                    if (matches) {
                        if (!isFirst) { // first line - current function
                            // second line - caller (what we are looking for)
                            initiator = matches[1];
                            break;
                        }
                        isFirst = false;
                    }
                }
            }
        }
        initiator.replace('\n', '');
        let s = initiator.indexOf('(');
        let e = initiator.indexOf(')');
        if (s != -1 && e != -1 && e > s) {
            initiator = initiator.slice(s + 1, e);
        }
        originalMethod.apply(console, [redTerminal, `${initiator}` + resetTerminal + '\t\t', ...args]);
    };
});


function ComputePage(json, page) {

    if (!page.startsWith("items")) {
        return page;
    }

    if (json.attunment != undefined && json.attunment != "0") { return "magic_items"; }
    if (json.price === null) { return "magic_items"; }
    if (json.name.startsWith("+")) { return "magic_items"; }
    if (json.price && json.price > 1000) { return "expensive"; }
    if (json.weight && json.weight > 60) { return "heavy"; }
    if (json.type == "weapon") return "weapons";
    if (json.consumableType == "poison") return "poison";
    if (json.armor && json.armor.value > 10) return "armor";
    return "items";


}
var counter = 0;
function writeJsonFileInPublic(dir, fileName, json) {

    try {
        let pathName = path.join(__dirname, 'public', dir, fileName + '.json');

        rawfs.writeFileSync(pathName, JSON.stringify(json));
        if (++counter > 20) { console.log("."); counter = 0; }

    } catch (err) {
        console.log(err + " Error with " + dir + " " + fileName);
        throw "badness"
    }
}

// function writeText(pathName, text) {

//     try {

//         rawfs.writeFileSync(pathName, text);
//         console.log(pathName);

//     } catch (err) {
//         console.log(err + " Error with " + pathName);
//     }
// }
const EnsureDestinationExists = async (fullFilePath) => {

    let dir = path.dirname(path.normalize(fullFilePath));
    if (rawfs.existsSync(dir)) return;
    try {
        await fs.mkdir(dir, { recursive: true });
    } catch (error) {
        console.error("Error making directory " + dir, error);
    }

}

function cleanFileName(destString) {
    // just path a name, not a path
    destString = destString.replaceAll(" ", "_");
    destString = destString.replaceAll(",", "_");
    destString = destString.replaceAll("%20%", "_");
    destString = destString.replaceAll("%2b%", "_plus_");
    destString = destString.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    return destString;
}

function cleanPath(destString) {
    // just path a name, not a path
    destString = destString.replaceAll(" ", "_");
    destString = destString.replaceAll("%20%", "_");
    destString = destString.replaceAll("%2b%", "_plus_");
    return destString;
}

function nameOk(name) {
    // stupid data has "null" in some fields as a string
    return name != "null" && name != null && name != undefined && name != "";
}


// todo: put in subthing
const stringSimilarity = (a, b) =>
    _stringSimilarity(prep(a), prep(b))

const _stringSimilarity = (a, b) => {
    const bg1 = bigrams(a)
    const bg2 = bigrams(b)
    const c1 = count(bg1)
    const c2 = count(bg2)
    const combined = uniq([...bg1, ...bg2])
        .reduce((t, k) => t + (Math.min(c1[k] || 0, c2[k] || 0)), 0)
    return 2 * combined / (Math.max(bg1.length + bg2.length, 1))
}

const prep = (str) => // TODO: unicode support?
    str.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ')

const bigrams = (str) =>
    [...str].slice(0, -1).map((c, i) => c + str[i + 1])

const count = (xs) =>
    xs.reduce((a, x) => ((a[x] = (a[x] || 0) + 1), a), {})

const uniq = (xs) =>
    [... new Set(xs)]

////////////
function prepareStringSimilarity(text) {
    let bg1 = bigrams(prep(text));
    let c = count(bg1);
    return {
        bigRams: bg1,
        count: c
    };

}
// works only on compared stirngs
const optimizedStringSimularity = (a, b) => {

    const combined = uniq([...a.bigRams, ...b.bigRams])
        .reduce((t, k) => t + (Math.min(a.count[k] || 0, b.count[k] || 0)), 0)
    return 2 * combined / (Math.max(a.bigRams.length + b.bigRams.length, 1))
}


// items
//   name
// slot: longarm, sidearm, small, bulky, mount, amulet, ring, hat, feet, shield, cloak, mount-armor, large, abstract, container
// has pockets (and size)

// containers:: pack .. allows a number of small or bulky items
// containers:: pockets:: allows a number of smnall items
// hammerspace:: pockets with a large amount of items
//
// counters
//      charges, ammo, : recharges at: long rest, short rest, shopping, activity, dawn, dusk, midnight,
// Careers or weapon types that apply
// weapon stats
// range: min, short, long
// [damage, when, damage type] (Computed)
// Steel (computed)
// armor stats
// toughness bonus
// Button: Take damage... rolls dice. Take damage armor doesn't help
var weapon_effects = {
    "Intimidate": { "Save": "Bravery", "Effect": "Foe becomes cautious and -1" },
    "Push": { "Save": "Str", "Effect": "Foe forced to retreat or knocked back" },
    "Prone": { "Save": "Str or Dex", "Effect": "Foe made prone" },
    "Bleeding": { "Save": "Con", "Effect": "Foe bleeds" },
    "Disarm": { "Save": "Str or Dex", "Effect": "Foe loses weapon" },
};
var critical_effects = {
    "Sever": { "Save": "Str or Con", "Effect": "Limb chopped off" },
    "Blind": { "Save": "Str or Con", "Effect": "Foe blinded" },
    "Deep Bleeding": { "Save": "Con", "Effect": "Foe bleeds x3" },
    "Broken Bones": { "Save": "Con", "Effect": "one limb useless" },
    "Vorpal": { "Save": "Con", "Effect": "Head chopped off" },
    "KO": { "Save": "Con", "Effect": "Knocked out for a few minutes" },
};
var items = [

    {
        name: "Breastplate",
        description: "breast plate",
        image: "images/icons/equipment/chest/breastplate-cuirass-steel-grey.webp",
        slot: "armor",
        wealth: 3,
        price: 400,
        armor: {
            type: ["bludgeoning", "piercing", "slashing"],
            sacrifice: 1,
            bonus: 2,
            career: ["LightArmor"],
        },
    },
    // {
    //     name: "Hoplite Armor",
    //     description: "Greek Armor",
    //     image: "",
    //     slot: "armor",
    //     wealth: 3,
    //     price: 600,
    //     armor: {
    //         type: ["bludgeoning", "piercing", "slashing"],
    //         sacrifice: 2,
    //         bonus: 3,
    //         career: ["HeavyArmor"],
    //     },
    // },
    {
        name: "Knights Armor",
        description: "Knightly Armor, reduces movement by 1 on foot",
        image: "",
        slot: "armor",
        wealth: 3,
        price: 1500,
        armor: {
            type: ["bludgeoning", "piercing", "slashing"],
            sacrifice: 2,
            bonus: 3,
            career: ["HeavyAmor"],
            movement: -1
        },
    },
    {
        name: "Viking Armor",
        description: "Chainmail Armor",
        image: "",
        price: 200,
        slot: "armor",
        wealth: 3,
        armor: {
            type: ["bludgeoning", "piercing", "slashing"],
            sacrifice: 1,
            bonus: 2,
            career: ["HeavyArmor"],
            movement: -1
        },
    },
    {
        name: "Padded Armor",
        description: "Padded Armor",
        image: "",
        slot: "armor",
        wealth: 2,
        price: 5,
        armor: {
            type: ["bludgeoning", "piercing", "slashing"],
            sacrifice: 1,
            bonus: 1,
            career: ["LightArmor"],
            movement: -1
        },
    },
    {
        name: "Leather Armor",
        description: "Leather Armor",
        image: "",
        slot: "armor",
        wealth: 2,
        price: 10,
        armor: {
            type: ["bludgeoning", "slashing"],
            sacrifice: 1,
            bonus: 1,
            career: ["LightArmor"],
        },
    },
    {
        name: "Open Helmet",
        description: "Open faced helmet",
        image: "",
        slot: "head",
        wealth: 2,
        price: 50,
        armor: {
            type: ["bludgeoning", "slashing"],
            bonus: 1,
            sacrifice: 1,
            career: ["LightArmor"],

        },
    },
    {
        name: "Closed Helmet",
        description: "Closed faced helmet",
        image: "",
        slot: "head",
        wealth: 2,
        price: 150,
        armor: {
            type: ["bludgeoning", "piercing", "slashing"],
            bonus: 1,
            career: ["HeavyArmor"],
            sacrifice: 2,
            notes: "Hard to see out of",
        },
    },
    // TODO: Make variant modes for armor hinge up, hinge down, from front, from back
    {
        name: "Shield",
        description: "shield",
        image: "",
        slot: "armor",
        wealth: 2,
        price: 10,
        weapon_defenses: [{
            name: "Shield Block",
            move: ["Parry"],
            range: 1,
            hands: 1,
            type: "Melee",
            career: ["HeavyArmor"],
        }],
        armor: {
            type: ["bludgeoning", "piercing", "slashing", "fire"],
            bonus: 1,
            career: ["HeavyArmor"],
            sacrifice: 12
        },
    },
    {
        name: "Large Shield",
        description: "shield",
        image: "",
        slot: "armor",
        wealth: 2,
        price: 20,
        weapon_defenses: [{
            name: "Large Shield Block",
            move: [""],
            range: 1,
            hands: 1,
            type: "Melee",
            career: ["HeavyArmor"],
        }],
        armor: {
            type: ["bludgeoning", "piercing", "slashing", "fire"],
            bonus: 1,
            career: ["HeavyArmor"],
            sacrifice: 2,
            movement: -1,
        },
    },
    /// end of armor
    /// start of wepaons
    {
        name: "Phalanx Spear",
        description: "Your classic spear",
        image: "images/icons/weapons/polearms/spear-flared-worn-grey.webp",
        slot: "longarm",
        wealth: 1,
        price: 2,
        weapon_defenses: [{
            name: "Quaterstaff(spear) Block",
            move: [""],
            range: 1,
            hands: 2,
            type: "Melee",
            career: ["Infantry", "Gladiator", "Brawling"],
        }],
        weapon_modes:
            [{
                name: "Spear Stab",
                range: 2,
                hands: 1,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "2d8", type: "piercing", when: "" }],
                career: ["Martial"],
                wounding: "Long Piercing"
            }, {
                name: "Spear Clobber",
                range: 1,
                hands: 2,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "2d4", type: "bludgeoning", when: "" }],
                career: ["Brawling"],
                wounding: "Light Bludgeon"
            }]
    },
    {
        name: "Quarterstaff",
        description: "Your classic staff",
        image: "images/icons/skills/melee/hand-grip-staff-blue.webp",
        slot: "longarm",
        wealth: 0,
        price: 0.5,
        weapon_defenses: [{
            name: "Quaterstaff Block",
            move: [""],
            range: 1,
            move: ["Attack", "Ambush"],
            hands: 2,
            type: "Melee",
            career: ["Brawling"],
        }],
        weapon_modes:
            [{
                name: "Quarterstaff clobber",
                range: 1,
                hands: 2,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "2d6", type: "bludgeoning", when: "" }],
                career: ["Brawling"],
                wounding: "Light Bludgeon"
            }]
    },
    {
        name: "Glaive ",
        description: "Your classic Polearm",
        image: "images/icons/weapons/polearm/halberd-crescent-glowing.webp",
        slot: "longarm",
        wealth: 3,
        price: 20,
        weapon_defenses: [{
            name: "Quaterstaff (Glaive) Block",
            move: [""],
            range: 1,
            hands: 2,
            type: "Melee",
            career: ["Martial", "Brawling"],
        }],
        weapon_modes:
            [{
                name: "Polearm Attack",
                range: 2,
                min_range: 2,
                hands: 2,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "2d10", type: "piercing or slashing", when: "" }],
                career: ["Martial"],
                wounding: "Polearm"
            },
            {
                name: "Polearm Clobber",
                range: 1,
                hands: 2,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "1d8", type: "bludgeoning", when: "" }],
                career: ["Brawling"],
                wounding: "Light Bludgeon"
            }]
    },
    {
        name: "Pike ",
        description: "A very long spear",
        image: "images/icons/weapons/polearms/spear-hooked-blue.webp",
        slot: "longarm",
        wealth: 1,
        price: 5,
        weapon_defenses: [{
            name: "Quaterstaff Block",
            move: [""],
            range: 1,
            hands: 2,
            type: "Melee",
            career: ["Martial", "Brawling"],
            wounding: "Light Bludgeon"
        }],
        weapon_modes:
            [{
                name: "Pike Stab",
                range: 3,
                min_range: 2,
                hands: 2,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "2d10", type: "piercing or slashing", when: "" }],
                career: ["Martial"],
                wounding: "Long Piercing"
            },
            {
                name: "Pike Clobber",
                range: 1,
                hands: 2,
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "1d8", type: "bludgeoning", when: "" }],
                career: ["Brawling"],

                wounding: "Light Bludgeon"
            }]
    },
    {
        name: "Long Sword",
        description: "Your classic sword",
        image: "images/icons/weapons/swords/sword-guard-brown.webp",
        slot: "sidearm",
        hands: 1,
        wealth: 3,
        price: 20,
        weapon_defenses: [{
            name: "Long Sword Parry",
            move: [""],
            range: 1,
            hands: 1,
            type: "Melee",
            career: ["Paladin", "Martial", "Noble"],

        }],
        weapon_modes:
            [{
                name: "Longsword Slice",
                range: 1,
                hands: 1,
                career: ["Paladin", "Martial", "Noble"],
                move: ["Attack", "Ambush"],
                type: "Melee",
                damage: [{ damage: "2d8", type: "slashing", when: "" }],
                wounding: "Heavy Cut"
            },
            {
                name: "Longsword Horseback Charge",
                range: 1.5,
                hands: 1,
                career: ["Mounted"],
                requirements: ["Mounted"],
                move: ["Attack"],
                type: "Melee",
                damage: [{ damage: "2d10", type: "slashing", when: "" }],
                wounding: "Heavy Cut"
            },
            {
                name: "Longsword Pommel Smash",
                range: 0,
                type: "Grapple",
                career: ["Brawling"],
                move: ["Attack", "Ambush"],
                hands: 1,
                damage: [{ damage: "1d8", type: "bludgeoning", when: "" }],
                wounding: "Light Bludgeon"
            }],
    },
    {
        name: "BattleAxe",
        description: "A big axe",
        image: "images/icons/weapons/polearms/halberd-curved-steel.webp",
        slot: "sidearm",
        price: 20,
        hands: 1,
        wealth: 3,
        weapon_defenses: [{
            name: "Battleaxe Parry",
            move: [""],
            range: 1,
            hands: 1,
            type: "Melee",
            move: ["Parry"],
            career: ["Martial"],
        }],
        weapon_modes:
            [{
                name: "BattleAxe Chop",
                range: 1,
                hands: 1,
                career: ["Martial"],
                type: "Melee",
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d8", type: "slashing", when: "" }],
                powers: ["Brutal Strength", "Bleeding"]
            }],
    },

    {
        name: "Cavalry Horse",
        description: "A horse used to battle",
        image: "images/assets/srd5e/img/MM/Riding_Horse.png",
        slot: "mount",
        hands: 0,
        wealth: 4,
        saddlebags: 12,
        price: 400,
        weapon_defenses: [{
            name: "Fast Avoid Missiles",
            range: 0,
            hands: 0,
            advantage: 1,
            type: "Melee",
            move: ["Dodge"],
            career: ["Mounted"],
        }],
        weapon_modes:
            [],
    },

    {
        name: "Riding Horse",
        description: "A horse not used to battle - might have to control it",
        image: "images/assets/srd5e/img/MM/Riding_Horse.png",
        slot: "mount",
        hands: 0,
        wealth: 3,
        price: 75,
        saddlebags: 12,
        weapon_defenses: [{
            name: "Fast Avoid Missiles",
            range: 0,
            hands: 0,
            advantage: 1,
            type: "Melee",
            move: ["Dodge"],
            career: ["Mounted"],
        }],
        weapon_modes:
            [],
    },
    {
        name: "Cutlass",
        description: "A light sword",
        image: "images/cutlass.jpg",
        slot: "sidearm",
        wealth: 2,
        price: 20,
        weapon_defenses: [{
            name: "Cutlass Parry",
            move: ["Parry"],
            range: 1,
            hands: 1,
            type: "Melee",
            career: ["Martial", "Pirate"],
        }],
        weapon_modes:
            [{
                name: "Cutlass Slash",
                range: 1,
                type: "Melee",
                hands: 1,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d6", type: "slashing", when: "" }],
                career: ["Martial"],
                wounding: "Light Cut"
            },
            {

                name: "Cutlass Horseback Charge",
                range: 1.5,
                type: "Melee",
                hands: 1,
                requirements: ["Mounted"],
                move: ["Attack"],
                damage: [{ damage: "3d6", type: "piercing or slashing", when: "" }],
                career: ["Cavalry"],
                wounding: "Light Cut"
            },
            {
                name: "Cutlass Pommel",
                range: 0,
                type: "Grapple",
                hands: 1,
                move: ["Attack", "Ambush"],
                career: ["Brawling"],
                damage: [{ damage: "1d6", type: "bludgeoning", when: "" }],
                wounding: "Light Bludgeon"
            }
            ],
    },
    {
        name: "Lance",
        description: "Pointy spear",
        image: "",
        slot: "longarm",
        wealth: 2,
        price: 10,
        weapon_defenses: [{
            name: "Quaterstaff Block",
            range: 1,
            hands: 2,
            type: "Melee",
            move: ["Parry"],
            career: ["Brawling"],
        }],
        weapon_modes:
            [{
                range: 2,
                name: "Lance Horseback Charge",
                type: "Melee",
                hands: 1,
                damage: [{ damage: "2d12+4", type: "Piercing", when: "" }],
                career: ["Paladin", "Cavalry"],
                move: ["Attack"],
                wounding: "Heavy Pierce"
            },
            {
                range: 2,
                name: "Lance Spear",
                type: "Melee",
                hands: 2,
                damage: [{ damage: "2d8", type: "Piercing", when: "" }],
                career: ["Martial"],
                move: ["Attack", "Ambush"],
                wounding: "Long Pierce"
            }],
        counters: [{ max: 1, cur: 1, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 1 },] }],

    },
    {
        name: "Club",
        description: "A basic heavy club",
        image: "images/icons/weapons/clubs/club-simple-barbed.webp",
        slot: "longarm",
        wealth: 0,
        price: 0.1,
        weapon_defenses: [],
        weapon_modes:
            [{
                name: "Clib Smash",
                range: 1,
                type: "Melee",
                hands: 1,
                damage: [{ damage: "2d4", type: "bludgeoning", when: "" }],
                career: ["Martial", "Brawling"],
                move: ["Attack", "Ambush"],
                wounding: "Light Bludgeon"
            },
            ],
    },
    {
        name: "Mace",
        description: "A heavy metal crusher",
        image: "images/icons/weapons/maces/mace-spiked-steel-grey.webp",
        slot: "sidearm",
        wealth: 2,
        price: 10,
        weapon_defenses: [],
        weapon_modes:
            [{
                name: "Mace Swing",
                range: 1,
                type: "Melee",
                hands: 1,
                damage: [{ damage: "2d6", type: "bludgeoning", when: "" }],
                career: ["Martial", "Brawling"],
                move: ["Attack", "Ambush"],
                wounding: "Medium Bludgeon"
            }],
    },
    {
        name: "Unarmed",
        description: "Kick or fist",
        image: "images/icons/skills/melee/unarmed-punch-fist.webp",
        slot: "Always",
        wealth: 0,
        weapon_defenses: [{
            name: "Hand Block",
            range: 1,
            hands: 2,
            type: "Melee",
            notes: "Disadvantage vs armed opponents",
            career: ["Brawling"],
            move: ["Parry"],
        }],
        weapon_modes:
            [{
                name: "Punch",
                range: 1,
                type: "Melee",
                hands: 1,
                damage: [{ damage: "1d6", type: "bludgeoning", when: "" }],
                career: ["Brawling"],
                move: ["Attack", "Ambush"],
                wounding: "Light Bludgeon"
            },
            {
                name: "Kick",
                range: 1.5,
                type: "Melee",
                hands: 0,
                damage: [{ damage: "1d6", type: "bludgeoning", when: "" }],
                career: ["Dancer", "Brawling"],
                move: ["Attack", "Ambush"],
                wounding: "Light Bludgeon"
            },
            {
                name: "Grapple",
                range: 0,
                hands: 2,
                type: "Grapple",
                move: ["Wrestle"],
                damage: [{ damage: "1d6", type: "bludgeoning", when: "" }],
                career: ["Brawling"],
            }],
    },
    {
        name: "Hand Crossbow",
        description: "A small ahistorical crossbow useful as a stand in for pistols in urban adventures",
        image: "images/icons/weapons/crossbows/crossbow-simple-brown.webp",
        slot: "sidearm",
        wealth: 3,
        price: 75,
        weapon_modes:
            [{
                name: "Shoot Hand Crossbow",
                range: 6,
                type: "Ranged",
                hands: 1,
                loading: 1,
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                career: ["Asassin", "Thug", "Pirate"],
                move: ["Ambush", "Attack"],
                charges: 1,
                no_strength: true,
                wounding: "Short Pierce"
            },
            ],
        counters: [{ max: 6, cur: 6, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 6 },] }],
    },
    {
        name: "Crossbow",
        description: "A heavy crossbow that requires winding up, useful for assassinations or seiges, takes 3 rounds to wind",
        image: "images/icons/weapons/crossbows/crossbow-blue.webp",
        slot: "longarm",
        wealth: 3,
        price: 50,
        weapon_modes:
            [{
                name: "Shoot Crossbow",
                range: 30,
                type: "Ranged",
                hands: 2,
                loading: 2,
                armor_piercing: 2,
                damage: [{ damage: "2d10", type: "piercing", when: "" }],
                career: ["Asassin", "Archer", "Pirate"],
                move: ["Ambush", "Attack"],
                charges: 1,
                no_strength: true,
                wounding: "Strong Pierce"
            },
            ],
        counters: [{ max: 20, cur: 20, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 20 },] }],
    },
    {
        name: "Longbow",
        description: "A powerful bow",
        image: "images/icons/weapons/bows/longbow-leather-green.webp",
        slot: "longarm",
        wealth: 3,
        price: 50,
        weapon_modes:
            [{
                name: "Shoot Longbow",
                range: 30,
                type: "Ranged",
                hands: 2,
                loading: 0,
                armor_piercing: 1,
                damage: [{ damage: "2d8", type: "piercing", when: "" }],
                move: ["Ambush", "Attack"],
                career: ["Archer"],
                charges: 1,
                wounding: "Strong Pierce"
            },
            ],
        counters: [{ max: 20, cur: 20, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 20 },] }],
    },
    {
        name: "Horse Bow",
        description: "A powerful bow, short enough to be used from the saddle",
        image: "images/icons/weapons/bows/longbow-recurve-leather-red.webp",
        slot: "longarm",
        wealth: 3,
        price: 50,
        weapon_modes:
            [{
                name: "Shoot Horse Bow",
                range: 30,
                type: "Ranged",
                hands: 2,
                loading: 0,
                armor_piercing: 1,
                move: ["Ambush", "Attack"],
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                career: ["HorseArcher", "Archer"],
                charges: 1,
                wounding: "Strong Pierce"
            },
            ],
        counters: [{ max: 20, cur: 20, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 20 },] }],
    },
    {
        name: "Short Bow",
        description: "A  bow for hunting",
        image: "images/icons/weapons/bows/shortbow-recurve.webp",
        slot: "longarm",
        wealth: 3,
        price: 25,
        weapon_modes:
            [{
                name: "Shoot Short Bow",
                range: 20,
                type: "Ranged",
                hands: 2,
                loading: 0,
                move: ["Ambush", "Attack"],
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                career: ["Archer", "HorseArcher", "Hunter"],
                charges: 1,
                wounding: "Short Pierce"
            },
            ],
        counters: [{ max: 20, cur: 20, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 20 },] }],
    },
    {
        name: "Rapier",
        description: "A duelling sword",
        image: "images/icons/weapons/swords/Rapier.webp",
        slot: "sidearm",
        range: 1.5,
        wealth: 3,
        price: 25,

        weapon_defenses: [{
            name: "Rapier Parry",
            range: 1,
            hands: 1,
            type: "Melee",
            move: ["Parry"],
            career: ["Pirate", "Noble", "Urban"],
        }],
        weapon_modes:
            [{
                name: "Rapier Lunge",
                type: "Melee",
                range: 1.5,
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                move: ["Attack", "Ambush"],
                career: ["Noble", "Urban"],
                wounding: "Short Pierce"
            },

            {
                name: "Rapier Feint",
                range: 1,
                hands: 1,
                type: "Melee",
                move: ["Feint"],
                career: ["Noble", "Urban"],
            },
            {
                name: "Rapier Pommel",
                type: "Melee",
                range: 0,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "1d4", type: "bludgeoning", when: "" }],
                career: ["Brawling"],
                wounding: "Light Bludgeon"
            }],
    }
    ,
    {
        name: "Rapier with spring dagger hilt",
        description: "A duelling sword",
        image: "images/icons/weapons/swords/Rapier.webp",
        slot: "sidearm",
        wealth: 4,
        price: 100,
        weapon_defenses: [{
            name: "Rapier Parry",
            range: 1,
            hands: 1,
            type: "Melee",
            move: ["Parry"],
            career: ["Noble", "Urban"],
        }],
        weapon_modes:
            [{
                name: "Rapier Stab",
                type: "Melee",
                range: 1.5,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                career: ["Noble", "Urban"],
                wounding: "Short Pierce"

            },

            {
                name: "Rapier Feint",
                range: 1,
                hands: 1,
                type: "Melee",
                move: ["Feint"],
                career: ["Noble", "Assassin", "Urban"],
            }, {
                name: "Hidden Knife Pommel Stab",
                type: "Grapple",
                range: 0,
                move: ["Ambush", "Attack"],
                damage: [{ damage: "1d8", type: "piercing", when: "" }],
                career: ["Noble", "Assassin", "Urban"],
                wounding: "Short Pierce"

            }],
    },
    {
        name: "Throwing dagger",
        description: "A dagger balanced to throw as well as stab",
        image: "images/icons/weapons/daggers/dagger-jeweled-purple.webp",
        slot: "pockets",
        wealth: 2,
        price: 5,
        weapon_modes:
            [{
                name: "Throwing dagger Stab",
                type: "Melee",
                range: 0.5,
                move: ["Attack", "Ambush"],
                career: ["Brawling", "Assassin"],
                damage: [{ damage: "1d8", type: "piercing", when: "" }],
                wounding: "Short Pierce"

            },
            {
                name: "Throwing dagger Feint",
                range: 1,
                hands: 1,
                type: "Melee",
                move: ["Feint"],
                career: ["Brawling", "Assassin", "Urban"],
            },
            {
                name: "Dagger Stab at close range",
                type: "Grapple",
                range: 0,
                move: ["Attack", "Ambush"],
                career: ["Brawling", "Assassin", "Urban"],
                damage: [{ damage: "1d8", type: "piercing", when: "" }],
                wounding: "Short Pierce"

            },
            {
                name: "Thrown Dagger",
                type: "Thrown",
                career: ["Noble", "Urban", "Assassin"],
                range: 10,
                move: ["Ambush", "Attack"],
                damage: [{ damage: "1d8", type: "piercing", when: "" }],
                charges: 1,
                wounding: "Short Pierce"

            }],
        counters: [{ max: 1, cur: 1, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 1 },] }],

    },

    {
        name: "Hand Axe",
        description: "A hand axe balanced to throw as well as chop, useful as a tool too",
        image: "images/icons/weapons/axes/axe-broad-black.webp",
        slot: "pockets",
        wealth: 2,
        price: 5,
        weapon_modes:
            [{
                name: "Hand Axe Chop",
                type: "Melee",
                range: 0.5,
                move: ["Attack", "Ambush"],
                career: ["Martial"],
                damage: [{ damage: "2d6", type: "slashing", when: "" }],
                wounding: "Light Cut"
            },
            {
                name: "Hand Axe Thrown",
                type: "Thrown",
                career: ["Gladiator", "Hunter", "Pirate", "Assassin"],
                move: ["Attack", "Ambush"],
                range: 10,
                damage: [{ damage: "1d8", type: "slashing", when: "" }],
                charges: 1,
                wounding: "Light Cut"
            }],
        counters: [{ max: 1, cur: 1, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 1 },] }],

    },

    {
        name: "Javelin",
        description: "A light spear",
        image: "images/icons/weapons/polearms/javelin.webp",
        slot: "longarm",
        wealth: 0,
        price: 0.5,
        weapon_modes:
            [{
                name: "Javelin Stab",
                type: "Melee",
                range: 1,
                move: ["Attack", "Ambush"],
                career: ["Hunter", "Infantry", "Gladiator", "Athlete"],
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                wounding: "Short Pierce"
            },
            {
                name: "Throw Javelin",
                type: "Thrown",
                career: ["Hunter", "Infantry", "Gladiator", "Athlete"],
                range: 10,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d6", type: "piercing", when: "" }],
                wounding: "Short Pierce",
                charges: 1,
            }],
        counters: [{ max: 1, cur: 1, regen: [{ when: "After Fight", regen_amount: 1 }, { when: "Shopping", regen_amount: 1 },] }],

    },
    {
        name: "Knife",
        description: "A knife, not primarily intended as a weapon",
        image: "images/icons/weapons/polearms/Kobold__knife.webp",
        slot: "pockets",
        wealth: 1,
        price: 1,
        weapon_modes:
            [{
                name: "Knife Stab",
                type: "Melee",
                move: ["Attack", "Ambush"],
                range: 0.5,
                damage: [{ damage: "1d6", type: "piercing", when: "" }],
                career: ["Assassin", "Brawling"],
                wounding: "Short Pierce"
            },

            {
                name: "Knife Feint",
                range: 1,
                hands: 1,
                type: "Melee",
                move: ["Feint"],
                career: ["Brawling", "Assassin"],
            }, {
                type: "Grapple",
                range: 0,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "1d6", type: "piercing", when: "" }],
                career: ["Assassin", "Brawling"],
            },
            {
                type: "Knife Thrown",
                range: 10,
                move: ["Attack", "Ambush"],
                awkward: true,
                damage: [{ damage: "1d6", type: "piercing", when: "" }],
                wounding: "Short Pierce",
                career: ["Assassin"],

            }],
        counters: [{ max: 1, cur: 1, regen_when: "Short Rest", regen_amount: "1" }],
    }
    ,
    {
        name: "Flail",
        description: "A ball on a chain. A skillful user can try to grapple or disarm opponents.",
        image: "images/icons/weapons/polearms/ouroboros-flail.webp",
        slot: "longarm",
        wealth: 1,
        price: 10,
        weapon_modes:
            [{
                name: "Flail Swing",
                type: "Melee",
                range: 1.1,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d6", type: "bludgeoning", when: "" }],
                career: ["Gladiator", "Paladin"],
                wounding: "Heavy Bludgeon"
            },
            {
                name: "Flail Extended Swing",
                type: "Melee",
                range: 1.1,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d8", type: "bludgeoning", when: "you have time to wind up" }],
                career: ["Gladiator", "Paladin"],
                wounding: "Heavy Bludgeon"
            }
            ],

    },
    {
        name: "Great Axe",
        description: "A very heavy axe",
        image: "images/icons/weapons/polearms/Berserker Axe.jpg",
        slot: "longarm",
        strengthMin: 2,
        wealth: 4,
        price: 30,
        weapon_defenses: [{
            name: "Great Axe Block",
            range: 1,
            move: ["Attack", "Ambush"],
            hands: 2,
            type: "Melee",
            career: ["Martial"],
        }],
        weapon_modes:
            [{
                name: "Great Axe Chop",
                type: "Melee",
                hands: 2,
                move: ["Attack", "Ambush"],
                range: 1.1,
                damage: [{ damage: "2d12", type: "slashing", when: "" }],
                career: ["Martial"],
               wounding: "Heavy Cut"
            },
            // {
            //     name: "Great Axe Pommel",
            //     type: "Grapple",
            //     move: ["Attack", "Ambush"],
            //     range: 0,
            //     damage: [{ damage: "1d8", type: "piercing", when: "" }],
            //     career: ["Martial", "Assassin"],

            // },
            ],

    },
    {
        name: "Great Club",
        description: "A very heavy club",
        image: "images/icons/weapons/polearms/Maul01_01_Regular_White_Thumb.webp",
        slot: "longarm",
        strengthMin: 2,
        wealth: 1,
        price: 0.1,
        weapon_modes:
            [{
                name: "Great Club Smash",
                type: "Melee",
                hands: 2,
                range: 1.1,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "2d8", type: "slashing", when: "" }],
                career: ["Martial", "Strenth"],

            wounding: "Heavy Bludgeon"
            },
            // {
            //     name: "Great Club Pommel",
            //     type: "Grapple",
            //     move: ["Attack", "Ambush"],
            //     range: 0,
            //     damage: [{ damage: "1d8", type: "piercing", when: "" }],
            //     career: ["Brawling", "Gladiator", "Strength"],
            // },
            ],

    },
    {
        name: "Net",
        description: "A Large or smaller creature hit by a net is restrained until it is freed. A net has no effect on creatures that are formless, or creatures that are Huge or larger.A creature can use its action to make a DC 10 Strength check, freeing itself or another creature within its reach on a success. Dealing 5 slashing damage to the net  also frees the creature without harming it, ending the effect and destroying the net.",
        image: "images/icons/weapons/polearms/net.webp",
        slot: "longarm",
        strengthMin: 2,
        wealth: 1,
        price: 1,
        weapon_defenses: [{
            name: "Net Block",
            range: 1,
            move: ["Parry"],
            hands: 2,
            type: "Melee",
            career: ["Hunter", "Gladiator"],
        }],
        weapon_modes:
            [{
                name: "Entangle with Net",
                type: "Ranged",
                hands: 2,
                range: 2,
                move: ["Attack", "Ambush"],
                damage: [{ damage: 0, condition: "restrained", type: "fabric", when: "Large or smaller target" }],
                career: ["Hunter", "Gladiator"],
            }
            ],

    },
    {
        name: "Great Sword",
        description: "A very heavy Sword",
        image: "images/icons/weapons/polearms/GreatSword.webp",
        slot: "longarm",
        strengthMin: 2,
        wealth: 5,
        price: 50,
        weapon_defenses: [{
            name: "Great Sword Parry",
            range: 1,
            hands: 2,
            move: ["Attack", "Ambush"],
            type: "Melee",
            career: ["Martial"],
        }],
        weapon_modes:
            [{
                name: "Great Sword Swong",
                type: "Melee",
                hands: 2,
                range: 1.1,
                move: ["Attack", "Ambush"],
                damage: [{ damage: "4d6", type: "slashing", when: "" }],
                career: ["Martial"],
                wounding: "Heavy Cut",
            },
            // {
            //     name: "Great Sword Pommel",
            //     type: "Grapple",
            //     move: ["Attack", "Ambush"],
            //     range: 0,
            //     damage: [{ damage: "1d8", type: "piercing", when: "" }],
            //     career: ["Brawling", "Assassin"],
            // },
            ],

    },
    {
        name: "Fireball Wand",
        description: "Opens a temporary rift to the plane of fire, on defense, it could be used in reverse to parry a fire blast",
        image: "images/icons/weapons/polearms/Wand of Fireballs.jpg",
        slot: "sidearm",
        wealth: 10,
        price: 3000,
        weapon_modes:
            [
                {
                    name: "Fireball Wand Blast",
                    type: "Blast",
                    radius: 2,
                    career: ["Immolator", "Sorcerer"],
                    range: 12,
                    move: ["Attack", "Ambush"],
                    damage: [{ damage: "6d6", type: "fire", when: "" }],
                    description: "Can set target alfame",
                    charges: 1,
                    no_strength: true,
                    wounding: "Fire Blast",
                }
            ],
        counters: [{ name: "charges", max: 7, cur: 7, regen_when: "Dawn", regen_amount: "1d4" }],
    },
    {
        name: "Acid Vial ",
        description: "A vial of strong acid",
        image: "images/icons/weapons/polearms/acid-flask.webp",
        slot: "pockets",
        wealth: 3,
        price: 25,
        weapon_modes:
            [{
                name: "Throw Acid from vial",
                range: 4,
                hands: 1,
                type: "Thrown",
                move: ["Ambush", "Attack"],
                damage: [{ damage: "4d6", type: "acid", when: "" }],
                career: ["Assassin"],
                charges: 1,
                no_strength: true,
                wounding: "Acid Blast",
            }],
        counters: [{ max: 1, cur: 1, regen_when: "Shopping", regen_amount: "1" }],
    },
    {
        name: "Alchemist's Fire",
        description: "Sticky, adhesive fluid that ignites when exposed to air",
        image: "images/icons/weapons/polearms/bottled-sunlight.webp",
        slot: "pockets",
        wealth: 3,
        price: 50,
        weapon_modes:
            [{
                name: "Shatter Alchemist FIre",
                range: 4,
                radius: 1,
                hands: 1,
                type: "Thrown",
                move: ["Ambush", "Attack"],
                damage: [{ damage: "1d6", type: "fire", when: "" }, { condition: "aflame", type: "fire", when: "flammable" }],
                career: ["Assassin"],
                charges: 1,
                no_strength: true,
                wounding: "Fire Blast",
            }],
        counters: [{ name: "vials", max: 1, cur: 1, regen_when: "Shopping", regen_amount: "1" }],
    },


    {
        name: "Arcane Ingredients-Common",
        description: "As an action, a character expend this which will grant him mana to his aura",
        image: "images/icons/weapons/polearms/blindpepper-bomb.webp",
        slot: "pockets",
        wealth: 2,
        price: 25,
        use:
            [{
                name: "Use Arcane Ingredients-Common",
                range: 1,
                hands: 1,
                type: "Ingrediant",
                move: ["IncreaseMana"],
                career: ["Scholar", "Sorceror"],
                charges: 1,
                mana: 2,
                no_strength: true,
            }],
        counters: [{ max: 1, cur: 1, regen_when: "Shopping", regen_amount: "1" }],
    },
    {
        name: "Arcane Ingredients- Rare",
        description: "As an action, a character expend this which will grant him mana to his aura",
        image: "images/icons/weapons/polearms/blindpepper-bomb.webp",
        slot: "pockets",
        price: 50,
        wealth: 4,
        use:
            [{
                name: "Use Arcane Ingredients- Rare",
                range: 1,
                hands: 1,
                type: "Ingrediant",
                career: ["Scholar", "Sorceror"],
                move: ["IncreaseMana"],
                charges: 1,
                mana: 4,
                no_strength: true,
            }],
        counters: [{ max: 1, cur: 1, regen_when: "Shopping", regen_amount: "1" }],
    },
    {
        name: "Arcane Ingredients- Legendary",
        description: "As an action, a character expend this which will grant him mana to his aura",
        image: "images/icons/weapons/polearms/blindpepper-bomb.webp",
        slot: "pockets",
        price: 700,
        wealth: 8,
        use:
            [{
                name: "Use Arcane Ingredients- Legendary",
                range: 1,
                hands: 1,
                type: "Ingrediant",
                move: ["IncreaseMana"],
                career: ["Scholar", "Sorceror"],
                charges: 1,
                mana: 10,
                no_strength: true,
            }],
        counters: [{ max: 1, cur: 1, regen_when: "Shopping", regen_amount: "1" }],
    },
    {
        name: "Boomerang",
        description: "The boomerang is a ranged weapon, on a miss it returns to your hand. Useful for killing birds.",
        image: "images/icons/weapons/polearms/boomerang.webp",
        slot: "pockets",
        wealth: 1,
        price: 5,
        weapon_modes:
            [{
                name: "Throw Boomerang",
                range: 12,
                hands: 1,
                type: "Thrown",
                move: ["Attack", "Ambush"],
                damage: [{ damage: "1s4", type: "bludgeoning", when: "" },],
                career: ["Hunter"],
                charges: 1,
            }],
        counters: [{ max: 1, cur: 1, regen_when: "Short Rest", regen_amount: "1" }],
    },

];
/////////// PTBA source

var feats = {



    ElvishMagic: {

        name: "Elvish Magic",
        description: "You draw upon the natural magic of elves",
        type: "Magic",

    },
    DwarvenMagic: {

        name: "Dwarven Magic",
        description: "You draw upon the natural magic of dwarves",
        type: "Magic",

    },

    HumanCompensation: {

        name: "Human Compensation",
        description: "Change one of your +0 stats to +1",
        type: "Setup Character"

    },

    TrollishMagic: {
        name: "Trollish Magic",
        description: "You draw upon the natural magic of trolls",
        type: "Magic",
    },

    ChaosMagic: {
        name: "Chaos Magic",
        description: "You can draw upon the unpredicatable power of Chaos to create great works of sorcery",
        type: "Magic",
    },
    CelestialMagic: {
        name: "Celestial Magic",
        description: "You can draw upon the power of the celestials",
        type: "Magic",
    },

    HexesMagic: {
        name: "Hex Magic",
        description: "You can draw upon the unlucky power of hexes and curses",
        type: "Magic",
    },
    OtherworldMagic: {
        name: "Otherworld Magic",
        description: "You can channel power from beyond the stars",
        type: "Magic",
    },

    FireMagic: {
        name: "Fire Magic",
        description: "You can channel the energy of fire",
        type: "Magic",
    },

    WinterMagic: {
        name: "Winter Magic",
        description: "You can channel the energy of winter",
        type: "Magic",
    },

    StormMagic: {
        name: "Winter Magic",
        description: "You can channel the energy of storms",
        type: "Magic",
    },

    NatureMagic: {
        name: "Nature Magic",
        description: "You can draw upon the magic of the earth and nature",
        type: "Magic",
    },

    DivinationMagic: {
        name: "Divinitation Magic",
        description: "You can open your inner vision to realms of magic",
        type: "Magic",
    },

    NecromancyMagic: {
        name: "Necromancy Magic",
        description: "You can deal with the afterlife",
        type: "Magic",
    },

    ChiMagic: {
        name: "Chi Magic",
        description: "You can open up your body to the energy that flows through it",
        type: "Magic",
    },

    DarknessMagic: {
        name: "Darkness Magic",
        description: "You can summon the shadow",
        type: "Magic",
    },

    HealingMagic: {
        name: "Healing Magic",
        description: "Your care can heal wounds",
        type: "Magic",
    },

    ProtectionMagic: {
        name: "Protection Magic",
        description: "Protection versus the dark arts",
        type: "Magic",
    },
    SunAllergy: {
        name: "Sun Allergy",
        description: "You don't like bright sun light and see in sunlight as if it were dim light",
        type: "Senses",

    },

    BlindCombat: {
        name: "Blind Combat",
        description: "You are unaffected by vision when attacking in melee. This does not let you easily do other activities, just grappling and swinging weapons at targets.",
        type: "Senses",
    },

    StarVision: {
        name: "Star Vision",
        description: "You can on clear starry nights, and dawn or dusk see as well as daytime. Cloudy nights or underground, you are as blind as a human. If the stars are obscured due to fires or nearby cities, you see as dim light",
        type: "Senses",
    },
    DimVision: {
        name: "Dim Vision",
        description: "You can on see in dim light (such as the glowing caverns of Menzobarren) as if it were bright light. In the precense of close bright light, Dim Vision doesn't work though.",
        type: "Senses",
    },
    DarkTravel: {
        name: "Dark Travel",
        description: "Although you can't see in the dark, you move surely at full speed, and will not collide with obstacles, fall into pits, as you can sense the presence of terrain naturally as if you can see in dim light",
        type: "Senses",
    },
    Anatomy: {
        name: "Anatomy",
        description: "Do +5 damage to an on a surprise attack.",
        type: "Combat",
        bonusType: "Damage",
        bonus: 5,
        Moves: ["Ambush", "Backstab"],
    },
    Animal_Communication: {
        name: "Animal Communication",
        description: "For Effort, ‘understand’ an animal and communicate to him your intentions without any sort of roll",
        type: "Activated",
        EffortLoss: 1,
    },
    Animal_Companion: {
        name: "Animal Companion",
        description: "Create an adventurer companion. Animal companions can choose from Beast, Strenth, also Slave, perhaps Mother as their careers.",
        type: "Setup Character"
    },
    Animal_Influence: {
        name: "Animal Influence",
        description: "For Effort, automatically influence an animal.. Calm them, or make them back down due to your superior chest pounding, without any sort of roll",
        type: "Activated",
        EffortLoss: 1,

    },
    Armor_Master: {
        name: "Armor Master",
        description: "+1 to resist damage when wearing heavy armor(requires profieciency in that)",
        type: "Combat",
        EquipmentNeeded: "Heavy Armor",
        Moves: ["ResistDamage"],
        bonus: 1,

    },
    Artifacts: {
        name: "Artifacts",
        description: "You know about magic items.",
        type: "Scene",
    },
    Bardic_Lore: {
        name: "Bardic Lore",
        description: "Spend Effort to remember a snatch of a song or history that exactly describes the riddle or problem",
        type: "Scene",
    },
    Berserk: {
        name: "Berserk",
        description: "Enter a rage, use 1 Effort, +1 forward on offense, -1 forward  on defense until you decide to stop raging",
        type: "Activated",
        EffortLoss: 1,
        Moves: ["Attack", "Ambush"],
        bonus: 1,
        HinderedMoves: ["Parry", "Dodge"],
        minus: 1,

    },
    Climber: {
        name: "Climber",
        description: "Easily climb on rocks and trees and walls",
        type: "Scene",
    },
    Commune: {
        name: "Commune",
        description: "Talk to the local spirits of the land, and ask them questions",
        type: "Scene",
    },
    Crime_Lord: {
        name: "Crime Lord",
        description: "Knows everyone about crime in a particular city",
        type: "Scene",
    },
    Critic: {
        name: "Critic",
        description: "Spend a Effort to automatically know the weaknesses in your foe’s equipment (from your specialty), and gain an advantage of some kind.",
        type: "Activated",
        EffortLoss: 1,
    },
    Demonology_And_Cults: {
        name: "Demonology And Cults",
        description: "You have advantage on questions involving demonology and cults",
        type: "Scene",
    },
    Disguise_Master: {
        name: "Disguise Master",
        description: "Spend a Effort to make a perfect disguise, or as good as you can with the materials at hand.",
        type: "Activated",
        EffortLoss: 1,
    },
    Dynasties: {
        name: "Dynasties",
        description: "You u have advantage on questions involving politics and history.",
        type: "Scene",
    },
    Expert_Lockpick: {
        name: "Expert Lockpick",
        description: "Spend Effort to pick a lock without any sort of roll.",
        type: "Activated",
        EffortLoss: 1,
    },
    Expert_Pickpocket: {
        name: "Expert Pickpocket",
        description: "Spend Effort to steal something without any sort of roll",
        type: "Activated",
        EffortLoss: 1,
    },
    Extra: {
        name: "Extra",
        description: "Spend Effort to pull out a backup or extra gear in your specialty from your pack",
        type: "Activated",
        EffortLoss: 1,
    },
    God_Talker: {
        name: "God Talker",
        description: "When you visit a temple and pray, you can mystically communicate with your diety.   This will let you find out his/her/it’s will in order to gain favors from him/her/or it  for doing things. A person though who chose Dreams as a boon might be able to do this any time.",
        type: "Scene",
    },
    Holdout_Weapon: {
        name: "Holdout Weapon",
        description: "conceal a small weapon (or other item) on your person in a way too offensive to consider",
        type: "Scene",
    },
    Home_Field_Advantage: {
        name: "Home Field Advantage",
        description: "in your home terrain (pick one, like the Swamps of the Dead, or the Mountains of Fear) you are never surprised , and in similar terrain you can travel through this kind of terrain easily without getting tired and can easily forage.",
        type: "Senses",
    },
    Imbue_Magic: {
        name: "Imbue Magic",
        description: "You can, at great expense, and time, and Effort, make magical versions of your specialty or specialties.",
        type: "Downtime",
        Kata: {
            name: "Kata",
            description: "You dance in a spiritual way.  As you dance, spend a bonus action to gain 2 mana point you can immediately add to your aura (for use in spells)",
            type: "bonus action",
            stuff: "TODO",
        },
        Magical_Performance: {
            name: "Magical Performance",
            description: " You can cast a spell subtly through your performance that only the most alert will notice, well, as long as the spell results aren’t obvious. Spend Effort to cast a spell by singing it.",
            type: "Activated",
            EffortLoss: 1,
        },
        Master_Acrobat: {
            name: "Master Acrobat",
            description: "Spend Effort to automatically make a difficult acrobatic move without a roll, or to get advantage on dodge",
            Moves: ["Dodge"],
            type: "Activated",
            EffortLoss: 1,
        },
        Master_Musician: {
            name: "Master Musician",
            description: "You are really good at your instrument. You could beat the devil in a fiddle duel. ",
            type: "Scene",
        },
        Master_of_Stealth: {
            name: "Master of Stealth",
            description: "Spend Effort to sneak without any sort of roll, you can spend 1 additional effort points for all your friends. Also applies to ‘scout’ rolls",
            type: "Activated",
            EffortLoss: 1,
        },
        McGuyver: {
            name: "McGuyver",
            description: "You can use your specialty in a quick manner with improper tools, with an Effort point you can acheive unlikely results",
            type: "Activated",
            EffortLoss: 1,
        },
        Mercy: {
            name: "Mercy! Spare Me!",
            description: "Spend Effort to not be the target of a creature’s attack, lasts until you attack.",
            type: "Activated",
            EffortLoss: 1,
        },
        Mobile_Archer: {
            name: "Mobile Archer",
            description: "Can both move and shoot your bow. Normally all aimed bows and crossbows require you not to move on the turn you are shooting, this lets you skip that.",
            type: "Combat"
        },
        Monotheist: {
            name: "Monotheist",
            description: "You believe all other gods are but reflections of your own. This is a heresy, but some gods like this and give you +1 rank in your usage dice.",
            type: "Scene",
            stuff: "TODO",
        },
        Musical_Number: {
            name: "Musical Number",
            description: "Explain to the GM the song,  the dance, the scene, and spend Effort. Resolve a problem (like building an orphanage, getting past the guards) after a broadway or bollywood sized dancing and musical number where everyone in the scene participates. Each player must say how he is contributing or fighting against or sitting out the musical number.  Each player can roll to give you a +1 or a -1  to the result.  Then roll Performance. On a hit it’s what you desire. (Note, no-one dies or gets injured during the musical number, although attitudes might change). A failure may indicate a counter narrative gains control of the scene.",
            type: "Activated",
            EffortLoss: 1,
        },
        Musical_Virtuoso: {
            name: "Musical Virtuoso",
            description: "Be able to play any instrument well, even a klaathian nose flute",
            type: "Scene",
        },
        Pack_Rat: {
            name: "Pack Rat",
            description: "Carry 50% more than normal",
            type: "equipment",
            stuff: "TODO",
        },
        Poison_Master: {
            name: "Poison Master",
            description: "Each Effort spent after an attack deals an additional + 3 damage, or when introduced into drink can incapacitate or kill one individual. Brewing more poison for a bigger set of targets, like a garrison, requires being industrious and spending supplies and money.You can also spend supplies to get various poisons from the poison list.",
            type: "Activated",
            EffortLoss: 1,
            Moves: ["Attack", "Backstab"],
            bonusType: "Damage",
            bonus: 3,
        },
        Polytheist: {
            name: "Polytheist",
            description: "You can call upon other gods, not just your main god, this might help for gaining advantage on planar forces rolls. Still use one usage dice though.",
            stuff: "TODO",
        },
        Reflexes: {
            name: "Reflexes",
            description: "When surprised, you still get reactions",
            type: "Scene",
        },
        Religious_Lore: {
            name: "Religious Lore",
            description: "You have advantage on questions involving religions",
            type: "Scene",
        },
        Ride_By: {
            name: "Ride By",
            description: "For Effort, gain an extra attack versus a new target that you are moving by",
            type: "Activated",
            EffortLoss: 1,
            Moves: ["Attack"],
            EquipmentNeeded: "Mount",

        },
        Scholars_Guild: {
            name: "Scholars Guild",
            description: "You have an official degree and title, and  know many other scholars. You can wear a special badge. You are automatically permitted access to every library, due to your status, and might receive an income.",
            type: "Scene",
        },
        Secrets: {
            name: "Secrets",
            description: "You know the secrets of your religion, the hidden passages behind temple altars, the passwords to get into the chambers, the secrets kept by the masters. You may (with table approval) invent secret facts about your religion that give you advantages",
            type: "Scene",
        },
        Shield_Master: {
            name: "Shield Master",
            EquipmentNeeded: "Shield",
            description: "+1 to resist damage when carrying a shield",
            Moves: ["ResistDamage"],
            bonus: 1,
        },
        Show_Off: {
            name: "Show Off",
            description: "You can spend Effort to reroll  a Challenge,Grisly Display,Fear my blade roll.",
            type: "Activated",
            EffortLoss: 1,
            Moves: ["Fear my blade", "Challenge", "Grisly Display", "Flaming Brand"],
            reroll: true,

        },
        Sniper: {
            name: "Sniper",
            description: "Spend Effort  to reroll a ranged attack roll",
            type: "Activated",
            EffortLoss: 1,
            EquipmentNeeded: "Ranged Weapon",
            Moves: ["Attack"],
            reroll: true,
        },
        Sorceror_Kings: {
            name: "Sorceror Kings",
            description: "You have advantage on questions involving the ancient sorceror kings",
            type: "Scene",
        },
        Specialty_Alchemist: {
            name: "Specialty Alchemist",
            description: "Drugs and alchemy and brewing craft specialty",
            type: "Scene",
        },
        Specialty_Cook: {
            name: "Specialty Cook",
            description: "Cooking and brewing craft specialty",
            type: "Scene",
        },
        Specialty_Jeweler: {
            name: "Specialty Jeweler",
            description: "Jewelry craft specialty",
            type: "Scene",
        },
        Specialty_Mason: {
            name: "Specialty Mason",
            description: "Buildlings craft specialty",
            type: "Scene",
        },
        Specialty_Tailor: {
            name: "Specialty Tailor",
            description: "Clothing craft specialty",
            type: "Scene",
        },
        Specialty_Weapon_Smith: {
            name: "Specialty Weapon Smith",
            description: "Weapons, armor, and metal objects craft specialty",
            type: "Scene",
        },
        Spirited_Charge: {
            name: "Spirited Charge",
            description: "+2 to  damage in a charge",
            type: "Optional",
            bonusType: "Damage",
            bonus: 2,
        },
        Swift_Rider: {
            name: "Swift Rider",
            description: "+1 movement when riding",
            type: "TODO"
        },
        Swift: {
            name: "Swift",
            description: "+1 Movement on foot or swim",
            type: "TODO"
        },
        Taboo: {
            name: "Taboo",
            description: "Pick 3 taboos, such as ‘eat no meat’, ‘never speak to a member of the opposite sex directly’, ‘fast while the sun is shining’, ‘never talk after darkness’. ‘Never ride a horse’  ‘always wear priestly vestments’,  ‘never wear armor, always wear a veil. While observing the taboo,  you get +1 rank on your usage dice, when you break it, get disadvantage until spiritually cured.",
            type: "TODO"
        },
        The_dance_of_the_seven_veils: {
            name: "The dance of the seven veils",
            description: "Your dancing can cause someone to desire you in an almost magical way. Spend Effort to reroll your seduction attempt.", type: "Activated",
            EffortLoss: 1,
            Moves: ["Seduce/Flirt/Entertain"],
            reroll: true,
        },
        Trade: {
            name: "Trade",
            description: "You know everything about the values of things and where they can be sold, advantage on shopping",
            Moves: ["Shopping"],
            advantage: true,

        },
        Tree_bends_in_the_Wind: {
            name: "Tree bends in the Wind",
            description: "When dodging an enemy, you can use his own force against him, on success or mixed for Effort you can also  knock them prone, make them collide into each other, or crash into walls, within reason",
            Moves: ["Dodge"],
            type: "Activated",
            EffortLoss: 1,
        },
        Two_Weapon_Fighting: {
            name: "Two Weapon Fighting",
            description: "When fighting with two weapons, reduce by 1 the cost in Steel if attacking more than one opponent, do the damage of the better weapon",
            Moves: ["Attack"],
            stuff: "TODO",

        },
        Vicious_Mockery: {
            name: "Vicious Mockery",
            description: "Spend Effort to insult another and make them enraged, they will be berserk and lose defense, as long as this makes sense",
            type: "Activated",
            EffortLoss: 1,
        },
        Wasnt_Here: {
            name: "I Wasn't Here",
            description: "Spend Effort to opt out of a scene as long as you haven't acted in it yet",
            type: "Activated",
            EffortLoss: 1,
        },

        Whip_Master: {
            name: "Whip Master",
            description: "You can attack at 2 hexes with a whip, disarming a foe on a success instead of damage, you can use the whip for swinging across chasms or putting out a candle or grabbing things. It doesn’t count as a reach weapon for defense against charges though.",
            stuff: "TODO",
        },
        Whirlwind: {
            name: "Whirlwind",
            description: "for Effort,  attack all  adjacent targets, roll against each one  ",
            type: "Activated",
            EffortLoss: 1,
        },
        Wicked_Lie: {
            name: "Wicked Lie",
            description: "Spend Effort to reroll any deception attempt. Take the best roll.",
            type: "Activated",
            Moves: ["Wicked Lie"],
            EffortLoss: 1,
        },
    },
    Wizard: {
        name: "Wizard",
        description: "You can learn spells outside your area of knowledge, and cast spells outside of your known area of magic, but must use Effort when you cast. You can also fuel your spells with any kind of mana when you do this.",
        type: "Activated",
        EffortLoss: 1,

    },
    Wrestler: {
        name: "Wrestler",
        description: "Add +1 to rolls involving wrestling",
        Moves: ["Wrestle", "restle (defense)"],
        bonus: 1,
    },
    Zealot: {
        name: "Zealot",
        description: "You have +1 on attacks when fighting infidels and supernatural evil",
        type: "Optional",
        Moves: ["Attack"],
        bonus: 1,
    },
    Familiar: {
        name: "Familiar",
        description: "You have a small inoffensive animal you can command mentally. You can possess this creature and see from it's eyes at will. You can only take actions as your familiar or yourself on any round",
        type: "Scene",
    },
    Burning_Brand: {
        name: "Burning Brand",
        description: "Conjure a weapon of flame, roll +Brave, it is fiery, touch, dangerous, has 3 uses. On success choose 2 more tags, on mixed choose 1: *hand *thrown, near , +1 damage, remove dangerous tag.",
        stuff: "TODDo",
    },
    God_Fire: {
        name: "God Fire",
        description: "You can use Godfire instead of normal fire in your powers or magic, this magic ignores 2 armor and burns not the body but the souls of the victims. Creatures without souls cannot be damaged by this.",
        stuff: "TODDo",
    },
    Resist_Fire: {
        name: "Resist Fire",
        description: "Take -3 damage from fire, and don’t suffocate from smoke. If you are the recipeint of a Resist Fire spell, you are immune to fire.",
        Moves: ["ResistDamage"],
        type: "Optional",
        bonus: -3,
    },
    By_Fire_Restored: {
        name: "By Fire Restored",
        description: "Heal all  health points if sleeping overnight near a large fire.",
        type: "Scene",
    },
    Fuel: {
        name: "Fuel",
        description: "Whenever you wound someone or they wound you gain 2 mana to your aura.",
        type: "TODO",
    },
    Phalanx: {
        name: "Phalanx",
        description: "+1 on attacks on a reach defense versus charge. If you also have a shield, you can defend even though you used your reaction for a reach attack.",
        type: "Optional",
        Moves: ["Attack"],
        bonus: 1,
    },
    Artillery: {
        name: "Artillery",
        description: "You can operate artillery and catapults, and know about sieges",
        type: "Scene",
    },
    Tough: {
        name: "Tough",
        description: "Use Effort point to ignore the pain effect of a wound for a scene",
        type: "Activated",
        EffortLoss: 1,
    },
    Mobile_Archer: {
        name: "Mobile Archer",
        description: "You can both move and shoot, normally when shooting bows you forgo movement that turn",
        type: "Scene",
    },

    Master_Surgeon: {
        name: "Master Surgeon",
        description: "You can do surgery to remove limbs or organs, or to heal wounds (triple healing but bad if you roll a failure), or to implant things.s",
        type: "Scene",
        stuff: "TODO"
    },
    Good_bedside_manner: {
        name: "Good Bedside Manner",
        description: "All your non magical healing are doubled",
        type: "Scene",
        stuff: "TODO"
    },

    Exorcist: {
        name: "Exorcist",
        description: "You can also recognize and diagnose demonic possession and curses, and sometimes can cure it, or at least know what will cure it.",
        type: "Scene",
    },
    Potion_Maker: {
        name: "Potion Maker",
        description: "Can make other kinds of potions. For  1 point of effort, have three bottles of one of the following potions:\n" +
            "* Dream Essence: Gives a person a dream\n" +
            "* Aphrodisiac: A love potion\n" +
            "* Depilatory: Removes hair on contact\n" +
            "* Poison Antidote: Cures poison instantly\n" +
            "* Soporific Elixir: When drunk, causes sleep\n" +
            "* Purgative: When drunk, removes parasites instantly\n" +
            "*Tirelessness: Drink first, then, when the drinker get tired, roll the potion maker’s medicine, success: prevent exhaustion, mixed: prevent 1 level of exhaustion, fail: gain +1 exhaustion,\n" +
            "You can also create magical potions. When you use a potion, spend one supply, and construct a potion that does a spell of the first magnitude to the person who drinks it. When the person drinks it, roll at that time with your skill for how successful the spell is and whether there are side effects., but spend the power now.",
        type: "Activated",
        EffortLoss: 1,
    },

    Mama_Lion: {
        name: "Mama Lion",
        description: " Reroll dice once whenever you are trying to save or advance or fix your kids or adopted kids",
        stuff: "TODO"
    },
    Guilt_Trip: {
        name: "Guilt Trip",
        description: " Use Effort to reroll an attempt to guilt someone into obedience",
        stuff: "TODO"
    },
    Great_Beauty: {
        name: "Great Beauty",
        description: "You are beautiful and desirable, and gain advantages when that matters",
        type: "Scene",
    },
    Duelist: {
        name: "Duelist",
        description: "You are skilled with melee weapons, and can use Effort (once per attack) to get +1 to damage with a light sword. Weapon Proficiencies:Light sword, dagger",
        stuff: "TODO"
    },
    Devoted_Servant: {
        name: "Devoted Servant",
        description: "Create an adventurer companion, this can be an animal, or a person",
        stuff: "Character Setup"

    },

    Lay_On_Hands: {
        name: "Lay On Hands",
        description: "Spend Effort to cast Heal Wounds (roll caring) with no Mana,  touch range, or get +1 to Heal Wounds Spell for 1 Effort",
        stuff: "TODO"
    },
    Smite: {
        name: "Smite",
        description: "Spend 1 Effort to cast Smite Spell",
        stuff: "TODO"
        // TODO: for paladins pick oath seperately and index
    },
    Channel_Divinity: {
        name: "Channel Divinity",
        description: "Once per short rest, take an action do do one of these: :\n" +
            "Oath of Devotion: You sword becomes magic +2 steel and +1 damage  and radiates light for 1 minute, or fiends and undead are turned\n" +
            "Oath of Redemption: Emissary of Peace: advantage on a peaecful negotiation\n" +
            "Oath of Vengeance: Target one foe and getting advantage on attacks and +1 forward for the rest of the battle\n" +
            "Turn outsiders: Turn aberrations, undead, celestials, elementals, fey, and fiends, OR, block one spell affect from affecting one target\n",
        stuff: "TODO"

    },
    Aura: {
        name: "Aura",
        description: "Your aura has an effect based on your oath to those allies and friends nearby or to your enemies. Can be used in one scene per day, Choose:\n" +
            "Ward Spells: Advantage on defenses versus spells\n" +
            "Ward Charms: Allies nearby cannot be magically charmed\n" +
            "Oath of Glory:  Spend effort to reroll your or your ally's attack\n" +
            "Oath of Vengeance: Sped effort to reroll your or your ally's damage\n" +
            "Oath of Watchers: Allies nearby can get advantage to gaining initiative at the start of an encounter\n" +
            "Oath of the Open Sea: Allies and yourself  nearby can swim at +2 move and get advantage escaping from grapples",
        stuff: "TODO"
    },
    Sail_Monkey: {
        name: "Sail Monkey",
        description: "Easily climb and swing from ropes and sails, keep to your feet in the roughest seas",
        type: "Scene",
    },
    Every_Port: {
        name: "Every Port",
        description: "Familiar with every port city in the Known World, you know the layout, the issues, the best taverns",
        type: "Scene",
    },
    Fisherman: {
        name: "Fisherman",
        description: "Survive at sea, commune with the ocean spirits",
        type: "Scene",
    },
    Sea_Captain: {
        name: "Sea Captain",
        description: "You have captained a ship and get the title, and can navigate. Describe your reputation for recruiting crew. In certain campaigns, you can have a ship.",
        type: "Scene",
    },
    Diver: {
        name: "Diver",
        description: "Hold your breath and dive deep, swim at +2 speed",
        type: "Scene",
        stuff: "TODO"
    },

    Blood_Sacrifice: {
        name: "Blood Sacrifice",
        description: "When you slice open your wrist for self sacrifice to gain mana, you don't take damage. Any blood scarfice gives triple mana value",
        type: "Scene",
        stuff: "TODO"
    },
    SubtleSpell: {
        name: "Subtle Spell",
        description: "If you take care you can cast your spells more quietly, and low mana spells (<3), may not even appear to be magic.",
        type: "Scene",
        stuff: "TODO"
    },
    Brawler: {
        name: "Brawler",
        description: "+1 damage with your bare hands",
        stuff: "TODO"
    },


    Reach: {
        name: "Reach",
        requirements: "Strength 2 or better",
        description: "Your long arms give you +1 reach: also when attacked by someone with the same length weapon when the enemy is moving into range you have and can use your defense for an attack instead, just as if you were armed with a longer reach weapon",
        stuff: "TODO"
    },
    Invisible_Man: {
        name: "Invisible Man",
        description: "Use Effort not to be paid attention to during the scene as long as you don’t act up",
        type: "Activated",
        EffortLoss: 1,
    },
    Tracking_Scent: {
        name: "Tracking Scent",
        description: "Ability to track unerringly with your nose",
        type: "Scene",
    },
    Human_Communication: {
        name: "Human Communication",
        description: "For Effort, ‘understand’ a human and communicate to him your intentions without any sort of roll",
        type: "Activated",
        EffortLoss: 1,
    },
    Bodyguard: {
        name: "Bodyguard",
        description: "Bodyguard: for Effort out of sequence react to defend another person even if you have already used your turn",
        type: "Activated",
        EffortLoss: 1,
    }
};


var languages = [
    "Dwarvish",
    "Far Durian",
    "Pirate Cant",
    "Illyrian",
    "Imperial, Court",
    "Imperial, Low",
    "Low Elvish",
];

var magic_languages = [
    "Abyssal (demon magic)",
    "Arachnos (spider magic) ",
    "BeastSpeech (animal magic)",
    "Celestial (divine magic)",
    "Firespeech (fire magic)",
    "High Elvish (elven magic)",
    "Sea Tongue (fish magic) ",
    "Saurian (reptiloid magic) ",
    "Windsong (air magic)"
];

var tribal_languages = [
    "Horse plains  (Tribal)",
    "Frozen North (Tribal) ",
    "Burning Sands (Tribal) ",
    "Orc (Tribal)",
    "Ratling (Tribal)",
    "Trollish (Tribal)",

];

var backgrounds = {
    Elf: {

        name: "Elf",
        description: "Elves are graceful, tolkienesque beings devote to the contemplative life. You must choose Allure as your best stat.",
        feats: ["StarVision", "ElvishMagic"],

        languages: ["Elvish"],


    },
    Drow: {

        name: "Drow",
        description: "Albino .",
        feats: ["SunAllergy", "DarkTravel", "DimVision", "DrowMagic"],

        languages: ["Elvish"],


    },
    Dwarf: {

        name: "Dwarf",
        description: "Dwarves are short, tokeienesque beings who live under the ground.",
        feats: ["DarkTravel", "DwarvishMagic"],

        languages: ["Dwarvish"],


    },

    Human: {

        name: "Human",
        description: "A man or a woman.  ",
        feats: ["HumanCompensation"],

        languages: [],


    },

    PartTroll: {

        name: "Part Troll",
        description: "You are blood related to giants or trolls. You must choose Strength as your best stat.",
        feats: ["SunAllergy",
            "BlindCombat", "TrollishMagic"],

        languages: [],


    },

    Goblin: {

        name: "Goblin",
        description: "You are a nasty, vicious goblin. Your worst stat must be allure. People will tend to have a bad reaction to you. Massive hindrance",
        feats: ["SunAllergy",
            "BlindCombat",
            "DarkTravel", "HexMagic"],

        languages: [],


    },

};

var careers = {


    Assassin: {
        name: "Assassin",
        type: "Rogue",
        weapons: ["Assassin"],
        description: "Blades-for-hire, perhaps agents in the service of the king, spies and assassins make killing and stealing in a discreet manner a way of life. They are adept at sneak attacks, killing, information gathering, disguises, city lore, persuasion, poisons, and lock picking. Their methods involve gathering intelligence on their subject from various (sometimes seedy) sources, circumventing security measures of all types, adopting disguises that allow them to get close to the target, and building up a broad selection of contacts. They are also patient, sometimes hiding out in a single spot for days to await the perfect opportunity to strike. ",
        feats: ["Holdout_Weapon", "Wicked_Lie", "Anatomy", "Poison_Master", "Sniper", "Disguise_Master", "Two_Weapon_Fighting",
            "Master_of_Stealth", "DarknessMagic", "ChiMagic"],

        languages: [],
        tools: "By Feat",
        moves: ["Ambush", "Avoid", "Backstab", "Dodge", "Feint", "Gossip", "Investigate", "Scout", "Wicked Lie", "Knife to the Throat"],
    },
    DrowBlademaster: {
        name: "Drow Blademaster",
        type: "Rogue",
        weapons: ["Assassin"],
        description: "The proffessional but polite killers who guard the ladies of Drow Society",

        feats: ["Master_Acrobat", "Two_Weapon_Fighting", "Reflexes", "Poison_Master", "Sniper", "Master_of_Stealth", "Bodyguard", "DarknessMagic"],

        languages: [],
        tools: "By Feat",
        moves: ["Fear My Blade", "Challenge", "Ambush", "Avoid", "Backstab", "Dodge", "Feint", "Gossip", "Investigate", "Scout", "Wicked Lie", "Knife to the Throat"],
    },
    Beggar: {
        name: "Beggar",
        type: "Rogue",
        description: "Beggars are not usually the career choice of a famous adventurer, but some of the careers like ignoring poor conditions and not needing food can come in handy. Also Beggars are alert to danger and often can pickpocket and steal.\n" +
            "Beggars are vagrants or tramps, aimlessly wandering from place to place. They may do casual work here and there, they may sell a few small trinkets that they carry about in their backpacks, or they may have to beg for a few coins when times are really hard. Some even turn their hands to dishonest pursuits.",
        feats: ["Mercy", "Expert_Pickpocket", "Pack_Rat", "Wasnt_Here"],
        languages: [],
        moves: ["Avoid", "Dodge", "Gossip", "Insight", "Scout", "Wicked Lie"],
        tools: ""
    },
    Viking: {
        name: "Nord",
        description: "These warriors hail from the frozen north.",
        weapons: ["Martial", "Brawling", "LightArmor", "HeavyArmor"],
        feats: ["Swift",
            "Climber",
            "Reflexes",
            "Berserk",
            "Whirlwind",
        ],
        moves: ["Grisly Display", "Challenge", "Fear My Blade", "Confront", "Wrestle", "Wrestle (defense)"],
        languages: [],
        tools: "Camping"
    },
    Bard: {
        name: "Bard",
        description: "Training in singing,  dancing (to a degree, not as acrobatic as a dancer, just enough to look good onstage), storytelling, and playing instruments. In a tavern, 1 level of minstrel might allow a roll to be not difficult, while it might take 4 for a royal performance.\n" +
            "As wandering entertainers, minstrels perform songs, music, poetry, and plays – telling tales of distant places and historical or fantastical events. They often create their own stories or memorize and embellish the work of others. Whilst most are travelers taking their songs and music from city to city, some are retained at the courts of nobles for their own entertainment",
        feats: [
            "Bardic_Lore",
            "Master_Musician",
            "Magical_Performance",
            "Musical_Number",
            "Vicious_Mockery",
            "Musical_Virtuoso"],
        languages: [languages, tribal_languages],
        mana: 1,
        moves: ["Confront", "Challenge", "Bargain", "Calm", "Feint", "Gossip", "Investigate", "Insight", "Perilous Journey", "Purchase", "Seduce/Flirt/Entertain",
            "Spout Lore", "Steal", "Wicked Lie", "Performance"
        ],
        tools: "Musical Instrument"
    },
    Beast: {
        name: "Beast",
        description: "For animal companions. Animal companions can choose from Beast, also Slave, Strong, perhaps Mother as their careers. Note, animals don't naturally fight well, this could represent a gerbil, choose strong if you want skill at claw and teeth",
        weapons: ["Brawling"],
        feats: ["Tracking_Scent", "Animal_Influence", "Animal_Communication", "Human_Communication", "Commune", "Swift"],
        moves: ["Scout", "Ambush", "Perilous Journey",],
        languages: [],
        tools: ""
    },

    Cavalry: {
        name: "Cavalry",
        description: "Raiding and soldiers: Fighting with cavalry weapons, but on foot too, familiar with horses, living off the land, pillaging, marching, scouting, following orders, preparing trips, logistics, interrogating locals, understanding enemy troop movements, getting the advantage in an attack involving a group using tactics.",
        weapons: ["Martial", "Mounted", "HeavyArmor", "Cavalry"],
        moves: ["Scout", "Control Mount", "Perilous Journey", "Fear My Blade",],

        feats: [
            "Ride_By",
            "Swift_Rider",
            "Spirited_Charge",
            "Shield_Master",
            "Armor_Master",
        ],
        languages: [],
        tools: "Horses, Camping"
    },
    HorseArcher: {
        name: "Horse Archer",
        description: "Raiders and soldiers: Fighting with ranged weapons, but on foot too, familiar with horses, living off the land, pillaging, marching, scouting, following orders, preparing trips, logistics, interrogating locals, understanding enemy troop movements, getting the advantage in an attack involving a group using tactics.",
        weapons: ["Archer", "Mounted", "HorseArcher", "LightArmor"],
        feats: [
            "Ride_By",
            "Swift_Rider",
            "Mobile_Archer",
        ],
        moves: ["Scout", "Control Mount", "Perilous Journey", "Ambush"],
        languages: [],
        tools: "Horses, Camping"
    },
    Craft: {
        name: "Craft",
        description: "Ability to make and repair things.\n" +
            "Specialty:  such as blacksmith, jeweler, carpenter, architect, weaver, drug maker. Your first feat Must be a specialty, after you can take more or take other feats",
        moves: ["Bargain", "Purchase", "Gossip", "Investigate", "Devices"],

        feats: [
            "Specialty_Weapon_Smith",
            "Specialty_Jeweler",
            "Specialty_Alchemist",
            "Specialty_Mason",
            "Specialty_Tailor",
            "Specialty_Cook",
            "Imbue_Magic",
            "McGuyver",
            "Critic",
            "Extra",
        ],
        languages: [],
        tools: "Tools of the Trade"
    },
    Thief: {
        name: "Thief", description: "Selling and buying illegal goods, taverns, lockpicking and traps. Shadowing and sneaking. Urban Crime. Pickpocketing. How to obtain miscreants for dirty work. Smuggling. Can overlap with Merchant and beggar.", weapons: [],
        feats: [
            "Climber",
            "Master_of_Stealth",
            "Expert_lockpick",
            "Expert_Pickpocket",
            "Pack_Rat",
            "Crime_Lord",],
        moves: ["Bargain", "Purchase", "Gossip", "Investigate", "Steal", "Wicked Lie", "Backstab", "Ambush", "Feint", "Devices"],
        languages: [],
        tools: "Lockpick, Cards"
    },
    Priest: {
        name: "Priest",
        description: "A priest leads ceremonies for one of the relgions:\n " +
            "*Church Of Law: Think medieval Catholicism , they are opposed to the forces of Chaos who are said to one day destroy the world, and fearful of sorcerers\n " +
            "*Nordic: Players can freely mix and match gaelic and nordic religions up in crazy combos\n " +
            "*Greek:Players can mix up greek and persian and egyptian religions up in crazy combos\n ",

        feats: [
            "CelestialMagic",
            "ProtectionMagic",
            "HealingMagic",
            "StormMagic",
            "NatureMagic",
            "Zealot",
            "Polytheist",
            "Secrets",
            "God_Talker",
            "Monotheist",
            "Taboo",
            "Religious_Lore"],
        languages: [],
        moves: ["Seduce/Flirt/Entertain", "Gossip", "Investigate", "Insight", "Performance"
            , "Wicked Lie", "Gossip", "Spout Lore", "Heal", "Calm", "Planar Forces"],
        tools: "Planar Forces, Religious symbols, Magic Religious Devices",
        mana: 1,
    },

    Cultist: {
        name: "Cultist",
        description: "A  cultist leads ceremonies for one of the forbidden relgions:\n " +
            "*Cults of Chaos: Many dark cults who worship hellish beings\n " +
            "*Cults of The Deep: Many dark cults who worships outsiders  “Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn.\n ",
        feats: [
            "OtherworldMagic",
            "ChaosMagic",
            "HexesMagic",
            "DarknessMagic",
            "NecromancyMagic",
            "Zealot",
            "Polytheist",
            "Secrets",
            "God_Talker",
            "Monotheist",
            "Blood_Sacrifice",
            "Taboo",
            "Religious_Lore"],
        languages: [],
        moves: ["Knife to the Throat", "Seduce/Flirt/Entertain", "Gossip", "Investigate", "Ambush", "Wicked Lie", "Gossip", "Spout Lore", "Planar Forces"],
        tools: "Planar Forces, Religious symbols, Magic Religious Devices",
        mana: 1,
    },
    Dancer: {
        name: "Dancer", description: "Dancing is an important part of entertainment in the land. Ceremonies and feasts will have dancers or acrobats. Dancers are athletic, showing feats of skill, agility, and coordination. They can dive, tumble, and do acrobatics. Some dancers extend their skills to a few sleight of hand and juggling tricks, and others to exotic techniques using veils to barely conceal their nakedness.",
        weapons: ["Dancer"],
        feats: [
            "Swift",
            "Master_Acrobat",
            "Tree_bends_in_the_Wind",
            "The_dance_of_the_seven_veils",
            "Kata",
            "ChiMagic",
        ],
        moves: ["Seduce/Flirt/Entertain", "Dodge", "Avoid", "Performance", "Feint", "Insight"],
        languages: [],
        mana: 1,
        tools: ""
    },
    Martal_Monk: {
        name: "Martial Monk", description: "These monks meditate in hidden temples, honing their martial arts powers",
        weapons: ["Brawling"],
        feats: [
            "Swift",
            "Master_Acrobat",
            "Tree_bends_in_the_Wind",
            "Kata",
            "Tough",
            "Climber",
            "Commune",
            "Brawler",
            "Wrestler",
            "ChiMagic"
        ],
        moves: ["Feint", "Dodge", "Avoid", "Wrestle", "Wrestle (defense)", "Insight"],
        languages: [],
        mana: 1,
        tools: ""
    },
    Farmer: {
        name: "Farmer", description: "Work with your hands and the land, agriculture, hard work. Ability to connect to common people. Farmers live outside the city, but often within half a day’s travel, so that they are able to get their produce to the city to feed the populace. They are hardy and hard working, and are skilled in basic plant- and animal lore, animal handling, cooking, baking and brewing, trading for basic goods, and such like.",
        feats: [
            "Commune",
            "Mercy",
            "Pack_Rat",
            "Wasnt_Here",
            "Animal_Influence",
        ],
        moves: ["Scout", "Avoid", "Hard Physical Work"],
        languages: [],
        tools: "Camping"
    }, Gladiator: {
        name: "Gladiator", description: "Gladiators are specialists at individual combat. They are adept with a variety of weapons. They fight humans or beasts in an entertaining fashion. Gladiators may have ended up in the arena as a slave or to pay off a debt – whatever the reason, they have survived to hear the howls of the crowd and their adversary at their feet. The best gladiators are often famous outside the arena, which can be to their advantage or to their detriment",
        weapons: ["Brawling", "Martial", "Gladiator", "LightArmor", "HeavyArmor"],
        feats: [
            "Two_Weapon_Fighting",
            "Wrestler",
            "Whip_Master",
            "Show_Off",],
        moves: ["Challenge", "Grisly Display", "Fear My Blade", "Confront", "Wrestle", "Wrestle (defense)"],
        languages: [],
        tools: ""
    },
    Hunter: {
        name: "Hunter", description: "The hunter is a master of tracking prey through the wilderness and the wastelands. Once hunters locate their target, they’ll use stealth, traps and/or expert bowmanship or spears  to bring it down. They are at home in the wild and can survive there for long periods, returning to more civilized areas only when they have furs and hides to sell, or when they require the company of their fellow men (or women). ",
        weapons: ["Hunter", "LightArmor"],
        feats: [
            "Home_Field_Advantage",
            "Sniper",
            "Pack_Rat",
            "Master_of_Stealth",
            "Commune",
            "Climber",
            "NatureMagic",
        ],
        languages: [],
        moves: ["Avoid", "Scout", "Perilous Journeys", "Ambush"],
        tools: "Animals, Animal Traps, Camping, Tracking"
    },
    Immolator: {
        name: "Immolator",
        description: "The Fire Priests of Far Dur worship Chiteng of the Red Dancing flame, and they scour the world for holy orphans, who hold the power of Fire within them. To choose this you must first choose FIRE as your magic power, as only those innately tied to fire can  become immolators. Immolators are not necessarily priests, but are not allowed by the priesthood to wander freely, the Priests of Far Dur have an agenda that only the Fire Master knows. It is possible the player will be a rogue immolator, escaped from the Priests, or a willing servant of the Red Chiteng.",
        weapons: ["Immolator"],
        feats: [
            "FireMagic",
            "Burning_Brand",
            "God_Fire",
            "Resist_Fire",
            "By_Fire_Restored",
            "Fuel",
        ],
        moves: ["On Fire", "Extinguish",],
        languages: [],
        tools: "Chiteng Talismans",
        mana: 1,
    },
    Infantry: {
        name: "Infantry",
        weapons: ["Martial", "Brawling", "LightArmor", "HeavyArmor"],
        description: "Fighting with infantry weapons, especially in a group,  living off the land, pillaging, marching, following orders, preparing trips, logistics, interrogating locals, understanding enemy troop movements, getting the advantage in an attack involving a group using tactics.",
        feats: [
            "Phalanx",
            "Artillery",
            "Tough",
            "Shield_Master",
            "Armor_Master",
        ],
        moves: ["Scout", "Perilous Journeys", "Fear My Blade", "Hard Physical Work"],
        languages: [],
        tools: "Camping"
    },
    Archer: {
        name: "Archer",
        description: "A Soldier. Fighting with ranged weapons, especially in a group,  living off the land, pillaging, marching, following orders, preparing trips, logistics, interrogating locals, understanding enemy troop movements, getting the advantage in an attack involving a group using tactics.",
        weapons: ["Archer", "LightArmor"],
        feats: [
            "Artillery",
            "Tough",
            "Mobile_Archer",
            "Sniper",
        ],
        moves: ["Scout", "Perilous Journeys", "Ambush", "Hard Physical Work"],
        languages: [],
        tools: "Camping"
    },
    Scholar: {
        name: "Scholar",
        description: "Knowledge of literature, different languages, ancient tongues, the true names of demons, how to read hieroglyphics, or Mystic tongues: the level of your Lore determines what you know. The DM may ask players for Lore rather than being the sole provider. Of course you are literate.\n" +
            "You get one extra language per level of lore, including ancient or magical tongues.",
        feats: [
            "Wizard",
            "Demonology_And_Cults",
            "Sorceror_Kings",
            "FireMagic",
            "HealingMagic",
            "ProtectionMagic",
            "Religious_Lore",
            "Trade",
            "Dynasties",
            "Artifacts",
            "Scholars_Guild",
        ],
        languages: [tribal_languages, languages, magic_languages],
        moves: ["Spout Lore", "Hard Mental Work", "Gossip", "Purchase", "Words of Power", "Devices", "Visit a sorcerous library"],
        tools: "Magic Words, Tomes, Magical Devices",
        mana: 1,
    },
    Medecine: {
        name: "Medecine",
        description: "Physicians, and others who can heal injured or sick people, are very important individuals in the cities.. With their great scale of knowledge and the importance of their job, they are held in high esteem in society. Most of the lowest-born citizens cannot afford the services of a physician, and are forced to use the services of charlatans and quacks. Physicians are dispensers of potions and medicines and have practical skills in bone setting, surgery, and child delivery. They are knowledgeable of plant lore, first aid, and diseases and their cures. Many physicians have their own herb gardens, where they grow the exotic plants that are used in their medications.",
        feats: [
            "Master_Surgeon",
            "Good_bedside_manner",
            "Exorcist",
            "HealingMagic",
            "Potion_Maker",],
        mana: 1,
        languages: [],
        moves: ["Spout Lore", "Hard Mental Work", "Gossip", "Purchase", "Heal", "Insight", "Calm"],
        tools: "Herbs, Medical Kit, Alchemical Kit"
    },
    Merchant: {
        name: "Merchant", description: "Merchants know the price of everything, and have often traveled far in their careers and speak many languages. Managing caravans, logistics. They can do accounting and are literate. Arranging complicated deals, finding rare items.\n" +
            "Merchants are not shopkeepers – they are wide traveled adventurers, who seek new and exotic goods to sell from faraway places. As such, merchant characters pick up a range of useful skills like trading, appraisal, obtaining rare or unusual goods, persuasion, city lore, knowledge of distant places, and guild membership. If you want a strange or unusual item, speak to a merchant first\n" +
            "You get one extra non-magic language per level of merchant",
        feats: [],
        languages: [tribal_languages, languages,],
        moves: ["Spout Lore", "Hard Mental Work", "Gossip", "Purchase", "Perilous Journeys", "Bargain", "Insight"],
        tools: "Ledger, Caravan, Wagon, Camping"
    }, Mother: {
        name: "Mother",
        description: "You raised one or more children, and know how to care for children, give birth, suckle, educate and manage children. You cooked, made clothing, cleaned messes, are probably familiar with plant lore and medicine.\n" +
            "FYI: Supporting documents: https://getpocket.com/explore/item/part-of-being-a-domestic-goddess-in-17th-century-europe-was-making-medicines?utm_source=pocket-newtab \n" +
            "Where are your kids now? That might be a story in itself.Maybe some of the  other player characters are your offspring?\n" +
            "Of course caring for adventurers is an easier job than caring for kids.", weapons: [],
        moves: ["Spout Lore", "Hard Mental Work", "Gossip", "Purchase", "Perilous Journeys", "Bargain", "Insight"],
        feats: [
            "Tough",
            "Mama_Lion",
            "Guilt_Trip",
            "Good_bedside_manner"

        ],
        moves: ["Hard Physical Work", "Heal", "Gossip", "Harm", "Seduce/Flirt/Entertain", "Bargain"],
        languages: [],
        tools: "Herbs, Medical Kit"
    },
    Witch: {
        name: "Witch",
        description: "You apprenticed to one of the witches or hags that dot the land. Did you leave on good terms? Are you a good witch or bad witch?\n",
        weapons: ["Assassin"],
        feats: [
            "ChaosMagic",
            "HexesMagic",
            "WinterMagic",
            "StormMagic",
            "NatureMagic",
            "DivinationMagic",
            "HealingMagic",
            "Blood_Sacrifice",
            "Disguise_Master",
            "Tough",
            "Poison_Master",
            "Wicked_Lie",
            "Familiar",
            "SubtleSpell", "Taboo"],
        languages: [],
        moves: ["Bargain", "Heal", "Gossip", "Perilous Journeys", "Hard Mental Work", "Seduce/Flirt/Entertain", "Insight", "Planar Forces", "Take mind altering drugs for visions of a spell"],
        tools: "Herbs, Medical Kit",
        mana: 1
    },
    Druid: {
        name: "Druid",
        description: "You are in the priesthood of the barbarians?\n",
        weapons: ["Assassin"],
        feats: [
            "Home_Field_Advantage",
            "Master_of_Stealth",
            "Commune",
            "HexesMagic",
            "WinterMagic",
            "StormMagic",
            "NatureMagic",
            "DivinationMagic",
            "HealingMagic",
            "Blood_Sacrifice",
            "Tough",
            "Poison_Master",
            "Familiar",
            "Animal_Influence", "Animal_Communication",
            "SubtleSpell", "Taboo"],
        languages: [],
        moves: ["Avoid", "Scout", "Perilous Journeys", "Ambush", "Heal", "Perilous Journeys", "Hard Mental Work", "Seduce/Flirt/Entertain", "Insight", "Planar Forces", "Take mind altering drugs for visions of a spell"],
        tools: "Herbs, Medical Kit",
        mana: 1
    },
    Noble: {
        name: "Noble",
        description: "Often holding homes in the city and estates or villas outside the city, these characters are usually titled (though not necessarily deserving) and have some authority over the common people, peasants, and slaves. Nobles are often able to obtain credit, have high-ranking contacts, and are skilled in such things as bribery, browbeating, dress sense, and etiquette.",
        weapons: ["Noble", "Martial", "LightArmor"],
        feats: [
            "Swift_Rider",
            "Great_Beauty",
            "Duelist",
            "Devoted_Servant",
            "Vicious_Mockery",
        ],
        moves: ["Seduce/Flirt/Entertain", "Gossip", "Perilous Journeys", "Performance", "Purchase"],
        languages: [],
        tools: ""
    },
    Paladin: {
        name: "Paladin",
        weapons: ["Paladin", "Martial", "Brawling", "LightArmor", "HeavyArmor", "Mounted"],
        description: "A classic paladin, who swears an oath (pick one from the lists in the feats) who fights for justice (or maybe injustice). You may want to round your conception with Cavalry and Noble… note weapon skills do not come from your oath",
        feats: [
            "Lay_On_Hands",
            "Smite",
            "Channel_Divinity",
            "Aura",
            "HealingMagic",
            "ProtectionMagic",
        ],
        moves: ["Challenge", "Fear My Blade", "Confront", "Wrestle", "Wrestle (defense)", "Calm Mount", "Heal", "Insight", "Calm"],
        languages: [],
        tools: ""
    },
    Sailor: {
        name: "Sailor",
        description: "Ability to sail and survive in the seas. Navigating, captaining a ship and supplying it, knowledge of strange and distant lands and islands, climbing, acrobatics. Perhaps you were  a pilot, perhaps a sailor, or a pirate, and you probably can swim well.",
        weapons: ["Brawling"],
        feats: [
            "Sail_Monkey",
            "Every_Port",
            "Fisherman",
            "Sea_Captain",
            "Diver",],
        moves: ["Avoid", "Dodge", "Wrestle", "Wrestle (defense)", "Devices"],
        languages: [tribal_languages, languages,],
        tools: "Boating, ropes"
    },
    Pirate: {
        name: "Pirate",
        weapons: ["Martial", "Brawling", "Urban", "Pirate"],
        description: "Ability to sail and survive in the seas. Navigating, captaining a ship and supplying it, knowledge of strange and distant lands and islands, climbing, acrobatics. Perhaps you were  a pilot, perhaps a sailor, or a pirate, and you probably can swim well.",
        feats: ["Sail_Monkey",
            "Artillery",
            "Every_Port",
            "Artillery",
            "Fisherman",
            "Sea_Captain",
            "Diver",],
        languages: [tribal_languages, languages,],
        moves: ["Avoid", "Dodge", "Wrestle", "Wrestle (defense)", "Devices", "Confront"],
        tools: "Boating, ropes"
    },
    Slave: {
        name: "Slave:",
        description: "Slavery is not exactly a career of choice for a heroic adventurer. Nevertheless, it can be useful in rounding out a character concept, and does provide the opportunity to pick up a few skills and techniques that other careers do not give. The career provides skill in things like humility, going unnoticed, listening and sneaking, as well as cooking, cleaning, gardening, sewing, and manual labor. Some slaves (the strong ones or the troublemakers) are sold to gladiatorial arenas.\n" +
            "Note: slavery is not common in Prittania, and reserved as a punishment for crimes there, but is common in other nations.",
        feats: [
            "Tough",
            "Invisible_Man",
            "Master_of_Stealth",
        ],
        moves: ["Avoid", "Hard Physical Work", "Insight"],
        languages: [],
        tools: ""
    },
    Sorceror: {
        name: "Sorceror",
        description: "Sorcery is dark.. Sorcery does not imply literacy if you come from a barbarian place, though but does imply you know the names of spirits and demons, and the use of dreadful potions and words, and you can sense sorcery. Sorcery involves dealing with dark powers.\n" +
            "You get to learn 1 magical language per level (from the list of languages, but only magical ones).\n" +
            "Magicians are both respected and feared. There are few who will deal with them willingly without great need, as a great many magicians are amoral at best, exceedingly evil at worst, and all of them are at least slightly unhinged. Magicians often live alone, with only a few servants or the occasional apprentice to attend them.",
        weapons: ["Sorcerer"],
        feats: [
            "ChaosMagic",
            "HexesMagic",
            "FireMagic",
            "WinterMagic",
            "StormMagic",
            "NatureMagic",
            "DivinationMagic",
            "DarknessMagic",
            "NecromancyMagic",
            "Blood_Sacrifice",
            "SubtleSpell", "Taboo"],
        languages: [magic_languages],
        tools: "Magic Words, Blood, Magical Devices",
        moves: ["Spout Lore", "Words of Power", "Planar Forces", "Visit a sorcerous library", "Take mind altering drugs for visions of a spell"],
        mana: 1,
    },

    Thug: {
        name: "Thug",
        weapons: ["Brawling", "Martial", "Urban", "LightArmor"],
        description: "You have not fought in wars for this career, but you have fought. You have beaten up people, fought in gangs, been a bodyguard. You have contacts in the city, and  know how to get information out of people, whether that means intimidation or knuckles. You know how to commit violence in a city without getting into trouble. You might have been in charge of prisoners or slaves.",
        feats: ["Brawler",
            "Wrestler",
            "Tough", "Bodyguard"],
        moves: ["Knife to the Throat", "Fear My Blade", "Challenge", "Confront", "Wrestle", "Wrestle (defense)"],
        languages: [],
        tools: ""
    },
    Guard: {
        name: "Guard",
        weapons: ["Brawling", "Martial", "Urban", "LightArmor"],
        description: "You have not fought in wars for this career, but you have fought. You have beaten up people, fought gangs, been a bodyguard. You have contacts in the city, and  know how to get information out of people, whether that means intimidation or knuckles. You know how to commit violence in a city without getting into trouble. You might have been in charge of prisoners or slaves.",
        feats: ["Brawler",
            "Wrestler",
            "Tough", "Bodyguard"],
        moves: ["Fear My Blade", "Challenge", "Confront", "Wrestle", "Wrestle (defense)"], languages: [],
        tools: ""
    },
};

//

async function readDir(dir) {
    const files = await fs.readdir(path.normalize(dir), { recursive: true });
    const entries = files.map((filename) => path.normalize(`${dir}/${filename}`));
    return entries;
}

let imgExtension = {};
imgExtension[".webp"] = true;
imgExtension[".jpg"] = true;
imgExtension[".jpeg"] = true;
imgExtension[".gif"] = true;
imgExtension[".png"] = true;
imgExtension[".svg"] = true;

let sourceImages = [];
let sourceBaseNames = [];
let founds = {};
//

function reverseString(str) {
    return str.split("").reverse().join("");
}

function binarySearch(arr, el, compare_fn) {
    let m = 0;
    let n = arr.length - 1;
    let tabs = "";
    while (m <= n) {
        let k = (n + m) >> 1;
        let cmp = compare_fn(el, arr[k]);
        if (cmp > 0) {
            m = k + 1;
        } else if (cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return ~m;
}

async function findSource(inputPath, recur = 0) {


    if (founds[inputPath]) return founds[inputPath];


    let reversed = reverseString(inputPath);

    if (sourceImages.length == 0) {

        let files = []; //await readDir("C:/Users/gcolg/AppData/Local/FoundryVTT/Data");

        sourceImages = files;
        files = []; //await readDir("C:/Program Files/FoundryVTT/Foundry Virtual Tabletop/resources/app/public");
        sourceImages = sourceImages.concat(files);


        sourceImages = sourceImages.filter(file => {
            return imgExtension[path.extname(file).toLowerCase()] === true;
        });

        for (let i = 0; i < sourceImages.length; i++) {

            sourceImages[i] = reverseString(sourceImages[i]);
        }

        sourceImages = sourceImages.sort(function (a, b) {
            return a.localeCompare(b);
        });

        for (let i = 0; i < sourceImages.length; i++) {

            sourceBaseNames.push(prepareStringSimilarity(path.basename(reverseString(sourceImages[i]))));
        }
    }

    let best = 0; let answer = -1;
    let i = binarySearch(sourceImages, reversed, function (a, b) {
        let c = b.substring(0, a.length);
        return a.localeCompare(c);
    })

    if (i >= 0) {
        return reverseString(sourceImages[i]);
    }
    console.log("No exact match " + inputPath);

    let baseName = path.basename(inputPath)
    let baseBg = prepareStringSimilarity(baseName);
    for (let i = 0; i < sourceBaseNames.length; i++) {
        let res = optimizedStringSimularity(sourceBaseNames[i], baseBg);
        if (res > best) {
            best = res;
            answer = i;
            if (best >= 0.9999999999999999) break;
        }
    }

    if (answer >= 0) {
        let resultPath = reverseString(sourceImages[answer]);

        founds[inputPath] = resultPath;
        console.log("  match " + resultPath);
        return resultPath;
    }
    founds[inputPath] = "";
    return "";
}


// async function processImageForTraining(imagePath, tagsSource) {

//     if (imagePath.startsWith("http")) {

//         destFile = path.pasename(imagePath);
//         destFile = path.normalize(path.join(__dirname, 'public', 'trainingData', destFile));
//         if (!rawfs.existsSync(destFile)) {

//             try {
//                 let response = await fetch(imagePath);
//                 //  console.log(imagePath);
//                 const arrayBuffer = await response.arrayBuffer();
//                 const buffer = Buffer.from(arrayBuffer);
//                 //  console.log(fileType);


//                 await EnsureDestinationExists(destFile);
//                 console.log("Would copy " + imagePath + " to " + destFile);

//                 await rawfs.createWriteStream(destFile).write(buffer);
//                 console.log("Did copy " + imagePath + " to " + destFile);
//                 return destFile;

//             }

//             catch (error) {
//                 console.log(error, "Cannot fetch " + imagePath);
//                 return "";
//             }
//         } else {
//             return destFile;
//         }
//     } else {

//         let a = path.basename(imagePath);
//         sourceFile = await findSource(a, 0);
//         if (!(nameOk(sourceFile))) {
//             console.error("Cannot find " + a);
//             return "";
//         }
//         a = cleanPath(a);
//         let destFile = path.normalize(path.join(__dirname, 'public', 'trainingData', a));
//         if (typeof destFile != "string") throw ("WTF1");
//         if (!rawfs.existsSync(destFile)) {

//             await EnsureDestinationExists(destFile);

//             try {
//                 console.log("Would copy " + sourceFile + " to " + destFile);
//                 await fs.copyFile(sourceFile, destFile);
//                 console.log("did copy " + sourceFile + " to " + destFile);
//             } catch (error) { console.log("Error Could not copy ", '"' + sourceFile + '"', " to ", '"' + destFile + '"'); }
//             return destFile;

//         } else {
//             return destFile;

//         }

//     }

// }

async function processImage(imagePath, tagsSource) {


    if (imagePath.startsWith("http")) {
        let startTime = performance.now();
        const fileType = path.extname(imagePath);
        if (!tagsSource) tagsSource = {};
        if (!tagsSource?.hash) {
            tagsSource.hash = path.normalize(imagePath.substring(6));
        }
        let destFile = tagsSource?.hash;
        destFile = cleanFileName(destFile);
        destFile = path.normalize(path.join(__dirname, 'public', 'images', 'fetched', destFile + fileType));
        let relativeName = path.normalize(path.join('images', 'fetched', tagsSource.hash + fileType));
        if (!rawfs.existsSync(destFile)) {

            try {
                let response = await fetch(imagePath);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);


                await EnsureDestinationExists(destFile);

                await rawfs.createWriteStream(destFile).write(buffer);
                return FixSlashes(relativeName);

            }

            catch (error) {
                console.log(error, "Cannot fetch " + imagePath);
                return "";
            }
        } else {
            let endTime = performance.now();
            return FixSlashes(relativeName);
        }
    } else {

        let a = path.normalize(imagePath);
        let sourceFile = await findSource(a, 0);
        if (!(nameOk(sourceFile))) {
            console.error("Cannot find " + a);
            return "";
        }
        let startTime = performance.now();
        a = cleanPath(a);
        let relativeName = path.normalize(path.join('images', a));
        let destFile = path.normalize(path.join(__dirname, 'public', 'images', a));
        if (typeof destFile != "string") throw ("WTF1");
        if (!rawfs.existsSync(destFile)) {

            await EnsureDestinationExists(destFile);

            try {
                await fs.copyFile(sourceFile, destFile);
            } catch (error) { console.log("Error Could not copy ", '"' + sourceFile + '"', " to ", '"' + destFile + '"'); }
            let a = FixSlashes(relativeName);


            return a;

        } else {
            let a = FixSlashes(relativeName);
            ;
            return a;
        }

    }

}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function FixSlashes(a) {
    a = a.replaceAll("\\", "/"); // replaces \ with /
    a = a.replaceAll("//", "/"); // replaces // with /
    return a;
}

function convert_weapons(input) {

    if (input.type != "weapon") return input;

    let output = {};
    output.name = input.name;
    output.type = input.type;
    output = {};
    output.description = input.description;
    output.range = {};
    output.range = input.range;
    output.types = [];


    if (input?.range?.long && input.range.long > 0)
        output.types.push("Ranged");

    // else if (output.range.long > 0 && output.comsume.type == "") {
    //     // output.types.push("Thrown");
    //     output.types.push("Melee");
    // }
    else
        output.types.push("Melee");

    if (input?.properties?.fin) output.types.push("Finesse");
    if (input?.properties?.lgt) output.types.push("Light");
    if (input?.properties?.thr) {
        output.types.push("Thrown");
        output.types.push("Melee");
    }
    if (input?.properties?.mgc) output.types.push("Magic");

    output.damage = input.damage;
    output.range = input.range;
    output.attackBonus = input.attackBonus;


    return output;
}
function clearField(json, field) {

    if (json[field] !== undefined)
        delete json[field];
    return json;
}
function CleanIt(json) {

    if (json.system) {
        let swap = json.system;
        delete json.system;
        json = { ...json, ...swap };
    }
    json = clearField(json, "prototypeToken");
    json = clearField(json, "effects");
    json = clearField(json, "_stats");
    json = clearField(json, "folder");
    json = clearField(json, "sort");
    json = clearField(json, "ownership");
    json = clearField(json, "_id");
    json = clearField(json, "flags");
    if (json?.attributes?.hp) {

        json.attributes.hp.value = json.attributes.hp.value / 2;
        json.attributes.hp.max = json.attributes.hp.max / 2;
        delete json.attributes.hp.formula;

    }
    if (!isNaN(json?.attributes?.prof))
        json.steel = json?.attributes.prof - 1;
    if (json?.attributes?.attunement)
        delete json.attributes.attunement;
    return json;
}
async function convertDnD5e() {

    await fsExtra.emptyDir(path.join(__dirname, 'public', 'Compendium'));
    await fsExtra.emptyDir(path.join(__dirname, 'public', 'CompendiumFiles'));
    let dir = await fs.readdir(path.join(__dirname, 'public', 'toConvert')); //
    let counts = {};


    for (let i = 0; i < dir.length; i++) {

        let fname = path.join(__dirname, 'public', 'toConvert', dir[i]);

        let text = (await fs.readFile(fname)).toString();
        let level = 0;
        let inQuotes = false;
        let subfiles = [];
        let oneEntry = "";
        let quoted = "";
        let badNews = false;
        let test = false;
        for (let i = 0; i < text.length; i++) {
            oneEntry += text[i];
            if (!inQuotes) {
                switch (text[i]) {
                    case '"': inQuotes = true; break;
                    case '{': level++; //console.log("up:" + level);

                        break;
                    case '}': level--;

                        if (level < 0) {
                            console.log("Error in conversion");
                            console.log(oneEntry);
                            exit(-1);
                        }
                        if (level === 0) {

                            subfiles.push(oneEntry);
                            oneEntry = "";
                        } break;
                    default: break;
                }
            }
            else {
                //  if (text[i] === '@') { badNews = true; }

                if (!badNews) {
                    if (text[i] === '"' && text[i - 1] !== '/') { inQuotes = false; }
                } else {
                    if (text[i] == '{') badNews = false;
                    else {
                        oneEntry = oneEntry.slice(0, -1);
                    }
                }
            }
        }

        console.log("Num SubFiles " + subfiles.length);

        let artGeneratorFile = [];
        let last = 0;
        let audit = false;
        for (let fileIndex = 0; fileIndex < subfiles.length; fileIndex++) {
            if (fileIndex > last + 50) { console.log(fileIndex + " of " + subfiles.length); last = fileIndex; audit = true; }
            {//   try {
                let json = JSON.parse(subfiles[fileIndex]);
                if (!json.flags) { console.log("PRESKipping " + json.name); continue; }


                let tagsSource = json.flags.plutonium;


                if (tagsSource) {

                    if (json.type == "feat") { continue; };
                    if (tagsSource.page.startsWith("subclassFeature")) { continue; }
                    if (tagsSource.page.startsWith("classes")) { continue; };
                    if (tagsSource.page.startsWith("races")) { continue; };
                    if (tagsSource.page.startsWith("spell")) { continue; };
                    if (tagsSource.page.startsWith("classFeature")) { continue; };
                    if (tagsSource.page.startsWith("optionalFeatures")) { continue; };
                    if (tagsSource.page.startsWith("item")) { continue; };

                    if (!tagsSource.hash)
                        tagsSource.hash = uuidv4();


                    tagsSource.hash = cleanFileName(tagsSource.hash);
                    if (json.img != undefined) {
                        // todo: avoid token images
                        json.img = await processImage(json.img, tagsSource);
                    }

                    if (json?.prototypeToken) {


                        let t = json.prototypeToken;


                        let token = {};
                        if (t.texture.src != undefined) {
                            t.texture.src = await processImage(t.texture.src);
                            // todo auto make tokens from main image
                        }
                    }

                    let tokenImage = json?.prototypeToken?.texture?.src;

                    json.appearance = [];

                    json.appearance.push({

                        "name": "normal",
                        "portrait": {
                            "image": json.img,
                        },
                        "token": {
                            "image": tokenImage ? tokenImage : json.img,
                        },
                        "slots": {}
                    });

                    json.current_appearance = "normal";


                    json = CleanIt(json);


                    tagsSource.hash = cleanFileName(tagsSource.hash);

                    tagsSource.page = path.parse(tagsSource.page).name;

                    tagsSource.page = ComputePage(json, tagsSource.page);

                    tagsSource.image = json.img;
                    tagsSource.prototypeToken = json.protoTypeToken;
                    json.protoTypeToken = undefined;
                    let name = json.name;
                    if (json.requirements) {
                        name += " : " + json.requirements;
                    } else {
                        name += " (" + tagsSource.page + ")";
                    }
                    /// change to split items off, change to have sheets load items, so that items are not embedded

                    if (json.items) {
                        for (let i = 0; i < json.items.length; i++) {
                            let item = json.items[i];
                            let subFile = tagsSource.hash + '_MITEM_' + (item.name);
                            subFile = cleanFileName(subFile);
                            if (item.img != undefined)
                                item.img = processImage(item.img);

                            let tags = {
                                file: "CompendiumFiles/" + subFile,
                                page: "itemSummary",
                                source: item.source,
                                droppable: item.propDroppable,
                                type: item.type,
                                name: item.name,
                                img: item.img,
                            };

                            item = CleanIt(item);
                            item = convert_weapons(item);

                            writeJsonFileInPublic('Compendium', "tag_" + subFile, tags);
                            writeJsonFileInPublic('CompendiumFiles', subFile, item);

                            json.items[i] = tags;

                        }
                    }

                    let tags = {
                        file: "CompendiumFiles/" + tagsSource.hash,
                        page: tagsSource.page,
                        source: tagsSource.source,
                        //droppable: tagsSource.propDroppable,
                        type: json.type,
                        name: json.name,
                        img: json.img,
                        prototypeToken: tagsSource.prototypeToken
                    };

                    CleanIt(json);
                    json = convert_weapons(json);
                    if (!json.name) json.name = tags.name;

                    if (counts[tagsSource.page] == undefined)
                        counts[tagsSource.page] = 0;
                    counts[tagsSource.page]++;

                    writeJsonFileInPublic('Compendium', "tag_" + tagsSource.hash, tags);
                    writeJsonFileInPublic('CompendiumFiles', tagsSource.hash, json);
                    artGeneratorFile.push({ id: tagsSource.hash, name: json.name, type: tagsSource.type });

                };

            }
            //    catch (err) {
            //       console.error("error parsing json ( " + err + "+)");
            //   }
        }
        // let keys = Object.keys(counts);
        // for (let i = 0; i < keys.length; i++) {
        //     console.log(keys[i], counts[keys[i]]);
        //     // let outfile3 = path.join(pathy.join(__dirname, 'public', "artgenerator.json"));
        //     //  fs.writeFile(outfile3, JSON.stringify(artGeneratorFile));
        // }

    }
}


// async function makeTrainingData() {

//     await fsExtra.emptyDir(path.join(__dirname, 'public', 'TrainingData'));
//     await fsExtra.emptyDir(path.join(__dirname, 'public', 'TrainingData'));
//     let dir = await fs.readdir(path.join(__dirname, 'public', 'toConvert3')); //
//     let counts = {};
//     console.log("Make training data " + dir.length);;

//     for (let i = 0; i < dir.length; i++) {

//         let fname = path.join(__dirname, 'public', 'toConvert3', dir[i]);

//         console.log("CHecking " + fname);;

//         let text = (await fs.readFile(fname)).toString();
//         let level = 0;
//         let inQuotes = false;
//         let subfiles = [];
//         let oneEntry = "";
//         badNews = false;
//         for (let i = 0; i < text.length; i++) {
//             oneEntry += text[i];
//             if (!inQuotes) {
//                 switch (text[i]) {
//                     case '"': inQuotes = true; break;
//                     case '{': level++; //console.log("up:" + level);
//                         // console.log(oneEntry);
//                         break;
//                     case '}': level--;
//                         // console.log("down:" + level); console.log(oneEntry);
//                         if (level < 0) {
//                             console.log("Error in conversion");
//                             console.log(oneEntry);
//                             exit(-1);
//                         }
//                         if (level === 0) {
//                             //    console.log("Writing size " + oneEntry.length);
//                             subfiles.push(oneEntry);
//                             oneEntry = "";
//                         } break;
//                     default: break;
//                 }
//             }
//             else {
//                 //  if (text[i] === '@') { badNews = true; }

//                 if (!badNews) {
//                     if (text[i] === '"' && text[i - 1] !== '/') { inQuotes = false; }
//                 } else {
//                     if (text[i] == '{') badNews = false;
//                     else {
//                         oneEntry = oneEntry.slice(0, -1);
//                     }
//                 }
//             }
//         }

//         console.log("Num SubFiles " + subfiles.length);

//         let last = 0;
//         let audit = false;
//         for (let fileIndex = 0; fileIndex < subfiles.length; fileIndex++) {


//             if (fileIndex > last + 50) { console.log(fileIndex + " of " + subfiles.length); last = fileIndex; audit = true; }
//             {//   try {
//                 json = JSON.parse(subfiles[fileIndex]);
//                 if (!json.flags) { console.log("PRESKipping " + json.name); continue; }


//                 let tagsSource = json.flags.plutonium;
//                 if (json.name == "Mace") {
//                     console.log(json);
//                 }




//                 if (json.img) {
//                     console.log("json.img " + json.img);
//                     // todo: avoid token images
//                     //    console.log("json %o ", json);
//                     let destFile = await processImageForTraining(json.img, tagsSource);
//                     console.log("json.img " + destFile);


//                     let text = path.basename(destFile);

//                     text = text.replace(/\.[^/.]+$/, "")




//                     let pathName = destFile;
//                     pathName = pathName.replace(/\.[^/.]+$/, ".txt")
//                     console.log("pathName " + pathName);
//                     writeText(pathName, text);

//                 }

//                 // if (json?.prototypeToken) {


//                 //     let t = json.prototypeToken;

//                 //     let text = json.base?.name + " " + json.base._typeHtml
//                 //         + json.base?._subTypeHtml + " token " + json?.description
//                 //         + (json.base?.weapon ? "weapon" : "");

//                 //     json.prototypeToken = await processImageForTraining(t.texture.src);

//                 //     let pathName = json.prototypeToken;
//                 //     pathName = pathName.replace(/\.[^/.]+$/, ".txt")
//                 //     writeText(pathName, text);


//                 //     // todo auto make tokens from main image
//                 // }



//             };

//         }
//         //    catch (err) {
//         //       console.error("error parsing json ( " + err + "+)");
//         //   }
//     }


// }



function convertPTBA() {

    Object.keys(feats).forEach(function (key, index) {
        let feat = feats[key];
        let tags = {
            "file": "CompendiumFiles/" + key,
            "page": "feats",
            "source": "Gil",
            "type": "feat",
            "name": feat.name,
            "img": "images/careers/" + key + ".avif" /// need this
        };

        let item = {
            name: feat.name,

            description: {
                value: "<div class=\"rd__b  rd__b--3\"> " +
                    feat.description + "</div>",
            },
            source: "GilPTBA",

            type: "feat",
            "img": "images/careers/" + key + ".avif" /// need this


        };
        console.log(key);

        writeJsonFileInPublic('Compendium', "tag_" + key, tags);
        writeJsonFileInPublic('CompendiumFiles', key, item);

    });


    Object.keys(injuries).forEach(function (key, index) {
        let injury = injuries[key];
        let tags = {
            "file": "CompendiumFiles/" + key,
            "page": "injuries",
            "source": "Gil",
            "type": "feat",
            "name": injury.name,
            "img": "images/injuries/" + key + ".jpg" /// need this
        };

        let item = injury;

        injury.img = "images/injuries/" + key + ".jpg" /// need this


        console.log(key);

        writeJsonFileInPublic('Compendium', "tag_" + key, tags);
        writeJsonFileInPublic('CompendiumFiles', key, item);

    });

    Object.keys(conditions).forEach(function (key, index) {
        let condition = conditions[key];
        let tags = {
            "file": "CompendiumFiles/" + key,
            "page": "conditions",
            "source": "Gil",
            "type": "feat",
            "name": condition.name,
            "img": "images/conditions/" + key + ".jpg" /// need this
        }; conditions

        let item = condition;

        condition.img = "images/conditions/" + key + ".jpg"; /// need this


        console.log(key);

        writeJsonFileInPublic('Compendium', "tag_" + key, tags);
        writeJsonFileInPublic('CompendiumFiles', key, item);

    });

    Object.keys(careers).forEach(function (key, index) {



        let career = careers[key];
        console.log(career);
        let tags = {
            "file": "CompendiumFiles/" + key,
            "page": "careers",
            "source": "Gil",
            "type": "careers",
            "name": career.name,
            "img": "images/careers/" + career + ".jpg" /// need this
        };

        career.owner_level = 0;
        career.owner_careerPointsSpent = 0;
        career.owner_featsChosen = {};

        let item = {
            name: career.name,
            type: "career",
            "img": "images/careers/" + key + ".avif" /// need this
        };

        career.description = {
            value: " <div class=\"rd__b  rd__b--3\"><p>" +
                career.description + "</p></div>",
        };
        item = career;

        console.log("Writing career");

        writeJsonFileInPublic('Compendium', "tag_" + key, tags);


        writeJsonFileInPublic('CompendiumFiles', key, item);
    });

    Object.keys(backgrounds).forEach(function (key, index) {



        let background = backgrounds[key];
        console.error("bp");
        console.error(key);
        console.error(background);
        let tags = {
            "file": "CompendiumFiles/" + key,
            "page": "background",
            "source": "Gil",
            "type": "backgrounds",
            "name": background.name,
            "img": "images/backgrounds/" + background + ".jpg" /// need this
        };
        background.owner = {}
        background.owner_level = 1;
        background.owner_careerPointsSpent = 1;
        background.owner_featsChosen = {};
        for (let i = 0; i < background.feats.length; i++) {
            let f = background.feats[i];
            background.owner_featsChosen[f] = true;
        }

        let item = {
            name: background.name,
            type: "career",
            "img": "images/backgrounds/" + key + ".avif" /// need this
        };

        background.description = {
            value: " <div class=\"rd__b  rd__b--3\"><p>" +
                background.description + "</p></div>",
        };
        item = background;

        console.log("Writing career");

        writeJsonFileInPublic('Compendium', "tag_" + key, tags);


        writeJsonFileInPublic('CompendiumFiles', key, item);
    });


    for (let item = 0; item < items.length; item++) {

        let key = items[item].name.split(' ').join('_');
        console.log(items[item].name);
        let tags = {
            "file": "CompendiumFiles/" + key,
            "page": "weapon",
            "source": "Gil",
            "type": "weapon",
            "name": items[item].name,
            "img": items[item].image, /// need this
            "price": items[item].price, /// need this
        };
        writeJsonFileInPublic('Compendium', "tag_" + key, tags);


        writeJsonFileInPublic('CompendiumFiles', key, items[item]);
    }
}
// note, run convertDnD5e and do not translate feats
//makeTrainingData();

convertPTBA();
//convertDnD5e();
// console.log("Converted D&D5e");pe
