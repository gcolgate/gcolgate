To do 

pain : 
 
 This sounds like it will take some days to work out:
Need to be able to POP OUT sub windows and scale them smaller/bigger. Lots of work on appearance.
https://stackoverflow.com/questions/21671218/window-opener-not-working-in-chrome
Need to access globals through this? probaly window.opener is working now
https://stackoverflow.com/questions/17493027/can-i-open-a-new-window-and-populate-it-with-a-string-variable
https://daily-dev-tips.com/posts/javascript-sending-data-between-windows/

Working 30%

Appearance window doesn't work 
dragging doesn't work: these might be the same as the bluebutton fix

Bug when dragging the name gets changed


Reorganization: 
1. Each sheet will have 2 objects, front and template. Data in front overrides template. DONE for subitems, not for players (need editing test)
2. When dragging from compendium, list original template in main file. Do not copy it like we do now file. Front file is blank Done for subitems. Not for monsters.
3. When editing, change front file. Need to test
4. For each field, when using, check front, if blank, check template. Not needed
5. reorganize bestiary and monsters to be simpler and better. Do this after getting image server working
Bugs: 
    Can we get rid of tag files completely? Or necc for compendiums for quick loading
Instances:

Bug: selecting more than one in directory window
 
 

2. For items, classify them more so they can be searched with more buttons
    Add mount and bag of holding areas on inventory screen
    Add elsewhere areas with a column for where (servant, home, ship, safe, bank)
    
 
3. Reoganize editing. 
    Add RAW DATA editor where each field of a json is individually changeable and random fields change. 1/2 done. To do: put on sub objects in player inventories, remember to use template properly
    Add edit button to on each sheet to allow editing of things, may require some sheet reoganization

     
future: provide Transactions tag where all transactions are recorded, with running total of money

3. Improve rolling
    Allow dice to be rerolled once they are in the chat as advantage/disadvantate +bonus -bonus
    Allow editing of rolls on sheet to set bonus before rolling 

3. Image library required on server
 
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
