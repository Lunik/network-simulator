/**
 * Created by lunik on 20/06/2017.
 */

export default class ICMPPacket {
  constructor (src, dst, type) {
    this.src = src
    this.dst = dst
    this.type = type // request or response
  }
}
