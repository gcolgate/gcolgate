
// create support for sheet


window.Spell = function (thing) {

    let s = thing.system;
    let damage = s.damage.parts;


    let answer = "<div>" + commaString(damage) + "</div>";
    if (s.save && s.save.ability) {
        answer += "<div" + s.save.ability + " save ";
        if (s.save.dc != null)
            answer += " dc " + s.save.dc;
        else
            answer += s.save.scaling;
        answer += + "</div>";
    }
    answer += "<div>" + span("Level", s.level) + "</div>";
    answer += "<div>" + span("School", s.school) + "</div>";

    let props = [];

    if (s.components.vocal) props.push("Vocal");
    if (s.components.somatic) props.push("Somatic");
    if (s.components.material) props.push("Material");
    if (s.components.ritual) props.push("Ritual");
    if (s.components.concentration) props.push("Concentration");
    if (s.components.value) props.push(s.components.value);
    answer += "<div> " + commaString(props) + "</div>";
    if (s.range && s.range.value) {

        answer += "<div><span>Range</span>" + s.range.value +
            (s.range.long ? "/" + s.range.long : "") +
            +" " + s.range.units + "</div>";
    }
    return answer;
};



createCSSSelector('.spellsetheader', "box-sizing: border-box; \
    color: rgb(88, 23, 13); \
    background-color: rgb(255, 215, 170); \
    color-scheme: light dark; \
    font-family: Mrs Eaves; \
    font-size: 30px; \
    font-variant-alternates: normal; \
    font-variant-caps: small-caps; \
    font-variant-east-asian: normal; \
    font-variant-ligatures: normal; \
    font-variant-numeric: normal; \
    font-variant-position: normal; \
    font-weight: 700; \
    line-height: 42px; \
    margin-bottom: -5px; \
    margin-left: 0px; \
    margin-right: 0px; \
    margin-top: -10px; \
    text-transform: capitalize");



createCSSSelector('.spellNumInput', ' \
    background-color: rgb(255, 215, 170); \
    border-top-style: hidden;\
    border-right-style: hidden;\
    border-left-style: hidden;\
    border-bottom-style: hidden;\
    color-scheme: light dark; \
    font-family: Mrs Eaves; \
    font-variant-alternates: normal; \
    font-variant-caps: small-caps; \
    font-variant-east-asian: normal; \
    font-variant-ligatures: normal; \
    font-variant-numeric: normal; \
    font-variant-position: normal; \
    font-weight: 300;');

createCSSSelector('.spellBold', "font-weight: 700;");

