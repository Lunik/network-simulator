/**
 * Created by lunik on 18/06/2017.
 */

import InterfaceEthernet from './interfaceEthernet'
import IPAdress from '../adress/ip'
export default class InterfaceIP extends InterfaceEthernet {
  constructor (props) {
    props = props || {}
    super(props)
    this.ip = new IPAdress(props.ip || '0.0.0.0', props.mac || '255.255.255.0')

    this.on('datagram', (datagram) => this.handleDatagram(datagram))

    this.arpTable = {}
    this.arpTimeout = {}
    this.arpCallBack = []
  }
  handleDatagram (datagram) {
    if (datagram.dst === this.ip.val) {
      switch (datagram.protocol) {
        case 'arp':
          this.handleARP(datagram.data)
          this.emit('arp', datagram.data)
          break
        case 'message':
          this.emit('message', datagram.data)
          break
        case 'icmp':
          this.handleICMP(datagram.data)
          this.emit('icmp', datagram.data)
          break
        default:
          break
      }
    }
  }
  send (ip, data) {
    var sendFunction = (mac) => {
      var datagram = this.generatePacket(this.ip.val, ip, 'message', data)
      var trame = this.generatePacket(this.mac.val, mac, 'ip', datagram)
      this.transmit(trame)
    }

    if (this.arpTable[ip]) {
      sendFunction(this.arpTable[ip])
    } else {
      this.arpRequest(ip, sendFunction)
    }
  }
  arpRequest (ip, cb) {
    var arpPacket = {
      ask: ip,
      src: this.ip.val,
      type: 'request'
    }
    this.arpCallBack.push({
      ip, cb
    })
    var datagram = this.generatePacket(this.ip.val, ip, 'arp', arpPacket)
    var trame = this.generatePacket(this.mac.val, 'ff:ff:ff:ff:ff:ff', 'ip', datagram)
    this.transmit(trame)
  }
  arpResponse (ip) {
    var arpPacket = {
      mac: this.mac.val,
      src: this.ip.val,
      type: 'response'
    }
    var datagram = this.generatePacket(this.ip.val, ip, 'arp', arpPacket)
    var trame = this.generatePacket(this.mac.val, 'ff:ff:ff:ff:ff:ff', 'ip', datagram)
    this.transmit(trame)
  }
  handleARP (packet) {
    switch (packet.type) {
      case 'request':
        this.arpResponse(packet.src)
        break
      case 'response':
        this.arpTable[packet.src] = packet.mac

        clearTimeout(this.arpTimeout[packet.src])
        this.arpTimeout[packet.src] = setTimeout(() => {
          delete this.arpTable[packet.src]
        }, 5000)

        for (let i = 0; i < this.arpCallBack.length; i++) {
          if (this.arpCallBack[i].ip === packet.src) {
            setTimeout(() => this.arpCallBack[i].cb(packet.mac))
          }
        }
        break
      default:
        break
    }
  }
  handleICMP (packet) {

  }
}
