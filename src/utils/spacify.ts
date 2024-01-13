export function spacify(string: string): string {
  return decodeURIComponent(string)
    .replace(/%2C/g, ',') // commas aren't decoded by decodeURIComponent
    .replaceAll('_', ' ')
}
