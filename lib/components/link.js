/**
 * Created by lunik on 18/06/2017.
 */
import EventEmitter from 'events'

export default class Link extends EventEmitter{
  constructor (props) {
    super()
    props = props || {}
    this.interfaces = []
  }
  attach (int) {
    if (this.interfaces >= 2) {
      throw 'This link is already connected on both sides.'
    }
    this.interfaces.push(int)
    int.link = this
  }
  detach (int) {
    for (let i = 0; i < this.interfaces.length; i++) {
      if (this.interfaces[i].id === int.id) {
        this.interfaces[i].link = null
        delete this.interfaces[i]
      }
    }
  }
  status () {
    return this.interfaces.length === 2 &&
        this.interfaces[0].status() &&
        this.interfaces[1].status()
  }
  forward (from, trame) {
    if (this.status()) {
      this.emit('forward', trame)

      if (this.interfaces[0].id === from.id) {
        this.interfaces[1].emit('trame', trame)
      } else {
        this.interfaces[0].emit('trame', trame)
      }
    }
  }
}
