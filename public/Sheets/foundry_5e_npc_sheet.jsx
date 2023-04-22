

<div>
  <div class="body" style="height:{contentHeight}px;
        overflow:auto;
        background-color: rgb(255, 215, 170);
        width:100%;">
    <div>
      <h1 style="box-sizing: border-box;
        color: rgb(88, 23, 13);
        color-scheme: light dark;
        font-family: Mrs Eaves;
        font-size: 30px;
        font-variant-alternates: normal;
        font-variant-caps: small-caps;
        font-variant-east-asian: normal;
        font-variant-ligatures: normal;
        font-variant-numeric: normal;
        font-variant-position: normal;
        font-weight: 700;
        line-height: 42px;
        margin-bottom: -5px;
        margin-left: 0px;
        margin-right: 0px;
        margin-top: -10px;
        text-transform: capitalize"
      >
        {sheet.name} </h1>
    </div>
    <div style="box-sizing: border-box;
          color: rgb(0, 0, 0);
          color-scheme: light dark;
          font-family: Georgia, serif;
          font-size: 15px;
          font-style: italic;
          font-weight: 400;
          margin:8px;
          line-height: 26.1333px;
          text-transform: lowercase">
      {sheet.system.traits.size}<span> {get5eDetails(sheet)} </span></div>
    <div></div>
    <div>
      <ul style="box-sizing: border-box;
          color: rgb(88, 23, 13);
          color-scheme: light dark;
          font-family: Georgia, serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 21px;
          list-style-type: none">
        <li><span style="font-weight: 700;">Armor Class </span>{sheet.system.attributes.ac.flat}</li>
        <li><span style="font-weight: 700;">Hit Points </span>{sheet.system.attributes.hp.max}</li>
        <li><span style="font-weight: 700;">Cur Hit Points </span>{sheet.system.attributes.hp.value}</li>
        {sheet.system.attributes.movement.burrow ? '<li><span style="font-weight: 700;"> Burrow </span>' + sheet.system.attributes.movement.burrow + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.climb ? '<li><span style="font-weight: 700;"> Climb </span>' + sheet.system.attributes.movement.climb + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.swim ? '<li><span style="font-weight: 700;"> Swim </span>' + sheet.system.attributes.movement.swim + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.walk ? '<li><span style="font-weight: 700;"> Walk </span>' + sheet.system.attributes.movement.walk + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.hover ? "<li>Can Hover</li>" : ""}
      </ul>
    </div>
    <div ></div>
    <div >
      <div style="box-sizing: border-box;
            color: rgb(88, 23, 13);
            color-scheme: light dark;
            display: inline-block;
            font-family: Georgia, serif;
            font-size: 20px;
            font-weight: 400">
        <div class="attr" style="display: inline-block"><span>STR</span><br>
          <div class="attr-num">{sheet.system.abilities.str.value}</div>
        </div>
        <div class="attr" style="display: inline-block"><span>DEX</span><br>
          <div class="attr-num">{sheet.system.abilities.dex.value}</div>
        </div>
        <div class="attr" style="display: inline-block"><span>CON</span><br>
          <div class="attr-num">{sheet.system.abilities.con.value}</div>
        </div>
        <div class="attr" style="display: inline-block"><span>INT</span><br>
          <div class="attr-num">{sheet.system.abilities.int.value}</div>
        </div>
        <div class="attr" style="display: inline-block"><span>WIS</span><br>
          <div class="attr-num">{sheet.system.abilities.wis.value}</div>
        </div>
        <div class="attr-cha" style="display: inline-block"><span>CHA</span><br>
          <div class="attr-num">{sheet.system.abilities.cha.value}</div>
        </div>
      </div>
    </div>
    <div ></div>
    <div >
      <ul>
        <li><span>Senses </span> passive Perception 10</li>
        <li><span>Languages </span>Any One Language (Usually Common)</li>
        <li><span>Challenge </span> 1/8 (25 XP)</li>
      </ul>
    </div>
    <div  ></div>
    <div  >
      <ul>
      </ul>
    </div>
    <div >
      <a ></a>
      <h2>Actions</h2>
      <ul>
        <li><span>Scimitar.</span> <i>Melee Weapon Attack:</i>
          +3 to hit, reach 5 ft., one target.
          <i>Hit: </i>(1d6 + 1) slashing damage.
        </li>
        <li><span>Light Crossbow.</span> <i>Ranged Weapon Attack:</i>
          +3 to hit, reach 80/320 ft., one target.
          <i>Hit: </i>(1d8 + 1) piercing damage.
        </li>
      </ul>
    </div>
    <div class="reactions">

      <ul>

      </ul>
    </div>
    <div class="legendary-actions">
      <ul>
      </ul>
    </div>
    <div class="mythic-actions">
      <ul>
      </ul>
    </div>
  </div >
  <div class="gold"></div>
</div >
