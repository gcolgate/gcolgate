 


A) G 
Conditions
    set condition: add icon and fx. Include all the results from moves. Change text to actually affect players rolls.
     

1) Downloading new art to the server folders don't make the server aware of them unless you restart Cheat: added button to refresh for now
2) Cannot drag images to player portraits

2) make all tiles at same Z be sorted, add widget to sort them. Cease using Z for this alone
so they can be at the same Z.. added sort order, need to add widget

3) Threed scroll is hacky but no longer flaky, deprioritized

4) Put feats back into the character. Yes
Double check they work in modes.
A feat can be a move
A feat can be a bonus to a different move
A feat can give advantage to a differet move
A feat can give disadvantage to all moves of a characteristic
A feat can give proficiency to a class of weapons, or to a move.
All feats relating to a move should be shown on the roll card, and each can be activated or deactivated
A spell is a move and an inventory item
Add weapons proficiency
Change spells into items that have to be equipped. Some spells have ingredients, that vanish once used.
Inventory items don't do their moves when clicked.  This might mean refactoring inventory items. 
special weapon player defenses not shown or not working or something

Resist Damage missing.
Resist damage needs to automatically include armor and have some degree of hit location or maybe attacks allow hitting in the head or body or arms or legs.

Feats: Add uses to feats. Add automatic success bonus.

pain POP-OUT:
      get rid of all popouts. Instead make a new window completely with a link.

A Remember camera position, a little more complicated because it is camera position per player per scene
B Find token from sheet button
C group things to scroll
D buy item doesn't deduct money  .
3. Mount required for certain moves, don't allow them without mount?
4. Need to have stat use a drop down, include Luck which makes a zero stack
Reorganization:
5. reorganize bestiary and monsters to be simpler and better. Try for a variant of Document where you can list conditions, hit points, etc. per token. Maybe support Armed, Sleeping, Bloodied, etc
Bugs:
    Can we get rid of tag files completely? Or necc for compendiums for quick loading
Instances:

Bug: Do we need selecting more than one in directory window  for nulti drag? Deprioritized

Bug: Popup windows on spell screen start open


Bug: Changes to inventory etc should be printed out to chat
Need transaction history
Need UNDO
Seems to break if left alone for a while (like 3 hours)
Careers should show feats chosen without opening panel. feats should hover

Tighten space for players sheets

Layout: Spell window has lots of wasted space, Features too


Game: Is mana generating fun? NO Fix mana generation and spells window
Game: maybe cursor keys scroll map. Maybe control also controls map.


2. For items, classify them more so they can be searched with more buttons
    Add mount and bag of holding, wagon, home, servant, elsewhere option on things not currently equipped
    Fix search on those windows
    Add elsewhere areas with a column for where (servant, home, ship, safe, bank)


3. Reoganize editing.
    Add RAW DATA editor where each field of a json is individually changeable and random fields change. 1/2 done. To do: put on sub objects in player inventories, remember to use template properly
    Add edit button to on each sheet to allow editing of things, may require some sheet reoganization. this is beginning to be done, we will just use a different sheet.


future: provide Transactions tag where all transactions are recorded, with running total of money


4. Image library required on server 50%. Cut and copy images?. Need to remember last folder.

    LIGHTS deprioritized. default scene is full vision lights don't apply, these are toggleable

    lights: gm placeable lights. Deprioritized
    lights: attach lights to different objects, when equipped by a player they show light Deprioritized
    darkvision, infravision, low light vision, true sight, etc. Deprioritized

    allow different images for theatre of the mind, 2d map, ortho map, 3d map
      pull out templates when casting a spell based for area effects. Use the effect size on the spell
    Add a tokenizer

Isometric projection of tiles.
    tiles are drawn flattened
    tokens are not unless a check box is hit. Add scale too on appearance tab
    would need new grid shaders
    need difference between Z and real Z so things can rise in the air. Show shadow on ground? Movement ok?
    investigate displaying splats.
    Add tint color to tokens.
    Try just using a 3d camera where tokens have code prior to render to aim them at the camera like sprites after adjusting grids


2. Hud widget to adjust Z is broken since it shares css with new tooltips, need to differentiate

3. tooltip and story need better css

  4. Hiding things to players
    Provide fog of war
        Simple: within X of a player who can see
        Traditional: voxels vs. line of sight
        Whiteboard: allow gm to erase mask
    Provide security settings on folders and individual items
       0 GM -- no restrictions
       1  Assistant GM -- restricted to compendium, party, partyMinions (default)
       2  Trusted Player -- restricted to party, partyMinions
       3 Rando Player -- restricted to his own sheet (default)
    Auto limit costume for NPCs based on player info level
    Security: reduce passing javascript to more strict approaches

5. FX
    underwater effect
    rain
    snow
    wind
    darkness
    overbright
    lights
    darknesses
    fogs
    spell templates

    6. General tools
        CVS to entities : convert CSV files with entities, where column is entity name. Did for spells
        entities to CSV : reverse of that


        7. add 3d modes for map

8. Audio: Chat received sound, roll dice sound. Good thing Dave hates music when playing or I do that

Window functionality
New player picks random name, as does new document, also new scene doesn't update
Delete item
Scene editor scaling tiles not working well.
1) Need to create handles
2) Drag handles
3) Create scene documents from a click that don't appear in documents but appear under the scene