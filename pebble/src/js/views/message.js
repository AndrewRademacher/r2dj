var UI = require('ui');

module.exports = function (msg) {
    var card = new UI.Card({
        title: msg
    });

    card.show();
    
    return function () {
        card.hide();
        card.hide();
    };
};