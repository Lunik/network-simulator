/**
 * Created by lunik on 20/06/2017.
 */

export default class IP {
  constructor (target) {
    this.target = target
  }
  handleDatagram (datagram) {
    if (datagram.dst === this.target.ip.val) { // or broadcast
      switch (datagram.protocol) {
        case 'arp':
          this.target.emit('arp', datagram.data)
          break
        case 'message':
          this.target.emit('message', datagram.data)
          break
        case 'icmp':
          this.target.emit('icmp', datagram.data)
          break
        default:
          break
      }
    }
  }
}
