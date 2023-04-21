
<div class="gold">
  <div ></div>
  <div class="body" style="box-sizing: border-box;
color: rgb(88, 23, 13);
color-scheme: light dark;
font-family: Mrs Eaves;
font-size: 20px;
font-variant-alternates: normal;
font-variant-caps: small-caps;
font-variant-east-asian: normal;
font-variant-ligatures: normal;
font-variant-numeric: normal;
font-variant-position: normal;
font-weight: 700;
line-height: 22px;
margin-bottom: -5px;
margin-left: 0px;
margin-right: 0px;
margin-top: -10px;
ext-transform: capitalize;
height:{contentHeight}px;
overflow:auto;
width:100%;">
    <div >
      <a name="toc_3"></a>
      <h1>{sheet.name} </h1>
    </div>
    <div >{sheet.system.traits.size}<span> {get5eDetails(sheet)} </span></div>
    <div  ></div>
    <div  >
      <ul>
        <li><span>Armor CLass </span>{sheet.system.attributes.ac.flat}</li>
        <li><span>Hit Points </span>{sheet.system.attributes.hp.max}</li>
        <li><span>Cur Hit Points </span>{sheet.system.attributes.hp.value}</li>
        <li><span>Armor CLass </span>{sheet.system.attributes.ac.flat}</li>
        {sheet.system.attributes.movement.burrow ? '<li><span> Burrow </span>' + sheet.system.attributes.movement.burrow + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.climb ? '<li><span> Climb </span>' + sheet.system.attributes.movement.climb + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.swim ? '<li><span> Swim </span>' + sheet.system.attributes.movement.swim + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.walk ? '<li><span> Walk </span>' + sheet.system.attributes.movement.walk + " " + sheet.system.attributes.movement.units + '</li>' : ""}
        {sheet.system.attributes.movement.hover ? "<li>Can Hover</li>" : ""}
      </ul>
    </div>
    <div ></div>
    <div >
      <div style="display: inline-block">
        <div class="attr"><span>STR</span><br>
          <div class="attr-num">{sheet.system.abilities.str.value}</div>
        </div>
        <div class="attr"><span>DEX</span><br>
          <div class="attr-num">{sheet.system.abilities.dex.value}</div>
        </div>
        <div class="attr"><span>CON</span><br>
          <div class="attr-num">{sheet.system.abilities.con.value}</div>
        </div>
        <div class="attr"><span>INT</span><br>
          <div class="attr-num">{sheet.system.abilities.int.value}</div>
        </div>
        <div class="attr"><span>WIS</span><br>
          <div class="attr-num">{sheet.system.abilities.wis.value}</div>
        </div>
        <div class="attr-cha"><span>CHA</span><br>
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
  </div>
  <div class="gold"></div>
</div>
