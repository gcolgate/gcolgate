
const fs = require('fs').promises;
const rawfs = require('fs');
//const fsExtra = require('fs-extra');
const path = require('path');

const sanitize = require('sanitize-filename');


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
        weapons: ["Martial", "Mounted", "LightArmor", "HeavyArmor", "Cavalry"],
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

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function writeJsonFileInPublic(dir, fileName, json) {

    try {
        let pathName = path.join(__dirname, 'public', dir, fileName + '.json');

        rawfs.writeFileSync(pathName, JSON.stringify(json));

    } catch (err) {
        console.log(err + " Error with " + dir + " " + fileName);
    }
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

async function doit() {
    //await fsExtra.emptyDir(path.join(__dirname, 'public', 'Compendium'));
    //await fsExtra.emptyDir(path.join(__dirname, 'public', 'CompendiumFiles'));
    let dir1 = await fs.readdir(path.join(__dirname, 'public', 'CompendiumFiles')); // 
    let dir = await fs.readdir(path.join(__dirname, 'public', 'toConvert2')); // 

    let xlation = {};
    for (let i = 0; i < dir1.length; i++) {
        let name = path.parse(dir1[i]).name;
        name = replaceAll(name, '20', ' ');
        name = replaceAll(name, '2c', ' of ');
        name = replaceAll(name, '2b', ' + ');
        let last = name.indexOf('_');
        if (last > 0) {
            name = name.slice(0, last);
        }
        name = name.trim();
        xlation[name] = dir1[i];
    }

    console.log("%o", dir);

    for (let i = 0; i < dir.length; i++) {

        let fname = path.join(__dirname, 'public', 'toConvert2', dir[i]);
        console.log("Loading " + fname);
        let text = (await fs.readFile(fname)).toString();
        let level = 0;
        let inQuotes = false;
        let subfiles = [];
        let oneEntry = "";
        let quoted = "";
        badNews = false;
        let test = false;
        console.log("My test");
        for (let i = 0; i < text.length; i++) {
            oneEntry += text[i];
            if (!inQuotes) {
                switch (text[i]) {
                    case '"': inQuotes = true; break;
                    case '{': level++; //console.log("up:" + level);
                        // console.log(oneEntry);
                        break;
                    case '}': level--;
                        // console.log("down:" + level); console.log(oneEntry);
                        if (level < 0) {
                            console.log("Error in conversion");
                            console.log(oneEntry);
                            exit(-1);
                        }
                        if (level === 0) {
                            //    console.log("Writing size " + oneEntry.length);
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


        for (let fileIndex = 0; fileIndex < subfiles.length; fileIndex++) {
            try {


                json = JSON.parse(subfiles[fileIndex]);

                let nom = json.name;
                let prefixEnd = nom.indexOf(':');
                if (prefixEnd > 0) {
                    nom = nom.slice(prefixEnd + 1);
                }
                let suffixStart = nom.indexOf('(');
                if (suffixStart > 0) {
                    nom = nom.slice(0, suffixStart);
                }

                let plusStart = nom.indexOf('+');
                if (plusStart > 0) {
                    nom = nom.substr(plusStart, 2) + ' ' + nom.substr(0, plusStart);
                }
                nom = replaceAll(nom, "'", '');
                nom = replaceAll(nom, "-", '');
                nom = nom.trim();
                let best = 0; let bestString = "";
                Object.keys(xlation).forEach(key => {
                    let answer = stringSimilarity(key, nom);
                    if (answer > best) {
                        best = answer;
                        bestString = key;
                    }

                });
                if (best < 1 && best > 0.9)
                    console.log(nom + "  matches with " + bestString + " at " + best + ' and ' + xlation[bestString]);

                // if best> 0.9
                /* let tagsSource = json.flags. ;
    
                 if (tagsSource) {
    
                     tagsSource.hash = tagsSource.hash.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                     tagsSource.page = path.parse(tagsSource.page).name;
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
                             subFile = subFile.replace(/[`~!@#$%^*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    
    
                             let tag = {
                                 file: "CompendiumFiles\ + subFile,
                                 page: "itemSummary",
                                 source: item.source,
                                 droppable: item.propDroppable,
                                 type: item.type,
                                 name: item.name,
                                 img: item.img,
                             };
                             if (subFile == "adult20amethyst20dragon_ftd_MITEM_Claw") {
    
                                 console.log(tas);
                                 console.log(item);
                             }
                             writeJsonFileInPublic('Compendium', "tag_" + subFile, tag);
                             writeJsonFileInPublic('CompendiumFiles', subFile, item);
    
                             json.items[i] = tag;
    
                         }
                     }
    
                     let tags = {
                         file: "CompendiumFiles/" + tagsSource.hash,
                         page: tagsSource.page,
                         source: tagsSource.source,
                         droppable: tagsSource.propDroppable,
                         type: json.type,
                         name: json.name,
                         img: json.img,
                     };
    
                     writeJsonFileInPublic('Compendium', "tag_" + tagsSource.hash, tags);
                     writeJsonFileInPublic('CompendiumFiles', tagsSource.hash, json);
    
    
    
                     artGeneratorFile.push({ id: tagsSource.hash, name: json.name, type: tagsSource.type });*/





            }
            catch (err) {
                console.error("error parsing json ( " + err + "+)");
            }

            // let outfile3 = path.join(path.join(__dirname, 'public', "artgenerator.json"));
            //  fs.writeFile(outfile3, JSON.stringify(artGeneratorFile));
        }


    }
}

doit();
