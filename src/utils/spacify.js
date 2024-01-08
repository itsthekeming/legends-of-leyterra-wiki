/**
 * @param {string} string
 * @returns {string}
 */
export function spacify(string) {
  return decodeURIComponent(string)
    .replace(/%2C/g, ',') // commas aren't decoded by decodeURIComponent
    .replaceAll('_', ' ')
}
