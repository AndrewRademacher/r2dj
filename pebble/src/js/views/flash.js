var UI = require('ui');

module.exports = function (msg, next) {
    var card = new UI.Card({
        title: msg
    });

    card.show();

    setTimeout(function () { 
        card.hide();
        next();
    }, 2000);
};