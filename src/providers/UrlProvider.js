const BACKEND_URL = 'http://localhost:5207'
const API_VERSION = `v1`
class UrlProvider {
  getFullUrlForEndpoint(endpointName) {
    return new URL(`${BACKEND_URL}/api/${API_VERSION}/${endpointName}`)
  }

  /**
   * Constructs a full URL by appending query parameters to the endpoint URL.
   *
   * @param {string} endpointName - The name of the endpoint to construct the URL for.
   * @param {Object} params - An object containing key-value pairs representing query parameters to add to the URL.
   * @return {URL} The full URL with query parameters appended.
   */
  getFullUrlForEndpointWithParams(endpointName, params) {
    const url = this.getFullUrlForEndpoint(endpointName)
    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key])
    })
    return url
  }

  getBaseUrl() {
    return BACKEND_URL
  }
}

export default new UrlProvider()

