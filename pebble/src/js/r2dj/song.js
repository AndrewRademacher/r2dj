var Song = function (s) {
    this.id = s._id;
    this.title = s.title;
    this.artist = s.artist;
};

Song.new = function (s) {
    return new Song(s);
};

module.exports = Song;