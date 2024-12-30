import urlProvider from "@/providers/UrlProvider.js";
import SongsService from "@/core/SongsService.js";
class AudioPlayer {
  constructor (songContainerSelector) {
    this.selector = songContainerSelector
    this.song = null
    this.eventEmitter = new EventTarget()
  }

  getSongTitle() {
    return this.song && this.song.title
  }

  async setSong (song) {
    const divContainer = document.querySelector(this.selector)
    if (!divContainer) {
      console.error('Audio player container not found')
      return
    }

    try {
      const songService = new SongsService()
      const files = await songService.loadSongFiles(song.id)
      const getFileUrl = s => urlProvider.getFullUrlForEndpoint(`Streaming/${s.id}`)
      const sources = files.map(f => `<source src="${getFileUrl(f)}">`)
      divContainer.innerHTML = `
         <audio id="audio-player">
            ${sources.join('\n')}
         </audio>
      `
    } catch (e) {
      console.error(e)
      return false
    }
    this.song = song
    return true
  }

  on(eventName, cb) {
    this.eventEmitter.addEventListener(eventName, cb)
  }

  play () {
    const container = document.querySelector(this.selector)
    if (!container) {
      return
    }

    const audio = container.querySelector('audio')

    if (!audio) {
      console.error('Audio player not found. Most likely the song is not set or setSong was called without await.')
    }

    audio
      .play()
      .then(() => {
        this.eventEmitter.dispatchEvent(new CustomEvent('play', this.song))
      })
      .catch((err) => {
        console.error(err)
      })
  }

  pause() {
    const container = document.querySelector(this.selector)
    if (!container) {
      return
    }

    container.querySelector('audio').pause()
    this.eventEmitter.dispatchEvent(new CustomEvent('pause', this.song))
  }

  async next() {
    const nextSong = this.song.next()
    if (!nextSong) return
    await this.setSong(nextSong)
    this.play()
  }

  async prev() {
    const prevSong = this.song.prev()
    if (!prevSong) return
    await this.setSong(prevSong)
    this.play()
  }

  hasNext() {
    return this.song && !!this.song.next()
  }

  hasPrev() {
    return this.song && !!this.song.prev()
  }

}

export default new AudioPlayer('#audio-container')
