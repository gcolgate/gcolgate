To do 

pain :

 Pain points include sloppy input data from the srd
    Awkward HTML formatting


Deal with awkard HTML formatting
HTML formatting use colums/grid
    Title
    Small title
    Sub title 
    border on windows
 
Need to be able to POP OUT sub windows
 

Instances:

Bug: selecting more than one in directory window
 

Images:
All images need size representation before loading somehow (pipeline)
Editing for images
    Setting size for display in corner
    Cutting out tokens with nice edges
    Layering
Costumes -- easy to choose
    token, avatar, 
    Hud display


2. For items, classify them more so they can be searched with more buttons
    magic/not 
    price below, above, range 
    part of body
        armor  
        off hand
        main  hand
        both hands
        head
        feet
        rings
        backpack
        pouch
        sheath
        bandolier
        quiver
        mount
        pack animal
        bag of holding
        owned elsewhere

 2.5 For spells, same
    level
    class
    etc.

3. translation sheet that converts 5e mechanics into Prittanian mechanics


    for player sheet : Maybe only support Prittanian sheet first
        a. Choose elements from drop downs that correspond to items with their own sheets
        b. Roll moves that give output
        c. Compute steel for outfits
        d. allow adding counters that can be refreshed on long rest, short rest, restock, healed as moves
        e. transaction sheet for money and log
        Equipment for costumes
             Equipment list for costumes, lists encumberance level too, distributes equipment

        equipment location
            equipped
            bag 
            bag of holding
            saddlebags
            caravan
            ship
            home
            lost/stolen

    

    for d&d
        allow selecting the various proficiencies (expertise, half expertise, etc) on skills
        allow equiping parts of bodies, showing relevant lists, capped by player coin 
        allow credit and gold currencies
        allow selecting feats
        allow selecting classes and levels
            automatically add things based on level to class feats
        allow adding spells
        allow adding counters that can be refreshed on long rest, short rest, restock, healed
            automatically add counters for some things, like ammo and feats
            spell slots are counters
            also spell points
        add long rest, short rest, death save, restock buttons
        compute proficiency
        future: provide Transactions tag where all transactions are recorded, with running total of money


3. Image library required on server
 
    default scene is full vision lights don't apply, these are toggleable  
    show hex grid (shader) 
    set priorities, front/behind/use Z
    set z in 2d
    set hud.....simple like roll20?
    lights: gm placeable lights
    lights: attach lights to different objects, when equipped by a player they show light
    darkvision, infravision, low light vision, true sight, etc.
    set condition: add icon and fx
    allow different images for theatre of the mind, 2d map, ortho map, 3d map
      pull out templates when casting a spell based for area effects

   
  

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
        CVS to entities : convert CSV files with entities, where column is entity name
        entities to CSV : reverse of that
        