module.exports = {
    flash: function (msg, next) {
        setTimeout(next, 1500);
    }
}