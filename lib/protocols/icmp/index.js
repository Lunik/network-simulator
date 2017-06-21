/**
 * Created by lunik on 20/06/2017.
 */
import ICMPPacket from './dataUnit'
import Datagram from '../ip/dataUnit'
import Trame from '../ethernet/dataUnit'

export default class ICMP {
  constructor (target) {
    this.target = target
    this.timeout = 10000 // ms
    this.cbResponse = {}
  }
  ping (ip, cb) {
    var sendDate = new Date()
    var timeout = setTimeout(() => {
      cb(-1)
    }, this.timeout)

    this.cbResponse[ip] = () => {
      clearTimeout(timeout)
      var receiveDate = new Date()
      cb(receiveDate.getTime() - sendDate.getTime())
    }
    this.icmpRequest(ip, cb)
  }
  icmpRequest (ip) {
    this.target.arpWorker.getMac(ip, (mac) => {
      var icmpPacket = new ICMPPacket(this.target.ip.val, ip, 'request')
      var datagram = new Datagram(this.target.ip.val, ip, 'icmp', icmpPacket)
      var trame = new Trame(this.target.mac.val, mac, 'ip', datagram)
      this.target.transmit(trame)
    })
  }
  icmpResponse (ip) {
    this.target.arpWorker.getMac(ip, (mac) => {
      var icmpPacket = new ICMPPacket(this.target.ip.val, ip, 'response')
      var datagram = new Datagram(this.target.ip.val, ip, 'icmp', icmpPacket)
      var trame = new Trame(this.target.mac.val, mac, 'ip', datagram)
      this.target.transmit(trame)
    })
  }
  handleICMP (packet) {
    switch (packet.type) {
      case 'request':
        this.icmpResponse(packet.src)
        break
      case 'response':
        if (this.cbResponse[packet.src]) {
          this.cbResponse[packet.src]()
          delete this.cbResponse[packet.src]
        }
        break
      default:
        break
    }
  }
}
