/**
 * Created by lunik on 20/06/2017.
 */

export default class ARPPacket {
  constructor(src, mac, type, data){
    this.src = src
    this.mac = mac
    this.type = type // request or response
    this.data = data // contain IP when type = request and mac when type = response
  }
}