/**
 * Created by lunik on 20/06/2017.
 */

import Datagram from '../ip/dataUnit'
import Trame from '../ethernet/dataUnit'
import ARPPacket from './dataUnit'

export default class ARP {
  constructor (target) {
    this.target = target
    this.arpTable = {}
    this.arpTimeout = {}
    this.arpCallBack = []
    this.timeout = 5000
  }
  getMac (ip, cb) {
    if (this.arpTable[ip]) {
      cb(this.arpTable[ip])
    } else {
      this.arpRequest(ip, cb)
    }
  }
  handlePacket (packet) {
    switch (packet.type) {
      case 'request':
        this.arpResponse(packet.src, packet.mac)
        break
      case 'response':
        this.arpTable[packet.src] = packet.data

        /*clearTimeout(this.arpTimeout[packet.src])
        this.arpTimeout[packet.src] = setTimeout(() => {
          delete this.arpTable[packet.src]
        }, this.timeout)*/

        for (let i = 0; i < this.arpCallBack.length; i++) {
          if (this.arpCallBack[i] && this.arpCallBack[i].ip === packet.src) {
            let cb = this.arpCallBack[i].cb
            delete this.arpCallBack[i]
            setTimeout(() => cb(packet.data))
          }
        }
        break
      default:
        break
    }
  }
  arpRequest (ip, cb) {
    var arpPacket = new ARPPacket(this.target.ip.val, this.target.mac.val, 'request', ip)

    this.arpCallBack.push({
      ip, cb
    })
    var datagram = new Datagram(this.target.ip.val, ip, 'arp', arpPacket)
    var trame = new Trame(this.target.mac.val, 'ff:ff:ff:ff:ff:ff', 'ip', datagram)
    this.target.transmit(trame)
  }
  arpResponse (ip, mac) {
    var arpPacket = new ARPPacket(this.target.ip.val, this.target.mac.val, 'response', this.target.mac.val)

    var datagram = new Datagram(this.target.ip.val, ip, 'arp', arpPacket)
    var trame = new Trame(this.target.mac.val, mac, 'ip', datagram)
    this.target.transmit(trame)
  }
}
