/**
 * Created by lunik on 18/06/2017.
 */

import EventEmitter from 'events'
import MACAdress from '../adress/mac'

export default class InterfaceEthernet extends EventEmitter {
  constructor (props) {
    super()
    props = props || {}
    this.mac = new MACAdress(props.mac || this.generateMac())
    this.link = null
    this.state = true

    this.on('trame', (trame) => this.handleTrame(trame))
  }
  generateMac () {
    const chars = '0123456789abcdef'
    var mac = ''
    for (let i = 0; i < 12; i++) {
      mac += chars[Math.floor(Math.random() * 16)]
      if (i % 2 && i < 11) {
        mac += ':'
      }
    }
    return mac
  }
  status () {
    return this.state
  }
  enable () {
    this.state = true
  }
  disable () {
    this.state = false
  }
  transmit (dataUnit) {
    if (this.link === null) {
      throw 'No link connected.'
    }
    this.link.forward(this, dataUnit)
  }
  handleTrame (trame) {
    if (trame.dst === this.mac.val || trame.dst === 'ff:ff:ff:ff:ff:ff') {
      switch (trame.protocol) {
        case 'ip':
          this.emit('datagram', trame.data)
          break
        default:
          break
      }
    }
  }
  generatePacket (src, dst, protocol, data, options) {
    return {
      src, dst, protocol, data, options
    }
  }
}
