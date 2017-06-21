/**
 * Created by lunik on 20/06/2017.
 */

import Interface from '../components/interface'

export default class Switch {
  constructor (hostname, interfaces) {
    this.hostname = hostname || `node-${Math.floor(Math.random() * 1000)}`

    this.interfaces = {}
    for (let i = 0; i < interfaces.length; i++) {
      this.interfaces[interfaces[i]] = new Interface({
        name: interfaces[i]
      })
      this.interfaces[interfaces[i]].on('trame', (trame) => this.handleTrame(interfaces[i], trame))
    }

    this.macTable = {}
    this.macTimeout = {}
    this.timeout = 5000
  }
  handleTrame (int, trame) {
    this.macTable[trame.src] = int

    /* clearTimeout(this.macTimeout[trame.src])
    this.macTimeout[trame.src] = setTimeout(() => {
      delete this.macTable[trame.src]
    }, this.timeout) */

    if (this.macTable[trame.dst]) {
      if (this.interfaces[this.macTable[trame.dst]].link && this.interfaces[this.macTable[trame.dst]].link.status()) {
        this.interfaces[this.macTable[trame.dst]].transmit(trame)
      }
    } else {
      for (let int in this.interfaces) {
        if (int && this.interfaces[int].link && this.interfaces[int].link.status()) {
          this.interfaces[int].transmit(trame)
        }
      }
    }
  }
}
