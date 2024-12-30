import urlProvider from "@/providers/UrlProvider.js";

class ChatService {

  /**
   * Creates a new chat using the provided parameters by sending a POST request to the Playlists endpoint.
   *
   * @param {{ name: string }} params - The parameters to include in the body of the request.
   * @return {Promise<Object|undefined>} A promise that resolves to the response JSON object if the request succeeds, or undefined if the request fails.
   */
  async createChat (params) {
    const chatsUrl = urlProvider.getFullUrlForEndpoint('Chats')
    const resp = await fetch(chatsUrl, {
      credentials: 'include',
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign({ messages: [] }, params))
    })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return false
    }
    return await resp.json()
  }

  async loadChat (chatId) {
    if (!chatId) return false
    const chatsUrl = urlProvider.getFullUrlForEndpoint(`Chats/${chatId}`)
    const resp = await fetch(chatsUrl, {
      credentials: 'include',
      method: 'GET',
    })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return false
    }
    return await resp.json()
  }

  async loadChats () {
    const chatsUrl = urlProvider.getFullUrlForEndpoint(`Chats/`)
    const resp = await fetch(chatsUrl, {
      credentials: 'include',
      method: 'GET',
    })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return false
    }
    return await resp.json()
  }


  async sendMessage (message) {
    const chatsUrl = urlProvider.getFullUrlForEndpoint('Messages')
    const resp = await fetch(chatsUrl, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (resp.status !== 200) {
      console.error('Something went wrong')
      return false
    }
    return await resp.json()
  }

  deleteMessage (chatId, messageId) {
  }

  deleteChat(chatId) {
  }

}

export default ChatService
