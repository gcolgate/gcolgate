To do

Conditions
    set condition: add icon and fx. Include all the results from moves
    See if any of the spell or spell results should be conditions. Figure out how to use conditions in rolls 

Editing map pain.

1) Downloading new art to the server folders don't make the server aware of them unless you restart Cheat: added button to refresh for now

5) Scaling is terribly implemented.  
        New method: when hovered, show 8 pins as new models
        the pin moves the coordinates so that the pin is in the new mouse point
        Only clicking on the pin moves it.
        The top and bottom can only go up and down
        The left and right can only go left and right
        The corners can move freely

6) sheets should be able to scale themselves, perhaps based on content. So tooltip not edit should be skinnier

7) make add POI go to grid boundaries

content: fill out comments for all moves.
Clean up spacing in move chat

 Rollmove stat formatting and dice


 exotic: 3d dice.
 
Creating new: Players, documents, need to use the typed in name, not a random name, in the displays. File id should be an uuid not a random name

special weapon player defenses not shown or not working or something

There should be a spell to conjure or enhance weapons that add extra actions like burnify
Add place to add conditions   for NPCs and to manage health
Resist damage needs to automatically include armor and have some degree of hit location or maybe attacks allow hitting in the head or body or arms or legs.
Damage is now all over the map include MERP ideas... weapons include penetration, damage type, 
Conditions referred to in Moves should be hoverable.
spells need to provide ways to set damage
make moves for every spell


pain POP-OUT:
     This sounds like it will take some days to work out:
    Need to be able to POP OUT sub windows and scale them smaller/bigger. Lots of work on appearance.
    https://stackoverflow.com/questions/21671218/window-opener-not-working-in-chrome
    Need to access globals through this? probaly window.opener is working now
    https://stackoverflow.com/questions/17493027/can-i-open-a-new-window-and-populate-it-with-a-string-variable
    https://daily-dev-tips.com/posts/javascript-sending-data-between-windows/
    Issue: if closing main window window copy screws up, add button to make main window hide and copy window open. When closing copy window make copy main window visible
    Many things break on pop out windows like the inventory screen
    Bug: Would like to pop out chat window ,
For slow network, need to put up clock when loading initial scene, as each character sheet is loaded.
 
Tile propoerties: when editing map, allow double clicking on tiles to change properties such as color and shader , so far implented for tokens in documents only
    note: updating a player does not change the color (or rather it turns it white) until reloading the game
    Shaders: put a json in the shaders folder that details all combinations of shaders. give each one a name
    Create a shader for points of interest that twinkles them by making them more or less opaque or bright in semi random ways
    Put a menu on the appearance for tokens that allows changing the shader.

Fix non-fighty characters dancer based had no , still an issue.   
Make armor proficiencies more known on the sheet currently they are hidden.


    
B Find token from sheet button
C group things to scroll 
D buy item doesn't deduct money
E Could spend some time to make a context menu for text editing with these
    bold: Toggles bold on/off for the selection or at the insertion point. (Key) control b
    italic: Toggles italics on/off for the selection or at the insertion point. (Key) control i
    underline: Toggles underline on/off for the selection or at the insertion point.(key) control u
    strikeThrough: Toggles strikethrough on/off for the selection or at the insertion point.
    subscript: Toggles subscript on/off for the selection or at the insertion point.
    superscript: Toggles superscript on/off for the selection or at the insertion point.
    insertOrderedList: Creates an ordered list (numbered) for the selection or at the insertion point.
    insertUnorderedList: Creates an unordered list (bulleted) for the selection or at the insertion point.
    justifyLeft: Justifies the selection or insertion point to the left.
    justifyCenter: Centers the selection or insertion point.
    justifyRight: Justifies the selection or insertion point to the right.
    justifyFull: Justifies the selection or insertion point fully.
    insertHorizontalRule: Inserts a horizontal rule at the insertion point.
    createLink: Creates a hyperlink for the selection or at the insertion point.
    unlink: Removes hyperlinks from the selection.
    insertImage: Inserts an image at the insertion point.
    foreColor: Changes the text color for the selection or at the insertion point.
    backColor: Changes the background color for the selection or at the insertion point.
    fontName: Changes the font name for the selection or at the insertion point.
    fontSize: Changes the font size for the selection or at the insertion point.
    cut: Cuts the selection to the clipboard.
    copy: Copies the selection to the clipboard. (control c)
    paste: Pastes the clipboard contents at the insertion point. (control v)
    delete: Deletes the selection. (delete)
    selectAll: Selects all content. (control a)
    undo: Undoes the last executed command. (control shift z)
    redo: Redoes the last undone command. (control z)
1. Damage on players maybe too variable. add MERP rules for both players and monsters. No add weapon effect powers.
3. Mount required for certain moves, don't allow them without mount?
4. Need to have stat use a drop down, include Luck which makes a zero stack
Reorganization:
5. reorganize bestiary and monsters to be simpler and better. Try for a variant of Document where you can list conditions, hit points, etc. per token. Maybe support Armed, Sleeping, Bloodied, etc
Bugs:
    Can we get rid of tag files completely? Or necc for compendiums for quick loading
Instances:
 
 
Bug: Do we need selecting more than one in directory window  for nulti drag? Deprioritized 
 

 
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