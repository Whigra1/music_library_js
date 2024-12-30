class Song {

  /**
   * Constructs an instance of a song node with the given song ID, previous node, and next node.
   *
   * @param {number|string} id - The identifier for the song.
   * @param {string} name - song name
   * @param title
   * @param artist
   */
  constructor({ id, name, title, artist, description }) {
    this.id = id
    this.name = name
    this.title = title
    this.artist = artist
    this.description = description
    this._prev = null
    this._next = null
  }

  setPrev (prev) {
    this._prev = prev
  }

  setNext (next) {
    this._next = next
  }

  next() {
    return this._next;
  }

  prev() {
    return this._prev;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      title: this.title,
      artist: this.artist,
      description: this.description,
    }
  }
}

export default Song;
