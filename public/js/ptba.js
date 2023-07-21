var moves = {
    "Confront": {
        "stat": [
            "bravery"
        ],
        "Comments": "• Confronting your mother over whether you can stay out late, • Challenging a troll at a bridge, • Arguing with the King in his throne room, • fighting a horde of guards to let the party escape where you don't play out the rounds",
        "Critical": "",
        "success": "You get your way",
        "mixed": "Inconclusive, or get your way but take some pain",
        "fail": "You are schooled"
    },
    "Display of Might and Power": {
        "stat": [
            "bravery"
        ],
        "Comments": "Some actions which get you a bonus to your steel for this purpose  of intimidation: \n•A Mighty Name The character’s reputation alone is enough to make enemies hesitate\n•Dead Man’s Stare The character brandishes the severed head of an enemy at arm’s length, raising the grim trophy high for all to see. This violent action, drenched in gore, deters all but the most hardened foes. For extra emphasis, the head can be dropped dramatically, cast away as refuse, or tossed into the hands of a hapless target. \n•Flaming Brand Against  beasts, the threat of fire is something that inspires a primal dread. \n•Impossible Feat of Might The character pulls out all the stops and overturns a massive statue or stone, or something similar,  sending it crashing to the ground\n•Knife to the Throat A particularly intimate form of intimidation, holding a foe at the point or edge of a blade can cause them to swiftly capitulate\n•Sorcerous Power The character’s flashy and  dark and unnatural arts is enough to terrify many foes\n•Stain the Soil Red Following the death of several foes and the shedding of copious amounts of blood, the character lets out a savage, primordial cry\n•Divine Power Against the superstitious and the extraplanar, the words of a priest can compel",
        "Critical": "",
        "success": "Your foes seriously consider surrendering or fleeing, take +1 forward on your rolls against them for the scene, you keep the initiative",
        "mixed": "Your foes may surrendering or fleeing, you keep the initiative, take +1 forward on your rolls against them for the scene",
        "fail": "You lose the initiative, perhaps the foes laugh, perhaps the foe gets enraged with a bonus to steel, in extreme cases you suffer some sort of mental break"
    },
    "Attack": {
        "stat": [
            "bravery"
        ],
        "Comments": "Swing your weapon",
        "Critical": " You hit your foe and can choose 1:\nYou hit him in a vulnerable spot. Add +2 damage, and he is bleeding or stunned\nYou can immediately act again, maybe attacking a different foe\nYou are very strong. Add your Strength stat directly as damage, and can immediately try to intimidate all enemies (See Display of Might and Power) without taking an action",
        "success": "You hit your foe and do damage to him, and the DM will allow you to choose from 1 or 2 of these\nKnock him back\nMake him prone\nGet +1 on your next roll\nForce him to retreat and you advance\nGive your ally ( who is adjacent to the enemy)  initiative\nRetreat away after",
        "mixed": ": You hit your foe, but lose the initiative, you have to go on defense next round. And the DM will present you with 1 to  3 of these and let you choose 1: \nDo less damage (½)\nGet your weapon entangled  or stuck (perhaps in an enemy)\nGet into a sword pressed into sword standoff like the movies. Say a few words, initiative is fluid and may depend on making a cunning roll.\n lose some gear, perhaps it falls off.\nare knocked prone or pushed otherwise into a bad position or terrain or down some stairs.. Perhaps you charged past the enemy down the stairs, or advanced while the enemy retreated and now they surround you\nTake -1 on your next roll\nAre counterattacked or fended off by a longer weapon taking damage yourself, first time only",
        "fail": " You miss, lose the initiative, and perhaps one or 2 more from Mixed"
    },
    "Wrestle (offense)": {
        "stat": [
            "bravery"
        ],
        "Comments": "Wrestle someone",
        "Critical": "You wrestle your foe and can choose 1:\n•You injure him. Do 2 + your strength stat damage \n•You can throw you foe at another, doing 1 damage to each and knocking both prone\n•You have your foe helpless\n•You disarm your foe\n•You also keep the initiative and you can can keep the foe  wrestled unless you throw him",
        "success": "You wrestle your foe and choose two\n•You disarm your foe\n•You keep your foe wrestled\n•You keep the initiative\n•You add +2 on you next wrestling move  ",
        "mixed": "You wrestle  and choose one \n•You disarm your foe\n•You keep your foe wrestled\n•You keep the initiative ",
        "fail": "You miss, lose the initiative, and are stabbed  or punched "
    },
    "Wrestle (defense)": {
        "stat": [
            "bravery",
            "avoidance"
        ],
        "Comments": "This move can only be used if you are already wrestling with your foe",
        "Critical": "Immediately get to use your wrestle on offense\nor get free with the initiative",
        "success": "Your foe misses and you get the initiative",
        "mixed": "You wrestle  but choose one\n•Take some damage anyway (½)\n•Don’t get the initiative\n•Lose your grapple\n•You are knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs",
        "fail": "You are squarely hit, take damage, lose the initiative, and the GM choose one from mixed."
    },
    "Parry": {
        "stat": [
            "bravery",
            "avoidance"
        ],
        "Comments": "Parry with weapon or shield",
        "Critical": "gain the initiative, block your foe, and counterattack: damage your foe.",
        "success": "You block your foe and gain the initiative",
        "mixed": "You block your foe but you either\n•Take some damage anyway (½)\n•Don’t get the initiative \n•Your weapon, shield, or armor piece is damaged or knocked away\n•you knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs",
        "fail": " You are squarely hit, take damage, and perhaps the GM chooses 1 from mixed. You definitely don’t get the initiative"
    },
    "Avoid": {
        "stat": [
            "avoidance"
        ],
        "Comments": "Avoid is how to not get yourself into a confrontation.  When an NPC is attempting to confront you, you can Avoid.\nYou can avoid trouble by being submissive and accepting punishment, by lying about something, by misdirecting or confusing.\nYou can avoid trouble with disguises or forged papers or bribes.\nYou can avoid by hiding in advance, to avoid guards you could sneak around.\nYou can also try to avoid danger by running pell mell from it. Running away is also an avoid roll.",
        "Critical": "",
        "success": "You avoid the problem or confrontation",
        "mixed": "you must drop something, lose something, take harm, or bear some other cost but can avoid the confrontation.\n",
        "fail": "You get contronted, "
    },
    "Dodge": {
        "stat": [
            "avoidance"
        ],
        "Comments": "This roll is used in more detailed combat to represent dodging an attack\n It can be difficult to dodge multiple, swarming opponents, or volleys of arrow fire, without running pell mell away… \n It can be easy to dodge missiles if you can get into cover",
        "Critical": "",
        "success": "You dodge your foe and gain the initiative and either\n• Can move to a safer place\n• Can set yourself up for a better attack +1 on attacking next",
        "mixed": "You dodge your foe  but (choose 1, GM  will offer 2 to choose between)\n•Take some damage anyway(½)\n•Don’t get the initiative (for combat system 2)\n•Your weapon is damaged or knocked away or dropped\n•You are knocked prone or otherwise put into a bad position",
        "fail": "You are squarely hit, take damage, and perhaps the GM chooses 1 from mixed"
    },
    "Bargain": {
        "stat": [
            "intelligence"
        ],
        "Comments": "Using logic, and pointing out the mutual benefits of a deal or alliance, on success, you can get agreement on an issue. The deal must really have benefits for the other party, be sure to point those out",
        "Critical": "You make the deal, it doesn't have to be that fair",
        "success": "You make the deal, it must be at least somewhat fair",
        "mixed": "You make the deal, but choose:You must compromise a lot more than you hoped\nYou are now in debt, maybe a lot of debt, owing a favor to the other\nThe deal is shaky, and might break at any time",
        "fail": "You fail to make the deal. Maybe something bad happens. Did you insult them?"
    },
    "Investigate/Insight": {
        "stat": [
            "intelligence"
        ],
        "Comments": "When you closely study something or someone, ask the GM questions. such as \n•What happened here recently?\n•What is about to happen?\n•What should I be on the lookout for?\n•Who’s really in control here?\n•What here is not what it appears to be?\n•What is the history of this place?\n•How do I operate this device?\n•What here is useful or valuable to me and why?\n•What here can be sold for money, and if so how much?\n•What secret thing can I spot that might open up more things?\n•Can this merchant be bargained down?\n•What does this person really want in exchange?\n•What will make this person do what I say so I can get something?\n•What is this creature’s weak point?\n•How can this be dispelled?",
        "Critical": "",
        "success": "Ask 3 questions",
        "mixed": "Ask 1 question, or some sort of negative happens and you can ask 3 questions",
        "fail": "On a miss  the DM may consider\n• Worse than it seemed: Tell an unwelcome truth.\n• Worse than you thought: Ask the question to the player, then craftily twist their answer.\n• Abyss gazes into you: While you try to read a person, they take notice of you.\n• Missed the obvious: While the character is looking for one thing, another one strikes.\n• Procrastinated: Character spent too much time thinking/looking instead of acting.\n• Got separated: character is not in the right place because of looking around.\n• Sticking your nose in: What is the character doing while investigating? That goes wrong. Put the character in a spot or use up their stuff.\n• Trouble you missed earlier: What could have gone wrong earlier and not been noticed until now? (e.g. you dropped something. Want to go back and get it?)\n• A pack of lies (obvious): Tell a lie and a player knows or suspects it—this one might as well just be a failure, but might be more interesting.\n• A pack of lies (infectious): Tell a lie and offer the PC xp if they act on it.\n• A pack of lies (devious): Tell something that actually deceives the players (hard to do)"
    },
    "Purchase": {
        "stat": [
            "intelligence"
        ],
        "Comments": "Downtime purchase of rare and unsual things, such as magic items, improved weapons, etc.",
        "Critical": "",
        "success": "you find the item for sale and can buy it for a reasonable sum",
        "mixed": " DM choose 1\nThe item is more expensive\nThe item is not quite the one you wanted to buy\nThe item has a hidden cost, like it is stolen, or cursed, or being pursued by enemies",
        "fail": "On a miss, maybe you can’t find the item, maybe you get into trouble, maybe you find it with all the mixed conditions."
    },
    "Spout Lore": {
        "stat": [
            "intelligence"
        ],
        "Comments": "When you search your memories and experiences or library for clues. The knowledge you get is like consulting a bestiary, travel guide, or library. You get facts about the subject matter. This is highly dependent on your careers ",
        "Critical": "",
        "success": "The GM will reveal something interesting and useful relevant to your situation. This might help you investigate further",
        "mixed": "GM will only tell you something interesting—it’s on you to make it useful. The GM might ask you “How do you know this?” Tell them the truth, now.",
        "fail": "On a low roll the DM may consider\n• Worse than it seemed: Tell an unwelcome truth.\n• Worse than you thought: Ask the question to the player, then craftily twist their\nanswer.\n• Abyss gazes into you: While you try to read a person, they take notice of you.\n• Missed the obvious: While the character is looking for one thing, another one strikes.\n• Procrastinated: The character spent too much time thinking/looking instead of acting.\n• Got separated: character is not in the right place because of looking around.\n• Sticking your nose in: What is the character doing while investigating? That goes\nwrong. Put the character in a spot or use up their stuff.\n• Trouble you missed earlier: What could have gone wrong earlier and not been\nnoticed until now? (e.g. you dropped something. Want to go back and get it?)\n• A pack of lies (obvious): Tell a lie which everyone thinks is true (The earth is flat!)  and a player knows or suspects it—this one might\nas well just be a failure, but might be more interesting.\n• A pack of lies (infectious): Tell a lie  which everyone thinks is true and offer the PC xp if they act on it.\n• A pack of lies (devious): Tell something  which everyone thinks is true that actually deceives the players (hard to\ndo)\n "
    },
    "Heal": {
        "stat": [
            "caring"
        ],
        "Comments": "It takes a few minutes at least to provide healing, unless provided by a spell of the first magnitude. After each wounding, 1 roll per character who tries to heal, unless a spelll. These do not stack, take the best. Heal also reduces the effect of an injury. Injuries commonly last until all harm is gone, and count as one extra harm you need to heal. Without healing it normally it takes 1 day to heal 1 harm, although infected wounds in bad conditions can get worse, 1 day for 1 harm. . ",
        "Critical": "",
        "success": "Heal 3 harm plus you can 3 harm per medicine or mom career point you spend.",
        "mixed": "Heal 1 harm plus 3 per medicine or mom career point you spend.",
        "fail": "if you don’t have medicine or other appropriate career , you make things worse cause 1 harm"
    },
    "Calm": {
        "stat": [
            "caring"
        ],
        "Comments": "Calm someone down",
        "Critical": "",
        "success": "You stop someone from freeking out",
        "mixed": "You stop someone from freaking out, but maybe after a second of him expressing it",
        "fail": ""
    },
    "Seduce/Flirt/Entertain": {
        "stat": [
            "allure"
        ],
        "Comments": "Person to person interaction",
        "Critical": "",
        "success": "You either entertain and charm someone which they will remember fondly, or get them to do something they later regret  (or not), and hold them distracted for a while",
        "mixed": "Choose 1: \n•You get them do do something but then must immediately confront them or their friends or husband\n•You entertain and charm someone but they forget about it very quickly\n•You entertain and charm someone but their friends have a bad opinion of you\n•You distract them but they immediately become all alert after a minute",
        "fail": ""
    },
    "Performance": {
        "stat": [
            "allure"
        ],
        "Comments": "Performance will often require a level of Bard/Dancing/Noble  career to match the difficulty. A Tavern is but 1, but a King’s palace is more difficult (3 or 4). This is used to determine if the roll is easy or difficult.  ",
        "Critical": "",
        "success": "you receive applause and rewards, and you leave the audience with a particular emotion and theme, like ‘The Heroes are Great’ or ‘The Emperor is Evil’, or you can get one particular  person in the audience to come up to talk to you with them being inclined to like you",
        "mixed": "choose 1:\n•Your performance is going well but you must confront a heckler\n•Half the audience is entertained, the other half is not\n•The audience misinterprets the emotion and theme\n•You can get the person to talk to you but he is not amused",
        "fail": "On a miss any number of things could happen. If you are highly skilled though, at least you don’t play badly. Perhaps a fight breaks out."
    },
    "Wicked Lie": {
        "stat": [
            "cunning"
        ],
        "Comments": "While a fearful person lies to avoid confrontation, and a lusty person lies to seduce, and a caring person makes white lies to make people feel better, a Wicked Lie is a con, a scam, a ‘Big Lie’. It can be brazen and completely unmoored from reality.\n\nRemember, not all lies are wicked lies. A person trying to avoid being identified by a guard can use Avoid to claim to be someone else. A seducer might lie and say that he loves his partner when he is motivated by lust. But only a wicked lie could be used to tell that guard you are an agent of the king and that he must follow along with you or have his head chopped off. Only a wicked lie could persuade the seduced person to give over her money and jewels to you for investment into a new overseas company with a “guarantee” of riches..\n",
        "Critical": "",
        "success": "people believe you and follow along.",
        "mixed": "GM choose 1 \npeople are skeptical, but are willing to entertain the idea\n •they believe you but the reaction is not what you expected\n •they will believe you if you do something or spend something to show your commitment\n •they believe you if you show them some kind of evidence",
        "fail": "On a miss: they don't believe you. Maybe this has other consequences"
    },
    "Steal": {
        "stat": [
            "cunning"
        ],
        "Comments": "Stealing, pickpocketing, etc. Might not be possible in some circumstances without magic",
        "Critical": "",
        "success": "On a success, you palm or steal the item and are not noticed.",
        "mixed": "Choose 1:\n•You palm or steal the item but are confronted\n•You are about to palm or steal the item but are confronted, but perhaps you can weasel your way out of it",
        "fail": " You are caught red handed without the item or the GM makes some other hard move"
    },
    "Scout": {
        "stat": [
            "cunning"
        ],
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
        "Comments": "When you describe a plan to inflict pain and suffering or harm on someone by surprise or by suddenly attacking, or executing a helpless person.  ",
        "Critical": "",
        "success": "  you inflict the pain and suffering and have the option to get away (if that is feasible)",
        "mixed": " you inflict the pain and suffering  but  (GM choose one)\nare now confronting the victim or his heirs or friends,\nyou take stress (Exhaustion).",
        "fail": "On a failure you don’t inflict the pain and suffering, maybe you can’t bring yourself to do it, or perhaps you do it sloppily. GM decides"
    },
    "Backstab": {
        "stat": [
            "cunning"
        ],
        "Comments": "This roll is used in more detailed combat to represent the swing of a sword from behind with advantage. Note that it is difficult to backstab, unless you are entering the combat stealthily, or have been out of sight on the previous round. Then it might instead be easy.",
        "Critical": "Do +3 damage to him, stacks with assasin feats",
        "success": "You hit your foe and do +2 damage to him , (stacks with assassin feats)",
        "mixed": " You hit your foe and either (choose 1)\nDo less damage (½)\nLose the initiative\nGet your weapon entangled, lose some gear,  are knocked prone or otherwise put into a bad position\nMiss instead, since you decided to stay hiding and not attack now, maybe you can try next turn",
        "fail": "On a failure you lose the initiative and probably draw the ire of the person you tried to backstab."
    },
    "Gossip": {
        "stat": [
            "cunning",
            "allure",
            "intelligence"
        ],
        "Comments": "When you chat with NPCs and ask questions, \n•What is ____ up to?\n•What are you most worried about?\n•What should I be on the lookout for?\n•Where can I find ____\n•Who’s really in control here?\n•What is not what it appears to be?\n•What is the history of this place?\n\nEither way, take +1 forward when acting on the answers.",
        "Critical": "",
        "success": "Ask 3 questions",
        "mixed": "Ask 1 question, or ask 3 and GM choose\n•People remember you are gossiping and what about \n•you get some false information \n•you insult someone or cause a scene.",
        "fail": ""
    },
    "Perilous Journey": {
        "stat": [
            "cunning",
            "intelligence",
            "avoidance"
        ],
        "Comments": "Describe how you proceed through the wilderness, and how you avoid danger. This can mean that almost any stat can be used, but probably not bravery. I.E. by careful planning you use Intelligence, with a sense of discretion use discretion, by cunning arts use cunning.. If just marching into the unknown and trying to use bravery you probably just automatically fail unless you have a narrative power.",
        "Critical": "",
        "success": "choose 3.\nYou don’t use too much food: Don’t  subtract from supplies or gain exhaustion for not eating\nYou find your way through the land to where you want to go\nYou don’t encounter evil denizens of the land\nYou find an adventure spot: i.e. https://www.roleplayingtips.com/campaigns/wilderness-encounter-ideas/\nYou meet a good denizen of the land who can assist you",
        "mixed": "choose 2.\nYou don’t use too much food: Don’t  subtract from  your supplies or gain exhaustion from not eating\nYou find your way through the land to where you want to go\nYou don’t encounter evil denizens of the land\nYou find an adventure spot: i.e. https://www.roleplayingtips.com/campaigns/wilderness-encounter-ideas/\nYou meet a good denizen of the land who can assist you",
        "fail": "You are thirsty, lost, encounter evil denizens of the land and GM choose 1:\nThe area you are in is interfering with your magic or technology\nTerrible weather\nOne of the players has gotten lost from the party due to stampedes or sandstorms or mudslides or astral mental interference, maybe play this out\nThe evil denizens of the land are out in force or better armed or more violent\nThe evil denizens of the land get the drop on you"
    }
};

var languages = [
    "Cheptian  (Tribal)",
    "Dwarvish",
    "Far Duric",
    "Firespeech (Magic)",
    "Frozen Cost(Tribal) ",
    "Giant",
    "High Elvish (Magic)",
    "Imperial, Court",
    "Imperial, Low",
    "Low Elvish",
    "Orlanthi (Tribal)",
    "Pavis (Tribal)",
    "Prittanian, High",
    "Prittanian, Low",
    "Ratling (Tribal)",
    "Trollish (Tribal) ",
    "Abyssal (magic)",
    "Arachnos (Magic) ",
    "BeastSpeech (Magic)",
    "Celestial (Magic)",
    "Ignos (Firespeech) (Magic)",
    "Pirate King(Magic) ",
    "Saurian (Magic) ",
    "Windsong (Magic)"
];

const baseDice = "2d10";

function rollptbadice(dice) {
    let rolls = []

    rolls.push(
        {
            title: dice,
            roll: dice,

        }
    );

    socket.emit('rolls', rolls);
}

function selectLanguage(id, event, name) {
    let thing = registeredThings[id];
    let result = (event.currentTarget.checked ? true : false);
    eval('thing.languages["' + name + '"]' + ' = ' + result);

    socket.emit('change', {
        change: 'thing.languages["' + name + '"]' + ' = ' + result,
        thing: id
    })
};


function languagesButtons(thing) {
    let answer = "";

    for (let i = 0; i < languages.length; i++) {
        let name = (languages[i]);
        answer += '<input type="checkbox" id="' + name + '" name ="' + name + ((!!thing.languages[name]) ? '" checked = "true"' : "") + '"' +
            ' onChange= "selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">';

        answer += '<label for="' + name + '">' + name + '</label>'
    }
    return answer;
}


function rollMoveStat(ownerId, stat, mv) {

    let owner = registeredThings[ownerId];


    let bonus = owner.stats[stat];



    socket.emit('roll', {
        title: owner.name + ' ' + stat.toUpperCase() + " " + "'" + mv + "'",
        style: "dual-move",
        roll: baseDice + signed(bonus)
    });

}



function rollPTBAStat(ownerId, stat, isSave) {

    let owner = registeredThings[ownerId];


    let bonus = owner.stats[stat];



    socket.emit('roll', {
        title: owner.name + ' ' + stat.toUpperCase() + " Check ",
        style: "dual-move",
        roll: baseDice + signed(bonus)
    });

}


function PTBAAbility(thing, stat) {
    let answer = Editable(thing, " thing.stats['" + stat + "'] ", "npcNum") +
        "<button  onclick=\"rollPTBAStat('" + thing.id + "','" + stat + "', false)\">Check</button>";
    return answer;
}

function PTBAAbilities(thing) {
    let answer = "";
    let keys = Object.keys(thing.stats);
    for (let i = 0; i < keys.length; i++) {
        answer += '<div class=outlined style = "font-weight: 700;display: inline-block">';
        answer += '<span>' + keys[i].toUpperCase() + '</span><br>';
        answer += '<div style="font-weight: 400; font-size: 15px;">';
        answer += PTBAAbility(thing, keys[i]);
        answer += '</div>';
        answer += '</div>';
    }
    return answer;
}

function PTBAMoves(thing) {



    let answer = "";
    let keys = Object.keys(moves);
    for (let i = 0; i < keys.length; i++) {
        a = keys[i];
        for (let j = 0; j < moves[a].stat.length; j++) {
            let stat = moves[a].stat[j];

            answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "')\">"
                + a + (moves[a].stat.length > 1 ? "(" + stat + ")" : "") +
                "</button>";
        }
    }
    return answer;
}






