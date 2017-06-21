/**
 * Created by lunik on 18/06/2017.
 */

import MACAddress from '../../address/mac'
import Ethernet from '../../protocols/ethernet/index'
import Interface from './index'

export default class InterfaceEthernet extends Interface {
  constructor (props) {
    props = props || {}
    super(props)
    this.mac = new MACAddress(props.mac || this.generateMac())
    this.ethernetWorker = new Ethernet(this)

    this.on('trame', (trame) => this.ethernetWorker.handleTrame(trame))
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
}
