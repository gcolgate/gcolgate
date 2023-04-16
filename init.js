
'use strict'

var init = { inited: false }

init.until = function (conditionFunction) {
    const poll = resolve => {
        if (init.inited == true) resolve();
        else setTimeout(_ => poll(resolve), 400);
    }
    return new Promise(poll);
}




module.exports = init;