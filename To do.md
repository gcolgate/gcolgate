To do 

pain :

 Pain points include sloppy input data from the srd
    Awkward HTML formatting


Deal with awkard HTML formatting
HTML formatting use colums/grid
    Title
    Small title
    Sub title
    Need to make edit box resize to text entered (no dangling ft in movement)
Need to support resizing sub windows
Need to support resizing entire window
Need to be able to POP OUT sub windows


Better roll formatting in chat
 

1. Complete bestiary, add in 2 panels, actions, stats and skills
    Add roll to spells -- only half done
    Add rolls to feats --
    Make proficiency in saves checkbox work
    Add skills (only pick skills that are not default to show here)

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

3.

    for player sheet 
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


3. Creating a scene creates a scene.
    start allowing dragging of image files into a scene
       items and beasts dragged into a scene create instances, unless they are uniques or party, then they create references
    default scene is full vision lights don't apply, these are toggleable
    make a folder for each scene for these things when created
    make a folder for items in the scene: each tile, image, character, item, beast, etc will go here
    instance handling.
    show hex grid (shader), square grid
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
