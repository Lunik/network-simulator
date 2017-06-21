/**
 * Created by lunik on 18/06/2017.
 */

export default class IPAddress {
  constructor (ip, mask) {
    this.val = this.parse(ip)
    this.mask = this.parse(mask)
  }
  parse (string) {
    const regex = new RegExp(/([0-9][0-9]?[0-9]?.){3}[0-9][0-9]?[0-9]?/)
    if (regex.test(string)) {
      var numbers = string.split('.')
      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] > 255) {
          throw `${numbers[i]} is too high for an ip adress.`
        }
      }
      return string.toLowerCase()
    } else {
      throw `${string} is not a valid IP adress.`
    }
  }
}
