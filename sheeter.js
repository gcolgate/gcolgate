
// const debugfs = require('fs');
const fs = require('fs').promises;
const path = require('path');
const jsonHandling = require('./json_handling.js');
const uuid = require('uuid');
const { json } = require('stream/consumers');

var folders = {
  Compendium: [],
  // Favorites: [],
  //  Uniques: [],
  Party: [],
  Scenes: [],
  ScenesParsed: [],
  Documents: []
};

function uuidv4() {
  return uuid.v4();
}


var chats = {}; // chats so far

function ensureExists(thing, template, field) {
  if (thing[field] == undefined) {
    if (template) {
      if (template[field]) {
        thing[field] = template[field];
      } else
        thing[field] = {};  // adding a temp field
    } else {
      thing[field] = {};
    }
  }
}
global.ensureExists = ensureExists;

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



var missingImage = 'images/questionMark.png';

function getAppearanceImage(thing, type) {
  console.log('Thing %o', thing);
  if (thing.appearance) {
    let answer = findInNamedArray(thing.appearance, thing.current_appearance);
    console.log(answer);
    if (!answer) return missingImage;
    answer = answer[type];
    console.log(answer);
    if (!answer) return missingImage;
    return answer.img ? answer.img : missingImage;
  }
  return missingImage;
}

function getPortrait(thing) {
  return getAppearanceImage(thing, 'portrait');
}

function stripRoll(id) {
  if (id.startsWith("roll_")) {
    return id.substr(5);
  }
  return id;
}
/***
 *  ChangeThing
 *
 * @param thingname: thing to change
 * @param replacement: line of code to run on thing
 * @param io : network io
 * @param msg : change = msg to return (TODO get rid of thingname and
 *replacement and read from msg)
 * @param updateAppearance : appearance of tokens for this thing might have
 *changed
 **/
async function ChangeThing(thingName, replacement, io, msg, updateAppearance) {

  console.log("Thing " + thingName);
  console.log("Replacement " + replacement);
  console.log("msg: ", msg);
  let thing = null;
  if (!thingName || typeof (thingName) != "string") {
    console.error("CHange thing passed evil thingname " + thingName);
    return;
  }
  // replacement = SanitizeThing(replacement); // protect vs hacks, todo: see if
  // screws up string assignments
  if (replacement) {
    // Need to put these in a cache and write them out over time for speed
    // this should go through a cache
    console.log('replacement :', replacement);
    let has_file = true;
    if (!thingName.startsWith("roll_")) {
      thing = await jsonHandling.get(thingName);
      console.log('thing ' + thingName);
    } else {
      thing = chats[stripRoll(thingName)].rollMove; // skip roll_ make this neater so origin of thing is hidden
      has_file = false;

    }
    // console.log(thing);
    let template = undefined;
    console.log('thing ', thing);;
    if (thing.template && replacement.indexOf('template' >= 0)) {
      template = await jsonHandling.get(thing.template);

    }
    console.log('rep ' + replacement);
    if (replacement.indexOf(']') >= 0) {
      console.log('Do something');
    }
    eval(replacement);  // actually change the thing
    console.log(thing);

    //  console.log('writeFile ', filePath);
    if (has_file) {
      jsonHandling.set(thingName, thing);

    }
    if (thingName.startsWith("tag")) {

      let dirName = jsonHandling.getFolderName(thingName.substring(4));
      let folder = folders[dirName];

      if (folder) for (let i = 0; i < folder.length; i++) {

        if (folder[i].id == thing.id) {

          console.log(folder.id + ' vs ' + thing.id); 6
          console.log('%o', folder[i]);

          folder[i] = thing;
          io.emit(
            'updateDir',
            { id: dirName, folder: folders[dirName], makeFront: false });
          break; l
        }
      }
    }


  }
  msg.updateAppearance = updateAppearance;
  console.log('msg %o', msg);
  io.emit('change', msg);
  if (updateAppearance && thing.appearance && msg.updatePortrait) {
    //  let fileName = path.basename(thingName);
    //  let dir = path.dirname(thingName);
    //  let tagDir = dir.slice(0, -5);
    //  let folder = folders[tagDir];

    //  console.log('Tag dir (' + tagDir + ')');
    //  let tag_filePath = path.normalize(path.join(
    //   __dirname, 'public', tagDir,
    //   'tag_' + optionallyAddExt(fileName, '.json')));
    //  console.log('tag_filePath ' + tag_filePath);
    let tag;
    let thing;
    let dirName = jsonHandling.getFolder(thingName);
    let folder = folders[dirName];
    try {
      tag = await jsonHandling.get(tagName(thingName));
      thing = await jsonHandling.get(thingName);

    } catch (e) {
      console.error("Error loading  ", thingName, e);
      return;
    }
    if (folder) for (let i = 0; i < folder.length; i++) {
      console.log('folder i %o', folder[i]);
      var entry = folder[i];

      console.log(entry.id + ' vs ' + tag.id);
      console.log('%o', folder[i]);

      if (entry.id == tag.id) {
        entry.img = getPortrait(thing);
        folder[i] = JSON.stringify(entry);
        await jsonHandling.set(tagName(thingName), entry);

        msg.updateAppearance = updateAppearance;
        console.log('msg %o', msg);
        io.emit('change', msg);

        io.emit(
          'updateDir',
          { id: tagDir, folder: folders[dirName], makeFront: false });
        break;
      }
    }
  }
}


function RemoveDanglingRefs(io, thing, thingId, itemId) {  // this is clunky

  for (let i = 0; i < thing.appearance.length; i++) {
    let slots = thing.appearance[i].slots;
    if (!slots) continue;

    let keys = Object.keys(slots);

    keys.forEach((key, index) => {
      if (slots[key] == itemId) {
        slots[key] = '';
        let evaluation =
          'findInNamedArray(thing.appearance, thing.current_appearance).slots["' +
          key + '"] = ""';
        console.log('msg %o', { thing: thingId, change: evaluation });
        io.emit('change', { thing: thingId, change: evaluation });
      }
    });
  }
}


async function RemoveItemFromThing(io, msg) {
  let thingId = msg.thingId;
  let itemId = msg.itemId;

  console.log("thingId" + thingId);
  console.log("itemId" + itemId);

  let thing = await jsonHandling.get(thingId);
  let ok = false;
  if (thing && thing.items) {
    for (let i = 0; i < thing.items.length; i++) {
      if (thing.items[i].id == itemId) {
        thing.items.splice(i, 1);
        ok = true;
        console.log('Remove item ' + itemId + ' from ' + thingId);
        if (thing.appearance) {
          RemoveDanglingRefs(io, thing, msg.thingId, itemId);  // this is clunky
        }
        break;
      }
    }
  }
  if (ok) {

    jsonHandling.set(thingId, thing);



    io.emit('removeItemFromNpc', msg);
  }
}



async function AddItem(ownerName, item_id, io, msg) {
  if (item_id) {
    console.log("thingName", ownerName);
    // Need to put these in a cache and write them out over time for speed
    // this should go through a cache
    let promises = [];

    console.log("thingName", ownerName);
    console.log("itemid", item_id);
    console.log("tag", jsonHandling.tagName(item_id));


    let thing = await jsonHandling.get(ownerName);
    let item = await jsonHandling.get(item_id);
    let tag = await jsonHandling.get(jsonHandling.tagName(item_id));
    // copy the file to the same dir
    // get the main file maybe just a copy?
    item.page = tag.page;
    item.img = tag.img;
    item.id = tag.id;

    item.tag = tag;
    // add the item to the thing and write it
    if (!thing.items) thing.items = [];
    thing.items.push(item);
    await jsonHandling.set(ownerName, thing);
    await Promise.all(promises);
    io.emit('addItem', msg);
  }
}

module.exports = {
  ChangeThing: ChangeThing,
  AddItem: AddItem,
  folders: folders,
  findInNamedArray,
  RemoveItemFromThing: RemoveItemFromThing,
  chats: chats
};