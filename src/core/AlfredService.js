import audioPlayer from "@/core/AudioPlayer.js";
import urlProvider from "@/providers/UrlProvider.js";
class AlfredService {
  #router
  #playlistsService
  #songsService
  /**
   * Constructor for initializing the service with the provided router and playlists service.
   *
   * @param {VueRouter} router - The router instance for managing application routes.
   * @param {PlaylistsService} playlistsService - The playlists service instance for handling playlist-related operations.
   * @param {SongsService} songsService
   */
  constructor(router, playlistsService, songsService) {
    this.#router = router
    /**
     * @type {PlaylistsService}
     * A private instance of the playlists service used to manage and manipulate playlist data.
     * It is intended to handle logic and interaction with the playlists repository or data source.
     */
    this.#playlistsService = playlistsService
    this.#songsService = songsService
  }

  async ask (message) {
    const alfredUrl = urlProvider.getFullUrlForEndpoint('Alfred')
    const resp = await fetch(alfredUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // Ensure proper content-type is specified
      },
      body: JSON.stringify(message),
    })
    if (resp.status !== 200) {
      return this.parseResponse({ type: '', data: { where: '', params: {} }, textRepsonse: '' })
    }
    return this.parseResponse(await resp.json())
  }

  /**
   * Parses the given response and processes it.
   *
   * @param {{ type: string, data: { where: string, params: object }, textReponce: string }} resp - The response object to be parsed.
   */
  parseResponse(resp) {
    switch (resp.type) {
      case 'question':
        return this.#question(resp)
      case 'navigation':
        return this.#navigation(resp)
      case 'action':
        return this.#action(resp)
      default:
        return {
          type: 'undefined',
          handler: () => {
            console.log('Undefined response type')
            console.log(resp)
          }
        }
    }
  }

  /**
   * Handles navigation based on the provided response object.
   * This method processes the given response to determine the appropriate navigation state or action.
   *
   * @param {Object} resp - The response object containing data required for navigation processing.
   */
  #navigation(resp) {

    const playlist = {
      type: 'navigation',
      handler: async () => {
        if (!resp.data.params.name) {
          this.#router.push({
            name: 'library',
            query: { tab: 'playlists' }
          })
          return
        }

        const playlist = await this.#playlistsService.findPlaylistByName(resp.data.params.name)
        if (playlist) {
          this.#router.push({
            name: 'playlist-view',
            params: { id: playlist.id }})
          return
        }

        this.#router.push({
          name: 'library',
          query: { tab: 'playlists' }
        })
      }
    }

    switch ((resp.data.where || '').toLowerCase()) {
      case 'library':
        return { type: 'navigation', handler: () => this.#router.push({ name: 'library' }) }
      case 'playlists':
        return playlist
      case 'playlist':
        return playlist
      case 'home':
        return {
          type: 'navigation',
          handler: () => this.#router.push({ name: 'home' })
        }
      case 'profile':
        return {
          type: 'navigation',
          handler: () => this.#router.push({ name: 'profile' })
        }
      case 'chat':
      case 'alfred':
        return {
          type: 'navigation',
          handler: () => this.#router.push({ name: 'alfred' })
        }
      default:
        return {
          type: 'unknown',
          handler: () => {}
        }
    }
  }

  #action (resp) {
    if (resp.data.params.song) {
      return {
        type: 'action',
        handler: async () => {
          const song = await this.#songsService.findSongByName(resp.data.params.song)
          if (song) {
            await audioPlayer.setSong(song)
            audioPlayer.play()
          }
        }
      }
    }
  }


  /**
   * Retrieves the text response from the given response object.
   *
   * @param {{ type: string, data: { where: string, params: object }, textReponce: string }} resp - The response object to be parsed.
   * @return {{ type: string, handler: function }} The value of the textResponse property from the response object.
   */
  #question (resp) {
    return { type: 'question', handler: () => resp.textReponce}
  }
}

export default AlfredService
