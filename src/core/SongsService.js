import urlProvider from "@/providers/UrlProvider.js";
import Song from "@/core/Song.js";
import song from "@/core/Song.js";

class SongsService {
  #chainSongs (songs) {
    const res = []
    for (let i = 0; i < songs.length; i++) {
      const song = new Song(songs[i])
      res.push(song)
      if (i === 0) continue
      song.setPrev(res[i - 1])
      song.prev().setNext(song || null)
    }
    return res
  }

  async loadSongs() {
    const songsUrl = urlProvider.getFullUrlForEndpoint('Songs')
    const resp = await fetch(songsUrl, { credentials: 'include' })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return
    }
    const rawSongs = await resp.json()
    return this.#chainSongs(rawSongs)
  }

  async loadSongForPlaylist(playlistId) {
    const songsUrl = urlProvider.getFullUrlForEndpoint(`Playlists/${playlistId}/Songs`)
    const resp = await fetch(songsUrl, { credentials: 'include' })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return
    }
    const rawSongs = await resp.json()
    return this.#chainSongs(rawSongs)
  }

  async loadSongFiles(songId) {
    const fullUrl = urlProvider.getFullUrlForEndpoint(`Songs/${songId}/Files`)
    const resp = await fetch(fullUrl, {
      method: 'GET',
      credentials: 'include',
    })
    if (resp.status !== 200) {
      console.error('Error getting song files: ' + await resp.text())
      return false
    }

    return await resp.json()
  }

  async findSongByName(name) {
    const songsUrl = urlProvider.getFullUrlForEndpoint('Songs')
    songsUrl.searchParams.append('name', name)
    const resp = await fetch(songsUrl, { credentials: 'include' })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return
    }
    const rawSongs = await resp.json()
    return new Song(rawSongs)
  }
}

export default SongsService
