module.exports = {
    getId: function() {
        var text = "";
        for (var i = 0; i < 4; i++) {
            text += Math.floor((Math.random() * 9)).toString();
        }
        return text;
    }
};