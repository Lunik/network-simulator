/**
 * Created by lunik on 18/06/2017.
 */

import InterfaceEthernet from './ethernet'
import IPAddress from '../../address/ip'
import ARP from '../../protocols/arp/index'
import IP from '../../protocols/ip/index'
import Datagram from '../../protocols/ip/dataUnit'
import Trame from '../../protocols/ethernet/dataUnit'
import ICMP from '../../protocols/icmp/index'

export default class InterfaceIP extends InterfaceEthernet {
  constructor (props) {
    props = props || {}
    super(props)
    this.arpWorker = new ARP(this)
    this.icmpWorker = new ICMP(this)
    this.ipWorker = new IP(this)
    this.ip = new IPAddress(props.ip || '0.0.0.0', props.mac || '255.255.255.0')
    this.name = props.name || `eth${Math.floor(Math.random() * 100)}`
    this.on('datagram', (datagram) => this.ipWorker.handleDatagram(datagram))
    this.on('arp', (packet) => this.arpWorker.handlePacket(packet))
    this.on('icmp', (packet) => this.icmpWorker.handleICMP(packet))
  }
  ping (ip, cb) {
    this.icmpWorker.ping(ip, cb)
  }
  send (ip, data) {
    var sendFunction = (mac) => {
      var datagram = new Datagram(this.ip.val, ip, 'message', data)
      var trame = new Trame(this.mac.val, mac, 'ip', datagram)
      this.transmit(trame)
    }

    this.arpWorker.getMac(ip, sendFunction)
  }
}
