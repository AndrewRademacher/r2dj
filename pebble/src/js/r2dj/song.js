var Song = function (s) {
    this.id = s.songId || s._id;
    this.title = s.title;
    this.artist = s.artist;
    this.vote = s.vote;
};

Song.new = function (s) {
    return new Song(s);
};

module.exports = Song;