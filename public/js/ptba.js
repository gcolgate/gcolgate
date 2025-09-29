import { slotList } from './drag.js';
import { sendChat } from './chat.js';
import {
    RedrawWindow, ensureThingLoaded, GetRegisteredThing, signed, span, div, Editable, parseSheet, parseSheetWithContext,
    MakeAvailableToParser, MakeAvailableToHtml, chkDiv
} from './characters.js'
import { socket } from './client_main.js';
import { MakeDropDownWidget } from './directoryWindow.js';
import { getChat } from './chat.js';

const kAction = "1. Action (1 per turn)";
const kReaction = "2. Reaction (1 type per turn)";
const kMaybeAction = "3. Maybe Action (If lucky, won't count as action)";
const kTriggerdReaction = "4. Triggered Reaction (with the trigger, free action)";
const kScene = "5. Scene";
const kDowntime = "6. Downtime (Weeks)";
const kStat = "7. Stat"


// function WriteMovesFOrFountry() {


//     for (const moveName in moves) {
//         if (moves.hasOwnProperty(moveName)) {
//             let move = moves[moveName];
//             let json =
//             {
//                 folder: "tpwn2RrtXZyM1eB3",
//                 name: moveName,
//                 type: "move",
//                 img: "icons/svg/aura.svg",
//                 system: {
//                     description: move.Comments,
//                     moveType: "basic",
//                     rollFormula: "",
//                     moveResults: {
//                         failure: {
//                             key: "system.moveResults.failure.value",
//                             label: "Complications...",
//                             value: move.fail
//                         },
//                         partial: {
//                             key: "system.moveResults.partial.value",
//                             label: "Partial success",
//                             value: move.mixed
//                         },
//                         success: {
//                             key: "system.moveResults.success.value",
//                             label: "Success!",
//                             value: move.success
//                         },
//                         critical: {
//                             key: "system.moveResults.critical.value",
//                             label: "Critical Success!",
//                             value: move.Critical,
//                         }
//                     },
//                     uses: 0,
//                     rollType: move.stat[0],
//                     rollMod: 0,
//                     actorType: "character",
//                     choices: ""
//                 },
//                 effects: [],
//                 flags: {},
//                 _stats: {
//                     coreVersion: "13.346",
//                     systemId: "pbta",
//                     systemVersion: "1.1.21",
//                     createdTime: 1755307139650,
//                     modifiedTime: 1755307366332,
//                     lastModifiedBy: "9dvwwv9FxL0Qoluj",
//                     exportSource: {
//                         worldId: "dw2",
//                         uuid: "Item.gFVEeO9BE7K56lzb",
//                         coreVersion: "13.346",
//                         systemId: "pbta",
//                         systemVersion: "1.1.21"
//                     }
//                 }
//             };
//             // write out the json to a file
//             const fileName = `move_${sanitize(moveName)}.json`;
//             const filePath = path.join(outputDir, fileName);
//             fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');


//         }

//     }
// }

const moves = {

    "Stat Check": {
        "stat": [
            "allure",
            "avoidance",
            "bravery",
            "caring",
            "cunning",
            "health",
            "intelligence",
            "strength",
            "will",
        ],
        "action": kStat,
        "tooltip": "Basic Stat Check",
        "Comments": "Basic Stat Check",

        "Critical": "You overkill. If this is a save, you avoid ill effect and possibly get some advantage ",
        "success": "You meet the challenge. If this is a save, avoid ill effct",
        "mixed": "You win with a cost or else you lose. If this is a save, take half damage.",
        "fail": "You lose"
    },
    "Confront": {
        "stat": [
            "bravery"
        ],
        "action": kScene,
        "tooltip": "Confront: Bravely confront someone to his face",
        "Comments": "Confront: Bravely confront someone to his face, such as an in argument, or a challenge, whether it is with a king, a troll, or your mother in law.",

        "Critical": "You get your way, and things go your way ",
        "success": "You get your way",
        "mixed": "Inconclusive, or get your way but take some pain",
        "fail": "You definitely lose the confrontation, taking pain"
    },

    // "Visit a sorcerous library": {
    //     "stat": [
    //         "intelligence"
    //     ],
    //     "action": kDowntime,
    //     "tooltip": "If one is in this town, one can visit the sorcerous library. ",
    //     "Comments": "If one is in this town, one can visit the sorcerous library. The best libraries have a difficulty of zero. ",
    //     "Critical": "You find the spell of your choice from those avbailable at the library, and another another ",
    //     "success": "You find the spell of the GM's choice from the list of those available at the library",
    //     "mixed": 'you find a spell, but  <a href="#">choose 1 \
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; IWt is a lessor version, that has a side effect whenever you cast it</li>\
    //                 <li> &#x25BA; It is far away from the library and you will need to convince the party to help you find it</li>\
    //                 <li> &#x25BA; An imp will trade you for it for a favor</li>\
    //                 <li> &#x25BA; You have to steal the book from the library (roll steal)</li>\
    //                 <li> &#x25BA; The book is locked and the you have to unlock it (roll devices)</li>\
    //                 <li> &#x25BA; The librarian says this spell is behind lock and key, convince him to see</li>\
    //                 <li> &#x25BA; The book is in a strange, unknown tounge</li>\
    //             </div >\
    //         </div ></a >',
    //     "fail": "Nothing good here. Perhaps you are kicked out of the library, perhaps you are banned from the library."
    // },
    // "Take mind altering drugs for visions of a spell": {
    //     "stat": [
    //         "will"
    //     ],
    //     "action": kDowntime,
    //     "tooltip": "A dangerous way to learn magic",
    //     "Comments": "A dangerous way to learn magic ",
    //     "Critical": "You find the spell of your choice, perhaps you learn another ",
    //     "success": "You find the spell of the GM's choice",
    //     "mixed": 'you find a spell, but  <a href="#">choose 1 \
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; You immediately cast it uncontrolled and get a bad result on the t</li>\
    //                 <li> &#x25BA; You have to bargain with an astral gatekeepert</li>\
    //                 <li> &#x25BA; An imp will trade you for it for a favor</li>\
    //                 <li> &#x25BA; You have to avoid the evil inhabitants of the dreamland on a perilous journey</li>\
    //                 <li> &#x25BA; You get a level of chaos taint</li>\
    //                 <li> &#x25BA; The librarian says this spell is behind lock and key, convince him to see</li>\
    //             </div >\
    //         </div ></a >',
    //     "fail": "Nothing good here."
    // },

    // "Apprentice under a master": {
    //     "stat": [
    //         "cunning",
    //         "will",
    //         "intelligence"
    //     ],
    //     "action": kDowntime,
    //     "tooltip": "A way to raise your skill",
    //     "Comments": "A way to raise your skill, depending on the skill use a different stat. Your master has to have a higher skill than you",
    //     "Critical": "You raise your skill by 1 and can choose a feat, and impress your master greatly.",
    //     "success": "Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1 and choose a feat",
    //     "mixed": 'Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, choose a feat, and choose\
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
    //                 <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
    //                 <li> &#x25BA; You relationship with the master is suffering, maybe you must quit</li>\
    //                 <li> &#x25BA; You do not get to check the skill you wasted time </li>\
    //                 <li> &#x25BA; You must pay something, like supplies or initiation fees </li> \
    //                  </ul>\
    //             </div >\
    //         </div ></a >',
    //     "fail": 'choose\
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
    //                 <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
    //                 <li> &#x25BA; You relationship with the master is suffering, maybe you are terminated</li>\
    //                  <li> &#x25BA; You must pay something, like supplies or initiation fees to continue </li> \
    //                 </ul>\
    //             </div >\
    //              </div ></a >',
    // },

    // "Work at a job": {
    //     "stat": [
    //         "strength",
    //         "cunning",
    //         "will",
    //         "intelligence"
    //     ],
    //     "action": kDowntime,
    //     "tooltip": "A way to raise your skill and earn a living",
    //     "Comments": "A way to raise your skill, depending on the skill use a different stat ",
    //     "Critical": "You raise your skill by 1 and can choose a feat, an earn double the normal amount you should get for this skill ",
    //     "success": "Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill",
    //     "mixed": 'Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill and choose\
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; Financial Hardship: You do not earn money and have to dip into savings </li>\
    //                  <ul><li> &#x25BA; Your employer is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
    //                 <li> &#x25BA; Your employer (if any) has a quest for you, refuse and end the job </li>\
    //                 <li> &#x25BA; You relationship with the employer is suffering, maybe you must quit</li>\
    //                 <li> &#x25BA; You do not get to check the skill you wasted time </li>\
    //                 <li> &#x25BA; If your job is dangerous, you might have to save versus injury </li> \
    //                  </ul>\
    //             </div >\
    //         </div ></a >',
    //     "fail": 'choose\
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
    //                 <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
    //                 <li> &#x25BA; You relationship with the master is suffering, maybe you are terminated</li>\
    //                  <li> &#x25BA; You must pay something, like supplies or initiation fees to continue </li> \
    //                 </ul>\
    //             </div >\
    //              </div ></a >',
    // },

    // "Run a business": {
    //     "stat": [
    //         "cunning",
    //         "will",
    //         "intelligence"
    //     ],
    //     "action": kDowntime,
    //     "tooltip": "A way to raise your skill and earn a living",
    //     "Comments": "A way to raise your skill, depending on the skill use a different stat ",
    //     "Critical": "You raise your skill by 1 and can choose a feat, an earn double the normal amount you should get for this business ",
    //     "success": "Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill",
    //     "mixed": 'Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill and choose\
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; Financial Hardship: You do not earn money and have to dip into savings </li>\
    //                  <ul><li> &#x25BA; Your business in trouble with a GM plot relevant problemd </li>\
    //                   <li> &#x25BA; You relationship with the employer is suffering, maybe you must quit</li>\
    //                 <li> &#x25BA; You do not get to check the skill you wasted time </li>\
    //                 <li> &#x25BA; If your job is dangerous, you might have to save versus injury </li> \
    //                  </ul>\
    //             </div >\
    //         </div ></a >',
    //     "fail": 'choose\
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
    //                 <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
    //                 <li> &#x25BA; You relationship with the master is suffering, maybe you are terminated</li>\
    //                  <li> &#x25BA; You must pay something, like supplies or initiation fees to continue </li> \
    //                 </ul>\
    //             </div >\
    //              </div ></a >',
    // },


    // "Meditate or pray for a spell": {
    //     "stat": [
    //         "will"
    //     ],
    //     "action": kDowntime,
    //     "tooltip": "A dangerous way to learn magic",
    //     "Comments": "A dangerous way to learn magic ",
    //     "Critical": "You find the spell of your choice, perhaps you learn another ",
    //     "success": "You find the spell of the GM's choice",
    //     "mixed": 'you find a spell, but  <a href="#">choose 1 \
    //                 <div class="tooltipcontainer">\
    //                 <div class="tooltip">\
    //                  <ul><li> &#x25BA; You immediately cast it uncontrolled and get a bad result on the t</li>\
    //                 <li> &#x25BA; You have to bargain with an astral gatekeepert</li>\
    //                 <li> &#x25BA; An imp will trade you for it for a favor</li>\
    //                 <li> &#x25BA; You have to avoid the evil inhabitants of the dreamland on a perilous journey</li>\
    //                 <li> &#x25BA; You get a level of chaos taint</li>\
    //                 <li> &#x25BA; The librarian says this spell is behind lock and key, convince him to see</li>\
    //             </div >\
    //         </div ></a >',
    //     "fail": "Nothing good here."
    // },
    "Control Mount": {
        "stat": [
            "bravery", "caring"
        ],
        "action": kMaybeAction,
        "tooltip": "Control your horse. ",
        "Comments": "When you try to control your horse when it is panicked or you want it to do something crazy",
        "Critical": "You control your mount, it is a free action",
        "success": "You control your mount",
        "mixed": "Your mount acts panicked or with another emotion, doing something you don't want it to, but you stay on, it takes your action",
        "fail": "Your mount acts panicked or with another emotion, and you fall off of it, this takes your action"
    },
    "Feint": {
        "stat": [
            "cunning"
        ],
        "action": kMaybeAction,
        "tooltip": "In melee, maneuver, can be done before an attack to attack with cunning even without flanking or surprise",
        "Comments": "In melee, can be done before an attack to attack with cunning even without flanking or surprise. Advantage when switching to a new weapon, or narrating something surprising",
        "Critical": "You get advantage on your attacks",
        "success": "You can attack using your Cunning stat against your opponents",
        "mixed": "You can attack using cunning against one opponent",
        "fail": "Sorry! You lose your Actuib"
    },
    "Extinguish Fire": {
        "stat": [
            "caring"
        ],
        "action": kMaybeAction,
        "tooltip": "Extinguish Fire:  When your friend is on fire",
        "Comments": " \
         &#x25BA;  When your friend is on fire \
         &#x25BA;  Note, doing things like jumping in a lake \
         &#x25BA;  will not require a roll. ",
        "Critical": "The fire is out, and it takes you no time",
        "success": 'You get the fire out, but <a href="#">choose 1\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; It takes your action to do so</li>\
                    <li> &#x25BA; They take damage from the fire</li>\
                </div >\
            </div ></a >',
        "mixed": '<a href="#"> Choose One \
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You dont waste your action</li>\
                    <li> &#x25BA; They don\'t take damage from the fire</li>\
                    <li> &#x25BA; You get the fire out</li>\
                </div>\
            </div ></a>',
        "fail": "You waste your action and they take damage from the fire",
        "fumble": "You catch yourself on fire too."
    },
    "On Fire": {
        "stat": [
            "avoidance", "caring"
        ],
        "action": kMaybeAction,
        "tooltip": "Extinguish Fire:   When you are on fire",
        "Comments": "<ul>\
        <li> &#x25BA;  When you are on fire </li>\
        <li> &#x25BA;  Note, doing things like jumping in a lake </li>\
        <li> &#x25BA;  will not require a roll. </li></li></ul>",
        "Critical": "The fire is out, and it takes you no time",
        "success": 'You get the fire out, but <a href="#">choose 1\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You it takes your action</li>\
                    <li> &#x25BA; You don\'t take damage from the fire</li>\
                </div >\
            </div ></a >',
        "mixed": 'Choose One <a href="#"> \
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You don\'t waste your action</li>\
                    <li> &#x25BA; You don\'t take damage from the fire</li>\
                    <li> &#x25BA; You get the fire out</li>\
                </div>\
            </div ></a>',
        "fail": "You waste your turn, and take damage from the fire",
        "fumble": "You spread the fire to a nearby object."
    },
    "Challenge": {
        "stat": [
            "bravery", "strength"
        ],
        "action": kMaybeAction,
        "tooltip": "When you challenge or trash talk your opponent. This may be difficult in some cirumstances. It usually cannot be repeated against the same enemies",
        "Comments": "When you challenge or trash talk your opponent or question their authority",
        "Critical": "Foes are panicked, you can take another, different, action ",
        "success": "Foes are cowed and you take another, different, action",
        "mixed": "Foes are cowed but afterwards treat you as the main threat",
        "fail": "None or reverse effect, perhaps they are frenzied"
    },
    "Grisly Display": {
        "stat": [
            "bravery"
        ],
        "action": kMaybeAction,
        "tooltip": "Raise the severed head of an enemy, raising the grim trophy high, or some other fearful action",
        "Comments": "Raise the severed head of an enemy, raising the grim trophy high, or some other fearful action",
        "Critical": "Foes are panicked, you can take another, different, action ",
        "success": "Foes are cowed and you take another, different, action",
        "mixed": "Foes are cowed but afterwards treat you as the main threat",
        "fail": "None or reverse effect, perhaps they are frenzied"
    },
    "Flaming Brand": {
        "stat": [
            "bravery"
        ],
        "action": kMaybeAction,
        "tooltip": "Against  beasts, the threat of fire is something that inspires a primal dread. Waving fire about or using magic fire can frighten them",
        "Comments": "Against  beasts, the threat of fire is something that inspires a primal dread. Waving fire about or using magic fire can frighten them",
        "Critical": "Beasts are panicked, you can take another, different, action ",
        "success": "Beasts are cowed and you take another, different, action",
        "mixed": "Beasts are cowed but afterwards angered",
        "fail": "None or reverse effect, perhaps they are frenzied"
    },
    "Must Keep going": {
        "stat": [
            "bravery", "will", "health"
        ],
        "action": kMaybeAction,
        "tooltip": "When sick or stunned, you can try to keep acting, possibly acting or failing to act",
        "Critical": "You can act normally. You are no longer stunned but are still sick",
        "success": "You can act normally. You are no longer stunned but are still sick",
        "mixed": "Choose 1: You can act normally this round, but are still stunned OR you end the stun but can't act, in either case if sick still sick",
        "fail": "You cannot act this round and fall prone. If sick, maybe you barf or otherwise expel fluids"
    },
    "Knife to the Throat": {
        "stat": [
            "cunning"
        ],
        "action": kAction,
        "tooltip": "A particularly intimate form of intimidation that requires surprise, you sneak up and hold a foe at the point or edge of a blade can cause them to swiftly capitulate, will not work on fully armored or unintelligent beings",
        "Critical": "You have a knife to their throad, they are helpless ",
        "success": "Your opponent is cowed, and may surrender, if he tries to escape you hit for a critical hit",
        "mixed": "Your opponent is cowed, if he tries to escape you get to roll a backstab",
        "fail": "On a failure your foe gets a free action"
    },
    "Fear my Magic": {
        "stat": [
            "bravery"
        ],
        "action": kTriggerdReaction,
        "tooltip": "Immediately after a sufficiently scary spell, you keep the spell moaning or humming around you, as to indicate more is coming. Costs 1 mana",
        "Critical": "Foes are panicked",
        "success": "Foes are cowed",
        "mixed": "Foes are cowed but afterwards treat you as the main threat",
        "fail": "None or reverse effect, perhaps they are frenzied"
    },
    "Fear my blade": {
        "stat": [
            "bravery"
        ],
        "action": kTriggerdReaction,
        "tooltip": "Immediately after a certain critical hit, your foes may become frightened",
        "Critical": "Foes are panicked",
        "success": "Foes are cowed",
        "mixed": "Foes are cowed but afterwards treat you as the main threat",
        "fail": "None or reverse effect, perhaps they are frenzied"
    },
    "Attack": {
        "stat": [
            "bravery"
        ],
        "action": kAction,
        "tooltip": "Basic Attack (Bravery)",
        "Comments": "Swing your weapon",
        "Critical": 'You hit your foe, do double damage,\
        <a href="#">and GM can choose 1 \
         <div class="tooltipcontainer">\
                <div class="tooltip">\
       <ul><li> &#x25BA; You hit him in a vulnerable spot. Add another x1 damage, and he is bleeding or stunned</li>\
        <li> &#x25BA; You can immediately act again, maybe attacking a different foe</li>\
        <li> &#x25BA; You use brutal strength. Add your Strength x4 more damage, foe is prone (Str Save), and you get a free action (Stain the Soils Red) to intimidate all enemies</li></ul> \
        </div>\
        </div>\
        </a>',
        "success": 'You hit your foe and do damage to him, and the  \
         <a href="#">and GM can let you choose 1 to 2 of these \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
        <ul><li> &#x25BA; Knock him back</li>\
        <li> &#x25BA; Make him prone (Str Save)</li><li> &#x25BA; Get +1 on your next roll</li>\
        <li> &#x25BA; Force him to retreat and you advance</li>\
         <li> &#x25BA; Retreat away after, free move with disengagement</li></ul> </ul>\
                 </div>\
            </div>\
            </a>',
        "mixed": ": You hit your foe",
        "fail": ' You miss,  \
        <a href="#">and GM can choose 1 if the roll is very low or the foe is strong or tricky \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
                <ul>\
                <li> &#x25BA; Weapon entangled or stuck</li>\
                <li> &#x25BA; Foe retaliates (free attack) </li>\
                <li> &#x25BA; lose some gear, perhaps it falls off</li>\
                <li> &#x25BA; 1d3 hexes in a bad direction</li>\
                </ul>\
                 </div>\
            </div>\
            </a>',

    },
    "OpportunityAttack": {
        "stat": [
            "bravery", "cunning"
        ],
        "action": kReaction,
        "tooltip": "Attack someone trying to move around or to advance on you past your reach",
        "Comments": "Tricky",
        "Critical": 'You hit your foe, do double damage, your foe ends his turn,\
        <a href="#">and GM can choose 1 \
         <div class="tooltipcontainer">\
                <div class="tooltip">\
       <ul><li> &#x25BA; You hit him in a vulnerable spot. Add another x1 damage, and he is bleeding or stunned</li>\
        <li> &#x25BA; You can immediately act again, maybe attacking a different foe</li>\
        <li> &#x25BA; You use brutal strength. Add your Strength x4 more damage, foe is prone (Str Save), and you get a free action (Stain the Soils Red) to intimidate all enemies</li></ul> \
        </div>\
        </div>\
        </a>',
        "success": 'You hit your foe and do damage to him,your foe ends his turn, and the  \
         <a href="#">and GM can let you choose 1 to 2 of these \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
        <ul><li> &#x25BA; Knock him back</li>\
        <li> &#x25BA; Make him prone (Str Save)</li><li> &#x25BA; Get +1 on your next roll</li>\
        <li> &#x25BA; Force him to retreat and you advance</li>\
         <li> &#x25BA; Retreat away after, free move with disengagement</li></ul> </ul>\
                 </div>\
            </div>\
            </a>',
        "mixed": ": You hit your foe, but he continues his move and hits his target",
        "fail": ' You miss,  \
        <a href="#">and GM can choose 1 if it is really a low roll or the foe is strong or tricky \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
                <ul>\
                <li> &#x25BA; Weapon entangled or stuck</li>\
                <li> &#x25BA; Foe retaliates (free attack) </li>\
                <li> &#x25BA; lose some gear, perhaps it falls off</li>\
                <li> &#x25BA; 1d3 hexes in a bad direction</li>\
                </ul>\
                 </div>\
            </div>\
            </a>',

    },
    "ResistDamage": {
        "stat": [
            "health"
        ],
        "action": kTriggerdReaction,
        "tooltip": "When you get hurt, difficulty is the damage minus your armor",

        "Comments": "Resisting damage",
        "Critical": "You escape scott free!",
        "success": 'You are fine, but in the case of overwhelming attacks like a huge explosion or a giant’s club the GM might <a href="#">choose 1 or 2\
         <div class="tooltipcontainer"> \
                <div class="tooltip"> \
                <ul> \
                  <li>● You lose your footing. </li> \
                  <li>● You lose your grip on whatever you’re holding. </li> \
                  <li>● You lose track of someone or something you’re attending to.  </li>\
                  <li>● You miss noticing something important.  </li>\
                  <li>● You take half damage.</li> \
                  <li>● You take a level of exhaustion.  </li>\
                 </ul> \
                 </div></div></a>',

        "mixed": 'Take 1 health and <a href="#">choose 1 GM chooses 1: \
     <div class="tooltipcontainer">\
                <div class="tooltip">\
                 <ul> \
                    <li>● You lose your footing. </li> \
                    <li>● You lose your grip on whatever you’re holding.</li> \
                    <li>● You lose track of someone or something you’re attending to</li> \
                    <li>● You miss noticing something important.</li> \
                    <li>● You take double damage.</li>\
                    <li>● You take a level of exhaustion. \
                 </ul> \
                </div></div></a>',

        "fail": 'Take 2 health   and the   <a href="#"> choose 1 GM chooses 1 \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
                 <ul> \
                    <li>● You’re out of action: unconscious, trapped, incoherent or panicked.</li> \
                    <li>● It’s worse than it seemed. Lose double damage. </li>\
                    <li>● You have an injury, like a hurt leg (slowed), bleeding (lose additional damage with a chance each round, \
                          each 6 for light bleeding or greater than 1 for heavy), a hurt arm (-1 with actions from that arm),\
                          partial blindness (-3 to steel, many actions become more difficult) Certain weapons get bonuses to some kinds of injuries, so if you get struck by those you might be in worse shape. \
                    <li>● You are stunned, for a moment you can’t do anything. </li>\
                 </ul> \
            </div></div></a>',
    },
    "Artillery": {
        "stat": [
            "intelligence"
        ],
        "action": kAction,
        "tooltip": "Artillery: Operate Artillery or certain spells",
        "Comments": "Operate artillery",
        "Critical": 'You hit your target forcefully, Foes cannot avoid damage',
        "success": 'You hit your target. Those hit can reduce damage with Avoid/Dex saving throws',
        "mixed": 'You are taking a long time to wind up your shot and don\'t actually shoot this round',
        "fail": 'You miss by 1d6 yards per 10 yards range, in a random direction from your aiming point. All hit can make saving throws.',


    },
    "Wrestle": {
        "stat": [
            "strength"
        ],
        "action": kAction,
        "tooltip": "Wrestle:  Wrestle someone",
        "Comments": "Wrestle someone",
        "Critical": 'You wrestle your foe <a href="#">and you can choose 2 \
            <div class="tooltipcontainer">\
                    <div class="tooltip">\
            <ul>\
                <li> &#x25BA; You injure him. Do 2 + your strength stat damage </li>\
                <li> &#x25BA; You can throw you foe at another, doing 1 damage to each + your strength stat and knocking both prone</li>\
                <li> &#x25BA; You have your foe helpless, you will need to choose to keep him wrestled</li>\
                <li> &#x25BA; You disarm your foe</li>\
                <li> &#x25BA; You also keep your foe wrestled</li>\
            </ul>\
            </div>\
            </div>\
            </a>',
        "success": 'You wrestle your foe   <a href="#">and you can choose 1 \
            <div class="tooltipcontainer">\
                    <div class="tooltip">\
             <ul>\
              <li> &#x25BA; You disarm your foe</li>\
              <li> &#x25BA; You keep your foe wrestled</li>\
              <li> &#x25BA; You add +2 on you next wrestling move  " </ul>\
            </ul>\
            </div>\
            </div>\
            </a>',
        "mixed": 'You wrestle \
                    <a href="#">and choose 1 \
                   <div class="tooltipcontainer"> \
            <div class="tooltip">\
                    <ul>\
                    <li> & #x25BA; You disarm your foe</li>\
                    <li> & #x25BA; You keep your foe wrestled</li >\
                   </ul >\
                 </div >\
                 </div >\
                 </a>',
        "fail": "Wrestling ends,  and are stabbed or punched and/or prone"
    },
    // bugs: attack grapple should be wrestle
    // defenses should be on stat page
    // metacurrency to combat swingyness
    // Multiple attacks and initiative
    //
    "Wrestle (defense)": {
        "stat": [
            "strength",
            "avoidance"
        ],
        "action": kReaction,
        "tooltip": "Defend against wrestling with wrestling or squiggling",
        "Comments": "This move can only be used if you are already wrestling with your foe",
        "Critical": "Immediately get to use your wrestle on offense</li>\
        <li> &#x25BA; or get free and get a free move",
        "success": "Your can escape or take the offense",
        "mixed": 'Avoid wrestling escalation <a href="#"> but  choose 1 \
            <div class="tooltipcontainer">  \
            <div class="tooltip">\
            <ul> \
             <li> &#x25BA; Take -2 on the next wrestling roll</li> \
            <li> &#x25BA; Your foe escapes the grapple (if he wants)</li> \
            <li> &#x25BA; You are knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs \
            </ul></div></div></a>',
        "fail": 'Wrestling is escalated, take damage, and the GM  <a href="#">  choose one \
        <div class="tooltipcontainer">  \
            <div class="tooltip">  \
        <li> &#x25BA; Take -2 on the next wrestling roll</li>\
        <li> &#x25BA; End the grapple if the foe wishes this</li>\
        <li> &#x25BA; You are knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs \
        </div> </div></a>'
    },
    "Parry": {
        "stat": [
            "bravery",
            "avoidance"
        ],
        "action": kReaction,
        "tooltip": "Parry with weapon or shield",
        "Comments": "Parry with weapon or shield",
        "Critical": "you block your foe, and counterattack: damage your foe with your weapon.",
        "success": "You block your foe",
        "mixed": 'You block your foe but you or gm <a href="#">  choose one \
          <div class="tooltipcontainer">  \
            <div class="tooltip">  \
            <ul> \
                <li> &#x25BA; Take some damage anyway 1 pt</li>\
                <li> &#x25BA; Your weapon, shield, or armor piece is damaged or knocked away</li>\
                <li> &#x25BA; you are knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs </li></ul> \
              </div> </div></a>',
        "fail": 'You are squarely hit, take damage,   and the GM is allowed to <a href="#"> choose 1: \
         <div class="tooltipcontainer">  \
            <div class="tooltip">  \
            <ul> \
        <li> &#x25BA; You are hit in a less armored location</li>\
        <li> &#x25BA; Your weapon, shield, or armor piece is damaged or knocked away</li>\
        <li> &#x25BA; you knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs </li></ul> \
              </div></div></a>',
    },
    "Avoid": {
        "stat": [
            "avoidance"
        ],
        "action": kScene,
        "tooltip": "Avoid a confrontation or people or trouble",
        "Comments": "Avoid is how to not get yourself into a confrontation.  When an NPC is attempting to confront you, you can Avoid.<ul>\
        <li> &#x25BA; You can avoid trouble by being submissive and accepting punishment, by lying about something, by misdirecting or confusing.</li>\
        <li> &#x25BA; You can avoid trouble with disguises or forged papers or bribes.</li>\
        <li> &#x25BA; You can avoid by hiding in advance, to avoid guards you could sneak around.</li>\
        <li> &#x25BA; You can also try to avoid danger by running pell mell from it. Running away is also an avoid roll.</li></ul>",
        "Critical": "",
        "success": "You avoid the problem or confrontation",
        "mixed": "you must drop something, lose something, take harm, or bear some other cost to avoid the confrontation, otherwise you are confronted.",
        "fail": "You get contronted, and there is a chance the situation is worse because you tried to avoid it. "
    },
    "Dodge": {
        "stat": [
            "avoidance"
        ],
        "action": kReaction,
        "tooltip": "Dodge an attack or enemies",
        "Comments": "This roll is used in more detailed combat to represent dodging an attack<ul\
        <li> &#x25BA; It can be difficult to dodge multiple, swarming opponents, or volleys of arrow fire, without running pell mell away… </li>\
        <li> &#x25BA; It can be easy to dodge missiles if you can get into cover</li></ul>",
        "Critical": "",
        "success": 'You dodge your foe and <a href="#">choose one \
         <div class="tooltipcontainer">  \
         <div class="tooltip">  \
            <ul> \
        <li> &#x25BA;  Can move to a safer place, maybe outmanuevering chasing foes</li>\
        <li> &#x25BA;  Can set yourself up for a better attack +1 on attacking next</li></ul> \
              </div> \
              </div></a>',
        "mixed": 'You dodge your foe  but<a href="#"> choose 1: \
         <div class="tooltipcontainer">  \
         <div class="tooltip">  \
            <ul> \
        <li> &#x25BA; Take half damage anyway</li>\
        <li> &#x25BA; Your weapon is damaged or knocked away or dropped</li>\
        <li> &#x25BA; You are knocked prone or otherwise put into a bad position</li></ul>\
        </div></div></a>',
        "fail": "You are squarely hit and the GM is allowed to <a href='#'> choose 1: \
         <div class='tooltipcontainer'>  \
         <div class='tooltip'>  \
            <ul> \
        <li> &#x25BA; You are hit in a less armored location</li>\
        <li> &#x25BA; Your weapon is damaged or knocked away</li>\
        <li> &#x25BA; You are knocked prone or otherwise put into a bad position</li></ul>\
        </div></div></a>",
    },
    "Bargain": {
        "stat": [
            "intelligence"
        ],
        "action": kScene,
        "tooltip": "Bargain: you need to point out the benefits of a deal (or the consequences of not following the deal) to someone",
        "Comments": "Using logic, and pointing out the mutual benefits of a deal or alliance, or the problem if not doing so, on success, you can get agreement on an issue. The deal must really have benefits for the other party, be sure to point those out",
        "Critical": "You make the deal, it doesn't have to be that fair",
        "success": "You make the deal, it must be at least somewhat fair",
        "mixed": "You make the deal, but choose:<ul><li> &#x25BA; You must compromise a lot more than you hoped</li>\
        <li> &#x25BA; You are now in debt, maybe a lot of debt, owing a favor to the other</li>\
        <li> &#x25BA; The deal is shaky, and might break at any time</li></ul>",
        "fail": "You fail to make the deal. Maybe something bad happens. Did you insult them?"
    },
    "Investigate": {
        "stat": [
            "intelligence"
        ],
        "action": kScene,
        "tooltip": "When you closely study something or someone, ask the GM questions",
        "Comments": "When you closely study something or someone, ask the GM questions. such as <ul>\
        <li> &#x25BA; What happened here recently?</li>\
        <li> &#x25BA; What is about to happen?</li>\
        <li> &#x25BA; What should I be on the lookout for?</li>\
        <li> &#x25BA; Who’s really in control here?</li>\
        <li> &#x25BA; What here is not what it appears to be?</li>\
        <li> &#x25BA; What is the history of this place?</li>\
        <li> &#x25BA; How do I operate this device?</li>\
        <li> &#x25BA; What here is useful or valuable to me and why?</li>\
        <li> &#x25BA; What here can be sold for money, and if so how much?</li>\
        <li> &#x25BA; What secret thing can I spot that might open up more things?</li>\
        <li> &#x25BA; Can this merchant be bargained down?</li>\
        <li> &#x25BA; What does this person really want in exchange?</li>\
        <li> &#x25BA; What is this creature’s weak point?</li>\
        <li> &#x25BA; How can this be dispelled?</li></ul>",
        "Critical": "",
        "success": "Ask 3 questions",
        "mixed": "Ask 1 question, or some sort of negative happens and you can ask 3 questions",
        "fail": "The GM has a long list of ways to twist the information he gives",
    },
    "Insight": {
        "stat": [
            "caring"
        ],
        "action": kScene,
        "tooltip": "Insight gives you insight into other people's motive and agendas, lets you read poeple",
        "Comments": "When you closely study something or someone, ask the GM questions. such as <ul>\
        <li> &#x25BA; What do they want?</li>\
        <li> &#x25BA; Are they hiding something and what is it??</li>\
        <li> &#x25BA; What should I be on the lookout for?</li>\
        <li> &#x25BA; Who’s their boss?</li>\
        <li> &#x25BA; What is their plan?</li>\
        <li> &#x25BA; Are they injured, tired, upset?</li>\
        <li> &#x25BA; What is the relationship between those two people</li>\
         <li> &#x25BA; Can this merchant be bargained down?</li>\
        <li> &#x25BA; What does this person really want in exchange?</li>\
        <li> &#x25BA; What will make this person do what I say so I can get something?</li>\
        <li> &#x25BA; What are this creature’s weak point?</li>\
        <li> &#x25BA; Are they under an enchantment?</li></ul>",
        "Critical": "",
        "success": "Ask 3 questions",
        "mixed": "Ask 1 question, or some sort of negative happens and you can ask 3 questions",
        "fail": "The GM has a long list of ways to twist the information he gives",
    },
    "Purchase": {
        "stat": [
            "intelligence"
        ],
        "action": kScene,
        "tooltip": "Purchase: Downtime purchase of rare things like magic items. ",
        "Comments": "Downtime purchase of rare and unsual things, such as magic items, improved weapons, etc.",
        "Critical": "",
        "success": "You find the item for sale and can buy it for a reasonable sum",
        "mixed": " DM choose 1<ul>\
        <li> &#x25BA; the item is more expensive</li>\
        <li> &#x25BA; the item is not quite the one you wanted to buy</li>\
        <li> &#x25BA; the item looks great but it has a hidden cost, like it is stolen, or cursed, or being pursued by enemies </li></ul>",
        "fail": "On a miss, maybe you can’t find the item, maybe you get into trouble, maybe you find it but it is more expensive, is not the one you wanted, and it is stolen, or cursed, or pursued."
    },
    "Spout Lore": {
        "stat": [
            "intelligence"
        ],
        "action": kScene,
        "tooltip": "Spout Lore : Know something about something ",
        "Comments": "When you search your memories and experiences or library for clues. The knowledge you get is like consulting a bestiary, travel guide, or library. You get facts about the subject matter. This is highly dependent on your background ",
        "Critical": "",
        "success": "The GM will reveal something interesting and useful relevant to your situation. This might help you investigate further",
        "mixed": "GM will only tell you something interesting—it’s on you to make it useful. The GM might ask you “How do you know this?” Tell them the truth, now.",
        "fail": "GM has a long list of twists to the infromation he gives",
    },
    "Heal": {
        "stat": [
            "caring"
        ],
        "action": kScene,
        "tooltip": "Heal :  heal some harm",
        "Comments": "It takes a few minutes at least to provide healing, unless provided by a spell of the first magnitude. After each wounding, 1 roll per character who tries to heal, unless a spell. These do not stack, take the best. Heal also reduces the effect of an injury. Injuries commonly last until all harm is gone, and count as one extra harm you need to heal. Without healing it normally it takes 1 day to heal 1 harm, although infected wounds in bad conditions can get worse, 1 day for 1 harm.",
        "Critical": "",
        "success": "Heal 15 harm.",
        "mixed": "Heal 3 calm and  bandage  wound.",
        "fail": "if you don’t have proficiency , you make things worse cause damage or possible infection"
    },
    "Calm": {
        "stat": [
            "caring"
        ],
        "action": kScene,
        "tooltip": "Calm:  Calm someone down or smooth over a situation",
        "Comments": "Calm someone down",
        "Critical": "",
        "success": "You stop someone from freaking out",
        "mixed": "You stop someone from freaking out, but maybe after a second of them expressing it",
        "fail": "You cannot calm them, maybe you become upset too, or it becomes worse"
    },
    "Seduce/Flirt/Entertain": {
        "stat": [
            "allure"
        ],
        "action": kScene,
        "tooltip": "Seduce/Flirt/Entertain  : entertain, get someone to do something, distract them",
        "Comments": "Person to person interaction",
        "Critical": "",
        "success": "You either entertain and charm someone which they will remember fondly, or get them to do something they later regret  (or not), and hold them distracted for a while",
        "mixed": "Choose 1: <ul>\
        <li> &#x25BA; You get them do do something but then must immediately confront them or their friends or husband</li>\
        <li> &#x25BA; You entertain and charm someone but they forget about it very quickly</li>\
        <li> &#x25BA; You entertain and charm someone but their friends have a bad opinion of you</li>\
        <li> &#x25BA; You distract them but they immediately become all alert after a minute</li></ul>",
        "fail": "A swing and a miss, the GM has all sorts of bad reactions from the other party"
    },
    "Performance": {
        "stat": [
            "allure"
        ],
        "action": kScene,
        "tooltip": "stat entertain",
        "Comments": "Performance will often require a proficiency to match the difficulty. A Tavern is but 1, but a King’s palace is more difficult (3 or 4). This is used to determine if the roll is easy or difficult.  ",
        "Critical": "",
        "success": "you receive applause and rewards, and you leave the audience with a particular emotion and theme, like ‘The Heroes are Great’ or ‘The Emperor is Evil’, or you can get one particular  person in the audience to come up to talk to you with them being inclined to like you",
        "mixed": "choose 1:<ul>\
        <li> &#x25BA; Your performance is going well but you must confront a heckler</li>\
        <li> &#x25BA; Half the audience is entertained, the other half is not</li>\
        <li> &#x25BA; The audience misinterprets the emotion and theme</li>\
        <li> &#x25BA; You can get the person to talk to you but he is not amused</li></ul>",
        "fail": "On a miss any number of things could happen. If you are highly skilled though, at least you don’t play badly. Perhaps you get a heckler. Perhaps a fight breaks out."
    },
    "Wicked Lie": {
        "stat": [
            "cunning"
        ],
        "action": kScene,
        "tooltip": "Wicked Lie con or scam someone (not all lies are Wicked)",
        "Comments": "While a fearful person lies to avoid confrontation, and a lusty person lies to seduce, and a caring person makes white lies to make people feel better, a Wicked Lie is a con, a scam, a ‘Big Lie’. It can be brazen and completely unmoored from reality.</ul>\
        <li> &#x25BA; /li>\
        <li> &#x25BA; Remember, not all lies are wicked lies. A person trying to avoid being identified by a guard can use Avoid to claim to be someone else. A seducer might lie and say that he loves his partner when he is motivated by lust. But only a wicked lie could be used to tell that guard you are an agent of the king and that he must follow along with you or have his head chopped off. Only a wicked lie could persuade the seduced person to give over her money and jewels to you for investment into a new overseas company with a “guarantee” of riches..</li></ul>",
        "Critical": "",
        "success": "People believe you and follow along.",
        "mixed": "GM choose 1:<ul>\
        <li> &#x25BA; People are skeptical, but are willing to entertain the idea</li>\
        <li> &#x25BA; they believe you but the reaction is not what you expected</li>\
        <li> &#x25BA; they will believe you if you do something or spend something to show your commitment</li>\
        <li> &#x25BA; they believe you if you show them some kind of evidence</li></ul>",
        "fail": "On a miss: they don't believe you. Maybe this has other consequences"
    },
    "Devices": {
        "stat": [
            "cunning", "intelligence",
        ],
        "action": kScene,
        "tooltip": "Craft, lockpick, trap removal, anything technical",
        "Comments": "Craft, lockpick, trap removal, anything technical.",
        "Critical": "",
        "success": "You successfully deal with the obstacle",
        "mixed": "GM choose 1:<ul>\
        <li> &#x25BA; You made noise and alerted enemies</li>\
        <li> &#x25BA; You break one of your tools or lockpicks</li>\
        <li> &#x25BA; It takes a long time</li>\
        <li> &#x25BA; There is another roll required for some new step required</li></ul>",
        "fail": "On a miss: Either you don't solve the issue or the issue is solved with some major problem, like guards showing up"
    },
    "Hard Physical Work": {
        "stat": [
            "strength", "will", "health"
        ],
        "action": kScene,
        "tooltip": "Hard physical work",
        "Comments": "Digging, hauling, building, armoring, constructing.",
        "Critical": "You do twice as much work",
        "success": "You do the normal amount of work",
        "mixed": "You do the normal amount of work but GM choose 1:<ul>\
          <li> &#x25BA; You break one of your tools </li>\
          <li> &#x25BA; You get interrupted by something or someone </li>\
        <li> &#x25BA; It takes a longer time</li>\
        <li> &#x25BA; You are tired (exhaustion)</li></ul>",
        "fail": "You don't get much done, you are tired (exhausted)"
    },
    "Hard Mental Work": {
        "stat": [
            "intelligence", "will",
        ],
        "action": kScene,
        "tooltip": "Research, study, learn or copy spells",
        "Comments": "Research, study, learn or copy spells",
        "Critical": "You do twice as much work",
        "success": "You do the normal amount of work",
        "mixed": "You do the normal amount of work but GM choose 1:<ul>\
          <li> &#x25BA; You break one of your tools </li>\
          <li> &#x25BA; You get interrupted by something or someone </li>\
        <li> &#x25BA; It takes a longer time</li>\
        <li> &#x25BA; You are tired (exhaustion)</li></ul>",
        "fail": "You don't get much done, you are tired (exhausted)"
    },
    "Steal": {
        "stat": [
            "cunning"
        ],
        "action": kAction,
        "tooltip": "Steal : steal or pickpocket",
        "Comments": "Stealing, pickpocketing, etc. Might not be possible in some circumstances without magic",
        "Critical": "",
        "success": "On a success, you palm or steal the item and are not noticed.",
        "mixed": "Choose 1:<ul>\
        <li> &#x25BA; You palm or steal the item but are confronted</li>\
        <li> &#x25BA; You are about to palm or steal the item but are confronted, but perhaps you can gaslight your way out of it</li></ul>",
        "fail": " You are caught red handed without the item or the GM makes some other hard move"
    },
    "Scout": {
        "stat": [
            "cunning"
        ],
        "action": kScene,
        "tooltip": "Scout  When you sneak stealthily into a dangerous place",
        "Comments": "When you sneak stealthily into a dangerous place",
        "Critical": "",
        "success": "You can see the opponents unobserved",
        "mixed": "The opponents and you see each other at the same time",
        "fail": "Your opponents see you unobserved"
    },
    "Ambush": {
        "stat": [
            "cunning"
        ],
        "action": kScene,
        "tooltip": "Ambush: When you attack by surprise, loose non combat",
        "Comments": "When you describe a plan to inflict pain and suffering or harm on someone by surprise or by suddenly attacking, or executing a helpless person.  ",
        "Critical": "You inflict great pain and suffering and have the option to get away (if that is feasible)",
        "success": "You inflict the pain and suffering and have the option to get away (if that is feasible)",
        "mixed": " you inflict the pain and suffering  but  (choose one)<ul>\
        <li> &#x25BA; You are now confronting the victim or his heirs or friends,</li>\
        <li> &#x25BA; You take stress (Exhaustion).</li></ul>\
        <li> &#x25BA; You are running for your life from a hue and cry.</li></ul>",
        "fail": "On a failure you don’t inflict the pain and suffering, maybe you can’t bring yourself to do it, or perhaps you do it sloppily, or are exhausted by your actions. GM decides"
    },
    "Backstab": {
        "stat": [
            "cunning"
        ],
        "action": kAction,
        "tooltip": "Backstab:  When you attack by surprise in combat",
        "Comments": "The swing of a sword from behind with stealth. Note that it is difficult to backstab, unless you are entering the combat stealthily, or have been out of sight on the previous round. Then it might instead be easy.",
        "Critical": "Do +6 damage to him, stacks with assassin feats",
        "success": "You hit your foe and do +3 damage to him , (stacks with assassin feats), you can move away freely",
        "mixed": " You hit your foe and either (choose 1):<ul>\
        <li> &#x25BA; Do half damage (½)</li>\
        <li> &#x25BA; Are engaged</li>\
        <li> &#x25BA; Get your weapon entangled, lose some gear,  are knocked prone or otherwise put into a bad position</li>\
        <li> &#x25BA; Miss instead, since you decided to wait for a better time, stay hiding and not attack now, maybe you can try next turn</li></ul>",
        "fail": "On a failure your foe gets a free action"
    },
    "Gossip": {
        "stat": [
            "cunning",
            "allure",
            "intelligence"
        ],
        "action": kScene,
        "tooltip": "Gossip:  When you seek information from conversation",
        "Comments": "When you chat with NPCs and ask questions, </l>\
        <li> &#x25BA; What is ____ up to?<ul>\
        <li> &#x25BA; What are you most worried about?</li>\
        <li> &#x25BA; What should I be on the lookout for?</li>\
        <li> &#x25BA; Where can I find ____</li>\
        <li> &#x25BA; Who’s really in control here?</li>\
        <li> &#x25BA; What is not what it appears to be?</li>\
        <li> &#x25BA; What is the history of this place?</li>\
        <li> &#x25BA; ither way, take +1 forward when acting on the answers.</li></ul>",
        "Critical": "",
        "success": "Ask 3 questions",
        "mixed": "Ask 1 question, or ask 3 and GM choose<ul>\
        <li> &#x25BA; People remember you are gossiping and what about </li>\
        <li> &#x25BA; you get some false information </li>\
        <li> &#x25BA; you insult someone or cause a scene.</li></ul>",
        "fail": "GM choose:<ul>\
        <li> &#x25BA; People remember you are gossiping and what about </li>\
        <li> &#x25BA; you get some false information </li>\
        <li> &#x25BA; you insult someone or cause a scene.</li></ul> "
    },

    "Perilous Journey": {
        "stat": [
            "cunning",
            "intelligence",
            "avoidance"
        ],
        "action": kScene,
        "tooltip": "Perilous Journey: For a succesful wilderness journey",
        "Comments": "Describe how you proceed through the wilderness, and how you avoid danger. This can mean that almost any stat can be used, but probably not bravery. I.E. by careful planning you use Intelligence, with a sense of discretion use discretion, by cunning arts use cunning.. If just marching into the unknown and trying to use bravery you probably just automatically fail unless you have a narrative power.",
        "Critical": "You get their pronot without using supplies or exhaustion, not encountering the evil denizens of the land, you can find an adventure spot or a good denizen of the land who can assist you",
        "success": "choose 3.<ul>\
        <li> &#x25BA; You don’t use too much food: Don’t  subtract from supplies or gain exhaustion for not eating</li>\
        <li> &#x25BA; You find your way through the land to where you want to go</li>\
        <li> &#x25BA; You don’t encounter evil denizens of the land</li>\
        <li> &#x25BA; You find an adventure spot</li>\
        <li> &#x25BA; You meet a good denizen of the land who can assist you</li></ul>",
        "mixed": "choose 2.<ul>\
        <li> &#x25BA; You don’t use too much food: Don’t  subtract from  your supplies or gain exhaustion from not eating</li>\
        <li> &#x25BA; You find your way through the land to where you want to go</li>\
        <li> &#x25BA; You don’t encounter evil denizens of the land</li>\
        <li> &#x25BA; You find an adventure spot</li>\
        <li> &#x25BA; You meet a good denizen of the land who can assist you</li></ul>",
        "fail": "You are thirsty, lost, encounter evil denizens of the land and GM choose 1:<ul>\
        <li> &#x25BA; The area you are in is interfering with your magic or technology</li>\
        <li> &#x25BA; Terrible weather</li>\
        <li> &#x25BA; One of the players has gotten lost from the party due to stampedes or sandstorms or mudslides or astral mental interference, maybe play this out</li>\
        <li> &#x25BA; The evil denizens of the land are out in force or better armed or more violent</li>\
        <li> &#x25BA; The evil denizens of the land get the drop on you</li></ul>"
    }
};


var languages = [
    "Dwarvish",
    "Far Durian",
    "Illyrian",
    "Imperial, Court",
    "Imperial, Low",
    "Low Elvish",
    "Prittanian, High",
    "Prittanian, Low",
];

var magic_languages = [
    "Abyssal (magic)",
    "Arachnos (Magic) ",
    "BeastSpeech (Magic)",
    "Celestial (Magic)",
    "Firespeech (Magic)",
    "High Elvish (Magic)",
    "Ignos (Firespeech) (Magic)",
    "Pirate King(Magic) ",
    "Saurian (Magic) ",
    "Windsong (Magic)"
];

var tribal_languages = [
    "Cheptian  (Tribal)",
    "Frozen Cost(Tribal) ",
    "Giant (Tribal)",
    "Orlanthi (Tribal)",
    "Pavis (Tribal)",
    "Ratling (Tribal)",
    "Trollish (Tribal)",

];
// console.log("Loaded Moves for Fourty");
// WriteMovesFOrFountry();

// ///  


function appearanceDialog(thing) {
    let a = " <img src=\"" + getAppearanceImage(thing, 'token') + "\" alt=\"" + thing.name + "\"" +
        "   style=\"max-width:256px" + FetchStyleFromAppearanceArray(thing, 'token') + "\"" +
        "   ondragenter=\"onDragEnter(event,this)\" ondragover=\"onDragOver(event,this)\"" +
        "   ondrop=\"onDropOnImage(event,this,'" + thing.id + "', 'token')\" ondragleave=\"onDragLeave(event,this)\"/>"
    " <input type=\"color\" id=\"" + thing.id + "colorPicker\" name=\"" + thing.id + "colorPicker\"" +
        "   value=\"" + getAppearanceTintForHTML(thing, 'token') + "\"" +
        "   oninput=\"htmlContext.setAppearanceColor('" + thing.id + '", "token")>';


    return a;

}
MakeAvailableToParser('appearanceDialog', appearanceDialog);

async function Listify(list, owner, sheet, class_name, chat_id) {
    let context = {
        thing: null,
        sheetName: sheet,
        window: undefined,
        owner: owner,
        notes: undefined,
        additionalParms: undefined,
        chat_id: chat_id
    };
    let output = "<div>"
    if (class_name != undefined)
        output = "<div class=\"" + class_name + "\">";

    for (let i = 0; i < list.length; i++) {
        context.thing = list[i];
        output += "<div>" + await parseSheetWithContext(context) + "</div>";
    }
    return output + "</div>";
}

function ToggleActivate(checkbox, chat_id, owner_id, featName) {

    let checked = checkbox.checked;
    socket.emit("change", {
        thing: chat_id, change: ' thing.featsChecked[ "' + featName + '"] = ' + checked
    });


}
MakeAvailableToHtml('ToggleActivate', ToggleActivate);

function ActivationButton(chat_id, owner, featName, checked) {
    let labelid = chat_id + '_' + featName + '_activate';

    let form = `<form> <input type="checkbox" id="${labelid}" ${checked} onchange="htmlContext.ToggleActivate(this,'${chat_id}', '${owner}.id', '${featName}')"> <label for="${labelid}">Activate</label> </form>`;

    console.log(form);
    return form;
}
MakeAvailableToParser('ActivationButton', ActivationButton);





function GetBonusFromFeats(chat_id, owner, move) {
    let bonus = 0;
    let chat = getChat(chat_id);
    let feats = GetRawFeatsForMove(owner, move);
    for (let i = 0; i < feats.length; i++) {
        let feat = feats[i];
        if ((feat.activated || chat.featsChecked[feat.name]) && feat.bonus) {
            if (feat.complex_bonuses) {
                bonus += feat.complex_bonuses[move];
            }
            else {
                bonus += feat.bonus;
            }
        }
    }
    return bonus;
}

MakeAvailableToParser('GetBonusFromFeats', GetBonusFromFeats);
MakeAvailableToHtml('GetBonusFromFeats', GetBonusFromFeats);


function GetRawFeatsForMove(owner, move) {
    let answer = [];
    let feats = GetAllFeats(owner);
    for (let i = 0; i < feats.length; i++) {
        let feat = feats[i];
        if (feat.moves) {
            for (let a = 0; a < feat.moves.length; a++) {
                if (feat.moves[a] == move) {
                    answer.push(feat);
                }
            }
        }


    }
    return answer;
}


function GetRawHinderingFeatsForMove(owner, move) {
    let answer = [];
    let feats = GetAllFeats(owner);
    for (let i = 0; i < feats.length; i++) {
        let feat = feats[i];
        if (feat.HinderedMoves) {
            for (let a = 0; a < feat.HinderedMoves.length; a++) {
                if (feat.HinderedMoves[a] == move) {
                    answer.push(feat);
                }
            }
        }


    }
    return answer;
}
async function GetFeatsForMove(owner, move, chat_id, sheetName) {

    return await Listify(GetRawFeatsForMove(owner, move), owner, sheetName, undefined, chat_id);

}
MakeAvailableToParser('GetFeatsForMove', GetFeatsForMove);
MakeAvailableToHtml('GetFeatsForMove', GetFeatsForMove);

function GetAllFeats(owner) {

    let list = [];
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "feats") {


            list.push(item);
        }
    }
    return list;
}

async function ListAllFeats(owner) {

    let list = GetAllFeats(owner);
    return await Listify(list, owner, "feats", undefined);
}

MakeAvailableToParser('ListAllFeats', ListAllFeats);



function getStrength(owner) {

    return Number(owner.stats.strength);
}



export function isAllowedToWear(owner_id, thingId) {

    let thing = GetRegisteredThing(thingId);
    if (!thing.armor) return true;

    console.log("New rule for armor required level");
    return true;
}

function getMaxHealth(owner) {
    let strbonus = getStrength(owner);
    let will = Number(owner.stats.will);
    let health = Number(owner.stats.health);
    return 10 + strbonus + will + health * 2;


}

MakeAvailableToParser("getMaxHealth", getMaxHealth);
MakeAvailableToHtml("getMaxHealth", getMaxHealth);

async function getArmorValue(owner, damageType) {

    let bonus = 0;
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "weapon") {
            let b = await isEquipped(owner.id, item.id)
            if (b && !isNaN(item?.armor?.bonus))
                bonus += item.armor.bonus;
        }
    }
    return bonus;
}


MakeAvailableToParser("getArmorValue", getArmorValue);

function getArmor(item) {
    if (!isNaN(item?.armor?.bonus))
        return " Armor:" + item.armor.bonus + " ";



    return "";
}
MakeAvailableToParser("getArmor", getArmor);

var takeDamageMove = {
    "stat": [
        "none"
    ],
    "Comments": "Resisting damage",
    "Critical": "You escape scott free!",
    "success": 'You are fine, but in the case of overwhelming attacks like a huge explosion or a giant’s club the GM might <a href="#">choose 1 or 2\
         <div class="tooltipcontainer"> \
                <div class="tooltip"> \
                <ul> \
                  <li>● You lose your footing. </li> \
                  <li>● You lose your grip on whatever you’re holding. </li> \
                  <li>● You lose track of someone or something you’re attending to.  </li>\
                  <li>● You miss noticing something important.  </li>\
                  <li>● You take half damage.</li> \
                 </ul> \
                 </div></div></a>',

    "mixed": 'Take 1 wound and <a href="#">choose 1 GM chooses 1: \
     <div class="tooltipcontainer">\
                <div class="tooltip">\
                 <ul> \
                    <li>● You lose your footing. </li> \
                    <li>● You lose your grip on whatever you’re holding.</li> \
                    <li>● You lose track of someone or something you’re attending to</li> \
                    <li>● You miss noticing something important.</li> \
                    <li>● You take double damage.</li>\
                 </ul> \
                </div></div></a>',
    // here in 'you have an injury roll on injury table
    "fail": 'Take double damage  and the   <a href="#"> and the GM chooses chooses 1 \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
                 <ul> \
                    <li>● You’re out of action: unconscious, trapped, incoherent or panicked.</li> \
                    <li>● It’s worse than it seemed. Take double damage again. </li>\
                    <li>● You have an injury, like a hurt leg (slowed), bleeding (lose additional damage with a chance each round, \
                          each 6 for light bleeding or greater than 1 for heavy), a hurt arm (-1 with actions from that arm),\
                          partial blindness (-3 to steel, many actions become more difficult) Certain weapons get bonuses to some kinds of injuries, so if you get struck by those you might be in worse shape. \
                    <li>● You are stunned, for a moment you can’t do anything. </li>\
                 </ul> \
            </div></div></a>',
};


async function takeDamage(ownerId, damage, damageType, advantage) {

    // let owner = await ensureThingLoaded(ownerId);
    //let armor = await getArmorValue(owner, damageType);
    // this is broken, let's figure out how damage works later
    let mod_damage = Math.floor((-(damage - 3) + armor * 2) / 2);

    rollMoveStat(ownerId, "health", "ResistDamage", "", advantage,
        undefined, undefined, undefined, "");



}

MakeAvailableToParser("takeDamage", takeDamage);
MakeAvailableToHtml("takeDamage", takeDamage);

function getTakenDamage(thingId) {
    let thing = GetRegisteredThing(thingId);
    return thing.ui.damageToTakeAmt;
}

function getTakenDamageType(thingId) {
    let thing = GetRegisteredThing(thingId);
    return thing.ui.damageToTakeType;
}
MakeAvailableToHtml("getTakenDamage", getTakenDamage);
MakeAvailableToHtml("getTakenDamageType", getTakenDamageType);



function FindProficiencyBonus(owner, mode, move) {
    // should return a bonus for proficiency
    return 0;
}


function showWeaponModes(thing, owner) {
    let answer = "";
    if (!thing.weapon_modes) return answer;
    for (let i = 0; i < thing.weapon_modes.length; i++) {
        let mode = thing.weapon_modes[i];
        for (let mv = 0; mv < mode.move.length; mv++) {
            let move = mode.move[mv];
            answer += span(mode.name + " " + move, "", "bold") + ".  ";
            if (mode.range) answer += (span("range ", mode.range, "italic")) + ".  ";
            if (mode.min_range) answer += (span("minimum range ", mode.min_range, "italic")) + ".  ";
            if (mode.radius) answer += (span("radius range ", mode.radius, "italic")) + ".  ";
            answer += span(mode.type + " ", (mode.hands > 1 ? " Two Handed. " : ""), "italic");
            let bonus = FindProficiencyBonus(owner, mode, move);
            for (let d = 0; d < mode.damage.length; d++) {
                if (mode.damage) {
                    let damage = mode.damage[d];
                    answer += span("damage ", "", "italic") + damage.damage + "+" + bonus[0] + " " + damage.type + " " + damage.when + ". ";
                    bonus = 0;
                } else if (mode.condition) {
                    let damage = mode.damage[d];
                    answer += span("condition", "", "italic") + damage.damage + " " + damage.type + " " + damage.when + ". ";
                }
            }
        }
    }
    return div(answer, "centered");
}
MakeAvailableToParser('showWeaponModes', showWeaponModes);


function showArmorBenefit(thing, owner) {
    let answer = "";
    let armor = thing.armor;
    if (!armor) return answer;

    let a = "";
    for (let i = 0; i < armor.type.length; i++) {
        if (i > 0) a += ", ";
        a += armor.type[i];
    }
    answer += div(span("protects vs ", a));
    answer += div(span("bonus ", armor.bonus + ""));

    let steel = FindProficiencyBonus(owner, armor);
    answer += div(span("Steel ", steel[0] + ""));
    answer += div(span("Sacrifice", (armor.usedSacrifice ? armor.sacrifice - armor.usedSacrifice : armor.sacrifice) + "/" + armor.sacrifice));

    return div(answer);
}
MakeAvailableToParser('showArmorBenefit', showArmorBenefit);




export function findInNamedArray(array, name) {

    if (name) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    }
    return undefined;
}
MakeAvailableToParser('findInNamedArray', findInNamedArray);


var missingImage = "images/questionMark.png";

export function getAppearanceImage(thing, type) {
    try {
        let answer = findInNamedArray(thing.appearance, thing.current_appearance);
        if (!answer) return missingImage;
        answer = answer[type];
        if (!answer) return missingImage;
        return answer.img ? answer.img : missingImage;
    } catch {

        return missingImage;

    }
}
MakeAvailableToParser('getAppearanceImage', getAppearanceImage);

function setAppearanceColor(thingId, type) {

    let thing = GetRegisteredThing(thingId);
    const colorPicker = document.getElementById(thingId + "colorPicker");
    let evaluation = 'findInNamedArray(thing.appearance, thing.current_appearance).' + type + '.color =  "' + colorPicker.value + '"';
    socket.emit("change_appearance", { thing: thingId, change: evaluation, updatePortrait: true });
}
MakeAvailableToHtml('setAppearanceColor', setAppearanceColor);

export function getAppearanceTintForHTML(thing, type) {
    try {
        let answer = findInNamedArray(thing.appearance, thing.current_appearance);
        if (!answer) return '#ffffff';
        answer = answer[type];
        if (!answer) return '#ffffff';
        return answer.color != undefined ? answer.color : '#ffffff';
    } catch {
        return '#ffffff';
    }
}
MakeAvailableToParser('getAppearanceTintForHTML', getAppearanceTintForHTML);

export function setAppearanceImage(thingId, image_type, path) {

    let thing = GetRegisteredThing(thingId);
    if (path.startsWith(window.location.href)) { // remove URL if present
        let skip = window.location.href.length;
        path = path.substr(skip);
    }
    if (image_type == "") { // no extended appearance info
        thing.img = path;
        let evaluation = 'thing.img = "' + path + '"';
        socket.emit("change", { thing: thingId, change: evaluation });
        return;

    }
    let evaluation = 'findInNamedArray(thing.appearance, thing.current_appearance).' + image_type + '.image =  "' + path + '"';
    console.log('evaluation is ' + evaluation);
    socket.emit("change_appearance", { thing: thingId, change: evaluation, updatePortrait: true });
}
MakeAvailableToParser('setAppearanceImage', setAppearanceImage);



export function setSlot(thing, slotExact, item) {
    let answer = findInNamedArray(thing.appearance, thing.current_appearance);


    let evaluation = 'findInNamedArray(thing.appearance, thing.current_appearance).slots["' + slotExact + '"] = "' + item.id + '"';

    socket.emit("change_appearance", { thing: thing.id, change: evaluation, updatePortrait: false });


}

function removeFromSlot(thing, slotExact) {


    let evaluation = 'findInNamedArray(thing.appearance, thing.current_appearance).slots["' + slotExact + '"] = ""';

    socket.emit("change_appearance", { thing: thing.id, change: evaluation, updatePortrait: false });


}

function getSlotImage(thing, type, placeholder) {

    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    if (!answer) return placeholder;
    let slots = answer['slots'];
    if (!slots) return placeholder;

    if (!slots[type]) return placeholder;
    console.log(slots[type]);
    if (isAllExpended(slots[type])) {
        return "images/icons/all_empty.webp";
    }
    let item = GetRegisteredThing(slots[type]);
    if (item) {
        return item.img;
    }
    return placeholder;


}
MakeAvailableToParser('getSlotImage', getSlotImage);

function getSlotItem(owner_id, slot) {

    let owner = GetRegisteredThing(owner_id);
    let answer = findInNamedArray(owner.appearance, owner.current_appearance);
    if (!answer) return false;
    let slots = answer['slots'];
    if (!slots) return false;
    return slots[slot];

}


export function isEquipped(owner_id, thingId) {
    let thing = GetRegisteredThing(thingId);
    if (!thing) { console.error(thingId + " missing"); return false; }

    if (thing.slot == "Always") return true;
    let owner = GetRegisteredThing(owner_id);
    let answer = findInNamedArray(owner.appearance, owner.current_appearance);
    if (!answer) return false;
    let slots = answer['slots'];
    if (!slots) return false;
    for (const [key, value] of Object.entries(slots)) {
        if (value == thingId)
            return true;
    }
    return false;
}


function isAllExpended(thingId) {
    let thing = GetRegisteredThing(thingId);

    if (!thing?.counters) return false;
    for (let i = 0; i < thing.counters.length; i++) {
        if (thing.counters[i].cur > 0) return false;
    }
    return true;
}

function isExpended(thingId, weaponMode) {
    let thing = GetRegisteredThing(thingId);
    if (!thing?.counters) return false;
    if (thing.counters.length < weaponMode)
        if (thing.counters[weaponMode].cur > 0) return false;

    return true;
}
function Expend(thingId, weapon_mode) {
    // returns true if expended status has changed
    let thing = GetRegisteredThing(thingId);

    if (!thing.counters) return false;
    let newUses = (thing.counters[weapon_mode].cur - 1)
    if (newUses < 0) return false;
    thing.counters[weapon_mode] = newUses;
    socket.emit('change', {
        change: 'ensureExists (thing, template, "counters"); thing.counters[ ' + weapon_mode + '].cur = ' + newUses,
        thing: thingId
    });
    return newUses <= 0;
}

function ToggleEquip(owner_id, thingId) {

    let thing = GetRegisteredThing(thingId);
    if (thing.slot == "Always") return;
    let owner = GetRegisteredThing(owner_id);
    let answer = findInNamedArray(owner.appearance, owner.current_appearance);
    if (!answer) return;
    let slots = answer['slots'];
    if (!slots) return false;
    // turn it off
    for (const [key, value] of Object.entries(slots)) {
        if (value == thingId) {
            removeFromSlot(owner, key);
            return;
        }
    }


    if (!isAllowedToWear(owner_id, thingId)) {
        alert("Not proficient.");
        // redraw
        RedrawWindow(owner_id);
        return;
    }

    // else turn it on
    for (let i = 0; i < slotList.length; i++) {
        if (slotList[i].slot == thing.slot) {
            if (slotList[i].num == 1) {
                setSlot(owner, thing.slot, thing);
                return;
            }

            else {
                // find a blank one
                for (let j = 0; j < slotList[i].num; j++) {

                    if (!slots[thing.slot + j]) {
                        setSlot(owner, thing.slot + j, thing);
                        return;
                    }
                }

                setSlot(owner, thing.slot + '1', thing);
            }


        }


    }
}
MakeAvailableToHtml("ToggleEquip", ToggleEquip);

async function EquippedCheckBox(owner_id, thingId) {
    let e = await isEquipped(owner_id, thingId);
    console.log("e " + e);

    console.log('<input type="checkbox" id="' + owner_id + "_" + thingId + '" name="Equipped"' + (e ? ' checked="true"' : "") + '"' +
        ' onChange= "htmlContext.ToggleEquip(' + "'" + owner_id + "'" + thingId + "')" + '  ">');

    return '<input type="checkbox" id="' + owner_id + "_" + thingId + '" name="Equipped"' + (e ? ' checked="true"' : "") + '"' +
        ' onChange= "htmlContext.ToggleEquip(' + "'" + owner_id + "','" + thingId + "')" + '  ">';

}
MakeAvailableToParser('EquippedCheckBox', EquippedCheckBox);

function FetchStyleFromAppearanceArray(thing, type) {


    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    if (!answer) return "";
    answer = answer[type];
    if (!answer) return "";
    let parms = "";
    if (answer.rotation) {
        parms += ';transform:rotate(' + answer.rotation + 'deg)';

    }
    // if (answer.color != undefined && answer.color != 0xffffff) {  I have to switch to canvas to do this right, low priority
    //     parms += '; mix-blend-mode: multiply;  background-color:' + answer.color.toString(16);


    // }
    return parms;
}
MakeAvailableToParser('FetchStyleFromAppearanceArray', FetchStyleFromAppearanceArray);

function featclicked(cb) {
    console.log("Clicked, new value = " + cb.checked);
    console.log("thing = ", cb.dataset.thingid);
    console.log("cb = ", cb);

    socket.emit('change', {
        change: cb.dataset.clause + " = " + cb.checked,
        thing: cb.dataset.thingid
    });
}
MakeAvailableToHtml('featclicked', featclicked);

function tabLinkClass(isActive) {

    if (!isActive) {
        return 'class="tablinks"';
    }

    return 'class="selectedTab"';
}
MakeAvailableToParser('tabLinkClass', tabLinkClass);


function tabClass(isActive) {
    if (!isActive) {
        return 'class="tabcontent"';
    }

    return 'class="selectedtabcontent"';
}
MakeAvailableToParser('tabClass', tabClass);

function FindSubELementsByCLassName(element, className) {

    let foundList = [];
    function recurse(element, className, foundList) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var el = element.childNodes[i];
            if (typeof el.className === 'string' || el.className instanceof String) {
                var classes = el.className.split(" ");
                for (var j = 0, jl = classes.length; j < jl; j++) {
                    if (classes[j] == className) {
                        foundList.push(element.childNodes[i]);

                    }
                }
            }

            recurse(element.childNodes[i], className, foundList);
        }
    }
    recurse(element, className, foundList);
    return foundList;
}

function openTab(evt, tabName, button, id) {
    // Declare all variables


    socket.emit('change', {
        change: 'thing.tab="' + tabName + '"',
        thing: id
    });
    let sheet = button.parentNode.parentNode; // ???? We also need the thing

    // Get all elements with class="tabcontent" and hide them
    let tabcontent = FindSubELementsByCLassName(sheet, "tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].id != tabName) tabcontent[i].style.display = "none";
        else tabcontent[i].style.display = "block";
    }

}
MakeAvailableToParser('openTab', openTab);
MakeAvailableToHtml('openTab', openTab);

function ensureExists(thing, template, field) {
    // actually only used on server
    if (!thing[field]) thing[field] = {}
}
MakeAvailableToParser('ensureExists', ensureExists);




function featNoCheckBox(feats, i, thing, owner, checked, featSheet) {

    let template = "";
    let text = "<li> &#x25BA;"
    text += '<span class=npcBold>' +
        featSheet.name + ':</span>' + featSheet.description + '</li > ';

    return text;
}


function featCheckBox(feats, i, thing, owner, checked, featSheet) {

    if (featSheet == undefined) return "Missing feat";

    let clause = "ensureExists(thing, template, 'owner_featsChosen'); thing.owner_featsChosen['" + feats[i] + "']"
    let text = "<li> &#x25BA;"
    text += '<input id="' + feats[i] + '" type="checkbox" class="dropdown-check-list-ul-items-li"'
        + '"  data-owner="' + owner.id + '" '
        + '" data-clause="' + clause
        + '"  data-thingid="' + thing.id // straighten out id and file
        + '" ' + (checked ? " checked " : "")
        + ' onchange="htmlContext.featclicked(this);"'
        + ' /><label for="' + feats[i] + '"> <span class=npcBold>' +
        featSheet.name + ':</span>' + featSheet.description + '</li > ';

    return text;
}

MakeAvailableToParser('featCheckBox', featCheckBox);




// Hide the popup menu when clicking anywhere in the document
document.addEventListener("mouseup", (event) => {
    const popupMenu = document.getElementById("popupMenu");
    if (popupMenu && event.target != popupMenu) {
        popupMenu.style.display = "none";
    }
});

function DragAppearanceArt(thingDragged, event, portrait) {

    console.log("DragAppearanceArt thingDragged " + thingDragged, event, portrait);


}
MakeAvailableToHtml('DragAppearanceArt', DragAppearanceArt);

// input is drag and drop file
async function UploadAppearanceArt(ev, which, id) {
    let file = ev.target.files[0];
    try {
        let url = new URL(window.location.href).origin + '/uploadFromButton';


        let formData = new FormData()
        formData.append('file', file);


        let response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const result = await response.text();
        console.log("Success:", result);

        let evaluation = 'findInNamedArray(thing.appearance, thing.current_appearance).' + which + '.image =  "images/uploaded/' + file.name + '"'; // the window id is window_fullthingname
        console.log('id is ' + id);
        console.log('evaluation is ' + evaluation);

        socket.emit("change_appearance", { thing: id, change: evaluation, updatePortrait: true });

        return true;


    } catch (error) {
        console.error("Error:  file %o" + error, file);
        return false;
    }
}
MakeAvailableToHtml('UploadAppearanceArt', UploadAppearanceArt);

function showPasteAndChoose(e, w, show, hide) {

    let toShow = w.document.getElementById(show);
    let toHide = w.document.getElementById(hide);

    toShow.style.visibility = "visible";
    toHide.style.visibility = "hidden";

}
MakeAvailableToHtml('showPasteAndChoose', showPasteAndChoose);

function dropDownToggle(elemId, doc, filterId) {

    let toShow = doc.getElementById(elemId);

    if (toShow.style.visibility == "visible")
        toShow.style.visibility = "hidden";
    else {
        let searchText = doc.getElementById(filterId);
        toShow.style.visibility = "visible";
        toShow.style.display = "block";
        searchText.style.visibility = "visibility";
        searchText.focus();
    }


}

MakeAvailableToHtml('dropDownToggle', dropDownToggle);


function filterDropDown(input, dropdown) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(input);
    filter = input.value.toUpperCase();
    let div = document.getElementById(dropdown);
    a = div.getElementsByTagName("li");
    for (i = 0; i < a.length; i++) {
        let txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
MakeAvailableToHtml('filterDropDown', filterDropDown);


function ChangeW(e, show, hide) {

    let toShow = document.getElementById(show);
    let toHide = document.getElementById(hide);

    toShow.style.visibility = "visible";
    toHide.style.visibility = "hidden";

}
MakeAvailableToHtml('ChangeW', ChangeW);

function showApperancePopUp(e, id) {

    const popupMenu = document.getElementById("popupMenu");
    const ul = popupMenu.children[0]; // todo change to id
    let thing = GetRegisteredThing(id);

    if (thing) {
        ul.replaceChildren();

        // letli= document.createElement("li");
        // li.appendChild(document.createTextNode("Edit " + thing.current_appearance));
        // ul.appendChild(li);

        // li.onclick = function () {
        //     showThing(id, "Appearance");
        // }
        for (let i = 0; i < thing.appearance.length; i++) {
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(thing.appearance[i].name));
            ul.appendChild(li);

            li.onclick = function () {

                //  thing.current_appearance = thing.appearance[i].name;
                let id = thing.id; // the window id is window_fullthingname
                let evaluation = 'thing.current_appearance =  "' + thing.appearance[i].name + '"'; // the window id is window_fullthingname
                console.log('id is ' + id);
                console.log('evaluation is ' + evaluation);

                popupMenu.style.display = "none";
                socket.emit("change_appearance", { thing: id, change: evaluation, updatePortrait: true });

            }

        }

        popupMenu.style.display = "block";
        popupMenu.style.visibility = "visible";
        popupMenu.style.left = e.clientX + "px";
        popupMenu.style.top = e.clientY + "px";


    }

}
MakeAvailableToHtml('showApperancePopUp', showApperancePopUp);


const baseDice = "2d10";

async function showInventoryTooltip(evt, thing_id, slot) {

    let tooltip = document.getElementById("InventoryTooltip_" + thing_id);
    tooltip.innerHTML = slot;
    let thing = GetRegisteredThing(thing_id);
    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    let slots = answer['slots'];
    if (!slots) return;

    if (!slots[slot]) return;
    let windowName = "window_" + thing_id;
    let w = document.getElementById(windowName);
    let topWPos = w.getBoundingClientRect().top + window.scrollY;
    let leftWPos = w.getBoundingClientRect().left + window.scrollX;

    let parent = evt.target.parentNode;
    let topPos = parent.getBoundingClientRect().top + window.scrollY;
    let leftPos = parent.getBoundingClientRect().left + window.scrollX;

    // this needs to be fixed, the calculation of the tooltip wrong
    let weapon = await GetRegisteredThing(slots[slot]);
    tooltip.innerHTML = weapon.description + '(' + weapon.slot + ')';
    tooltip.style.display = "block";
    tooltip.style.left = (10 + leftPos - leftWPos) + 'px';
    tooltip.style.top = (10 + topPos - topWPos) + 'px';

    tooltip.style.zIndex = 10000;

}
MakeAvailableToParser('showInventoryTooltip', showInventoryTooltip);


function hideInventoryTooltip(thingId) {
    let tooltip = document.getElementById("InventoryTooltip_" + thingId);
    tooltip.style.display = "none";

}
MakeAvailableToParser('hideInventoryTooltip', hideInventoryTooltip);

function quote(x) {
    return "'" + x + "'";
}

function CreateRollMoveStatString(buttonClass, buttonText, description, ownerId, stat, mv, skill, advantage, weapon_id, defense_or_offset, weapon_mode) {
    let comma = ",";
    return "<button class=\""
        + buttonClass + "\" onclick =\"htmlContext.rollMoveStat(" + quote(ownerId) + comma + quote(stat) + comma + quote(mv) + comma + quote(skill) + comma + quote(advantage) + comma +
        quote(weapon_id) + comma + quote(defense_or_offset) + comma + quote(weapon_mode) + comma + quote(description) + ")\">"
        + quote(buttonText) +
        "</button>";

}
MakeAvailableToParser('CreateRollMoveStatString', CreateRollMoveStatString);




function changeChatDifficulty(id, amt) {

    console.log("Chaning skill to " + amt + "for id " + id);
    socket.emit('change', {
        change: "thing.difficulty = '" + amt + "'",
        thing: id
    })

}


MakeAvailableToParser('changeChatDifficulty', changeChatDifficulty);
MakeAvailableToHtml('changeChatDifficulty', changeChatDifficulty);


function changeChatStat(id, stat) {
    //let menu = document.getElementById(divElement);
    //  menu.classList.remove("active")
    console.log("Chaning stat to " + stat + "for id " + id);
    socket.emit('change', {
        change: "thing.stat = '" + stat + "'",
        thing: id
    })

}
MakeAvailableToParser('changeChatStat', changeChatStat);
MakeAvailableToHtml('changeChatStat', changeChatStat);


function ChooseStat(owner, id, divElement) {

    let answer = "<ul class='popup-menu'>";
    let quote = "'";
    let comma = ",";
    let stats = Object.keys(owner.stats);
    for (let i = 0; i < stats.length; i++) {

        answer += '<li onclick="changeChatStat('
            + quote + id + quote + comma + quote + stats[i] + quote + comma + quote
            + divElement + quote + ')">' + stats[i] + '</li>';


    }
    answer += '</ul>'
    return answer;
}
MakeAvailableToParser('ChooseStat', ChooseStat);
MakeAvailableToHtml('ChooseStat', ChooseStat);

function GetProficiency(owner, skill) {
    console.log("Add something about proficiency")
    return 0;
}

function rollMoveStat(ownerId, stat, mv, skill, advantage, weapon_id, attackOrDefense, weapon_mode, description) {
    let owner = GetRegisteredThing(ownerId);
    let damage = []
    let bonus = owner.stats[stat];
    if (!weapon_id || weapon_id == "undefined") {

        if (moves[mv] == undefined) { throw ("err"); }

        socket.emit('rollmove', {
            ownerId: ownerId,
            description: description,
            stat: stat,
            statBonus: owner.stats[stat],
            skill: skill,
            skillDice: GetProficiency(owner, skill),
            move: mv,
            difficulty: 0,
            advantage: advantage,
            resultsTable: moves[mv],
            featsChecked: {}
        });
    } else {
        let weapon = GetRegisteredThing(weapon_id);
        if (!weapon) throw ("err");
        let mode = (weapon[attackOrDefense][weapon_mode]); // weaksauce fix
        if (Expend(weapon_id, mode)) {
            RedrawWindow(owner.registeredId)
        }
        let skill = FindProficiencyBonus(owner, mode)[1];
        console.log(skill);
        if (moves[mv] == undefined) { throw ("err"); }

        socket.emit('rollmove', {

            ownerId: ownerId,
            stat: stat,
            description: description,
            statBonus: owner.stats[stat],
            skill: skill,
            skillDice: GetProficiency(owner, skill),
            move: mv,
            difficulty: 0,
            advantage: advantage,
            resultsTable: moves[mv],
            weapon_name: weapon.name,
            damage: mode.damage,
            damage_bonus: FindProficiencyBonus(owner, mode)[0],
            featsChecked: {}


        });


    }

}

MakeAvailableToParser("rollMoveStat", rollMoveStat);
MakeAvailableToHtml("rollMoveStat", rollMoveStat);





function GetStatBonus(owner, stat) {

    return Number(owner.stats[stat]);
}



MakeAvailableToParser("GetStatBonus", GetStatBonus);

function GetRollColor(thing, owner) {

    return getRollAndRollResults(thing, owner).color;


}
MakeAvailableToParser("GetRollColor", GetRollColor);

function getRollAndRollResults(thing, owner) {

    let index = 0;

    let outputD10s = thing.d10.slice();
    let results = "";
    let numdice = 2;
    if (thing.advantage != 0) {
        numdice += Math.abs(thing.advantage);
    }
    if (thing.advantage < 0)
        outputD10s.sort(function (a, b) { return Number(a.val) - Number(b.val) });
    if (thing.advantage > 0)
        outputD10s.sort(function (a, b) { return Number(b.val) - Number(a.val) });

    results += "d10s: <b> " + (outputD10s[0].val) + "," + (outputD10s[1].val) + " " + "</b>";
    for (let j = 2; j < numdice; j++) {
        results += "," + (outputD10s[j].val);
    }

    let result = Number(outputD10s[0].val) + Number(outputD10s[1].val);

    let natural = result;

    let max = 0;
    let numSixes = 0;

    let skill = GetProficiency(owner, thing.skill);

    if (skill > 0)
        results += "d6s:(";
    for (let i = 0; i < skill; i++) {
        if (i > 0) results += ",";
        results += (thing.skillDice[i].val);
        max = Math.max(max, thing.skillDice[i].val);
        if (thing.skillDice[i].val == 6) numSixes++;
    }
    result += Number(max);
    if (max) results += ") " + max;
    if (numSixes > 1) {
        result += numSixes - 1;
        results += " <span class='redtext'>" + (numSixes - 1) + "</span>";
    }
    // should I also transmit the featbonus so the server feat is always used?
    // TODO: change this
    let featBonus = GetBonusFromFeats(thing.id, owner, thing.move);
    result += featBonus;
    results += (featBonus > 0 ? " +" : "") + featBonus;
    result += Number(thing.statBonus);
    results += (thing.statBonus > 0 ? " +" : "") + thing.statBonus;
    result -= Number(thing.difficulty);
    results += " -" + thing.difficulty;
    let text = "";
    let color = 'black';
    if (natural == 2) {
        color = 'fumble';
        text = ("fail")
    } else if (natural == 20) {
        color = 'crit';
        text = ("critical");
    }
    else if (result < 10) {
        color = 'fail';
        text = ("fail");
    }
    else if (result < 16) {
        color = 'mixed';
        text = ("mixed");
    }
    else if (result < 23) {
        color = 'success';
        text = ("success");
    }
    else if (isNaN(result)) {
        color = 'fumble';
        text = ("error");
    } else {
        text = ("critical");
        color = 'crit';
    }


    return { result: result, results: results, natural: natural, category: text, color: color }

}

MakeAvailableToParser("getMaxHealth", getMaxHealth);


function GetRollResult(thing, owner) {


    return getRollAndRollResults(thing, owner).result;

}
MakeAvailableToParser("GetRollResult", GetRollResult);


function GetRollCategory(thing, owner) {


    return getRollAndRollResults(thing, owner).category;

}
MakeAvailableToParser("GetRollCategory", GetRollCategory);



function GetRollResults(thing, owner) {


    return getRollAndRollResults(thing, owner).results;

}
MakeAvailableToParser("GetRollResults", GetRollResults);


function ptbaResult(nat, r, resultsTable) {

    console.log(resultsTable);
    console.log(resultsTable.Critical);
    if (nat == 2) return (resultsTable.fail);
    if (nat == 20) return (resultsTable.Critical ? resultsTable.success : resultsTable.Critical);
    if (r < 10) return (resultsTable.fail);
    if (r < 16) return (resultsTable.mixed);
    if (r < 23) return (resultsTable.success);
    return (resultsTable.Critical == "" ? resultsTable.success : resultsTable.Critical);
}

function GetRollTextResult(thing, owner) {

    let a = getRollAndRollResults(thing, owner);
    return ptbaResult(a.natural, a.result, thing.resultsTable)

}
MakeAvailableToParser("GetRollTextResult", GetRollTextResult);


function PTBAAbility(thing, stat, readonly) {
    if (!readonly)
        return Editable(thing, " thing.stats['" + stat + "'] ", "npcNum");
    else
        return '<div class="npcNum" >' + thing.stats[stat] + '</div >';
}

function PTBAAbilities(thing, readonly) {
    let answer = "";
    let keys = Object.keys(thing.stats);
    for (let i = 0; i < keys.length; i++) {
        answer += '<div class=outlined style = "font-weight: 700;font-size: 12px;display: inline-block">';
        answer += '<span>' + keys[i].toUpperCase() + '</span><br>';
        answer += '<div style="font-weight: 400; font-size: 12px;">';
        answer += PTBAAbility(thing, keys[i], readonly);
        answer += '</div>';
        answer += '</div>';
    }
    return answer;
}
MakeAvailableToParser('PTBAAbilities', PTBAAbilities);

function GetWeaponsList(thing) {
    let result = [];
    if (thing.items) for (let i = 0; i < thing.items.length; i++) {
        if (thing.items[i].page == "weapon") {
            result.push(thing.items[i].id);
            //  if (!item) console.log("Error fetching " + thing.items[i].id);
            //    if (item && item.equipped && item.armor && item.armor.value) {


        }
    }
    return result;

}

async function WeaponMoves(owner, weaponId) {

    if (!owner) return "";
    let equipped = await isEquipped(owner.id, weaponId);
    if (!equipped)
        return "";
    let answer = "";
    let weapon = await ensureThingLoaded(weaponId);

    if (weapon.weapon_modes)
        for (let m = 0; m < weapon.weapon_modes.length; m++) {
            if (isExpended(weaponId, m)) continue;

            let mode = weapon.weapon_modes[m];
            for (let k = 0; k < mode.move.length; k++) {
                // if (mode.range) answer += div(span("range ", mode.range));
                // if (mode.min_range) answer += div(span("minimum range ", mode.min_range));
                // if (mode.radius) answer += div(span("radius range ", mode.radius));
                // answer += mode.type + " " + (mode.hands > 1 ? " Two Handed " : "");
                let bonus = FindProficiencyBonus(owner, mode, mode.move[k]);
                for (let d = 0; d < mode.damage.length; d++) {
                    if (mode.damage) {
                        let damage = mode.damage[d];
                        answer += span("damage ", "", "italic") + damage.damage + "+" + bonus[0] + " " + damage.type + " " + damage.when + ". ";
                        bonus = 0;
                    } else if (mode.condition) {
                        let damage = mode.damage[d];
                        answer += span("condition", "", "italic") + damage.damage + " " + damage.type + " " + damage.when + ". ";
                    }
                }
            }
        }
    return div(answer, "centered");
}

MakeAvailableToParser('WeaponMoves', WeaponMoves);

async function WeaponParries(thing, weaponId) {


    let equipped = await isEquipped(thing.id, weaponId);
    if (!equipped) return "";

    let answer = "";
    let weapon = GetRegisteredThing(weaponId);

    let name = weapon.name;
    if (weapon.weapon_defenses)
        for (let m = 0; m < weapon.weapon_defenses.length; m++) {
            if (isExpended(weaponId, m)) continue;
            let mode = weapon.weapon_defenses[m];
            if (mode.move)
                for (let k = 0; k < mode.move.length; k++) {

                    // if (mode.range) answer += div(span("range ", mode.range));
                    // if (mode.min_range) answer += div(span("minimum range ", mode.min_range));
                    // if (mode.radius) answer += div(span("radius range ", mode.radius));
                    // answer += mode.type + " " + (mode.hands > 1 ? " Two Handed " : "");
                    let bonus = FindProficiencyBonus(thing, mode);


                    let stats = moves[mode.move[k]].stat;

                    for (let j = 0; j < stats.length; j++) {
                        let stat = stats[j];
                        answer += "<div>"
                        answer += CreateRollMoveStatString("greentintButton roundbutton ", '+',
                            mode.name, thing.id, stat, mode.move, bonus[1], 1, weaponId, "weapon_defenses", m);
                        answer += CreateRollMoveStatString("midtintButton", '<span class="superEmphasis">' + mode.name + '</span> ' + bonus[1] + "(" + bonus[0] + ") " + 'Rng(' + mode.range + ")" + "(" + stat + ")",
                            mode.name, thing.id, stat, mode.move, bonus[1], 0, weaponId, "weapon_defenses", m);
                        answer += CreateRollMoveStatString("redtintButton roundbutton ", '-',
                            mode.name, thing.id, stat, mode.move, bonus[1], -1, weaponId, "weapon_defenses", m);

                        answer += "</div>"

                    }
                }
        }
    return chkDiv(answer);
}


async function BackgroundButton(thing, window) {


    return await MakeDropDownWidget(" Choose Background", "background", thing);


}
MakeAvailableToParser('BackgroundButton', BackgroundButton);

async function PTBAMoves(thing) {
    let answer = "";
    let keys = Object.keys(moves);

    keys.sort(function (a, b) {

        let one = moves[a];
        let two = moves[b];

        if (one.action > two.action) return 1;
        if (one.action < two.action) return -1;
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;

    });
    let action = "";
    let once = false;
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (action != moves[key].action) {
            if (once) answer += "</div>";
            once = true;
            action = moves[key].action;
            answer += "<div><div class=\"npcheader\" >" + action + "</div>"

        }
        if (key == "Parry" || key == "OpporunityAttack") {

            let weapons = GetWeaponsList(thing);
            for (let w = 0; w < weapons.length; w++) {
                if (weapons[w]) {
                    let a = await WeaponParries(thing, weapons[w]);
                    answer += a;
                }
            }
        } else
            if (key == "Attack") {
                let weapons = GetWeaponsList(thing);
                for (let w = 0; w < weapons.length; w++) {
                    if (!weapons[w]) continue;
                    let a = await WeaponMoves(thing, weapons[w]);
                    answer += a;
                }
            } else {
                let bonus = GetProficiency(thing, key);
                let skill = bonus[1];
                for (let j = 0; j < moves[key].stat.length; j++) {
                    let stat = moves[key].stat[j];

                    answer += "<div class=\"padded\" >";

                    if (key == "Confront") {
                        console.log("jhj");
                    }


                    answer += CreateRollMoveStatString("greentintButton roundbutton ", '+',
                        moves[key].Comments ? moves[key].Comments : moves[key].tooltip, thing.id, stat, key, skill, 1);

                    answer += CreateRollMoveStatString("midtintButton ",
                        '<span class="superEmphasis">' + key + '</span> ' + stat + "(" + thing.stats[stat] + ") " + skill + '(' + bonus[0] + ")",
                        moves[key].Comments ? moves[key].Comments : moves[key].tooltip, thing.id, stat, key, skill, 0);
                    answer += CreateRollMoveStatString("redtintButton roundbutton ", '+',
                        moves[key].Comments ? moves[key].Comments : moves[key].tooltip, thing.id, stat, key, skill, -1);

                    chkDiv('<a href="#"> Info  ' +
                        '<div class="tooltipcontainer">' +
                        '<div class="tooltip moveright">'
                        + moves[key].tooltip
                        + '</div>  </div>  </a> ');

                    answer += '<a href="#"> Info  ' +
                        '<div class="tooltipcontainer">' +
                        '<div class="tooltip moveright">'
                        + moves[key].tooltip
                        + '</div>  </div>  </a>  </div>';


                }
            }
    }
    return (answer);
}
MakeAvailableToParser('PTBAMoves', PTBAMoves);

function PTBADefenses(thing) {
    let answer = "";
    let keys = Object.keys(moves);

    keys.sort();
    for (let i = 0; i < keys.length; i++) {
        let a = keys[i];
        if (a == "Attack") {
            let weapons = GetWeaponsList(thing);
            for (let w = 0; w < weapons.length; w++) {
                answer += WeaponParries(thing, weapons[w]);
            }

        }
    }
    let mv = "Dodge";
    let stat = "avoidance";

    let bonus = FindProficiencyBonus(thing, mv);

    answer += CreateRollMoveStatString("greentintButton roundbutton", "+", moves[mv].Comments ? moves[mv].Comments : moves[mv].tooltip, thing.id, stat, mv, bonus[1], 1);
    answer += CreateRollMoveStatString("midtintButton", "+ ", moves[mv].Comments ? moves[mv].Comments : moves[mv].tooltip, thing.id, stat, mv, bonus[1], 0);
    answer += CreateRollMoveStatString("redtintButton roundbutton", "-", moves[mv].Comments ? moves[mv].Comments : moves[mv].tooltip, thing.id, stat, mv, bonus[1], -1);



    return answer;
}
MakeAvailableToParser('PTBADefenses', PTBADefenses);



export function dragItems(thingDragged, evt) {

    if (!this.items)
        return;


    console.log(thingDragged);
    let id = this.id;
    socket.emit('addItem', {
        item: thingDragged,
        thing: id
    })
    // socket.emit('roll', {
    //     title: ' debug2',
    //     style: "dual",
    //     roll: "1d6"
    // });
}

function getModifiedManaCost(thing) {

    let a = Number(thing.BaseManaCost);
    if (!thing.owner_modified) return a;

    let numbers = Object.values(thing.owner_modified);
    for (let i = 0; i < numbers.length; i++) {
        a += numbers[i];
    }

    return a;

}
MakeAvailableToParser('getModifiedManaCost', getModifiedManaCost);

function AddDiceToExpression(damage, amt) {
    let pieces = damage.split("d");
    let dice = parseInt(pieces[0]);
    dice += amt;
    pieces[0] = dice;
    return pieces.join("d");
}

function GetModifiedDamageString(thing) {
    if (!thing.Damage) return "";
    if (thing.Damage.length > 0) {
        let answer = "";
        let intensity = (thing?.owner_modified?.Intensity);
        if (!intensity) intensity = 0;
        intensity = Number(intensity);

        for (let i = 0; i < thing.Damage.length; i++) {
            let a = AddDiceToExpression(thing.Damage[i].damage, intensity);
            a += " " + thing.Damage[i].type + ' ';
            if (thing.Damage[i].when) a += thing.Damage[i].when + " ";
            answer += a; function GetRollColor(thing, owner) {
            }
            return answer;
        }
    }
    return thing.Damage;
}
MakeAvailableToParser('GetModifiedDamageString', GetModifiedDamageString);



function SpellPowerOnOf(tag_thing, list) {

    for (let a = 0; a < tag_thing.powers.length; a++) {
        for (let b = 0; b < list.length; b++) {
            if (list[b] == tag_thing.powers[a]) return true;
        }
    }
    return false;
}
MakeAvailableToParser('SpellPowerOnOf', SpellPowerOnOf);

function GetSpellModifiedRangeString(thing) {

    if (!thing?.owner_modified?.Range) {
        return thing.Range;
    }
    let baseRange = 0;


    let r = thing.Range.substr(0, 2);
    if (!isNaN(r)) {
        r /= 10;
        baseRange = Math.log2(r);

        baseRange += thing.owner_modified.Range;

        if (baseRange < 0) return "Touch";
        return ((1 << r) * 10) + " yards";



    }
}

MakeAvailableToParser('GetSpellModifiedRangeString', GetSpellModifiedRangeString);

function SpellToolTip(thing, owner) {

    if (!owner) return "<div>";
    if (owner.openSpell == thing.name) {
        return '<div class = "tooltip_open" onmouseleave="hidebogusTooltip(this)">';
    }
    return '<div class = "tooltip" onmouseleave="hidebogusTooltip(this)">';

}
MakeAvailableToParser('SpellToolTip', SpellToolTip);

function DrawArrayEnhancementButtons(thing, owner, array) {

    if (!owner) return "";

    let s = "";
    if (!array) return s;
    for (let i = 0; i < array.length; i++) {
        let stat = array[i];
        s += '<button class="greentintButton roundbutton" onclick ="ChangeSpell(\'' + thing.id + '\',\'' + owner.id + '\',\'' + stat + '\',1)">'
            + "+" +
            "</button>";
        s += '<button class="midtintButton" onclick="ZeroSpell(\'' + thing.id + '\',\'' + owner.id + '\',\'' + stat + '\')">'
            + ' ' + (thing?.owner_modified[stat] ? "(" + thing.owner_modified[stat] + ") " : "") + stat +
            "</button>";
        s += '<button class="redtintButton roundbutton" onclick ="ChangeSpell(\'' + thing.id + '\',\'' + owner.id + '\',\'' + stat + '\',-1)">'
            + "-" +
            "</button>";
    }
    return s;

}

MakeAvailableToParser('DrawArrayEnhancementButtons', DrawArrayEnhancementButtons);

function ChangeSpell(thingId, ownerId, stat, amt) {
    let thing = GetRegisteredThing(thingId);

    let res = 0;
    if (!thing.owner_modifield) {
        let template = thing.origValue;
        thing.owner_modfied = template.owner_modified;

    }
    if (thing?.owner_modified[stat] != undefined) {
        res = thing.owner_modified[stat];
    }
    res += amt;
    thing.owner_modified[stat] = res;
    let evaluation = 'ensureExists(thing, template, "owner_modified") ; thing.owner_modified["' + stat + '"] =' + res;
    socket.emit('change', {
        change: evaluation,
        thing: thingId
    })
    let owner = GetRegisteredThing(ownerId);
    // hack around redrawing keeping the tooltip as open
    owner.openSpell = thing.name;
    // RedrawWindow(owner);
    // owner.openSpell = "";

}

MakeAvailableToHtml('ChangeSpell', ChangeSpell);

function ZeroSpell(thingId, ownerId, stat) {
    let thing = GetRegisteredThing(thingId);

    thing.owner_modified[stat] = 0;
    let evaluation = 'thing.owner_modified[' + stat + ']=0';
    socket.emit('change', {
        change: evaluation,
        thing: thingId
    })
    let owner = GetRegisteredThing(ownerId);
    // hack around redrawing keeping the tooltip as open
    owner.openSpell = thing.name;
    RedrawWindow(owner.registeredId)
    owner.openSpell = "";

}
MakeAvailableToHtml('ZeroSpell', ZeroSpell);


let maxExhaustion = 12;
function addMana(thingId, amt) {
    let thing = GetRegisteredThing(thingId);
    amt = Number(amt);
    let newMana = (Number(thing.counters.manaInAura.cur) + (amt));
    sendChat("Added " + amt + " mana   now " + newMana);
    socket.emit('change', {
        change: 'thing.counters.manaInAura.cur = ' + (newMana),
        thing: thingId
    });
}
function exhaust(thingId, amt) {
    socket.emit('change', {
        change: 'thing.counters.exhaustion = Number(thing.counters.exhaustion)+ Number(' + amt + ')',
        thing: thingId
    });
    let thing = GetRegisteredThing(thingId);

    switch (thing.counters.exhaustion.cur + amt) { // add since emit not processed yet

        default:
            sendChat("Exhaustion now " + (Number(thing.counters.exhaustion.cur) + Number(amt)));
            break;
        case 11:
            sendChat("You are exausted and have disadvantage on all actions");
            break;
        case 12:
            sendChat("You are fall unconcious");
            break;
        case 13:
            sendChat("You die");

    }

}

function addManaOncePerTurn(button, thingId) {
    addMana(thingId, 1);
    button.disabled = true; // not eorking
}
MakeAvailableToHtml('addManaOncePerTurn', addManaOncePerTurn);

function addManaExhaust(button, thingId) {
    let thing = GetRegisteredThing(thingId);
    if (thing.counters.exhaustion.cur <= maxExhaustion - 1) {
        exhaust(thingId, 1);

        addMana(thingId, 3);

    } else {

        sendChat("Too exhausted");
    }
}

MakeAvailableToHtml('addManaExhaust', addManaExhaust);




function changeAttackMode(thingId, toWhat) {

    socket.emit('change', {
        change: 'thing.attackOrAmbushResult = "' + toWhat + '"',
        thing: thingId
    });
}

function AttackOrAmbushButton(thing, owner) {
    if (thing.Move != "Attack or Ambush") return "";

    if (!thing.attackOrAmbushResult) {

        if (owner.stats.bravery > owner.stats.cunning) {
            thing.attackOrAmbushResult = "Attack";
        } else {
            thing.attackOrAmbushResult = "Ambush";
        }
        changeAttackMode(thing.id, thing.attackOrAmbushResult);
    }
    let attackChecked = "";
    let ambushChecked = "";
    if (thing.attackOrAmbushResult == "Attack") {
        attackChecked = 'checked="checked"';
    } else {
        ambushChecked = 'checked="checked"';

    }
    let id = thing.id + '_' + owner.id + '_attackOrAmbush';
    return '<input type="radio" id="' + id + '_attack" name="Attack_Mode' + id + '" value="Attack"' + attackChecked + 'onclick=htmlContext.changeAttackMode(thing.id,  "Attack")>' +
        '<label for="' + id + '_attack">Attack</label>  ' +
        '<input type="radio" id="id+ambush" name="Attack_Mode' + id + '" value="Ambush"' + ambushChecked + 'onclick=htmlContext.changeAttackMode(thing.id,  "Ambush")>' +
        '<label for="' + id + '_ambush">Ambush</label>';
}

MakeAvailableToHtml('AttackOrAmbushButton', AttackOrAmbushButton);


function FormatFeat(thing, owner) {

    let name = thing.name;
    let description = thing.description;
    let type = thing.type || "";
    let equipmentNeeded = thing.equipmentNeeded || "";
    let moves = thing.moves || [];
    let bonus = thing.bonus || "";
    let uses = "";
    let recovery = "";
    let usesUsed = "";
    let bonusAdvantage = thing.bonusAdvantage || "";

    if (thing.uses) {
        uses = thing.uses;
        usesUsed = thing.uses_used || 0;
        recovery = thing.recovery || "";

    }
    // if (complexBonuses) {
    //     moves = [];


    // }


    // build a safe HTML string showing only non-empty fields
    const esc = (s) => {
        if (s === null || s === undefined) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    };

    let parts = [];

    if (name) parts.push('<div><strong>Name:</strong> ' + esc(name) + '</div>');
    if (type) parts.push('<div><strong>Type:</strong> ' + esc(type) + '</div>');
    if (description) parts.push('<div><strong>Description:</strong> ' + esc(description) + '</div>');
    if (equipmentNeeded) parts.push('<div><strong>Equipment needed:</strong> ' + esc(equipmentNeeded) + '</div>');
    if (bonus) parts.push('<div><strong>Bonus:</strong> ' + esc(bonus) + '</div>');
    if (bonusAdvantage) parts.push('<div><strong>Bonus advantage:</strong> ' + esc(bonusAdvantage) + '</div>');

    if (uses || usesUsed || recovery) {
        let usesPart = '<div><strong>Uses:</strong> ' + (uses ? esc(uses) : '0');
        if (usesUsed !== "" && usesUsed !== undefined) usesPart += ' <em>(used: ' + esc(usesUsed) + ')</em>';
        if (recovery) usesPart += ' <span>Recovery: ' + esc(recovery) + '</span>';
        usesPart += '</div>';
        parts.push(usesPart);
    }

    if (Array.isArray(moves) && moves.length > 0) {
        // join moves by comma, skip empty strings
        const filtered = moves.filter(m => m !== null && m !== undefined && String(m).trim() !== "");
        if (filtered.length > 0) parts.push('<div><strong>Moves:</strong> ' + esc(filtered.join(', ')) + '</div>');
    }

    if (parts.length === 0) return '<div class="feat">No information</div>';

    return '<div class="feat">' + parts.join('') + '</div>';



}
MakeAvailableToParser('FormatFeat', FormatFeat);


function featTypeMatches(thing, type) {

    return (thing.type == type);
}
MakeAvailableToParser('featTypeMatches', featTypeMatches);
