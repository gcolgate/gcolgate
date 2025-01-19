To do

pain POP-OUT:
 This sounds like it will take some days to work out:
Need to be able to POP OUT sub windows and scale them smaller/bigger. Lots of work on appearance.
https://stackoverflow.com/questions/21671218/window-opener-not-working-in-chrome
Need to access globals through this? probaly window.opener is working now
https://stackoverflow.com/questions/17493027/can-i-open-a-new-window-and-populate-it-with-a-string-variable
https://daily-dev-tips.com/posts/javascript-sending-data-between-windows/
Issue: if closing main window window copy screws up, add button to make main window hide and copy window open. When closing copy window make copy main window visible



For slow network, need to put up clock when loading initial scene, as each character sheet is loaded.
 
Finish image server: Images should be able to have color and shaders changed on them.

Fix non-fighty characters dancer based had no , still an issue.   
Make armor proficiencies more known on the sheet currently they are hidden.
Add a place to add conditions
See if any of the spell or spell results should be conditions. Figure out how to use conditions in rolls  
   
Remember camera position, a little more complicated because it is camera position per player per scene
Find token from sheet button
group things to scroll 
Hovering tooltips should be click -thru
buy item doesn't deduct money
large creatures scaled tokens
 
1. Damage on players maybe too variable. add MERP rules for both players and monsters. 
3. Mount required for certain moves, don't allow them without mount?

Reorganization:
5. reorganize bestiary and monsters to be simpler and better. Try for a variant of Document where you can list conditions, hit points, etc. per token. Maybe support Armed, Sleeping, Bloodied, etc
Bugs:
    Can we get rid of tag files completely? Or necc for compendiums for quick loading
Instances:
 
Bug: selecting more than one in directory window
Bug: popping out should be option on window panel
Bug: Would like to pop out chat window
Bug: Finish spell casting. Use moves. Also add in areas of power. sort of done.
Bug: spells need 'show description' button not just cast. Spell rolls broken.

 
Bug: Changes to inventory etc should be printed out to chat
Need transaction history
Need UNDO
Seems to break if left alone for a while (like 3 hours)
Careers should show feats chosen without opening panel. feats should hover

alternate layout that doesn't show image and window is smaller for players
Tighten space for players sheets

Layout: Spell window has lots of wasted space, Features too


Game: Is mana generating fun? NO
Game: maybe cursor keys scroll map. Maybe control also controls map.


2. For items, classify them more so they can be searched with more buttons
    Add mount and bag of holding areas on inventory screen
    Add elsewhere areas with a column for where (servant, home, ship, safe, bank)


3. Reoganize editing.
    Add RAW DATA editor where each field of a json is individually changeable and random fields change. 1/2 done. To do: put on sub objects in player inventories, remember to use template properly
    Add edit button to on each sheet to allow editing of things, may require some sheet reoganization


future: provide Transactions tag where all transactions are recorded, with running total of money
 

3. Image library required on server 50%

    LIGHTS deprioritized. default scene is full vision lights don't apply, these are toggleable
    show hex grid (shader) right now only square grid
    set priorities, front/behind/use Z
    set z in 2d
    set hud.....simple like roll20?
    lights: gm placeable lights. Deprioritized
    lights: attach lights to different objects, when equipped by a player they show light Deprioritized
    darkvision, infravision, low light vision, true sight, etc. Deprioritized
    set condition: add icon and fx. Include all the results from moves
    allow different images for theatre of the mind, 2d map, ortho map, 3d map
      pull out templates when casting a spell based for area effects. Use the effect size on the spell
    Add a tokenizer




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
Scene editor is broken! Must be merge error, the Zs look very wrong