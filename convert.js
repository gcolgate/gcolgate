const { Level } = require('level')
const fs = require('fs').promises;
const { type } = require('express/lib/response');
const rawfs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const sanitize = require('sanitize-filename');
const db = new Level('public/Compendium', { valueEncoding: 'json' })

const readline = require('readline');


const directory = "test";

function fileName(dir, type, name) {
    return dir + '_' + type + '_' + name;

}

function tagName(dir, type, name, tag) {
    let fname = fileName(dir, type, name);
    tag.id = fname;
    let key = 'tag_' + fname;
    return key;
}
let kAction = "action";
let kMaybeAction = "maybeAction";
let kReaction = "reaction";
let kTriggerdReaction = "triggeredReaction";
let kStat = "save";
let kScene = "rolePlay";
let kDowntime = "dpwmtime";



function WriteMovesFOrFountry() {


    for (const moveName in moves) {
        if (moves.hasOwnProperty(moveName)) {
            let move = moves[moveName];
            let json =
            {
                folder: "tpwn2RrtXZyM1eB3",
                name: moveName,
                type: "move",
                img: "icons/svg/aura.svg",
                system: {
                    description: move.Comments,
                    moveType: "basic",
                    rollFormula: "",
                    moveResults: {
                        failure: {
                            key: "system.moveResults.failure.value",
                            label: "Complications...",
                            value: move.fail
                        },
                        partial: {
                            key: "system.moveResults.partial.value",
                            label: "Partial success",
                            value: move.mixed
                        },
                        success: {
                            key: "system.moveResults.success.value",
                            label: "Success!",
                            value: move.success
                        },
                        critical: {
                            key: "system.moveResults.critical.value",
                            label: "Critical Success!",
                            value: move.Critical,
                        }
                    },
                    uses: 0,
                    rollType: move.stat[0],
                    rollMod: 0,
                    actorType: "character",
                    choices: ""
                },
                effects: [],
                flags: {},
                _stats: {
                    coreVersion: "13.346",
                    systemId: "pbta",
                    systemVersion: "1.1.21",
                    createdTime: 1755307139650,
                    modifiedTime: 1755307366332,
                    lastModifiedBy: "9dvwwv9FxL0Qoluj",
                    exportSource: {
                        worldId: "dw2",
                        uuid: "Item.gFVEeO9BE7K56lzb",
                        coreVersion: "13.346",
                        systemId: "pbta",
                        systemVersion: "1.1.21"
                    }
                }
            };
            // write out the json to a file
            const fileName = `move_${sanitize(moveName)}.json`;
            let outputDir = path.normalize(path.join(__dirname));

            const filePath = path.join(outputDir, fileName);
            fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8');
            console.log(`Move written to ${filePath}`);


        }

    }
}

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
        "tooltip": "When the DM calls for a stat check",
        "Comments": "When the DM calls for a stat check",

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

    "Visit a sorcerous library": {
        "stat": [
            "intelligence"
        ],
        "action": kDowntime,
        "tooltip": "When you visit the sorcerous library",
        "Comments": "If one is in this town, one can visit the sorcerous library. The best libraries have a difficulty of zero. ",
        "Critical": "You find the spell of your choice from those avbailable at the library, and another another ",
        "success": "You find the spell of the GM's choice from the list of those available at the library",
        "mixed": 'you find a spell, but  <a href="#">choose 1 \
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; IWt is a lessor version, that has a side effect whenever you cast it</li>\
                    <li> &#x25BA; It is far away from the library and you will need to convince the party to help you find it</li>\
                    <li> &#x25BA; An imp will trade you for it for a favor</li>\
                    <li> &#x25BA; You have to steal the book from the library (roll steal)</li>\
                    <li> &#x25BA; The book is locked and the you have to unlock it (roll devices)</li>\
                    <li> &#x25BA; The librarian says this spell is behind lock and key, convince him to see</li>\
                    <li> &#x25BA; The book is in a strange, unknown tounge</li>\
                </div >\
            </div ></a >',
        "fail": "Nothing good here. Perhaps you are kicked out of the library, perhaps you are banned from the library."
    },
    "Take mind altering drugs for visions of a spell": {
        "stat": [
            "will"
        ],
        "action": kDowntime,
        "tooltip": "A dangerous way to learn magic",
        "Comments": "A dangerous way to learn magic ",
        "Critical": "You find the spell of your choice, perhaps you learn another ",
        "success": "You find the spell of the GM's choice",
        "mixed": 'you find a spell, but  <a href="#">choose 1 \
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You immediately cast it uncontrolled and get a bad result on the t</li>\
                    <li> &#x25BA; You have to bargain with an astral gatekeepert</li>\
                    <li> &#x25BA; An imp will trade you for it for a favor</li>\
                    <li> &#x25BA; You have to avoid the evil inhabitants of the dreamland on a perilous journey</li>\
                    <li> &#x25BA; You get a level of chaos taint</li>\
                    <li> &#x25BA; The librarian says this spell is behind lock and key, convince him to see</li>\
                </div >\
            </div ></a >',
        "fail": "Nothing good here."
    },

    "Apprentice under a master": {
        "stat": [
            "cunning",
            "will",
            "intelligence"
        ],
        "action": kDowntime,
        "tooltip": "A way to raise your skill",
        "Comments": "A way to raise your skill, depending on the skill use a different stat. Your master has to have a higher skill than you",
        "Critical": "You raise your skill by 1 and can choose a feat, and impress your master greatly.",
        "success": "Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1 and choose a feat",
        "mixed": 'Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, choose a feat, and choose\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
                    <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
                    <li> &#x25BA; You relationship with the master is suffering, maybe you must quit</li>\
                    <li> &#x25BA; You do not get to check the skill you wasted time </li>\
                    <li> &#x25BA; You must pay something, like supplies or initiation fees </li> \
                     </ul>\
                </div >\
            </div ></a >',
        "fail": 'choose\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
                    <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
                    <li> &#x25BA; You relationship with the master is suffering, maybe you are terminated</li>\
                     <li> &#x25BA; You must pay something, like supplies or initiation fees to continue </li> \
                    </ul>\
                </div >\
                 </div ></a >',
    },

    "Work at a job": {
        "stat": [
            "strength",
            "cunning",
            "will",
            "intelligence"
        ],
        "action": kDowntime,
        "tooltip": "A way to raise your skill and earn a living",
        "Comments": "A way to raise your skill, depending on the skill use a different stat ",
        "Critical": "You raise your skill by 1 and can choose a feat, an earn double the normal amount you should get for this skill ",
        "success": "Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill",
        "mixed": 'Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill and choose\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; Financial Hardship: You do not earn money and have to dip into savings </li>\
                     <ul><li> &#x25BA; Your employer is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
                    <li> &#x25BA; Your employer (if any) has a quest for you, refuse and end the job </li>\
                    <li> &#x25BA; You relationship with the employer is suffering, maybe you must quit</li>\
                    <li> &#x25BA; You do not get to check the skill you wasted time </li>\
                    <li> &#x25BA; If your job is dangerous, you might have to save versus injury </li> \
                     </ul>\
                </div >\
            </div ></a >',
        "fail": 'choose\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
                    <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
                    <li> &#x25BA; You relationship with the master is suffering, maybe you are terminated</li>\
                     <li> &#x25BA; You must pay something, like supplies or initiation fees to continue </li> \
                    </ul>\
                </div >\
                 </div ></a >',
    },

    "Run a business": {
        "stat": [
            "cunning",
            "will",
            "intelligence"
        ],
        "action": kDowntime,
        "tooltip": "A way to raise your skill and earn a living",
        "Comments": "A way to raise your skill, depending on the skill use a different stat ",
        "Critical": "You raise your skill by 1 and can choose a feat, an earn double the normal amount you should get for this business ",
        "success": "Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill",
        "mixed": 'Check the skill, when the number of checks are equal to or greater than the skill, you raise it by 1, and earn the normal amount you should get for this skill and choose\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; Financial Hardship: You do not earn money and have to dip into savings </li>\
                     <ul><li> &#x25BA; Your business in trouble with a GM plot relevant problemd </li>\
                      <li> &#x25BA; You relationship with the employer is suffering, maybe you must quit</li>\
                    <li> &#x25BA; You do not get to check the skill you wasted time </li>\
                    <li> &#x25BA; If your job is dangerous, you might have to save versus injury </li> \
                     </ul>\
                </div >\
            </div ></a >',
        "fail": 'choose\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; Your master is in trouble with a GM plot relevant problem, maybe he is kidnapped </li>\
                    <li> &#x25BA; Your master has a quest for you, refuse and end the relationship </li>\
                    <li> &#x25BA; You relationship with the master is suffering, maybe you are terminated</li>\
                     <li> &#x25BA; You must pay something, like supplies or initiation fees to continue </li> \
                    </ul>\
                </div >\
                 </div ></a >',
    },


    "Meditate or pray for a spell": {
        "stat": [
            "will"
        ],
        "action": kDowntime,
        "tooltip": "A dangerous way to learn magic",
        "Comments": "A dangerous way to learn magic ",
        "Critical": "You find the spell of your choice, perhaps you learn another ",
        "success": "You find the spell of the GM's choice",
        "mixed": 'you find a spell, but  <a href="#">choose 1 \
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You immediately cast it uncontrolled and get a bad result on the t</li>\
                    <li> &#x25BA; You have to bargain with an astral gatekeepert</li>\
                    <li> &#x25BA; An imp will trade you for it for a favor</li>\
                    <li> &#x25BA; You have to avoid the evil inhabitants of the dreamland on a perilous journey</li>\
                    <li> &#x25BA; You get a level of chaos taint</li>\
                    <li> &#x25BA; The librarian says this spell is behind lock and key, convince him to see</li>\
                </div >\
            </div ></a >',
        "fail": "Nothing good here."
    },
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
        "Comments": "When you search your memories and experiences or library for clues. The knowledge you get is like consulting a bestiary, travel guide, or library. You get facts about the subject matter. This is highly dependent on your careers ",
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
        "fail": "if you don’t have medicine or other appropriate career , you make things worse cause damage or possible infection"
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
        "Comments": "Performance will often require a level of Bard/Dancing/Noble  career to match the difficulty. A Tavern is but 1, but a King’s palace is more difficult (3 or 4). This is used to determine if the roll is easy or difficult.  ",
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
        "fail": "You don't get much done, you are tired (exhausted), and should consider a new career"
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
        "fail": "You don't get much done, you are tired (exhausted), and should consider a new career"
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

    "Question": {
        "stat": [
            "cunning",
            "allure",
            "intelligence"
        ],
        "action": kScene,
        "tooltip": "Gossip:  When you seek information from questioning",
        "Comments": "</l>\
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
        <li> &#x25BA; The beings questioned are irritated with you </li>\
        <li> &#x25BA; you get some false information </li>\
        <li> &#x25BA; you insult someone or cause a scene.</li></ul>",
        "fail": "GM choose:<ul>\
        <li> &#x25BA; The beings are irritated with you and might cause you problems</li>\
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



async function main() {

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
            description: "Players  can take only actions OR reactions this next turn, monsters take disadvantage on attacks",
            stackable: "No",
        },
        Cowed: {
            name: "Cowed",
            description: "Players can take only  reactions this next turn, but get advantage on them, monstesr will not attack but get advantage on defense",
            stackable: "No",
            duration: "1 round",
            next: "Frightened",
        },
        Frightened: {
            name: "Frightned",
            description: "A frightened creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature can’t willingly move closer to the source of its fear.",
            next: "Routed",
        },
        Routed: {
            name: "Routed",
            description: "A Routed creature has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight. The creature must try to escape if possible.",
        },
        Burning: {
            name: "You are burning",
            description: "You must roll On Fire each turn until extinguished",
            duration: "Until fire is out",
            stackable: "Yes, adds damage"
        },
        Bleeding: {
            name: "Bleeding",
            description: "You lose 1 health each turn.",
            duration: "Until healed",
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
    var all_items = [

        {
            name: "Breastplate",
            description: "breast plate",
            img: "images/icons/equipment/chest/breastplate-cuirass-steel-grey.webp",
            slot: "armor",
            wealth: 3,
            price: 400,
            armor: {
                type: ["bludgeoning", "piercing", "slashing"],
                sacrifice: 1,
                bonus: 2,
                career: ["LightArmor", "HeavyArmor"],
            },
        },
        // {
        //     name: "Hoplite Armor",
        //     description: "Greek Armor",
        //     img: "",
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
            img: "",
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
            img: "",
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
            img: "",
            slot: "armor",
            wealth: 2,
            price: 5,
            armor: {
                type: ["bludgeoning", "piercing", "slashing"],
                sacrifice: 1,
                bonus: 1,
                career: ["LightArmor", "HeavyArmor"],
                movement: -1
            },
        },
        {
            name: "Leather Armor",
            description: "Leather Armor",
            img: "",
            slot: "armor",
            wealth: 2,
            price: 10,
            armor: {
                type: ["bludgeoning", "slashing"],
                sacrifice: 1,
                bonus: 1,
                career: ["LightArmor", "HeavyArmor"],
            },
        },
        {
            name: "Open Helmet",
            description: "Open faced helmet",
            img: "",
            slot: "head",
            wealth: 2,
            price: 50,
            armor: {
                type: ["bludgeoning", "slashing"],
                bonus: 1,
                sacrifice: 1,
                career: ["LightArmor", "HeavyArmor"],

            },
        },
        {
            name: "Closed Helmet",
            description: "Closed faced helmet",
            img: "",
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
            img: "",
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
            img: "",
            slot: "armor",
            wealth: 2,
            price: 20,
            weapon_defenses: [{
                name: "Large Shield Block",
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
                sacrifice: 2,
                movement: -1,
            },
        },
        /// end of armor
        /// start of wepaons
        {
            name: "Phalanx Spear",
            description: "Your classic spear",
            img: "images/icons/weapons/polearms/spear-flared-worn-grey.webp",
            slot: "longarm",
            wealth: 1,
            price: 2,
            weapon_defenses: [{
                name: "Quaterstaff(spear) Block",
                move: ["Parry"],
                range: 1,
                hands: 2,
                type: "Melee",
                career: ["Infantry", "Gladiator", "Brawling"],
            },
            {
                name: "Spear Opportunity Attack",
                range: 2,
                hands: 1,
                move: ["OpportunityAttack"],
                type: "Melee",
                damage: [{ damage: "2d8", type: "piercing", when: "" }],
                career: ["Martial"],
                wounding: "Long Piercing"
            }
            ],
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
            img: "images/icons/skills/melee/hand-grip-staff-blue.webp",
            slot: "longarm",
            wealth: 0,
            price: 0.5,
            weapon_defenses: [{
                name: "Quaterstaff Block",
                move: ["Parry"],
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
            img: "images/icons/weapons/polearm/halberd-crescent-glowing.webp",
            slot: "longarm",
            wealth: 3,
            price: 20,
            weapon_defenses: [{
                name: "Quaterstaff (Glaive) Block",
                move: ["Parry"],
                range: 1,
                hands: 2,
                type: "Melee",
                career: ["Martial", "Brawling"],
            }, {
                name: "Polearm Opportunity Attack",
                range: 2,
                min_range: 2,
                hands: 2,
                move: ["OpportunityAttack"],
                type: "Melee",
                damage: [{ damage: "2d10", type: "piercing or slashing", when: "" }],
                career: ["Martial"],
                wounding: "Polearm"
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
            img: "images/icons/weapons/polearms/spear-hooked-blue.webp",
            slot: "longarm",
            wealth: 1,
            price: 5,
            weapon_defenses: [{
                name: "Quaterstaff Block",
                move: ["Parry"],
                range: 1,
                hands: 2,
                type: "Melee",
                career: ["Martial", "Brawling"],
                wounding: "Light Bludgeon"
            }, {
                name: "Pike Opporunity Attack",
                range: 3,
                min_range: 2,
                hands: 2,
                move: ["OpportunityAttack"],
                type: "Melee",
                damage: [{ damage: "2d10", type: "piercing or slashing", when: "" }],
                career: ["Martial"],
                wounding: "Long Piercing"
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
            img: "images/icons/weapons/swords/sword-guard-brown.webp",
            slot: "sidearm",
            hands: 1,
            wealth: 3,
            price: 20,
            weapon_defenses: [{
                name: "Long Sword Parry",
                move: ["Parry"],
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
            img: "images/icons/weapons/polearms/halberd-curved-steel.webp",
            slot: "sidearm",
            price: 20,
            hands: 1,
            wealth: 3,
            weapon_defenses: [{
                name: "Battleaxe Parry",
                move: ["Parry"],
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
            img: "images/assets/srd5e/img/MM/Riding_Horse.png",
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
            img: "images/assets/srd5e/img/MM/Riding_Horse.png",
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
            img: "images/cutlass.jpg",
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
            }, {
                name: "Cutlass Opportunity Attack",
                range: 1,
                type: "Melee",
                hands: 1,
                move: ["OpportunityAttack"],
                damage: [{ damage: "2d6", type: "slashing", when: "" }],
                career: ["Martial", "Pirate"],
                wounding: "Light Cut"
            },],
            weapon_modes:
                [{
                    name: "Cutlass Slash",
                    range: 1,
                    type: "Melee",
                    hands: 1,
                    move: ["Attack", "Ambush"],
                    damage: [{ damage: "2d6", type: "slashing", when: "" }],
                    career: ["Martial", "Pirate"],
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
            img: "",
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
            img: "images/icons/weapons/clubs/club-simple-barbed.webp",
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
            img: "images/icons/weapons/maces/mace-spiked-steel-grey.webp",
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
            img: "images/icons/skills/melee/unarmed-punch-fist.webp",
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
            img: "images/icons/weapons/crossbows/crossbow-simple-brown.webp",
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
            img: "images/icons/weapons/crossbows/crossbow-blue.webp",
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
            img: "images/icons/weapons/bows/longbow-leather-green.webp",
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
            img: "images/icons/weapons/bows/longbow-recurve-leather-red.webp",
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
            img: "images/icons/weapons/bows/shortbow-recurve.webp",
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
            img: "images/icons/weapons/swords/Rapier.webp",
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
            img: "images/icons/weapons/swords/Rapier.webp",
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
            img: "images/icons/weapons/daggers/dagger-jeweled-purple.webp",
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
            img: "images/icons/weapons/axes/axe-broad-black.webp",
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
            img: "images/icons/weapons/polearms/javelin.webp",
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
            img: "images/icons/weapons/polearms/Kobold__knife.webp",
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
            img: "images/icons/weapons/polearms/ouroboros-flail.webp",
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
            img: "images/icons/weapons/polearms/Berserker Axe.jpg",
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
            img: "images/icons/weapons/polearms/Maul01_01_Regular_White_Thumb.webp",
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
            img: "images/icons/weapons/polearms/net.webp",
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
            img: "images/icons/weapons/polearms/GreatSword.webp",
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
            img: "images/icons/weapons/polearms/Wand of Fireballs.jpg",
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
            img: "images/icons/weapons/polearms/acid-flask.webp",
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
            img: "images/icons/weapons/polearms/bottled-sunlight.webp",
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
            img: "images/icons/weapons/polearms/blindpepper-bomb.webp",
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
            img: "images/icons/weapons/polearms/blindpepper-bomb.webp",
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
            img: "images/icons/weapons/polearms/blindpepper-bomb.webp",
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
            img: "images/icons/weapons/polearms/boomerang.webp",
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

    var feat_template = {

        name: "Feat Name",
        description: "Descriptions",
        type: "Type",
        activated: false,
        bonusType: "",
        bonus: 0,
        moves: [],
        NeedsActivation: false,
        uses: 0,
        recovery: "",
        complexBonuses: {},
        HinderedMoves: [],
        minus: 0,

    };


    var cut_feats = {


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
        Kata: {
            name: "Kata",
            description: "You dance in a spiritual way.  As you dance, spend a bonus action to gain 2 mana point you can immediately add to your aura (for use in spells)",
            type: "bonus action",
            stuff: "TODO",
        },
        McGuyver: {
            name: "McGuyver",
            description: "You can use your in a quick manner with improper tools, with an Effort point you can acheive unlikely results",
            type: "Skill",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
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
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Pack_Rat: {
            name: "Pack Rat",
            description: "Carry 50% more than normal",
            type: "equipment",
            stuff: "TODO",
        },
        Polytheist: {
            name: "Polytheist",
            description: "You can call upon other gods, not just your main god, this might help for gaining advantage on planar forces rolls. Still use one usage dice though.",
            stuff: "TODO",
        },
        Taboo: {
            name: "Taboo",
            description: "Pick 3 taboos, such as ‘eat no meat’, ‘never speak to a member of the opposite sex directly’, ‘fast while the sun is shining’, ‘never talk after darkness’. ‘Never ride a horse’  ‘always wear priestly vestments’,  ‘never wear armor, always wear a veil. While observing the taboo,  you get +1 rank on your usage dice, when you break it, get disadvantage until spiritually cured.",
            type: "TODO"
        },
        Wizard: {
            name: "Wizard",
            description: "You can learn spells outside your area of knowledge, and cast spells outside of your known area of magic, but must use Effort when you cast. You can also fuel your spells with any kind of mana when you do this.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",

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
        Fuel: {
            name: "Fuel",
            description: "Whenever you wound someone or they wound you gain 2 mana to your aura.",
            type: "Mystic",
            prerequisite: "Fire Magic",
        },
        Good_bedside_manner: {
            name: "Good Bedside Manner",
            description: "All your non magical healing are doubled",
            type: "Scene",
            moves: ["Heal"]

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
            activated: false,
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
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
        Devoted_Servant: {
            name: "Devoted Servant",
            description: "Create an adventurer companion, this can be an animal, or a person",
            stuff: "Character Setup"

        },
        Animal_Companion: {
            name: "Animal Companion",
            description: "Create an adventurer companion. Animal companions can choose from Beast, Stregnth, also Slave, perhaps Mother as their careers.",
            type: "Setup Character"
        },
        Lay_On_Hands: {
            name: "Lay On Hands",
            description: "to cast Heal Wounds (roll caring) with no Mana,  touch range, or get +1 to Heal Wounds Spell for 1 Effort",
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
                "Oath of Glory:  to reroll your or your ally's attack\n" +
                "Oath of Vengeance: Sped effort to reroll your or your ally's damage\n" +
                "Oath of Watchers: Allies nearby can get advantage to gaining initiative at the start of an encounter\n" +
                "Oath of the Open Sea: Allies and yourself  nearby can swim at +2 move and get advantage escaping from grapples",
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
        Human_Communication: {
            name: "Human Communication",
            description: "For Effort, ‘understand’ a human and communicate to him your intentions without any sort of roll",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
    }

    var feats_master_list = {

        HumanCompensation: {

            name: "Human Compensation",
            description: "Change one of your +0 stats to +1",
            type: "Setup Character",
            prerequisite: "Racial",

        },

        SunAllergy: {
            name: "Sun Allergy",
            description: "You don't like bright sun light and see in sunlight as if it were dim light",
            type: "Senses",
            prerequisite: "Racial",

        },

        BlindCombat: {
            name: "Blind Combat",
            description: "You are unaffected by vision when attacking in melee and don't get disadvantage in melee for darkness. This does not let you easily do other activities, just grappling and swinging weapons at targets.",
            type: "Senses",
            prerequisite: "Racial",
        },

        StarVision: {
            name: "Star Vision",
            description: "You can on clear starry nights, and dawn or dusk see as well as daytime. Cloudy nights or underground, you are as blind as a human. If the stars are obscured due to fires or nearby cities, you see as dim light",
            type: "Senses",
            prerequisite: "Racial",
        },
        DimVision: {
            name: "Dim Vision",
            description: "You can on see in dim light (such as the glowing caverns of Menzobarren) as if it were bright light. In the precense of close bright light, Dim Vision doesn't work though.",
            type: "Senses",
            prerequisite: "Racial",
        },
        DarkTravel: {
            name: "Dark Travel",
            description: "Although you can't see in the dark, you move surely at full speed, and will not collide with obstacles, fall into pits, as you can sense the presence of terrain naturally as if you can see in dim light",
            type: "Senses",
            prerequisite: "Racial",
        },
        AsssasinStrike: {
            name: "Asssasin Strike",
            description: "Do +5 damage to an on a surprise attack.",
            type: "Combat",
            activated: true,
            bonusType: "Damage",
            bonus: 5,
            moves: ["Ambush", "Backstab"],
            prerequsite: "Assassin",
        },
        Animal_Communication: {
            name: "Animal Communication",
            description: "'Understand’ an animal and communicate to him your intentions without any sort of roll. The animal might not be willing to help you or change their mind, but you can at least make your intentions known",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },

        Animal_Influence: {
            name: "Animal Influence",
            description: "'Automatically influence an animal.. Calm them, or make them back down due to your superior chest pounding, without any sort of roll",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Armor_Master: {
            name: "Armor Master",
            description: "+1 to resist damage when wearing heavy armor",
            type: "Combat",
            EquipmentNeeded: "Heavy Armor",
            activated: true,    // needs to be based onEquipment
            moves: ["ResistDamage"],
            bonus: 1,

        },
        Artifacts: {
            name: "Artifacts",
            description: "You know about magic items.",
            NeedsActivation: true,
            bonusType: "Advantage",
            moves: ["Spout Lore", "Insight", "Investigate"],
            type: "Knowledge",
        },
        Bardic_Lore: {
            name: "Bardic Lore",
            activated: false,
            description: "Remember a snatch of a song or history that exactly describes the riddle or problem",
            bonusType: "Advantage",
            moves: ["Spout Lore"],
            type: "Knowledge",
        },
        Berserk: {
            name: "Berserk",
            description: "Enter a rage, +1 forward on offense, -1 forward  on defense until you decide to stop raging or are defeated. Use refunded with roleplay",
            NeedsActivation: true,
            type: "Combat",
            uses: 1,
            recovery: "Short Rest",
            activated: false,
            moves: ["Attack", "Ambush", "Parry", "Dodge"],
            complexBonuses: {
                Attack: 1,
                Ambush: 1,
                Parry: -1,
                Dodge: -1
            },

            HinderedMoves: ["Parry", "Dodge"],
            minus: 1,

        },
        Climber: {
            name: "Climber",
            description: "Easily climb on rocks and trees and walls",
            type: "Movement",
            activated: false,
            bonusType: "Advantage",
            moves: ["Avoid", "Ambush", "Scout", "Dodge"],
        },
        Commune: {
            name: "Commune",
            description: "Talk to the local spirits of the land, and ask them questions",
            type: "Mystic",
            activated: false,
            bonusType: "Advantage",
            moves: ["Question"],
        },
        Crime_Lord: {
            name: "Crime Lord",
            description: "Knows everyone about crime in a particular city",
            type: "Knowledge",
            activated: false,
            bonusType: "Advantage",
            moves: ["Spout Lore", "Insight", "Investigate"],
        },

        Demonology_And_Cults: {
            name: "Demonology And Cults",
            description: "You have advantage on questions involving demonology and cults",
            type: "Knowledge",
            bonusType: "Advantage",
            activated: false,
            moves: ["Spout Lore", "Insight", "Investigate"],
        },
        Disguise_Master: {
            name: "Disguise Master",
            description: "Make a perfect disguise, or as good as you can with the materials at hand.",
            type: "Skill",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Dynasties: {
            name: "Dynasties",
            description: "You  have advantage on questions involving politics and history.",
            type: "Knowledge",
            activated: false,
            bonusType: "Advantage",
            type: "Scene",
        },
        Expert_Lockpick: {
            name: "Expert Lockpick",
            description: "to pick a lock without any sort of roll.",
            type: "Skill",
            NeedsActivation: true,
            moves: ["Devices"],
            uses: 1,
            recovery: "Short Rest",
        },
        Expert_Pickpocket: {
            name: "Expert Pickpocket",
            description: "to steal something without any sort of roll",
            type: "Skill",
            NeedsActivation: true,
            moves: ["Steal"],
            uses: 1,
            recovery: "Short Rest",
        },
        Extra: {
            name: "Extra",
            description: "to pull out a backup or extra gear from your pack that is not on your sheet",
            type: "Skill",
            NeedsActivation: true,
            uses: 1,
            recovery: "Short Rest",
        },
        God_Talker: {
            name: "God Talker",
            description: "When you visit a temple and pray, you can mystically communicate with your diety.   This will let you find out his/her/it’s will in order to gain favors from him/her/or it  for doing things. A person though who chose Dreams as a boon might be able to do this any time.",
            type: "Mystic",
            bonusType: "Advantage",
            moves: ["Question"],
        },
        Holdout_Weapon: {
            name: "Holdout Weapon",
            description: "conceal a small weapon (or other item) on your person in a way too offensive to consider",
            type: "Skill",
        },
        Home_Field_Advantage: {
            name: "Home Field Advantage",
            description: "in your home terrain (pick one, like the Swamps of the Dead, or the Mountains of Fear) you are never surprised , and in similar terrain you can travel through this kind of terrain easily without getting tired and can easily forage.",
            type: "Skill",
            bonusType: "Advantage",
            moves: ["Perilous Journey", "Scout", "Avoid"],
        },
        Imbue_Magic: {
            name: "Imbue Magic",
            type: "Mystic",
            description: "You can, at great expense, and time, and effort, make magical tools should you be proficient in an art.",
            type: "Downtime"
        },

        Magical_Performance: {
            name: "Magical Performance",
            description: " You can cast a spell subtly through your performance that only the most alert will notice, well, as long as the spell results aren’t obvious. to cast a spell by singing it.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Master_Acrobat: {
            name: "Master Acrobat",
            description: "to automatically make a difficult acrobatic move without a roll, or to get advantage on dodge",
            moves: ["Dodge"],
            type: "Combat",
            bonusType: "Advantage",
            activated: false,
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Master_Musician: {
            name: "Master Musician",
            description: "You are really good at your instrument. You could beat the devil in a fiddle duel. ",
            type: "Skill",
        },
        Master_of_Stealth: {
            name: "Master of Stealth",
            type: "Skill",
            description: "to sneak without any sort of roll, you can spend 1 additional use point for all your friends. Also applies to ‘scout’ rolls",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },

        Mercy: {
            name: "Mercy! Spare Me!",
            type: "Face",
            description: "to not be the target of a creature’s attack, lasts until you attack.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Mobile_Archer: {
            name: "Mobile Archer",
            description: "Can both move and shoot your bow. Normally all aimed bows and crossbows require you not to move on the turn you are shooting, this lets you skip that.",
            type: "Combat"
        },

        Musical_Virtuoso: {
            name: "Musical Virtuoso",
            description: "Be able to play any instrument well, even a klaathian nose flute",
            type: "Skill",
        },

        Poison_Master: {
            name: "Poison Master",
            description: "Each use spent after an attack deals an additional + 3 damage, or when introduced into drink can incapacitate or kill one individual. Brewing more poison for a bigger set of targets, like a garrison, requires being industrious and spending supplies and money.You can also spend supplies to get various poisons from the poison list.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Shopping",
            activated: false,
            moves: ["Attack", "Backstab"],
            bonusType: "Damage",
            bonus: 3,
            type: "Assassin"
        },

        Reflexes: {
            name: "Reflexes",
            description: "When surprised, you still get reactions",
            type: "Combat",
        },
        Religious_Lore: {
            name: "Religious Lore",
            description: "You have advantage on questions involving religions",
            bonusType: "Advantage",
            moves: ["Spout Lore", "Insight", "Investigate"],
            type: "Knowledge",
        },
        Ride_By: {
            name: "Ride By",
            description: "For Effort, gain an extra attack versus a new target that you are moving by",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            activated: false,
            moves: ["Attack"],
            EquipmentNeeded: "Mount",
            type: "Combat",

        },
        Scholars_Guild: {
            name: "Scholars Guild",
            description: "You have an official degree and title, and  know many other scholars. You can wear a special badge. You are automatically permitted access to every library, due to your status, and might receive an income.",
            type: "RolePlaying",
        },
        Noble: {
            name: "Noble",
            description: "You have a title, and a coat of arms, and a family estate. You might have an income, and you have servants. You can call upon your family for help, but they might not be willing to help you if you have shamed the family name. You are automatically permitted access to noble houses, due to your status.",
            type: "RolePlaying",
        },
        CultSecrets: {
            name: "CultSecrets",
            description: "You know the secrets of your religion, the hidden passages behind temple altars, the passwords to get into the chambers, the secrets kept by the masters. You may (with table approval) invent secret facts about your religion that give you advantages",
            type: "RolePlaying",
        },
        Shield_Master: {
            name: "Shield Master",
            EquipmentNeeded: "Shield",
            description: "+1 to resist damage when carrying a shield",
            activated: true,
            moves: ["ResistDamage"],
            bonus: 1,
            type: "Combat",
        },
        Show_Off: {
            name: "Show Off",
            description: "You can to reroll  a Challenge,Grisly Display,Fear my blade roll.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            activated: false,
            moves: ["Fear my blade", "Challenge", "Grisly Display", "Flaming Brand"],
            reroll: true,
            type: "Combat",

        },
        Sniper: {
            name: "Sniper",
            description: " to reroll a ranged attack roll when you have taken time to aim carefully.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            EquipmentNeeded: "Ranged Weapon",
            activated: false,
            moves: ["Attack"],
            reroll: true,
            type: "Combat",

        },
        Sorceror_Kings: {
            name: "Sorceror Kings",
            description: "You have advantage on questions involving the ancient sorceror kings",
            bonusType: "Advantage",
            moves: ["Spout Lore", "Insight", "Investigate"],
            type: "Knowledge",
        },
        Alchemist: {
            name: "Alchemist",
            description: "Drugs and alchemy and brewing craft specialty. You can get free healing poitions and other alchemical items to fill up your equipped slots when downtime",
            bonusType: "Advantage",
            moves: ["Spout Lore", "Insight", "Investigate"],
            type: "Occupation",
        },
        Cook: {
            name: "Cook",
            description: "Cooking and brewing craft specialty",
            type: "Occupation",
        },
        Jeweler: {
            name: "Jeweler",
            description: "Jewelry craft specialty",
            type: "Occupation",
        },
        Mason: {
            name: "Mason",
            description: "Buildlings craft specialty",
            type: "Occupation",

        },
        Tailor: {
            name: "Tailor",
            description: "Clothing craft specialty",
            type: "Occupation",

        },
        Weapon_Smith: {
            name: "Weapon Smith",
            description: "Weapons, armor, and metal objects craft specialty",
            type: "Occupation",

        },
        Spirited_Charge: {
            name: "Spirited Charge",
            description: "+2 to  damage in a charge",
            NeedsActivation: true,
            bonusType: "Damage",
            bonus: 2,
            type: "Combat",
        },
        Swift_Rider: {
            name: "Swift Rider",
            description: "+1 movement when riding",
            type: "Combat",

        },
        Swift: {
            name: "Swift",
            description: "+1 Movement on foot or swim",
            type: "Combat",

        },

        The_dance_of_the_seven_veils: {
            name: "The dance of the seven veils",
            description: "Your dancing can cause someone to desire you in an almost magical way. to reroll your seduction attempt.",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            activated: false,
            moves: ["Seduce/Flirt/Entertain"],
            reroll: true,
        },
        Trader: {
            name: "Trader",
            description: "You know everything about the values of things and where they can be sold, advantage on shopping",
            bonusType: "Advantage",
            moves: ["Shopping"],
            type: "Downtime",

        },
        Tree_bends_in_the_Wind: {
            name: "Tree bends in the Wind",
            description: "When dodging an enemy, you can use his own force against him, on success or mixed you can also  knock them prone, make them collide into each other, or crash into walls, within reason",
            moves: ["Dodge"],
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            type: "Combat",
        },
        Two_Weapon_Fighting: {
            name: "Two Weapon Fighting",
            description: "When fighting with two weapons you can make an additional attack with your off hand weapon, but you take -1 to parries and dodges. Only for attacks not ambushes.",
            moves: ["Attack"],
            HinderedMoves: ["Parry", "Dodge"],
            complexBonuses: {
                Attack: 0,
                Parry: -1,
                Dodge: -1
            },
            type: "Combat",

        },
        Vicious_Mockery: {
            name: "Vicious Mockery",
            description: "to insult another and make them enraged, they will be berserk and lose defense, as long as this makes sense",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            type: "Face",
        },
        Wasnt_Here: {
            name: "I Wasn't Here",
            description: "to opt out of a scene as long as you haven't acted in it yet",
            moves: ["Avoid"],
            activated: false,
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
            type: "Face",
        },

        Whip_Master: {
            name: "Whip Master",
            description: "You can attack at 2 hexes with a whip, disarming a foe on a success instead of damage, you can use the whip for swinging across chasms or putting out a candle or grabbing things. It doesn’t count as a reach weapon for defense against charges though.",
            moves: ["Attack"],
            type: "Combat",
        },
        Whirlwind: {
            name: "Whirlwind",
            description: "Spend one use,  attack all  adjacent targets, roll against each one  ",
            NeedsActivation: true,
            activated: false,
            moves: ["Attack"],
            uses: 3,
            recovery: "Short Rest",
            type: "Combat",
        },
        Wicked_Lie: {
            name: "Wicked Lie",
            description: "to reroll any deception attempt. Take the best roll.",
            NeedsActivation: true,
            activated: false,
            bonusType: "Advantage",
            moves: ["Wicked Lie", "Avoid"],
            uses: 3,
            recovery: "Short Rest",
            type: "Face",
        },

        Wrestler: {
            name: "Wrestler",
            description: "Add +1 to rolls involving wrestling",
            activated: true,
            moves: ["Wrestle", "Wrestle (defense)"],
            bonus: 1,
            type: "Combat",
        },
        Zealot: {
            name: "Zealot",
            description: "You have +1 on attacks when fighting infidels and supernatural evil",
            NeedsActivation: true,
            activated: false,
            type: "Combat",
            moves: ["Attack"],
            bonus: 1,
        },
        Familiar: {
            name: "Familiar",
            description: "You have a small inoffensive animal you can command mentally. You can possess this creature and see from it's eyes at will. You can only take actions as your familiar or yourself on any round",
            type: "Mystic",
        },


        Resist_Fire: {
            name: "Resist Fire",
            description: "Take -3 damage from fire, and don’t suffocate from smoke. If you are the recipeint of a Resist Fire spell, you are immune to fire.",
            activated: false,
            moves: ["ResistDamage"],
            NeedsActivation: true,
            bonus: -3,
            type: "Mystic",
            prerequisite: "Fire Magic",
        },
        By_Fire_Restored: {
            name: "By Fire Restored",
            description: "Heal all  health points if sleeping overnight near a large fire.",
            type: "Mystic",
            prerequisite: "Fire Magic",

        },

        Phalanx: {
            name: "Phalanx",
            description: "+1 on attacks on a reach defense versus charge. If you also have a shield, you can defend even though you used your reaction for a reach attack.",
            NeedsActivation: true,
            activated: false,
            moves: ["Attack"],
            bonus: 1,
            type: "Combat",
            EquipmentNeeded: "Polearm",
        },
        Artillery: {
            name: "Artillery",
            description: "You can operate artillery and catapults, and know about sieges.  ",
            type: "Scene",
            bonusAdvantage: "Advantage",
            moves: ["Artillery"],
            type: "Combat",
            EquipmentNeeded: "Artillery",
        },
        Tough: {
            name: "Tough",
            description: "Use effort to ignore the pain effect of a wound for a scene",
            NeedsActivation: true,
            activated: false,
            uses: 3,
            recovery: "Short Rest",
            moves: ["ResistDamage"],
        },
        Mobile_Archer: {
            name: "Mobile Archer",
            description: "You can both move and shoot, normally when shooting bows you forgo movement that turn",
            type: "Movement",
        },

        Master_Surgeon: {
            name: "Master Surgeon",
            description: "You can do surgery to remove limbs or organs, or to heal wounds (triple healing but bad if you roll a failure), or to implant things.s",
            type: "Occupation",
            moves: ["Heal"]
        },


        Exorcist: {
            name: "Exorcist",
            description: "You can  recognize and diagnose demonic possession and curses, and sometimes can cure it, or at least know what will cure it.",
            bonusAdvantage: "Advantage",
            moves: ["Heal", "Insight", "Investigate"],
            type: "Knowledge",
        },


        Great_Beauty: {
            name: "Great Beauty",
            description: "You are beautiful and desirable, and gain advantages when that matters",
            type: "Face",
        },
        Duelist: {
            name: "Duelist",
            description: "You are skilled with melee weapons, and can use a use (once per attack) to get +1 to damage with a light sword.",
            proficiencies: ["Light Sword", "Dagger"],
            uses: 3,
            recovery: "Short Rest",
            moves: ["Attack"],
            bonusType: "Damage",
            bonus: 1,
            type: "Combat",
        },




        Sail_Monkey: {
            name: "Sail Monkey",
            description: "Easily climb and swing from ropes and sails, keep to your feet in the roughest seas",
            type: "Movement",
            proficiencies: ["Sailor"],
        },
        Every_Port: {
            name: "Every Port",
            description: "Familiar with every port city in the Known World, you know the layout, the issues, the best taverns",
            type: "RolePlaying",
            proficiencies: ["Sailor"],
        },
        Fisherman: {
            name: "Fisherman",
            description: "Survive at sea, commune with the ocean spirits",
            proficiencies: ["Sailor"],

        },
        Sea_Captain: {
            name: "Sea Captain",
            description: "You have captained a ship and get the title, and can navigate. Describe your reputation for recruiting crew. In certain campaigns, you can have a ship.",
            type: "RolePlaying",
            proficiencies: ["Sailor"],
        },
        Diver: {
            name: "Diver",
            description: "Hold your breath and dive deep, swim at +2 speed",
            type: "Movement",
            proficiencies: ["Swimming"],

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
        },
        Unimportance: {
            name: "Unimportance, or someone else's problem",
            description: "Use a use not to be paid attention to during the scene as long as you don’t act up",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
        },
        Tracking_Scent: {
            name: "Tracking Scent",
            description: "Ability to track unerringly with your nose",
            type: "Scene",
        },

        Bodyguard: {
            name: "Bodyguard",
            description: "Bodyguard: for a usage out of sequence react to defend another person even if you have already used your turn",
            NeedsActivation: true,
            uses: 3,
            recovery: "Short Rest",
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

            json.attributes.hp.value = Math.trunc(json.attributes.hp.value / 2);
            json.attributes.hp.max = Math.trunc(json.attributes.hp.max / 2);
            delete json.attributes.hp.formula;
            let d = 0;
            switch (json.traits.size) {

                case "tiny": d = 0; break;
                case "med": d = 1; break;
                case "lg": d = 2; break;
                case "huge": d = 4; break;
                default: d = 8; break;
            }

            json.attributes.woundThreshold = d;
        }
        if (!isNaN(json?.attributes?.prof))
            json.steel = json?.attributes.prof - 1;
        if (json?.attributes?.attunement)
            delete json.attributes.attunement;
        return json;
    }

    // async function convertDnD5e() {

    //     //await fsExtra.emptyDir(path.join(__dirname, 'public', 'Compendium'));
    //     let dir = await fs.readdir(path.join(__dirname, 'public', 'toConvert')); //
    //     let counts = {};


    //     for (let i = 0; i < dir.length; i++) {

    //         let fname = path.join(__dirname, 'public', 'toConvert', dir[i]);

    //         let text = (await fs.readFile(fname)).toString();
    //         let level = 0;
    //         let inQuotes = false;
    //         let subfiles = [];
    //         let oneEntry = "";
    //         let quoted = "";
    //         let badNews = false;
    //         let test = false;
    //         for (let i = 0; i < text.length; i++) {
    //             oneEntry += text[i];
    //             if (!inQuotes) {
    //                 switch (text[i]) {
    //                     case '"': inQuotes = true; break;
    //                     case '{': level++; //console.log("up:" + level);

    //                         break;
    //                     case '}': level--;

    //                         if (level < 0) {
    //                             console.log("Error in conversion");
    //                             console.log(oneEntry);
    //                             return (-1);
    //                         }
    //                         if (level === 0) {

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
    //                 let json = JSON.parse(subfiles[fileIndex]);
    //                 if (!json.flags) { console.log("PRESKipping " + json.name); continue; }


    //                 let tagsSource = json.flags.plutonium;


    //                 if (tagsSource) {

    //                     if (json.type == "feat") { continue; };
    //                     if (tagsSource.page.startsWith("subclassFeature")) { continue; }
    //                     if (tagsSource.page.startsWith("classes")) { continue; };
    //                     if (tagsSource.page.startsWith("races")) { continue; };
    //                     if (tagsSource.page.startsWith("spell")) { continue; };
    //                     if (tagsSource.page.startsWith("classFeature")) { continue; };
    //                     if (tagsSource.page.startsWith("optionalFeatures")) { continue; };
    //                     if (tagsSource.page.startsWith("item")) { continue; };

    //                     if (!tagsSource.hash)
    //                         tagsSource.hash = uuidv4();


    //                     tagsSource.hash = cleanFileName(tagsSource.hash);
    //                     if (json.img != undefined) {
    //                         // todo: avoid token images
    //                         json.img = await processImage(json.img, tagsSource);
    //                     }

    //                     if (json?.prototypeToken) {


    //                         let t = json.prototypeToken;


    //                         let token = {};
    //                         if (t.texture.src != undefined) {
    //                             t.texture.src = await processImage(t.texture.src);
    //                             // todo auto make tokens from main image
    //                         }
    //                     }

    //                     let tokenImage = json?.prototypeToken?.texture?.src;

    //                     json.appearance = [];

    //                     json.appearance.push({

    //                         "name": "normal",
    //                         "portrait": {
    //                             "img": json.img,
    //                         },
    //                         "token": {
    //                             "img": tokenImage ? tokenImage : json.img,
    //                         },
    //                         "slots": {}
    //                     });

    //                     json.current_appearance = "normal";


    //                     json = CleanIt(json);


    //                     tagsSource.hash = cleanFileName(tagsSource.hash);

    //                     tagsSource.page = path.parse(tagsSource.page).name;

    //                     tagsSource.page = ComputePage(json, tagsSource.page);

    //                     tagsSource.image = json.img;
    //                     tagsSource.prototypeToken = json.protoTypeToken;
    //                     json.protoTypeToken = undefined;
    //                     let name = json.name;
    //                     if (json.requirements) {
    //                         name += " : " + json.requirements;
    //                     } else {
    //                         name += " (" + tagsSource.page + ")";
    //                     }
    //                     /// change to split items off, change to have sheets load items, so that items are not embedded

    //                     if (json.items) {
    //                         for (let i = 0; i < json.items.length; i++) {
    //                             let item = json.items[i];

    //                             if (item.img != undefined)
    //                                 item.img = processImage(item.img);

    //                             let tag = {
    //                                 source: item.source,
    //                                 droppable: item.propDroppable,
    //                                 type: item.type,
    //                                 name: item.name,
    //                                 img: item.img,
    //                             };

    //                             item = CleanIt(item);
    //                             item = convert_weapons(item);
    //                             item.tag = tag;

    //                             json.items[i] = item;

    //                         }
    //                     }

    //                     let tag = {
    //                         file: tagsSource.hash,
    //                         page: tagsSource.page,
    //                         source: tagsSource.source,
    //                         //droppable: tagsSource.propDroppable,
    //                         type: json.type,
    //                         name: json.name,
    //                         img: json.img,
    //                         prototypeToken: tagsSource.prototypeToken
    //                     };

    //                     CleanIt(json);
    //                     json = convert_weapons(json);
    //                     if (!json.name) json.name = tag.name;

    //                     if (counts[tagsSource.page] == undefined)
    //                         counts[tagsSource.page] = 0;
    //                     counts[tagsSource.page]++;

    //                     let key = tagsSource.hash;
    //                     db.put(tagName('Compendium', tag.type, key, tag), tag);
    //                     db.put(fileName('Compendium', tag.type, key), json);

    //                 };

    //             }
    //             //    catch (err) {
    //             //       console.error("error parsing json ( " + err + "+)");
    //             //   }
    //         }
    //         // let keys = Object.keys(counts);
    //         // for (let i = 0; i < keys.length; i++) {
    //         //     console.log(keys[i], counts[keys[i]]);
    //         //     // let outfile3 = path.join(pathy.join(__dirname, 'public', "artgenerator.json"));
    //         //     //  fs.writeFile(outfile3, JSON.stringify(artGeneratorFile));
    //         // }

    //     }
    // }





    function convertPTBA() {

        //  db.put("feat_template", feat_template);
        let feat_types = {}

        Object.keys(feats_master_list).forEach(function (key, index) {
            let feat = feats_master_list[key];
            let tag = {
                "id": key,
                "page": "feats",
                "source": "Gil",
                "type": "feat",
                "name": feat.name,
                "key": key,
                type: feat.type,
                "img": "images/careers/" + key + ".avif" /// need this
            };

            feat.key = key;
            feat.page = "feats";
            console.log(key);

            feat_types[feat.type] = 1;

            db.put(tagName('Compendium', 'feat', key, tag), tag);
            console.log("Writing feat" + fileName('Compendium', 'feat', key)
            );
            db.put(fileName('Compendium', 'feat', key), feat);


        });

        db.put(fileName('Compendium', 'all_feat_types', 'list'), feat_types);

        Object.keys(injuries).forEach(function (key, index) {
            let injury = injuries[key];
            let tag = {
                //"file": key,  Will be set when writing
                "page": "injuries",
                "source": "Gil",
                "type": "feat",
                "name": injury.name,
                "img": "images/injuries/" + key + ".jpg" /// need this
            };

            let item = injury;

            injury.img = "images/injuries/" + key + ".jpg" /// need this


            console.log(key);

            db.put(tagName('Compendium', 'injury', key, tag), tag);
            db.put(fileName('Compendium', 'injury', key), item);
        });

        Object.keys(conditions).forEach(function (key, index) {
            let condition = conditions[key];
            let tag = {
                //"file": key,  Will be set when writing
                "page": "conditions",
                "source": "Gil",
                "type": "feat",
                "name": condition.name,
                "img": "images/conditions/" + key + ".jpg" /// need this
            }; conditions

            let item = condition;

            condition.img = "images/conditions/" + key + ".jpg"; /// need this


            console.log(key);
            db.put(tagName('Compendium', 'condition', key, tag), tag);
            db.put(fileName('Compendium', 'condition', key), item);


        });

        // Object.keys(careers).forEach(function (key, index) {



        //     let career = careers[key];
        //     console.log(career);
        //     let tag = {
        //         "id": key,
        //         "page": "careers",
        //         "source": "Gil",
        //         "type": "careers",
        //         "name": career.name,
        //         "img": "images/careers/" + career + ".jpg" /// need this
        //     };

        //     career.owner_level = 0;
        //     career.owner_careerPointsSpent = 0;
        //     career.owner_featsChosen = {};

        //     let item = {
        //         name: career.name,
        //         type: "career",
        //         img: "images/careers/" + key + ".avif", /// need this
        //         page: "careers",
        //     };

        //     career.description = {
        //         value: " <div class=\"rd__b  rd__b--3\"><p>" +
        //             career.description + "</p></div>",
        //     };
        //     career.page = "careers";

        //     // convert these to include the type in the name of the feat
        //     for (let i = 0; i < career.feats.length; i++) {
        //         console.log("heu", feats_master_list[career.feats[i]]);
        //         career.feats[i] = 'Compendium_feat' + "_" + career.feats[i]; // did I realy want this?
        //     }
        //     console.log("Writing career", career);
        //     db.put(tagName('Compendium', tag.type, key, tag), tag);
        //     db.put(fileName('Compendium', tag.type, key), career);

        // });

        Object.keys(backgrounds).forEach(function (key, index) {

            // TODO: decorate the database key with the type

            let background = backgrounds[key];
            console.error("bp");
            console.error(key);
            console.error(background);
            let fullkey = "background_" + key;
            console.error(fullkey);
            let tag = {
                //"file": key,  Will be set when writing
                "page": "background",
                "source": "Gil",
                "name": background.name,
                "img": "images/backgrounds/" + key + ".jpg" /// need this
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
                type: "background",
                page: "background",
                img: "images/backgrounds/" + key + ".avif" /// need this
            };

            background.description =
                " <div class=\"rd__b  rd__b--3\"><p>" +
                background.description + "</p></div>";

            item = background;
            item.id = tag.id;
            item.page = "background";
            item.tye = "background";

            console.log("Writing career");


            item.tag = tag;

            db.put(tagName('Compendium', tag.type, key, tag), tag);
            db.put(fileName('Compendium', tag.type, key), item);
        });

        console.log(all_items);
        for (let i = 0; i < all_items.length; i++) {
            let item = all_items[i];

            let key = item.name.split(' ').join('_');
            console.log(item.name);
            let tag = {
                //"file": key,  Will be set when writing
                "page": "weapon",
                "source": "Gil",
                "type": "weapon",
                "name": item.name,
                "img": item.image, /// need this
                "price": item.price, /// need this
                "id": key
            };
            item.type = "weapon";
            item.page = "weapon";
            item.id = key;

            db.put(tagName('Compendium', tag.type, key, tag), tag);
            db.put(fileName('Compendium', tag.type, key), item);
            console.log("Writing item " + key + ' ' + item.name);
            console.log("Writing item ", item);

        }
    }
    // note, run convertDnD5e and do not translate feats
    //makeTrainingData();

    //    WriteMovesFOrFountry();

    convertPTBA();

    console.log(fileName('Compendium', 'all_feat_types', 'list'))
    for await (const [key, value] of db.iterator()) {
        if (String(key).includes("all_feat_types")) {
            console.log(key) // 2
            console.log(value) // 2
            console.log(Object.keys(value));
        }
    }
}

main().then(() => {
    console.log("Done");
}).catch((err) => {
    console.error(err);
});
