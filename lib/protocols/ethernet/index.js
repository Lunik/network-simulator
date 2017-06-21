/**
 * Created by lunik on 20/06/2017.
 */

export default class Ethernet {
  constructor (target) {
    this.target = target
  }
  handleTrame (trame) {
    if (trame.dst === this.target.mac.val || trame.dst === 'ff:ff:ff:ff:ff:ff') {
      switch (trame.protocol) {
        case 'ip':
          if(this.target.arpWorker) {
            this.target.arpWorker.arpTable[trame.data.src] = trame.src // save to arp table if we receiv a packet
          }
          this.target.emit('datagram', trame.data)
          break
        default:
          break
      }
    }
  }
}
