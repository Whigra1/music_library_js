import urlProvider from "@/providers/UrlProvider.js";
class PlaylistsService {
  constructor(songsService) {
    this.songsService = songsService
  }
  async loadPlaylists() {
    const playlistUrl = urlProvider.getFullUrlForEndpoint('Playlists')
    const resp = await fetch(playlistUrl, {credentials: 'include'})
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return
    }
    return await resp.json()
  }

  async loadSongs(playlistId) {
    return this.songsService.loadSongForPlaylist(playlistId)
  }

  async deletePlaylist(playlistId) {
    const fullUrl = urlProvider.getFullUrlForEndpoint(`Playlists/${playlistId}`)
    const resp = await fetch(fullUrl, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (resp.status !== 200) {
      console.error('Error deleting playlist: ' + await resp.text())
    }
    return resp.status === 200
  }

  async findPlaylistByName(name) {
    const playlistUrl = urlProvider.getFullUrlForEndpoint('Playlists')
    playlistUrl.searchParams.append('name', name)
    const resp = await fetch(playlistUrl, {credentials: 'include'})
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return
    }
    return await resp.json()
  }
}

export default PlaylistsService
