import { slotList } from './drag.js';
import { sendChat } from './chat.js';
import { RedrawWindow, GetRegisteredThing, signed, span, div, Editable, parseSheet, MakeAvailableToParser, MakeAvailableToPopup, MakeAvailableToHtml, windowSetElemVisible } from './characters.js'
import { socket } from './main.js';


export const moves = {
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
    "Extinguish Fire": {
        "stat": [
            "caring"
        ],
        "Comments": "<ul>\
        <li> &#x25BA;  When your friend is on fire </li>\
        <li> &#x25BA;  Note, doing things like jumping in a lake </li>\
        <li> &#x25BA;  will not require a roll. </li></li></ul>",
        "Critical": "The fire is out, and it takes you no time and will not affect initiative",
        "success": 'You get the fire out, but <a href="#">choose 1\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You lose the intiative</li>\
                    <li> &#x25BA; They take damage from the fire</li>\
                </div >\
            </div ></a >',
        "mixed": 'Choose <a href="#">you lose the initiative\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You get the intiative</li>\
                    <li> &#x25BA; They don\'t take damage from the fire</li>\
                    <li> &#x25BA; You get the fire out</li>\
                </div>\
            </div ></a>',
        "fail": "You lose the initiative and they take damage from the fire",
        "fumble": "You catch yourself on fire too."
    },
    "On Fire": {
        "stat": [
            "avoid", "caring"
        ],
        "Comments": "<ul>\
        <li> &#x25BA;  When you are on fire </li>\
        <li> &#x25BA;  Note, doing things like jumping in a lake </li>\
        <li> &#x25BA;  will not require a roll. </li></li></ul>",
        "Critical": "The fire is out, and it takes you no time and will not affect initiative",
        "success": 'You get the fire out, but <a href="#">choose 1\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You lose the intiative</li>\
                    <li> &#x25BA; You take damage from the fire</li>\
                </div >\
            </div ></a >',
        "mixed": 'Choose <a href="#">you lose the initiative\
                    <div class="tooltipcontainer">\
                    <div class="tooltip">\
                     <ul><li> &#x25BA; You get the intiative</li>\
                    <li> &#x25BA; You don\'t take damage from the fire</li>\
                    <li> &#x25BA; You get the fire out</li>\
                </div>\
            </div ></a>',
        "fail": "You lose the initiative and take damage from the fire",
        "fumble": "You spread the fire to a nearby object."
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
        "Critical": 'You hit your foe, do double damage,  :\
        <a href="#">and GM can choose 1 \
         <div class="tooltipcontainer">\
                <div class="tooltip">\
       <ul><li> &#x25BA; You hit him in a vulnerable spot. Add another x1 damage, and he is bleeding or stunned</li>\
        <li> &#x25BA; You can immediately act again, maybe attacking a different foed</li>\
        <li> &#x25BA; You are very strong. Add your Strength x4 more damage, foe is prone (Str Save), and get a free action (display of might and power) to intimidate all enemies</li></ul> \
        </div>\
        </div>\
        </a>',
        "success": 'You hit your foe and do damage to him, and the  \
         <a href="#">and GM can let you choose 1=2 of these \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
        <ul><li> &#x25BA; Knock him back</li>\
        <li> &#x25BA; Make him prone (Str Save)</li><li> &#x25BA; Get +1 on your next roll</li>\
        <li> &#x25BA; Force him to retreat and you advance</li>\
        \<li> &#x25BA; Give your ally ( who is adjacent to the enemy)  initiative</li>\
        <li> &#x25BA; Retreat away after, free move</li></ul> </ul>\
                 </div>\
            </div>\
            </a>',
        "mixed": ": You hit your foe, but lose the initiative",
        "fail": ' You miss, lose the initiative, \
        <a href="#">and GM can choose 1 \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
                <ul>\
                <li> &#x25BA; Weapon entangled or stuck</li>\
                <li> &#x25BA; Foe retaliates </li>\
                <li> &#x25BA; lose some gear, perhaps it falls off</li>\
                <li> &#x25BA; 1d3 hexes in a bad direction</li>\
                <li> &#x25BA; Take -1 on your next roll</li>\
                </ul>\
                 </div>\
            </div>\
            </a>',

    },
    "Artillery": {
        "stat": [
            "intelligence"
        ],
        "Comments": "Operate artillery",
        "Critical": 'You hit your target forcefully, Foes cannot avoid damage',
        "success": 'You hit your target. Those hit can reduce damage with Avoid/Dex saving throws',
        "mixed": 'You miss by 1d6 yards per 10 yards, in a random direction. All hit can make saving throws. Lose intiative',
        "fail": 'If using a spell, you release the mana in a random way. If using artillery, you are taking a long time to set up your shot. Lose the initiative and try again next time',


    },
    "Wrestle (offense)": {
        "stat": [
            "bravery"
        ],
        "Comments": "Wrestle someone",
        "Critical": 'You wrestle your foe  <a href="#">and you can choose 2 \
            <div class="tooltipcontainer">\
      <ul>\
        <li> &#x25BA; You injure him. Do 2 + your strength stat damage </li>\
        <li> &#x25BA; You can throw you foe at another, doing 1 damage to each and knocking both prone</li>\
        <li> &#x25BA; You have your foe helpless</li>\
        <li> &#x25BA; You disarm your foe</li>\
        <li> &#x25BA; You also keep the initiative and you can can keep the foe  wrestled unless you throw him</div>\
            </ul>\
            </div>\
            </a>',
        "success": 'You wrestle your foe   <a href="#">and you can choose 1 \
            <div class="tooltipcontainer">\
      <ul>\
        <li> &#x25BA; You disarm your foe</li>\
        <li> &#x25BA; You keep your foe wrestled</li>\
        <li> &#x25BA; You keep the initiative</li>\
        <li> &#x25BA; You add +2 on you next wrestling move  " </ul>\
            </div>\
            </a>',
        "mixed": 'You wrestle   <a href="#">and you  choose 1 \
            <div class="tooltipcontainer">\
      <ul>\ </li>\
        <li> &#x25BA; You disarm your foe</li>\
        <li> &#x25BA; You keep your foe wrestled</li>\
        <li> &#x25BA; You keep the initiative    </ul>\
                 </ul>\
            </div>\
            </a>',
        "fail": "You miss, lose the initiative, and are stabbed  or punched "
    },
    // bugs: attack grapple should be wrestle
    // defenses should be on stat page
    // metacurrency to combat swingyness
    // Multiple attacks and initiative
    // 
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
        "mixed": "You block your foe but you either don't gain the initiative or gm chooses:<ul>\
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
        "success": "Heal 3 harm plus if you have skill at Medecine or Mom, you can 3 harm per 1 Effort you spend.",
        "mixed": "Heal 1 harm plusif you have skill at Medecine or Mom,  3 per 1 Effort you spend.",
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
        "fail": "On a failure you lose the initiative and probably the ire of the person you tried to backstab."
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

function HasFeat(thingId, featName) {

    let owner = GetRegisteredThing(thingId);
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "careers") {
            let career = GetRegisteredThing(item.file);
            if (career.owner_featsChosen[featName]) {
                return true;
            }
        }
    }
    return false;
}

function getStrength(owner) {
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "careers") {
            let career = GetRegisteredThing(item.file);

            if (career.name == "Strength") {
                return Number(career.owner_level);
            }
        }
    }
    return 0;
}

function getMaxMageLevel(owner) {
    let answer = 0;
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "careers") {
            let career = GetRegisteredThing(item.file);

            if (career.mana) {
                answer = Math.max(Number(career.owner_level), answer);
            }
        }
    }
    return answer;
}
MakeAvailableToParser('getMaxMageLevel', getMaxMageLevel);

function getMaxHealth(owner) {
    return 6 + getStrength(owner);
}
MakeAvailableToHtml('getMaxHealth', getMaxHealth);


function isArmorProficient(owner_id, thingId) {

    let thing = GetRegisteredThing(thingId);
    if (!thing.armor) return false;

    let owner = GetRegisteredThing(owner_id);
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "careers") {

            for (let j = 0; j < thing.armor.career.length; j++) {
                if (thing.armor.career[j] == item.name) {
                    return true;
                }
            }
        }
    }
    return false;
}


function getArmor(owner, damageType) {

    let strbonus = getStrength(owner) - 1;
    let brave = Number(owner.stats.bravery);
    let bonus = Math.max(strbonus, brave);
    for (let i = 0; i < owner.items.length; i++) {
        let item = owner.items[i];
        if (item.page == "weapon" && isEquipped(owner.id, item.file)) {
            let weapon = GetRegisteredThing(item.file);
            if (!isNaN(weapon?.armor?.bonus) &&
                isArmorProficient(owner.id, item.file))
                bonus += weapon.armor.bonus;

        }

    }

    return bonus;
}

var takeDamageMove = {
    "stat": [
        "none"
    ],
    "Comments": "Resisting damage",
    "Critical": "You escape scott free!",
    "success": 'You are fine, but in the case of overwhelming attacks like a huge explosion or a giant’s club the GM might <a href="#">choose 1 \
         <div class="tooltipcontainer"> \
                <div class="tooltip"> \
                <ul> \
                  <li>● You lose your footing. </li> \
                  <li>● You lose your grip on whatever you’re holding. </li> \
                  <li>● You lose track of someone or something you’re attending to.  </li>\
                  <li>● You miss noticing something important.  </li>\
                  <li>● You take 1 wound.</li> \
                  <li>● You take a level of exhaustion.  </li>\
                 </ul> \
                 </div></div></a>',

    "mixed": 'Take one wound and <a href="#">choose 1 GM chooses 1: \
     <div class="tooltipcontainer">\
                <div class="tooltip">\
                 <ul> \
                    <li>● You lose your footing. </li> \
                    <li>● You lose your grip on whatever you’re holding.</li> \
                    <li>● You lose track of someone or something you’re attending to</li> \
                    <li>● You miss noticing something important.</li> \
                    <li>● You lose 1 more wound.</li>\
                    <li>● You take a level of exhaustion. \
                 </ul> \
                </div></div></a>',

    "fail": 'Take 2 wounds and the 1  <a href="#"> choose 1 GM chooses chooses 1 \
            <div class="tooltipcontainer">\
                <div class="tooltip">\
                 <ul> \
                    <li>● You’re out of action: unconscious, trapped, incoherent or panicked.</li> \
                    <li>● It’s worse than it seemed. Lose 2 more health. </li>\
                    <li>● You have an injury, like a hurt leg (slowed), bleeding (lose additional damage with a chance each round, \
                          each 6 for light bleeding or greater than 1 for heavy), a hurt arm (-1 with actions from that arm),\
                          partial blindness (-3 to steel, many actions become more difficult) Certain weapons get bonuses to some kinds of injuries, so if you get struck by those you might be in worse shape. \
                    <li>● You are stunned, for a moment you can’t do anything. </li>\
                 </ul> \
            </div></div></a>',
};

function takeDamageAmt(owner, damage, damageType, advantage) {

    let armor = getArmor(owner, damageType);
    let mod_damage = (-(damage - 3) + armor * 2) / 2;


    socket.emit('roll', {
        title: owner.name + "<ul><li> Resist Damage </li><li>" + damage + " armor " + armor + " mod " + mod_damage + "</li></ul>",
        style: "dual-move",
        advantage: advantage,
        roll: baseDice + (mod_damage >= 0 ? "+" + mod_damage : mod_damage),
        resultsTable: takeDamageMove
    });

}
function takeDamage(thingId) {

    let thing = GetRegisteredThing(thingId);
    let damage = prompt("Amount of Damage", "0");
    if (!isNaN(damage))
        takeDamageAmt(thing, damage);

}
MakeAvailableToParser("takeDamage", takeDamage);
MakeAvailableToHtml("takeDamage", takeDamage);

function FindBestCareerNode(owner, node) {

    let bonus = 0;
    let strbonus = 0;
    let career_string = "";
    if (!node.career) return [0, ""]; // old d7d armors

    for (let i = 0; i < owner.items.length; i++) {

        let item = owner.items[i];
        if (item.page == "careers") {
            let career = GetRegisteredThing(item.file);
            if (career.owner_level > bonus) {
                for (let cw = 0; cw < career.weapons.length; cw++) {
                    let career_wt = career.weapons[cw];
                    for (let w2 = 0; w2 < node.career.length; w2++) {
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
    return "";
    if (!thing.weapon_modes) return answer;
    for (let i = 0; i < thing.weapon_modes.length; i++) {
        let mode = thing.weapon_modes[i];
        for (let mv = 0; mv < mode.moves.length; mv++) {
            let move = mode.moves[mv];
            answer += span(mode.name + " " + moves[move].name, "", "bold") + ".  ";
            if (mode.range) answer += (span("range ", mode.range, "italic")) + ".  ";
            if (mode.min_range) answer += (span("minimum range ", mode.min_range, "italic")) + ".  ";
            if (mode.radius) answer += (span("radius range ", mode.radius, "italic")) + ".  ";
            answer += span(mode.type + " ", (mode.hands > 1 ? " Two Handed. " : ""), "italic");
            let bonus = FindBestCareerNode(owner, mode, move);
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
    return div(answer);
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

    let steel = FindBestCareerNode(owner, armor);
    answer += div(span("Steel ", steel + ""));
    answer += div(span("Sacrifice", (armor.usedSacrifice ? armor.sacrifice - armor.usedSacrifice : armor.sacrifice) + "/" + armor.sacrifice));

    return div(answer);
}
MakeAvailableToParser('showArmorBenefit', showArmorBenefit);

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

// function getLine(offset) {
//     var stack = new Error().stack.split('\n'),
//         line = stack[offset + 1].split(':');
//     return parseInt(line[line.length - 2], 10);
// }
// MakeAvailableToParser('getLine', getLine);





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

    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    if (!answer) return missingImage;
    answer = answer[type];
    if (!answer) return missingImage;
    return answer.image ? answer.image : missingImage;

}
MakeAvailableToParser('getAppearanceImage', getAppearanceImage);


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


        return item.image;
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
    console.log(thing);
    console.log(thing.slot);
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
    if (!thing.counters) return false;
    for (let i = 0; i < thing.counters.length; i++) {
        if (thing.counters[i].cur > 0) return false;
    }
    return true;
}

function isExpended(thingId, weaponMode) {
    let thing = GetRegisteredThing(thingId);
    if (!thing.counters) return false;

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
        change: 'thing.counters[ ' + weapon_mode + '].cur = ' + newUses,
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

function EquippedCheckBox(owner_id, thingId) {
    let e = isEquipped(owner_id, thingId);
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


function featCheckBox(feats, i, thing, owner, checked, featSheet) {


    let clause = "ensureExists(thing, 'owner_featsChosen'); thing.owner_featsChosen['" + feats[i] + "']"
    let text = "<li> &#x25BA;"
    text += '<input id="' + feats[i] + '" type="checkbox" class="dropdown-check-list-ul-items-li"'
        + '"  data-owner="' + owner.id + '" '
        + '" data-clause="' + clause
        + '"  data-thingid="' + thing.id
        + '" ' + (checked ? " checked " : "")
        + ' onchange="htmlContext.featclicked(this);"'
        + ' /><label for="' + feats[i] + '"> <span class=npcBold>' +
        featSheet.name + ':</span>' + featSheet.description.value + '</li > ';

    return text;
}

MakeAvailableToParser('featCheckBox', featCheckBox);

export function sumCareerFeats(thing) {


    let feats = thing.feats;

    if (!thing?.owner_featsChosen) return 0;
    let count = 0;

    for (let i = 0; i < feats.length; i++) {
        let name = "CompendiumFiles/" + feats[i];

        let checked = thing.owner_featsChosen[feats[i]];

        if (checked) count++;


    }
    return count;

}



function drawCareerFeats(thing, owner, notes) {
    let text = "";
    // let career = validateCareer(thing, owner);


    let feats = thing.feats;


    if (owner) {

        if (!notes) {
            text += div(span("Weapons", Editable(thing, "thing.weapons", ""))) +
                div(span("Tools", Editable(thing, "thing.tools", "")));
        } else {

            text += div(span("Weapons", thing.weapons, 'class="bold"')) +
                div(span("Tools", thing.tools, 'class="bold"'));

        }

        text += '<div id="list3" class="dropdown-check-list" tabindex="100">';

        text += '<ul class=" .dropdown-check-list-ul-item">';

        for (let i = 0; i < feats.length; i++) {
            let name = "CompendiumFiles/" + feats[i];

            let checked = thing.owner_featsChosen[feats[i]];

            if (notes && !checked) continue;

            let featSheet = GetRegisteredThing(name);

            text += featCheckBox(feats, i, thing, owner, checked, featSheet);

            // let clause = "thing.owner_featsChosen['" + feats[i] + "']"
            // text += '<li> &#x25BA; <input id="' + feats[i] + '" type="checkbox" class="dropdown-check-list-ul-items-li"' + '"  data-owner="' + owner.id + '" '
            //     + '" data-clause="' + clause + '"  data-thingid="' + thing.id + '" ' + (checked ? " checked " : "") +
            //     ' onchange="featclicked(this);" /><label for="' + feats[i] + '"> <span class=npcBold>' +
            //     featSheet.name + ':</span>' + featSheet.description.value + '</label></li > ';

        }
        text += '</ul> </div>';
        return text;
    }

    for (let i = 0; i < feats.length; i++) {

        if (owner && !thing.owner_featsChosen[feats[i]]) continue;

        let name = "CompendiumFiles/" + feats[i];
        text += "<div>";
        text += parseSheet(GetRegisteredThing(name), "itemSummary", owner);
        text += "</div>";


    }
    console.log(text); return text;
}

MakeAvailableToParser('drawCareerFeats', drawCareerFeats);

// Hide the popup menu when clicking anywhere in the document
document.addEventListener("mouseup", (event) => {
    const popupMenu = document.getElementById("popupMenu");
    if (popupMenu && event.target != popupMenu) {
        popupMenu.style.display = "none";
    }
});



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

function dropDownToggle(elemId, doc) {

    let toShow = doc.getElementById(elemId);
    if (toShow.style.visibility == "visible")
        toShow.style.visibility = "hidden";
    else {
        toShow.style.visibility = "visible";
        toShow.style.display = "block";

    }


}

MakeAvailableToHtml('dropDownToggle', dropDownToggle);


function filterDropDown(input, dropdown) {
    var input, filter, ul, li, a, i;
    input = document.getElementById(input);
    filter = input.value.toUpperCase();
    let div = document.getElementById(dropdown);
    a = div.getElementsByTagName("p");
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

        // let li = document.createElement("li");
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

// function drawCareerLevel(thing, owner, notes) {
//     let text = "";
//     // let career = validateCareer(thing, owner);





//     if (owner && notes) {
//         text += div('<span class="basicFont npcBold bodyText">Level </span>' +
//             Editable(thing, "thing.owner_level", "shortwidth coloring basicFont bodyText"));

//     }
//     return text;
// }


// var weaponProf = {
//     Ambush: "Ambush, skilled in all weapons during a surprise attack, otherwise, daggers",
//     TribalWeapons: "Your tribe's weapons,  also Unarmed combat.",
//     Pirate: "Sword, Dagger, Slings, unarmed",
//     Melee: "Melee Weapons, Lance, Shield, Armor, also unarmed Combat",
//     Ranged: "Bow, dagger, spear",
//     Gladiator: "Melee weapons, shield, exotic, impractical and exotic wepaons, Unarmed, theatrical wrestling",
//     Immolator: "Conjured Fire",
//     Strong: "unarmed, swung weapons, wrestling"

// };


// var itemTags = {
//     Area: "It hits or effects everything in an area. ",
//     Armor: "Provides a bonus to your react to harm roll ",
//     Awkward: "It’s unwieldy and tough to wield or use appropriately. ",
//     Clumsy: "It’s unwieldy to use. ",
//     Dangerous: "Unsafe; take the proper precautions when using it or the GM may freely invoke the consequences on failed rolls",
//     Distinctive: "It has an obvious and unique sound, appearance or impression when used. ",
//     Fiery: "It painfully burns, sears, and causes things to catch fire. Hot to the touch. Inflicts Firey Damage. ",
//     Forceful: "It inflicts powerful, crushing blows that knock targets back and down. ",
//     Heavy: "It requires two hands to wield properly.",
//     Infinite: "Too many to keep count. Throw one away, and you have another one.",
//     Messy: "It harms foes in a particularly destructive way, ripping people and things apart.",
//     Piercing: "Inflicts Piercing Damage ",
//     Bludgeoning: "Inflicts Bludgeoning Damage",
//     Slashing: "Inflicts Slashing Damage ",
//     Silvered: "Hurts magical things too",
//     Blessed: "Hurts magical things and does double damage versus fiends and undead",
//     Reload: "You have to take time to reload it between uses",
//     Slow_Reload: "It takes at least one round to reload, and you have to be still to relaod it",
//     Slow: "It takes a while to use - at least a minute, if not more. ",
//     Unbreakable: "It can’t be broken or destroyed by normal means. ",
//     Valuable: "It’s worth Wealth to the right person. ",
//     Vicious: "It harms foes in an especially cruel way, its wounds inflicting debilitating pain",
//     Concealable: "Easily Concealable",
//     Armor_Piercing: "Reduces Armor",
//     Cheap: "May break",
//     Weak: "Won't penetrate proper armor",
//     LuckySave: "Once per game session can prevent all damage from one attack",
//     Knockback: "May knock foes back"
// }

// var itemRanges = {
//     Intimate: 0,
//     Close: 1,
//     Reach: 2,
//     Near: 10,
//     Far: 40
// };

// var weaponType = {
//     backup: 0,
//     sheathed: 1,
//     longarm: 2
// };

// var weapons = [
//     {
//         name: "Punch", description: "Basic unarmed attack", type: ["Melee",], Ranges: ["Intimate"],
//         cost: 0, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Bludgeoning, Weak", "Knockback"]
//     },
//     {
//         name: "Ragged Bow", description: "Crappy bow useful for rabbit hunting", steel: -1, type: ["Ranged",], Ranges: ["Near"],
//         cost: 15, Hands: 2, encumerance: "longarm", Damage: 1, tags: ["Piercing"]
//     },
//     {
//         name: "Fine Bow", description: "Basic Military bow", type: ["Ranged",], Ranges: ["Near", "Far"],
//         cost: 60, Hands: 2, encumerance: "longarm", Damage: 1, tags: ["Piercing"]
//     },
//     {
//         name: "Elven Bow", description: "Elvish Bow, not comon", steel: 1, type: ["Ranged",], Ranges: ["Near", "Far"],
//         cost: 300, Hands: 2, encumerance: "longarm", Damage: 1, tags: ["Piercing"]
//     },
//     {
//         name: "Crossbow", description: "Advanced Prittanian Arm", steel: 1, type: ["Ranged",], Ranges: ["Near", "Far"],
//         cost: 100, Hands: 2, encumerance: "longarm", Damage: 2, tags: ["Piercing", "Slow_Reload", "Armor_Piercing", "Vicious"]
//     },
//     {
//         name: "Dwarven Crossbow", description: "Powerful Dwarven Crossbow. Awkward for non-dwarves to use", steel: +2, type: ["Ranged"], Ranges: ["Near", "Far"],
//         cost: 300, Hands: 2, encumerance: "longarm", Damage: 2, tags: ["Piercing", "Slow_Reload", "Armor_Piercing", "Vicious"]
//     },
//     {
//         name: "Club", description: "Basic Club", type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 1, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning", "Cheap"]
//     },
//     {
//         name: "Metal Shod Club", description: "Basic Club", type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 10, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning"]
//     },
//     {
//         name: "Staff", description: "Long piece of wood", type: ["Melee",], Ranges: ["Close"],
//         cost: 1, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Bludgeoning", "Cheap"]
//     },
//     {
//         name: "Dagger", description: "BIg Knife", steel: 1, type: ["Melee", "Ambush",], Ranges: ["Intimate"],
//         cost: 2, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Piercing"]
//     },
//     {
//         name: "Shiv", description: "Small Knife", type: ["Melee", "Ambush",], Ranges: ["Intimate"],
//         cost: 1, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Piercing", "Concealable"]
//     },
//     {
//         name: "Throwing Dagger", description: "Thrown dagger", type: ["Ranged",], Ranges: ["Near"],
//         cost: 1, Hands: 1, encumerance: "backup", Damage: 1, tags: ["Piercing"]
//     },
//     {
//         name: "Spear", description: "One handed spear", type: ["Melee",], Ranges: ["Close", "Reach"],
//         cost: 10, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Piercing"]
//     },
//     {
//         name: "Pike", description: "Two handed spear", type: ["Melee",], Ranges: ["Reach"],
//         cost: 10, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Piercing"]
//     },
//     {
//         name: "Lance", description: "Spear on horseback. Knockbacks with horse charge and +1 damage, will break", type: ["Melee",], Ranges: ["Reach"],
//         cost: 2, Hands: 1, encumerance: "longarm", Damage: 3, tags: ["Piercing", "Knockback"]
//     },
//     {
//         name: "Longsword", description: "Military weapon", steel: +1, type: ["Melee",], Ranges: ["Close"],
//         cost: 25, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
//     },
//     {
//         name: "Shortsword", description: "Military weapon", type: ["Melee",], Ranges: ["Close", "Intimate"],
//         cost: 10, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
//     },
//     {
//         name: "Greatsword", description: "Military weapon", type: ["Melee",], Ranges: ["Close", "Reach"],
//         cost: 150, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Slashing"]
//     },
//     {
//         name: "Rapier", description: "Military weapon", type: ["Melee,Duelist",], Ranges: ["Close", "Reach"],
//         cost: 60, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Piercing"]
//     },
//     {
//         name: "Peasant Axe", description: "Axe for chopping wood", steel: -1, type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 15, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
//     },
//     {
//         name: "BattleAxe", description: "Basic battle axe", steel: 1, type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 29, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Slashing"]
//     },
//     {
//         name: "GreatAxe", description: "Big axe", steel: 1, type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 100, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Slashing"]
//     },
//     {
//         name: "War Hammer", description: "Basic hammere", steel: 1, type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 20, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning"]
//     },
//     {
//         name: "Whip", description: "Articulated Weapon", steel: 2, type: ["Exotic",], Ranges: ["Reach"],
//         cost: 10, Hands: 1, encumerance: "sheathed", Damage: 2, tags: ["Slashing"]
//     },
//     {
//         name: "Whip of Pain", description: "Articulated Weapon", steel: 2, type: ["Exotic",], Ranges: ["Reach"],
//         cost: 400, Hands: 1, encumerance: "sheathed", Damage: 3, tags: ["Slashing"]
//     },
//     {
//         name: "Flail", description: "Articulated Weapon", steel: 2, type: ["Melee", "Swung",], Ranges: ["Close"],
//         cost: 40, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning", "Awkward"]
//     },
//     {
//         name: "Halberd", description: "Axe on stick", steel: 2, type: ["Melee", "Swung",], Ranges: ["Reach"],
//         cost: 80, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Bludgeoning"]
//     },
//     {
//         name: "Mace", description: "spiky club", steel: 1, type: ["Melee", "Swung",], Ranges: ["Reach"],
//         cost: 20, Hands: 1, encumerance: "longarm", Damage: 2, tags: ["Bludgeoning"]
//     },
//     {
//         name: "Maul", description: "Two handed club", steel: 1, type: ["Melee", "Swung",], Ranges: ["Reach"],
//         cost: 80, Hands: 2, encumerance: "longarm", Damage: 3, tags: ["Bludgeoning"]
//     },
//     {
//         name: "Magic Longsword", description: "Watery tarts hand these out in lakes", steel: 3, type: ["Melee",], Ranges: ["Close"],
//         cost: 2500, Hands: 1, encumerance: "sheathed", Damage: 3, tags: ["Slashing", "Blessed"]
//     },

// ];

// var armor = [
//     { name: "Light Armor", steel: 1, armor: 0, tags: [], cost: 50 },
//     { name: "Medium Armor: like mail", steel: 2, armor: 1, tags: [], cost: 300 },
//     { name: "Prittanian Plate", steel: 1, armor: 2, tags: ["Noisy",], cost: 1500 },
//     { name: "Elven Mithril Undergarment", steel: 1, armor: 1, tags: ["Concealed", "LuckySave"], cost: 1000 },
//     { name: "Scary Tribal Regalia", steel: 1, armor: 0, tags: [], cost: 50 },
//     { name: "Dragon Scale Armor", steel: 3, armor: 2, tags: ["Immunity", "LuckySave"], cost: 5670 },
// ];


const baseDice = "2d10";

// function rollptbadice(dice) {
//     let rolls = []
//     rolls.push(
//         {
//             title: dice,
//             roll: dice,
//         }
//     ); socket.emit('rolls', rolls);
// }

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
            ' onChange= "htmlContext.selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">'; answer += '<label for="' + name + '">' + name + '</label>'
    }
    for (let i = 0; i < tribal_languages.length; i++) {
        let name = (tribal_languages[i]);
        answer += '<input type="checkbox" id="' + name + '" name="' + name + ((!!thing.languages[name]) ? '" checked="true"' : "") + '"' +
            ' onChange= "htmlContext.selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">'; answer += '<label for="' + name + '">' + name + '</label>'
    }
    for (let i = 0; i < magic_languages.length; i++) {
        let name = (magic_languages[i]);
        answer += '<input type="checkbox" id="' + name + '" name="' + name + ((!!thing.languages[name]) ? '" checked="true"' : "") + '"' +
            ' onChange= "htmlContext.selectLanguage(' + "'" + thing.id + "',  event,'" + name + "')" + '  ">'; answer += '<label for="' + name + '">' + name + '</label>'
    }
    return answer;
}

function showInventoryTooltip(evt, thing_id, slot) {

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
    let weapon = GetRegisteredThing(slots[slot]);
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


function rollMoveStat(ownerId, stat, mv, advantage, weapon_id, weapon_mode) {
    let owner = GetRegisteredThing(ownerId);
    let damage = []
    let bonus = owner.stats[stat];
    if (!weapon_id) {

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
        if (Expend(weapon_id, weapon_mode)) {
            RedrawWindow(owner)
        }
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

MakeAvailableToParser("rollMoveStat", rollMoveStat);
MakeAvailableToHtml("rollMoveStat", rollMoveStat);

/// TODO rearrange data so this isn';t a seprate function
function rollSpellMoveStat(ownerId, stat, mv, advantage, spell_id, spell_node) {
    let owner = GetRegisteredThing(ownerId);
    let damage = []
    let bonus = owner.stats[stat];
    let spell = GetRegisteredThing(spell_id);
    if (!spell) throw ("err");
    // let mode = weapon.weapon_modes[weapon_mode];
    // if (Expend(weapon_id, weapon_mode)) {
    //     RedrawWindow(owner)
    // }
    socket.emit('roll', {
        title: owner.name + '<ul><li>' + stat.toUpperCase() + "</li><li>" + mv + ' ' + spell.name + "</li></ul>",
        style: "dual-move",
        advantage: advantage,
        roll: baseDice + signed(bonus),
        damage: GetModifiedDamageString(spell),
        damage_bonus: 0, //FindBestCareerNode(owner, mode)[0],
        resultsTable: moves[mv]
    });


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
MakeAvailableToParser("rollPTBAStat", rollPTBAStat);
MakeAvailableToHtml("rollPTBAStat", rollPTBAStat);

function PTBAAbility(thing, stat) {
    let answer = Editable(thing, " thing.stats['" + stat + "'] ", "npcNum") +
        "<button onclick=\"htmlContext.rollPTBAStat('" + thing.id + "','" + stat + "', false)\">Check</button>";
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
MakeAvailableToParser('PTBAAbilities', PTBAAbilities);

function GetWeaponsList(thing) {
    let result = [];
    if (thing.items) for (let i = 0; i < thing.items.length; i++) {
        if (thing.items[i].page == "weapon") {
            result.push(thing.items[i].file);
            //  if (!item) console.log("Error fetching " + thing.items[i].file);
            //    if (item && item.equipped && item.armor && item.armor.value) {


        }
    }
    return result;

}

function WeaponMoves(thing, weaponId,) {

    if (!isEquipped(thing.id, weaponId)) return "";
    let answer = "";
    let weapon = GetRegisteredThing(weaponId);

    let name = weapon.name;
    if (weapon.weapon_modes)
        for (let m = 0; m < weapon.weapon_modes.length; m++) {
            if (isExpended(weaponId, m)) continue;
            let mode = weapon.weapon_modes[m];
            // if (mode.range) answer += div(span("range ", mode.range));
            // if (mode.min_range) answer += div(span("minimum range ", mode.min_range));
            // if (mode.radius) answer += div(span("radius range ", mode.radius));
            // answer += mode.type + " " + (mode.hands > 1 ? " Two Handed " : "");
            let bonus = FindBestCareerNode(thing, mode);


            let key = "Attack";
            for (let j = 0; j < moves[key].stat.length; j++) {
                let stat = moves[key].stat[j];
                answer += "<div>"
                answer += "<button class=\"greentintButton roundbutton \" onclick =\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + 'Attack' + "',1,'" + weaponId + "'," + m + ")\">"
                    + "+" +
                    "</button>";
                answer += "<button class=\"middleButton\" onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + 'Attack' + "',0,'" + weaponId + "'," + m + ")\">"
                    + ' ' + mode.name + ' ST(' + bonus[0] + ") " + 'RA(' + mode.range + ")" + (moves[key].stat.length > 1 ? "(" + stat + ")" : "") +
                    "</button>";
                answer += "<button class=\"redtintButton roundbutton\" onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + 'Attack' + "',-1,'" + weaponId + "'," + m + ")\">"
                    + "-" +
                    "</button>";
                answer += "</div>"

            }
        }
    return answer;
}

MakeAvailableToParser('WeaponMoves', WeaponMoves);

function WeaponParries(thing, weaponId,) {

    if (!isEquipped(thing.id, weaponId)) return "";
    let answer = "";
    let weapon = GetRegisteredThing(weaponId);

    let name = weapon.name;
    if (weapon.weapon_defenses)
        for (let m = 0; m < weapon.weapon_defenses.length; m++) {
            if (isExpended(weaponId, m)) continue;
            let mode = weapon.weapon_defenses[m];
            // if (mode.range) answer += div(span("range ", mode.range));
            // if (mode.min_range) answer += div(span("minimum range ", mode.min_range));
            // if (mode.radius) answer += div(span("radius range ", mode.radius));
            // answer += mode.type + " " + (mode.hands > 1 ? " Two Handed " : "");
            let bonus = FindBestCareerNode(thing, mode);


            let stats = ["Bravery", "Avoid"];
            for (let j = 0; j < stats.length; j++) {
                let stat = stats[j];
                answer += "<div>"
                answer += "<button class=\"greentintButton roundbutton \" onclick =\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + mode.name + "',1,'" + weaponId + "'," + m + ")\">"
                    + "+" +
                    "</button>";
                answer += "<button class=\"middleButton\" onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + mode.name + "',0,'" + weaponId + "'," + m + ")\">"
                    + ' ' + mode.name + ' ST(' + bonus[0] + ") " + 'RA(' + mode.range + ")" + "(" + stat + ")" +
                    "</button>";
                answer += "<button class=\"redtintButton roundbutton\" onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + mode.name + "',-1,'" + weaponId + "'," + m + ")\">"
                    + "-" +
                    "</button>";
                answer += "</div>"

            }
        }
    return answer;
}



function PTBAMoves(thing) {
    let answer = "";
    let keys = Object.keys(moves);

    keys.sort();
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key == "Attack") {
            let weapons = GetWeaponsList(thing);
            for (let w = 0; w < weapons.length; w++) {
                answer += WeaponMoves(thing, weapons[w]);
            }

        } else
            for (let j = 0; j < moves[key].stat.length; j++) {
                let stat = moves[key].stat[j];
                answer += "<div class=\"padded\" ><button class=\"greentintButton roundbutton \"  onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + key + "',1)\">"
                    + "+" +
                    "</button>";
                answer += "<button  class=\"middleButton\" onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + key + "',0)\">"
                    + key + (moves[key].stat.length > 1 ? "(" + stat + ")" : "") +
                    "</button>";
                answer += "<button class=\"redtintButton roundbutton\"  onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + key + "',-1)\">"
                    + "-" +
                    "</button></div>";
            }
    }
    return answer;
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
    let a = "Dodge";
    let stat = "Avoid";
    answer += "<div class=\"padded\" ><button class=\"greentintButton roundbutton \"  onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',1)\">"
        + "+" +
        "</button>";
    answer += "<button  class=\"middleButton\" onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',0)\">"
        + a + (moves[a].stat.length > 1 ? "(" + stat + ")" : "") +
        "</button>";
    answer += "<button class=\"redtintButton roundbutton\"  onclick=\"htmlContext.rollMoveStat('" + thing.id + "','" + stat + "', '" + a + "',-1)\">"
        + "-" +
        "</button></div>";


    return answer;
}
MakeAvailableToParser('PTBADefenses', PTBADefenses);



export function dragCareersAndItems(thingDragged, evt) {

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

function getModifiedManaCost(thing) {

    let a = Number(thing.BaseManaCost);

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
        let intensity = (thing.owner_modified.Intensity);
        if (!intensity) intensity = 0;
        intensity = Number(intensity);

        for (let i = 0; i < thing.Damage.length; i++) {
            let a = AddDiceToExpression(thing.Damage[i].damage, intensity);
            a += " " + thing.Damage[i].type + ' ';
            if (thing.Damage[i].when) a += thing.Damage[i].when + " ";
            answer += a;
        }
        return answer;
    }
    return thing.Damage;
}
MakeAvailableToParser('GetModifiedDamageString', GetModifiedDamageString);

function GetSpellModifiedRangeString(thing) {

    if (!thing.owner_modified?.Range) {
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

function DrawArrayEnhancementButtons(thing, owner, array) {

    let s = "";
    if (!array) return s;
    for (let i = 0; i < array.length; i++) {
        let stat = array[i];
        s += '<button class="greentintButton roundbutton" onclick ="ChangeSpell(\'' + thing.id + '\',\'' + owner.id + '\',\'' + stat + '\',1)">'
            + "+" +
            "</button>";
        s += '<button class="middleButton" onclick="ZeroSpell(\'' + thing.id + '\',\'' + owner.id + '\',\'' + stat + '\')">'
            + ' ' + (thing.owner_modified[stat] ? "(" + thing.owner_modified[stat] + ") " : "") + stat +
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
    if (thing.owner_modified[stat] != undefined) {
        res = thing.owner_modified[stat];
    }
    res += amt;
    thing.owner_modified[stat] = res;
    let evaluation = 'thing.owner_modified["' + stat + '"] =' + res;
    socket.emit('change', {
        change: evaluation,
        thing: thingId
    })
    let owner = GetRegisteredThing(ownerId);
    // hack around redrawing keeping the tooltip as open
    owner.openSpell = thing.name;
    RedrawWindow(owner)
    owner.openSpell = "";

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
    RedrawWindow(owner)
    owner.openSpell = "";

}
MakeAvailableToHtml('ZeroSpell', ZeroSpell);


let maxExhaustion = 12;
function addMana(thingId, amt) {
    let thing = GetRegisteredThing(thingId);
    amt = Number(amt);
    let newMana = (Number(thing.counters.manaInAura) + (amt));
    sendChat("Added " + amt + " mana   now " + newMana);
    socket.emit('change', {
        change: 'thing.counters.manaInAura = ' + (newMana),
        thing: thingId
    });
}
function exhaust(thingId, amt) {
    socket.emit('change', {
        change: 'thing.counters.exhaustion = Number(thing.counters.exhaustion)+ Number(' + amt + ')',
        thing: thingId
    });
    let thing = GetRegisteredThing(thingId);

    switch (thing.counters.exhaustion + amt) { // add since emit not processed yet

        default:
            sendChat("Exhaustion now " + (Number(thing.counters.exhaustion) + Number(amt)));
            break;
        case 11:
            sendChat("You are suffering from fatigue");
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
    if (thing.counters.exhaustion <= 11) {
        exhaust(thingId, 1);

        addMana(thingId, 1);

    } else {

        sendChat("Too exhausted");
    }
}

MakeAvailableToHtml('addManaExhaust', addManaExhaust);


function weapon_is_sharp(sidearm) {

    let sharp = false;
    let s = sidearm.weapon_modes;
    for (let i = 0; i < s.length; i++) {
        let w = s[i];
        if (w.damage)
            for (let j = 0; j < w.damage.length; j++) {
                if (w.damage[j].type == "piercing" || w.damage[j].type == "slashing" || w.damage[j].type == "piercing or slashing") {
                    return true;
                }
            }
    }
    return false;
}


/// should reverse this and calculate this on equip unequip
//// having a key value pair of variables like roll20 does
function addManaStab(button, thingId) {


    let s = getSlotItem(thingId, 'sidearm');

    if (!s) {
        sendChat("No sidearm equipped. ");
        return;
    }
    let sidearm = GetRegisteredThing(s);
    if (!sidearm.weapon_modes) {
        sendChat("No dangerous sidearm equipped. ");
        return;
    }
    if (!weapon_is_sharp(sidearm)) {
        sendChat("Not equipped with sharp sidearm. ");
        return;
    }

    let mana = 3;
    if (HasFeat(thingId, "Fuel")) mana += 2;
    let advantage = 0;
    if (HasFeat(thingId, "Blood_Sacrifice")) advantage = 1;
    let thing = GetRegisteredThing(thingId);

    takeDamageAmt(thing, 1, 'slashing', advantage)
    addMana(thingId, mana);
}
MakeAvailableToHtml('addManaStab', addManaStab);

function addManaStabAnother(button, thingId) {
    let mana = 1;
    if (HasFeat(thingId, "Fuel")) mana += 2;
    addMana(thingId, mana);
}

MakeAvailableToHtml('addManaStabAnother', addManaStabAnother);

function addManaGetHurtd(button, thingId) {
    let mana = 1;
    if (HasFeat(thingId, "Fuel")) mana += 2;
    addMana(thingId, mana);
}
MakeAvailableToHtml('addManaGetHurtd', addManaGetHurtd);

function addManaSpendIngredients(button, thingId) {
    addMana(thingId, 1);
}
MakeAvailableToHtml('addManaSpendIngredients', addManaSpendIngredients);

function AddManaWorldsOfPower(button, thingId) {
    addMana(thingId, 1);
}
MakeAvailableToHtml('AddManaWorldsOfPower', AddManaWorldsOfPower);

function AddManaPLanarFOrces(button, thingId) {
    addMana(thingId, 1);
}
MakeAvailableToHtml('AddManaPLanarFOrces', AddManaPLanarFOrces);

function AddManaGotCritOrFumble(button, thingId) {
    addMana(thingId, 1);
}
MakeAvailableToHtml('AddManaGotCritOrFumble', AddManaGotCritOrFumble);

function resetManaButtons(parent) {
    for (let i = 0; i < parent.children.length; i++) {
        parent.children[i].disabled = false;

    }
}
MakeAvailableToHtml('resetManaButtons', resetManaButtons);


function CastSpell(thingId, ownerId, advantage) {

    let thing = GetRegisteredThing(thingId);
    let owner = GetRegisteredThing(ownerId);
    let cost = getModifiedManaCost(thing);
    if (cost <= Number(owner.counters.manaInAura)) {
        addMana(ownerId, -getModifiedManaCost(thing));
        let a = parseSheet(thing, "spell_chat", undefined, owner, undefined, undefined); // no w

        sendChat(a);

        let mv = thing.attackOrAmbushResult;
        if (mv) {
            let bonus;
            let stat;
            if (mv == "Attack") {
                bonus = owner.stats.bravery;
                stat = "Bravery";
            }
            else {
                bonus = owner.stats.cunning;
                stat = "Cunning";
            }

            socket.emit('roll', {
                title: owner.name + '<ul><li>' + stat.toUpperCase() + "</li><li>" + mv + ' ' + thing.name + "</li></ul>",
                style: "dual-move",
                advantage: advantage,
                roll: baseDice + signed(bonus),
                damage: thing.Damage,
                damage_bonus: 0,
                resultsTable: moves[mv]
            });

        } else if (moves[thing.Move]) {
            let mv = moves[thing.Move];
            let stat = mv.stat[0]; // todo pick best for player
            let bonus = owner.stats[stat];
            socket.emit('roll', {
                title: owner.name + '<ul><li>' + stat.toUpperCase() + "</li><li>" + thing.Move + ' ' + thing.name + "</li></ul>",
                style: "dual-move",
                advantage: advantage,
                roll: baseDice + signed(bonus),
                damage: thing.Damage,
                damage_bonus: 0,
                resultsTable: mv
            });


        }



    } else {

        sendChat("Not Enough mana in your aura to cast this spell. ");

    }




}
MakeAvailableToHtml('CastSpell', CastSpell);

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
