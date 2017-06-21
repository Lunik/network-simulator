/**
 * Created by lunik on 18/06/2017.
 */

export default class MACAddress {
  constructor (mac) {
    this.val = this.parse(mac)
  }
  parse (string) {
    const regex = new RegExp(/([0-9a-f]{2}[:-]){5}[0-9a-f]{2}/)
    if (regex.test(string)) {
      return string.toLowerCase()
    } else {
      throw `${string} is not a valid MAC adress.`
    }
  }
}
