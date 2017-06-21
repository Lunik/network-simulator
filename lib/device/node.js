/**
 * Created by lunik on 20/06/2017.
 */
import InterfaceIP from '../components/interface/ip'
export default class Node {
  constructor (hostname, interfaces) {
    this.hostname = hostname || `node-${Math.floor(Math.random() * 1000)}`

    this.interfaces = {}
    for (let i = 0; i < interfaces.length; i++) {
      this.interfaces[interfaces[i]] = new InterfaceIP({
        name: interfaces[i]
      })
    }
  }
}
