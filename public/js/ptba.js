var moves = {
    "Confront": {
        "stat": [
            "bravery"
        ],
        "Comments": "<ul>\
        <li> &#x25BA;  Confronting your mother over whether you can stay out late, </li>\
        <li> &#x25BA;  Challenging a troll at a bridge, </li>\
        <li> &#x25BA;  Arguing with the King in his throne room, </li>\
        <li> &#x25BA;  fighting a horde of guards to let the party escape where you don't play out the rounds </li></ul>",
        "Critical": "You get your way, and things go your way ",
        "success": "You get your way",
        "mixed": "Inconclusive, or get your way but take some pain",
        "fail": "You definitely lose the confrontation, taking pain"
    },
    "Display of Might and Power": {
        "stat": [
            "bravery"
        ],
        "Comments": "Some actions which get you a bonus to your steel for this purpose  of intimidation: <ul>\
        <li> &#x25BA; A Mighty Name The character’s reputation alone is enough to make enemies hesitate</li>\
        <li> &#x25BA; Dead Man’s Stare The character brandishes the severed head of an enemy at arm’s length, raising the grim trophy high for all to see. This violent action, drenched in gore, deters all but the most hardened foes. For extra emphasis, the head can be dropped dramatically, cast away as refuse, or tossed into the hands of a hapless target. </li>\
        <li> &#x25BA; Flaming Brand Against  beasts, the threat of fire is something that inspires a primal dread. </li>\
        <li> &#x25BA; Impossible Feat of Might The character pulls out all the stops and overturns a massive statue or stone, or something similar,  sending it crashing to the ground</li>\
        <li> &#x25BA; Knife to the Throat A particularly intimate form of intimidation, holding a foe at the point or edge of a blade can cause them to swiftly capitulate</li>\
        <li> &#x25BA; Sorcerous Power The character’s flashy and  dark and unnatural arts is enough to terrify many foes</li>\
        <li> &#x25BA; Stain the Soil Red Following the death of several foes and the shedding of copious amounts of blood, the character lets out a savage, primordial cry</li>\
        <li> &#x25BA; Divine Power Against the superstitious and the extraplanar, the words of a priest can compel</li></ul>",
        "Critical": "",
        "success": "Foes are frightened may flee (Wis Save or Circumstances): take +1 forward on your rolls against them for the scene (not stacking),  keep the initiative",
        "mixed": "Foes are frightened: choose 1:<ul>\
        <li> &#x25BA; you keep the initiative</li>\
        <li> &#x25BA; take +1 forward on your rolls against them for the scene (not stacking)</li></ul>",
        "fail": "No or reverse effect and you lose the initiative"
    },
    "Attack": {
        "stat": [
            "bravery"
        ],
        "Comments": "Swing your weapon",
        "Critical": "You hit your foe, do double damage, and can choose 1:\
        <ul><li> &#x25BA; You hit him in a vulnerable spot. Add another x1 damage, and he is bleeding or stunned</li>\
        <li> &#x25BA; You can immediately act again, maybe attacking a different foed</li>\
        <li> &#x25BA; You are very strong. Add your Strength x4 more damage, foe is prone (Str Save), and get a free action (display of might and power) to intimidate all enemies</li></ul>",
        "success": "You hit your foe and do damage to him, and the DM will allow you to choose from 1 or 2 of these<ul><li> &#x25BA; Knock him back</li>\
        <li> &#x25BA; Make him prone (Str Save)</li><li> &#x25BA; Get +1 on your next roll</li>\
        <li> &#x25BA; Force him to retreat and you advance</li>\
        \<li> &#x25BA; Give your ally ( who is adjacent to the enemy)  initiative</li>\
        <li> &#x25BA; Retreat away after, free move</li></ul>",
        "mixed": ": You hit your foe, but lose the initiative",
        "fail": " You miss, lose the initiative, and GM can choose 1:\
        <ul>\
        <li> &#x25BA; Weapon entangled or stuck</li>\
        <li> &#x25BA; Foe retaliates </li>\
        <li> &#x25BA; lose some gear, perhaps it falls off</li>\
        <li> &#x25BA; 1d3 hexes in a bad direction</li>\
        <li> &#x25BA; Take -1 on your next roll</li></ul>"
    },
    "Wrestle (offense)": {
        "stat": [
            "bravery"
        ],
        "Comments": "Wrestle someone",
        "Critical": "You wrestle your foe and can choose 1:</li>\
        <li> &#x25BA; You injure him. Do 2 + your strength stat damage </li>\
        <li> &#x25BA; You can throw you foe at another, doing 1 damage to each and knocking both prone</li>\
        <li> &#x25BA; You have your foe helpless</li>\
        <li> &#x25BA; You disarm your foe</li>\
        <li> &#x25BA; You also keep the initiative and you can can keep the foe  wrestled unless you throw him",
        "success": "You wrestle your foe and choose two</li>\
        <li> &#x25BA; You disarm your foe</li>\
        <li> &#x25BA; You keep your foe wrestled</li>\
        <li> &#x25BA; You keep the initiative</li>\
        <li> &#x25BA; You add +2 on you next wrestling move  ",
        "mixed": "You wrestle  and choose one </li>\
        <li> &#x25BA; You disarm your foe</li>\
        <li> &#x25BA; You keep your foe wrestled</li>\
        <li> &#x25BA; You keep the initiative ",
        "fail": "You miss, lose the initiative, and are stabbed  or punched "
    },
    "Wrestle (defense)": {
        "stat": [
            "bravery",
            "avoidance"
        ],
        "Comments": "This move can only be used if you are already wrestling with your foe",
        "Critical": "Immediately get to use your wrestle on offense</li>\
        <li> &#x25BA; r get free with the initiative",
        "success": "Your foe misses and you get the initiative",
        "mixed": "You wrestle  but choose one</li>\
        <li> &#x25BA; Take some damage anyway (½)</li>\
        <li> &#x25BA; Don’t get the initiative</li>\
        <li> &#x25BA; End the grapple if the foe wishes</li>\
        <li> &#x25BA; You are knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs",
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
        "mixed": "You block your foe but you either<ul>\
        <li> &#x25BA; Take some damage anyway 1 pt</li>\
        <li> &#x25BA; Don’t get the initiative </li>\
        <li> &#x25BA; Your weapon, shield, or armor piece is damaged or knocked away</li>\
        <li> &#x25BA; you are knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs </li></ul>",
        "fail": " You are squarely hit, take damage,  definitely don’t get the initiative, and the GM is allowed to choose 1: <ul>\
        <li> &#x25BA; Your weapon, shield, or armor piece is damaged or knocked away</li>\
        <li> &#x25BA; you knocked prone or otherwise put into a bad position, or forced into bad terrain or off ledge or down some stairs </li></ul>"
    },
    "Avoid": {
        "stat": [
            "avoidance"
        ],
        "Comments": "Avoid is how to not get yourself into a confrontation.  When an NPC is attempting to confront you, you can Avoid.<ul>\
        <li> &#x25BA; You can avoid trouble by being submissive and accepting punishment, by lying about something, by misdirecting or confusing.</li>\
        <li> &#x25BA; You can avoid trouble with disguises or forged papers or bribes.</li>\
        <li> &#x25BA; You can avoid by hiding in advance, to avoid guards you could sneak around.</li>\
        <li> &#x25BA; You can also try to avoid danger by running pell mell from it. Running away is also an avoid roll.</li></ul>",
        "Critical": "",
        "success": "You avoid the problem or confrontation",
        "mixed": "you must drop something, lose something, take harm, or bear some other cost to avoid the confrontation, otherwise  you are confronted.",
        "fail": "You get contronted, and there is a chance the situation is worse because you tried to avoid it. "
    },
    "Dodge": {
        "stat": [
            "avoidance"
        ],
        "Comments": "This roll is used in more detailed combat to represent dodging an attack<ul\
        <li> &#x25BA; It can be difficult to dodge multiple, swarming opponents, or volleys of arrow fire, without running pell mell away… </li>\
        <li> &#x25BA; It can be easy to dodge missiles if you can get into cover</li></ul>",
        "Critical": "",
        "success": "You dodge your foe and gain the initiative and either<ul>\
        <li> &#x25BA;  Can move to a safer place, maybe outmanuevering chasing foes</li>\
        <li> &#x25BA;  Can set yourself up for a better attack +1 on attacking next</li></ul>",
        "mixed": "You dodge your foe  but choose 1:<ul>\
        <li> &#x25BA; Take half damage anyway</li>\
        <li> &#x25BA; Don’t get the initiative</li>\
        <li> &#x25BA; Your weapon is damaged or knocked away or dropped</li>\
        <li> &#x25BA; You are knocked prone or otherwise put into a bad position</li></ul>",
        "fail": "You are squarely hit, take damage, and perhaps the GM may add 1 of: Your weapon is damaged or knocked away or dropped</li>\
        <li> &#x25BA; You are knocked prone or otherwise put into a bad position"
    },
    "Bargain": {
        "stat": [
            "intelligence"
        ],
        "Comments": "Using logic, and pointing out the mutual benefits of a deal or alliance, on success, you can get agreement on an issue. The deal must really have benefits for the other party, be sure to point those out",
        "Critical": "You make the deal, it doesn't have to be that fair",
        "success": "You make the deal, it must be at least somewhat fair",
        "mixed": "You make the deal, but choose:<ul><li> &#x25BA; You must compromise a lot more than you hoped</li>\
        <li> &#x25BA; You are now in debt, maybe a lot of debt, owing a favor to the other</li>\
        <li> &#x25BA; The deal is shaky, and might break at any time</li></ul>",
        "fail": "You fail to make the deal. Maybe something bad happens. Did you insult them?"
    },
    "Investigate/Insight": {
        "stat": [
            "intelligence"
        ],
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
        <li> &#x25BA; What will make this person do what I say so I can get something?</li>\
        <li> &#x25BA; What is this creature’s weak point?</li>\
        <li> &#x25BA; How can this be dispelled?</li></ul>",
        "Critical": "",
        "success": "Ask 3 questions",
        "mixed": "Ask 1 question, or some sort of negative happens and you can ask 3 questions",
        "fail": "The GM has a long list of ways to twist the information he gives",
    },
    "Purchase": {
        "stat": [
            "intelligence"
        ],
        "Comments": "Downtime purchase of rare and unsual things, such as magic items, improved weapons, etc.",
        "Critical": "",
        "success": "You find the item for sale and can buy it for a reasonable sum",
        "mixed": " DM choose 1<ul>\
        <li> &#x25BA; the item is more expensive</li>\
        <li> &#x25BA; the item is not quite the one you wanted to buy</li>\
        <li> &#x25BA; the item has a hidden cost, like it is stolen, or cursed, or being pursued by enemies </li></ul>",
        "fail": "On a miss, maybe you can’t find the item, maybe you get into trouble, maybe you find it but it is more expensive, is not the one you wanted, and it is stolen, or cursed, or pursued."
    },
    "Spout Lore": {
        "stat": [
            "intelligence"
        ],
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
        "Comments": "It takes a few minutes at least to provide healing, unless provided by a spell of the first magnitude. After each wounding, 1 roll per character who tries to heal, unless a spelll. These do not stack, take the best. Heal also reduces the effect of an injury. Injuries commonly last until all harm is gone, and count as one extra harm you need to heal. Without healing it normally it takes 1 day to heal 1 harm, although infected wounds in bad conditions can get worse, 1 day for 1 harm.",
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
        "fail": "You cannot calm them, maybe you become upset too, or it becomes worse"
    },
    "Seduce/Flirt/Entertain": {
        "stat": [
            "allure"
        ],
        "Comments": "Person to person interaction",
        "Critical": "",
        "success": "You either entertain and charm someone which they will remember fondly, or get them to do something they later regret  (or not), and hold them distracted for a while",
        "mixed": "Choose 1: <ul>\
        <li> &#x25BA; You get them do do something but then must immediately confront them or their friends or husband</li>\
        <li> &#x25BA; You entertain and charm someone but they forget about it very quickly</li>\
        <li> &#x25BA; You entertain and charm someone but their friends have a bad opinion of you</li>\
        <li> &#x25BA; You distract them but they immediately become all alert after a minute</li></ul>",
        "fail": "A hit and a miss, the GM has all sorts of bad reactions from the other party"
    },
    "Performance": {
        "stat": [
            "allure"
        ],
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
        "Comments": "While a fearful person lies to avoid confrontation, and a lusty person lies to seduce, and a caring person makes white lies to make people feel better, a Wicked Lie is a con, a scam, a ‘Big Lie’. It can be brazen and completely unmoored from reality.</ul>\
        <li> &#x25BA; /li>\
        <li> &#x25BA; emember, not all lies are wicked lies. A person trying to avoid being identified by a guard can use Avoid to claim to be someone else. A seducer might lie and say that he loves his partner when he is motivated by lust. But only a wicked lie could be used to tell that guard you are an agent of the king and that he must follow along with you or have his head chopped off. Only a wicked lie could persuade the seduced person to give over her money and jewels to you for investment into a new overseas company with a “guarantee” of riches..</li></ul>",
        "Critical": "",
        "success": "people believe you and follow along.",
        "mixed": "GM choose 1:<ul>\
        <li> &#x25BA; People are skeptical, but are willing to entertain the idea</li>\
        <li> &#x25BA; they believe you but the reaction is not what you expected</li>\
        <li> &#x25BA; they will believe you if you do something or spend something to show your commitment</li>\
        <li> &#x25BA; they believe you if you show them some kind of evidence</li></ul>",
        "fail": "On a miss: they don't believe you. Maybe this has other consequences"
    },
    "Steal": {
        "stat": [
            "cunning"
        ],
        "Comments": "Stealing, pickpocketing, etc. Might not be possible in some circumstances without magic",
        "Critical": "",
        "success": "On a success, you palm or steal the item and are not noticed.",
        "mixed": "Choose 1:<ul>\
        <li> &#x25BA; You palm or steal the item but are confronted</li>\
        <li> &#x25BA; You are about to palm or steal the item but are confronted, but perhaps you can weasel your way out of it</li></ul>",
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
        "Critical": "You inflict great pain and suffering and have the option to get away (if that is feasible)",
        "success": "You inflict the pain and suffering and have the option to get away (if that is feasible)",
        "mixed": " you inflict the pain and suffering  but  (choose one)<ul>\
        <li> &#x25BA; You are now confronting the victim or his heirs or friends,</li>\
        <li> &#x25BA; You take stress (Exhaustion).</li></ul>",
        "fail": "On a failure you don’t inflict the pain and suffering, maybe you can’t bring yourself to do it, or perhaps you do it sloppily, or are exhausted by your actions. GM decides"
    },
    "Backstab": {
        "stat": [
            "cunning"
        ],
        "Comments": "The swing of a sword from behind with stealth. Note that it is difficult to backstab, unless you are entering the combat stealthily, or have been out of sight on the previous round. Then it might instead be easy.",
        "Critical": "Do +6 damage to him, stacks with assasin feats",
        "success": "You hit your foe and do +3 damage to him , (stacks with assassin feats), you have the initiative if engaged",
        "mixed": " You hit your foe and either (choose 1):<ul>\
        <li> &#x25BA; Do less damage (½)</li>\
        <li> &#x25BA; Lose the initiative</li>\
        <li> &#x25BA; Get your weapon entangled, lose some gear,  are knocked prone or otherwise put into a bad position</li>\
        <li> &#x25BA; Miss instead, since you decided to wait for a better time, stay hiding and not attack now, maybe you can try next turn</li></ul>",
        "fail": "On a failure you lose the initiative and probably draw the ire of the person you tried to backstab."
    },
    "Gossip": {
        "stat": [
            "cunning",
            "allure",
            "intelligence"
        ],
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


function FindBestCareerNode(owner, node) {

    let bonus = 0;
    let strbonus = 0;
    let career_string = "";
    if (!node.career) return [0, ""]; // old d7d armors

    for (let i = 0; i < owner.items.length; i++) {

        let item = owner.items[i];
        if (item.page == "careers") {
            let career = GetRegisteredThing(item.file).system;
            if (career.owner_level > bonus) {
                for (let cw = 0; cw < career.weapons.length; cw++) {
                    let career_wt = career.weapons[cw];
                    for (w2 = 0; w2 < node.career.length; w2++) {
                        if (career.name == node.career[w2] || career_wt == node.career[w2]) {
                            bonus = career.owner_level;
                            career_string = career.name;
                        }
                    }
                }
            }
            if (career.name == "Strength" && node.strAdd == true) {
                strbonus = career.owner_level;
            }
        }
    }
    return [bonus + strbonus, career_string];
}


function showWeaponModes(thing, owner) {
    let answer = "";
    if (!thing.weapon_modes) return answer;
    for (let i = 0; i < thing.weapon_modes.length; i++) {
        let mode = thing.weapon_modes[i];
        if (mode.range) answer += div(span("range ", mode.range));
        if (mode.min_range) answer += div(span("minimum range ", mode.min_range));
        if (mode.radius) answer += div(span("radius range ", mode.radius));
        answer += mode.type + " " + (mode.hands > 1 ? " Two Handed " : "");
        let bonus = FindBestCareerNode(owner, mode);
        for (let d = 0; d < mode.damage.length; d++) {
            if (mode.damage) {
                let damage = mode.damage[d];
                answer += "damage " + damage.damage + "+" + bonus[0] + " " + damage.type + " " + damage.when;
                bonus = 0;
            } else if (mode.condition) {
                let damage = mode.damage[d];
                answer += "condition " + damage.damage + " " + damage.type + " " + damage.when;
            }
        }
    }
    return div(answer);
}


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

    let steel = FindBestCareerNode(owner, armor);
    answer += div(span("Steel ", steel + ""));
    answer += div(span("Sacrifice", (armor.usedSacrifice ? armor.sacrifice - armor.usedSacrifice : armor.sacrifice) + "/" + armor.sacrifice));

    return div(answer);
}

// function validateCareer(thing, owner) {
//     if (!owner) return;

//     if (owner.chosen == undefined)
//         owner.chosen = {}
//     if (owner.chosen[thing.name] == undefined)
//         owner.chosen[thing.name] = { level: 0, featChosen: [] };

//     let career = owner.chosen[thing.name];

//     if (career.level < 0) career.level = 0;

//     if (career.level < career.featChosen.length) {
//         career.featChosen.length = career.level;
//     }

//     if (career.level > career.featChosen.length) {
//         console.log("Please choose more feats");
//     }
//     return career;

// }

function getLine(offset) {
    var stack = new Error().stack.split('\n'),
        line = stack[offset + 1].split(':');
    return parseInt(line[line.length - 2], 10);
}


function div(x, s) {
    if (s === undefined) { s = ""; }



    let divfront = x.toString().split("<div");;
    let divback = x.toString().split("</div>");;

    if (divfront?.length != divback?.length) {
        console.log("Error, div_front " + divfront?.length + " vs div_back " + divback?.length);
        return "Error  div_front + " + divfront?.length + " vs div_back " + divback?.length;;

    }

    return "<div " + s + ">" + x + "</div> ";
}

function chkDiv(x, s) {



    let divfront = x.toString().split("<div");;
    let divback = x.toString().split("</div>");;

    if (divfront?.length != divback?.length) {
        console.log("Error, div_front " + divfront?.length + " vs div_back " + divback?.length);
        return "Error  div_front + " + divfront?.length + " vs div_back " + divback?.length;;
    }

    return x;
}

function findInNamedArray(array, name) {

    if (name) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].name == name) {
                return array[i];
            }
        }
    }
    return undefined;
}

var missingImage = "images/questionMark.png";

function getAppearanceImage(thing, type) {

    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    if (!answer) return missingImage;
    answer = answer[type];
    if (!answer) return missingImage;
    return answer.image ? answer.image : missingImage;

}



function FetchStyleFromAppearanceArray(thing, type) {


    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    if (!answer) return "";
    answer = answer[type];
    if (!answer) return "";
    let parms = "";
    if (answer.rotation) {
        parms += ';transform:rotate(' + answer.rotation + 'deg)';

    }
    return parms;
}

function featclicked(cb) {
    console.log("Clicked, new value = " + cb.checked);
    console.log("thing = ", cb.dataset.thingid);
    console.log("cb = ", cb);

    socket.emit('change', {
        change: cb.dataset.clause + " = " + cb.checked,
        thing: cb.dataset.thingid
    });
}

function tabClass(isActive) {
    if (!isActive) {
        return 'class="tabcontent"';
    }

    return 'class="selectedtabcontent"';
}

function FindSubELementsByCLassName(element, className) {

    foundList = [];
    function recurse(element, className, foundList) {
        for (var i = 0; i < element.childNodes.length; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined ? el.className.split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    foundList.push(element.childNodes[i]);

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

    // Get all elements with class="tablinks" and remove the class "active"
    let tablinks =
        FindSubELementsByCLassName(sheet, "tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    evt.currentTarget.className += " active";
}

function featCheckBox(feats, i, thing, owner, checked, featSheet) {


    let clause = "thing.system.owner_featsChosen['" + feats[i] + "']"
    text = "<li> &#x25BA;"
    text += '<input id="' + feats[i] + '" type="checkbox" class="dropdown-check-list-ul-items-li"'
        + '"  data-owner="' + owner.id + '" '
        + '" data-clause="' + clause
        + '"  data-thingid="' + thing.id
        + '" ' + (checked ? " checked " : "")
        + ' onchange="featclicked(this);"'
        + ' /><label for="' + feats[i] + '"> <span class=npcBold>' +
        featSheet.name + ':</span>' + featSheet.system.description.value + '</li > ';

    return text;
}


function sumCareerFeats(thing) {


    let feats = thing.system.feats;

    if (!thing.system?.owner_featsChosen) return 0;
    let count = 0;

    for (let i = 0; i < feats.length; i++) {
        let name = "CompendiumFiles/" + feats[i];

        let checked = thing.system.owner_featsChosen[feats[i]];

        if (checked) count++;


    }
    return count;

}



function drawCareerFeats(thing, owner, notes) {
    let text = "";
    // let career = validateCareer(thing, owner);


    let feats = thing.system.feats;


    if (owner) {
        // text += div('<span class="npcBold">Level </span>' +
        //     Editable(thing, "thing.system.owner_level", "npcNum"));
        // text += div('<span class="npcBold">Career Points Spent </span>' +
        //     Editable(thing, "thing.system.owner_careerPointsSpent", "npcNum"));

        if (!notes) {
            text += div(span("Weapons", Editable(thing, "thing.system.weapons", ""))) +
                div(span("Tools", Editable(thing, "thing.system.tools", "")));
        } else {

            text += div(span("Weapons", thing.system.weapons, 'class="bold"')) +
                div(span("Tools", thing.system.tools, 'class="bold"'));

        }

        text += '<div id="list3" class="dropdown-check-list" tabindex="100">';

        text += '<ul class=" .dropdown-check-list-ul-item">';

        for (let i = 0; i < feats.length; i++) {
            let name = "CompendiumFiles/" + feats[i];

            let checked = thing.system.owner_featsChosen[feats[i]];

            if (notes && !checked) continue;

            let featSheet = GetRegisteredThing(name);

            text += featCheckBox(feats, i, thing, owner, checked, featSheet);

            // let clause = "thing.system.owner_featsChosen['" + feats[i] + "']"
            // text += '<li> &#x25BA; <input id="' + feats[i] + '" type="checkbox" class="dropdown-check-list-ul-items-li"' + '"  data-owner="' + owner.id + '" '
            //     + '" data-clause="' + clause + '"  data-thingid="' + thing.id + '" ' + (checked ? " checked " : "") +
            //     ' onchange="featclicked(this);" /><label for="' + feats[i] + '"> <span class=npcBold>' +
            //     featSheet.name + ':</span>' + featSheet.system.description.value + '</label></li > ';

        }
        text += '</ul> </div>';
        return text;
    }

    for (let i = 0; i < feats.length; i++) {

        if (owner && !thing.system.owner_featsChosen[feats[i]]) continue;

        let name = "CompendiumFiles/" + feats[i];
        text += "<div>";
        text += parseSheet(GetRegisteredThing(name), "itemSummary", owner);
        text += "</div>";


    }
    console.log(text); return text;
}


// Hide the popup menu when clicking anywhere in the document
document.addEventListener("mouseup", (event) => {
    const popupMenu = document.getElementById("popupMenu");
    if (popupMenu && event.target != popupMenu) {
        popupMenu.style.display = "none";
    }
});



// input is drag and drop file
async function UploadAppearanceArt(ev, which, id) {
    try {
        let url = new URL(window.location.href).origin + '/uploadFromButton';

        let file = ev.target.files[0];

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

        socket.emit("change_appearance", { thing: id, change: evaluation });

        return true;


    } catch (error) {
        console.error("Error:  file %o" + error, file);
        return false;
    }
}

function showPasteAndChoose(e, show, hide) {

    let toShow = document.getElementById(show);
    let toHide = document.getElementById(hide);

    toShow.style.visibility = "visible";
    toHide.style.visibility = "hidden";

}
function dropDownToggle(elem) {
    let toShow = document.getElementById(elem);
    if (toShow.style.visibility == "visible")
        toShow.style.visibility = "hidden";
    else {
        toShow.style.visibility = "visible";
        toShow.style.display = "block";

    }
}

function filterDropDown(input, dropdown) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(input);
    filter = input.value.toUpperCase();
    div = document.getElementById(dropdown);
    a = div.getElementsByTagName("p");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}

function ChangeW(e, show, hide) {

    let toShow = document.getElementById(show);
    let toHide = document.getElementById(hide);

    toShow.style.visibility = "visible";
    toHide.style.visibility = "hidden";

}

function showApperancePopUp(e, id) {

    const popupMenu = document.getElementById("popupMenu");
    const ul = popupMenu.children[0]; // todo change to id
    let thing = GetRegisteredThing(id);

    if (thing) {
        ul.replaceChildren();

        let li = document.createElement("li");
        li.appendChild(document.createTextNode("Edit " + thing.current_appearance));
        ul.appendChild(li);

        li.onclick = function () {
            showThing(id, "Appearance");
        }
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
                socket.emit("change_appearance", { thing: id, change: evaluation });

            }

        }

        popupMenu.style.display = "block";
        popupMenu.style.visibility = "visible";
        popupMenu.style.left = e.clientX + "px";
        popupMenu.style.top = e.clientY + "px";


    }

}

function drawCareerLevel(thing, owner, notes) {
    let text = "";
    // let career = validateCareer(thing, owner);





    if (owner && notes) {
        text += div('Career Points Spent ' +
            Editable(thing, "thing.system.owner_careerPointsSpent", "shortwidth coloring basicFont bodyText"), "basicFont coloring bodyText");

    } else if (owner) {
        text += div('<span class="basicFont npcBold bodyText">Level </span>' +
            Editable(thing, "thing.system.owner_level", "shortwidth coloring basicFont bodyText"));
        text += div('<span class="basicFont coloring bodyText">CP Spent </span>' +
            Editable(thing, "thing.system.owner_careerPointsSpent", "shortwidth coloring basicFont bodyText")
        );


    }
    text += "";
    return text;
}


var weaponProf = {
    Ambush: "Ambush, skilled in all weapons during a surprise attack, otherwise, daggers",
    TribalWeapons: "Your tribe's weapons,  also Unarmed combat.",
    Pirate: "Sword, Dagger, Slings, unarmed",
    Melee: "Melee Weapons, Lance, Shield, Armor, also unarmed Combat",
    Ranged: "Bow, dagger, spear",
    Gladiator: "Melee weapons, shield, exotic, impractical and exotic wepaons, Unarmed, theatrical wrestling",
    Immolator: "Conjured Fire",
    Strong: "unarmed, swung weapons, wrestling"

};


var itemTags = {
    Area: "It hits or effects everything in an area. ",
    Armor: "Provides a bonus to your react to harm roll ",
    Awkward: "It’s unwieldy and tough to wield or use appropriately. ",
    Clumsy: "It’s unwieldy to use. ",
    Dangerous: "Unsafe; take the proper precautions when using it or the GM may freely invoke the consequences on failed rolls",
    Distinctive: "It has an obvious and unique sound, appearance or impression when used. ",
    Fiery: "It painfully burns, sears, and causes things to catch fire. Hot to the touch. Inflicts Firey Damage. ",
    Forceful: "It inflicts powerful, crushing blows that knock targets back and down. ",
    Heavy: "It requires two hands to wield properly.",
    Infinite: "Too many to keep count. Throw one away, and you have another one.",
    Messy: "It harms foes in a particularly destructive way, ripping people and things apart.",
    Piercing: "Inflicts Piercing Damage ",
    Bludgeoning: "Inflicts Bludgeoning Damage",
    Slashing: "Inflicts Slashing Damage ",
    Silvered: "Hurts magical things too",
    Blessed: "Hurts magical things and does double damage versus fiends and undead",
    Reload: "You have to take time to reload it between uses",
    Slow_Reload: "It takes at least one round to reload, and you have to be still to relaod it",
    Slow: "It takes a while to use - at least a minute, if not more. ",
    Unbreakable: "It can’t be broken or destroyed by normal means. ",
    Valuable: "It’s worth Wealth to the right person. ",
    Vicious: "It harms foes in an especially cruel way, its wounds inflicting debilitating pain",
    Concealable: "Easily Concealable",
    Armor_Piercing: "Reduces Armor",
    Cheap: "May break",
    Weak: "Won't penetrate proper armor",
    LuckySave: "Once per game session can prevent all damage from one attack",
    Knockback: "May knock foes back"
}

var itemRanges = {
    Intimate: 0,
    Close: 1,
    Reach: 2,
    Near: 10,
    Far: 40
};

var weaponType = {
    backup: 0,
    sheathed: 1,
    longarm: 2
};

var weapons = [
    {
        name: "Punch", description: "Basic unarmed attack", type: ["Melee",], Ranges: ["Intimate"],
        cost: 0, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Bludgeoning, Weak", "Knockback"]
    },
    {
        name: "Ragged Bow", description: "Crappy bow useful for rabbit hunting", steel: -1, type: ["Ranged",], Ranges: ["Near"],
        cost: 15, Hands: 2, encumerance: "longarm", Damage: 1, tags: ["Piercing"]
    },
    {
        name: "Fine Bow", description: "Basic Military bow", type: ["Ranged",], Ranges: ["Near", "Far"],
        cost: 60, Hands: 2, encumerance: "longarm", Damage: 1, tags: ["Piercing"]
    },
    {
        name: "Elven Bow", description: "Elvish Bow, not comon", steel: 1, type: ["Ranged",], Ranges: ["Near", "Far"],
        cost: 300, Hands: 2, encumerance: "longarm", Damage: 1, tags: ["Piercing"]
    },
    {
        name: "Crossbow", description: "Advanced Prittanian Arm", steel: 1, type: ["Ranged",], Ranges: ["Near", "Far"],
        cost: 100, Hands: 2, encumerance: "longarm", Damage: 2, tags: ["Piercing", "Slow_Reload", "Armor_Piercing", "Vicious"]
    },
    {
        name: "Dwarven Crossbow", description: "Powerful Dwarven Crossbow. Awkward for non-dwarves to use", steel: +2, type: ["Ranged"], Ranges: ["Near", "Far"],
        cost: 300, Hands: 2, encumerance: "longarm", Damage: 2, tags: ["Piercing", "Slow_Reload", "Armor_Piercing", "Vicious"]
    },
    {
        name: "Club", description: "Basic Club", type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 1, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning", "Cheap"]
    },
    {
        name: "Metal Shod Club", description: "Basic Club", type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 10, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning"]
    },
    {
        name: "Staff", description: "Long piece of wood", type: ["Melee",], Ranges: ["Close"],
        cost: 1, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Bludgeoning", "Cheap"]
    },
    {
        name: "Dagger", description: "BIg Knife", steel: 1, type: ["Melee", "Ambush",], Ranges: ["Intimate"],
        cost: 2, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Piercing"]
    },
    {
        name: "Shiv", description: "Small Knife", type: ["Melee", "Ambush",], Ranges: ["Intimate"],
        cost: 1, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Piercing", "Concealable"]
    },
    {
        name: "Throwing Dagger", description: "Thrown dagger", type: ["Ranged",], Ranges: ["Near"],
        cost: 1, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Piercing"]
    },
    {
        name: "Spear", description: "One handed spear", type: ["Melee",], Ranges: ["Close", "Reach"],
        cost: 10, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Piercing"]
    },
    {
        name: "Pike", description: "Two handed spear", type: ["Melee",], Ranges: ["Reach"],
        cost: 10, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Piercing"]
    },
    {
        name: "Lance", description: "Spear on horseback. Knockbacks with horse charge and +1 damage, will break", type: ["Melee",], Ranges: ["Reach"],
        cost: 2, Hands: 1, encumerance: "longarm", Damage: 3, tags: ["Piercing", "Knockback"]
    },
    {
        name: "Longsword", description: "Military weapon", steel: +1, type: ["Melee",], Ranges: ["Close"],
        cost: 25, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
    },
    {
        name: "Shortsword", description: "Military weapon", type: ["Melee",], Ranges: ["Close", "Intimate"],
        cost: 10, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
    },
    {
        name: "Greatsword", description: "Military weapon", type: ["Melee",], Ranges: ["Close", "Reach"],
        cost: 150, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Slashing"]
    },
    {
        name: "Rapier", description: "Military weapon", type: ["Melee,Duelist",], Ranges: ["Close", "Reach"],
        cost: 60, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Piercing"]
    },
    {
        name: "Peasant Axe", description: "Axe for chopping wood", steel: -1, type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 15, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
    },
    {
        name: "BattleAxe", description: "Basic battle axe", steel: 1, type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 29, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Slashing"]
    },
    {
        name: "GreatAxe", description: "Big axe", steel: 1, type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 100, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Slashing"]
    },
    {
        name: "War Hammer", description: "Basic hammere", steel: 1, type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 20, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning"]
    },
    {
        name: "Whip", description: "Articulated Weapon", steel: 2, type: ["Exotic",], Ranges: ["Reach"],
        cost: 10, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
    },
    {
        name: "Whip of Pain", description: "Articulated Weapon", steel: 2, type: ["Exotic",], Ranges: ["Reach"],
        cost: 400, Hands: 1, encumerance: "sheathed", Damage: 3, tags: ["Slashing"]
    },
    {
        name: "Flail", description: "Articulated Weapon", steel: 2, type: ["Melee", "Swung",], Ranges: ["Close"],
        cost: 40, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning", "Awkward"]
    },
    {
        name: "Halberd", description: "Axe on stick", steel: 2, type: ["Melee", "Swung",], Ranges: ["Reach"],
        cost: 80, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Bludgeoning"]
    },
    {
        name: "Mace", description: "spiky club", steel: 1, type: ["Melee", "Swung",], Ranges: ["Reach"],
        cost: 20, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning"]
    },
    {
        name: "Maul", description: "Two handed club", steel: 1, type: ["Melee", "Swung",], Ranges: ["Reach"],
        cost: 80, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Bludgeoning"]
    },
    {
        name: "Magic Longsword", description: "Watery tarts hand these out in lakes", steel: 3, type: ["Melee",], Ranges: ["Close"],
        cost: 2500, Hands: 1, encumerance: "sheathed", Damage: 3, tags: ["Slashing", "Blessed"]
    },

];

var armor = [
    { name: "Light Armor", steel: 1, armor: 0, tags: [], cost: 50 },
    { name: "Medium Armor: like mail", steel: 2, armor: 1, tags: [], cost: 300 },
    { name: "Prittanian Plate", steel: 1, armor: 2, tags: ["Noisy",], cost: 1500 },
    { name: "Elven Mithril Undergarment", steel: 1, armor: 1, tags: ["Concealed", "LuckySave"], cost: 1000 },
    { name: "Scary Tribal Regalia", steel: 1, armor: 0, tags: [], cost: 50 },
    { name: "Dragon Scale Armor", steel: 3, armor: 2, tags: ["Immunity", "LuckySave"], cost: 5670 },
];


const baseDice = "2d10";

function rollptbadice(dice) {
    let rolls = []
    rolls.push(
        {
            title: dice,
            roll: dice,
        }
    ); socket.emit('rolls', rolls);
}

function selectLanguage(id, event, name) {
    let thing = GetRegisteredThing(id);
    let result = (event.currentTarget.checked ? true : false);
    eval('thing.languages["' + name + '"]' + ' = ' + result); socket.emit('change', {
        change: 'thing.languages["' + name + '"]' + ' = ' + result,
        thing: id
    })
};


function languagesButtons(thing) {
    let answer = ""; for (let i = 0; i < languages.length; i++) {
        let name = (languages[i]);
        answer += '<input type="checkbox" id="' + name + '" name="' + name + ((!!thing.languages[name]) ? '" checked="true"' : "") + '"' +
            ' onChange= "selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">'; answer += '<label for="' + name + '">' + name + '</label>'
    }
    for (let i = 0; i < tribal_languages.length; i++) {
        let name = (tribal_languages[i]);
        answer += '<input type="checkbox" id="' + name + '" name="' + name + ((!!thing.languages[name]) ? '" checked="true"' : "") + '"' +
            ' onChange= "selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">'; answer += '<label for="' + name + '">' + name + '</label>'
    }
    for (let i = 0; i < magic_languages.length; i++) {
        let name = (magic_languages[i]);
        answer += '<input type="checkbox" id="' + name + '" name="' + name + ((!!thing.languages[name]) ? '" checked="true"' : "") + '"' +
            ' onChange= "selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">'; answer += '<label for="' + name + '">' + name + '</label>'
    }
    return answer;
}


function rollMoveStat(ownerId, stat, mv, advantage, weapon_id, weapon_mode) {
    let owner = GetRegisteredThing(ownerId);
    let damage = []
    let bonus = owner.stats[stat];
    if (!weapon_id) {
        let weapon = GetRegisteredThing(weaponId);

        socket.emit('roll', {
            title: owner.name + '<ul><li>' + stat.toUpperCase() + "</li><li>" + mv + "</li></ul>",
            style: "dual-move",
            advantage: advantage,
            roll: baseDice + signed(bonus),
            resultsTable: moves[mv]
        });
    } else {
        let weapon = GetRegisteredThing(weapon_id);
        if (!weapon) throw ("err");
        let mode = weapon.weapon_modes[weapon_mode];
        socket.emit('roll', {
            title: owner.name + '<ul><li>' + stat.toUpperCase() + "</li><li>" + mv + ' ' + weapon.name + "</li></ul>",
            style: "dual-move",
            advantage: advantage,
            roll: baseDice + signed(bonus),
            damage: mode.damage,
            damage_bonus: FindBestCareerNode(owner, mode)[0],
            resultsTable: moves[mv]
        });


    }

}



function rollPTBAStat(ownerId, stat, isSave) {
    let owner = GetRegisteredThing(ownerId);
    let bonus = owner.stats[stat];
    socket.emit('roll', {
        title: owner.name + ' ' + stat.toUpperCase() + " Check ",
        style: "dual-move",
        roll: baseDice + signed(bonus),
        resultsTable: { Critical: "Crit", success: "Success", mixed: "Mixed", fail: "Failure" }
    });

}


function PTBAAbility(thing, stat) {
    let answer = Editable(thing, " thing.stats['" + stat + "'] ", "npcNum") +
        "<button onclick=\"rollPTBAStat('" + thing.id + "','" + stat + "', false)\">Check</button>";
    return answer;
}

function PTBAAbilities(thing) {
    let answer = "";
    let keys = Object.keys(thing.stats);
    for (let i = 0; i < keys.length; i++) {
        answer += '<div class=outlined style = "font-weight: 700;font-size: 12px;display: inline-block">';
        answer += '<span>' + keys[i].toUpperCase() + '</span><br>';
        answer += '<div style="font-weight: 400; font-size: 12px;">';
        answer += PTBAAbility(thing, keys[i]);
        answer += '</div>';
        answer += '</div>';
    }
    return answer;
}

function GetWeaponsList(thing) {
    let result = [];
    if (thing.items) for (let i = 0; i < thing.items.length; i++) {
        if (thing.items[i].page == "weapon") {
            result.push(thing.items[i].file);
            //  if (!item) console.log("Error fetching " + thing.items[i].file);
            //    if (item && item.system.equipped && item.system.armor && item.system.armor.value) {


        }
    }
    return result;

}

function PTBAMoves(thing) {
    let answer = "";
    let keys = Object.keys(moves);

    keys.sort();
    for (let i = 0; i < keys.length; i++) {
        a = keys[i];
        if (a == "Attack") {
            let weapons = GetWeaponsList(thing);
            for (let w = 0; w < weapons.length; w++) {
                let weapon = GetRegisteredThing(weapons[w]);
                let name = a + " " + weapon.name;
                if (weapon.weapon_modes)
                    for (let m = 0; m < weapon.weapon_modes.length; m++) {
                        let mode = weapon.weapon_modes[m];
                        // if (mode.range) answer += div(span("range ", mode.range));
                        // if (mode.min_range) answer += div(span("minimum range ", mode.min_range));
                        // if (mode.radius) answer += div(span("radius range ", mode.radius));
                        // answer += mode.type + " " + (mode.hands > 1 ? " Two Handed " : "");
                        let bonus = FindBestCareerNode(thing, mode);



                        for (let j = 0; j < moves[a].stat.length; j++) {
                            let stat = moves[a].stat[j];
                            answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',1,'" + weapons[w] + "'," + m + ")\">"
                                + "+" +
                                "</button>";
                            answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',0,'" + weapons[w] + "'," + m + ")\">"
                                + name + ' Steel(' + bonus[0] + ") " + 'r(' + mode.range + ")" + (moves[a].stat.length > 1 ? "(" + stat + ")" : "") +
                                "</button>";
                            answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',-1,'" + weapons[w] + "'," + m + ")\">"
                                + "-" +
                                "</button>";
                        }
                    }
            }

        } else
            for (let j = 0; j < moves[a].stat.length; j++) {
                let stat = moves[a].stat[j];
                answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',1)\">"
                    + "+" +
                    "</button>";
                answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',0)\">"
                    + a + (moves[a].stat.length > 1 ? "(" + stat + ")" : "") +
                    "</button>";
                answer += "<button  onclick=\"rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',-1)\">"
                    + "-" +
                    "</button>";
            }
    }
    return answer;
}


function dragCareersAndItems(thingDragged, evt) {

    if (!this.items)
        return;


    console.log(thingDragged);
    let id = this.id;
    socket.emit('addItem', {
        item: thingDragged,
        thing: id
    })
    socket.emit('roll', {
        title: ' debug2',
        style: "dual",
        roll: "1d6"
    });
}



