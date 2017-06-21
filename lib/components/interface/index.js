/**
 * Created by lunik on 18/06/2017.
 */

import EventEmitter from 'events'

export default class Interface extends EventEmitter {
  constructor (props) {
    props = props || {}
    super()
    this.link = null
    this.state = true
    this.id = Math.floor(Math.random() * 100000)
  }
  status () {
    return this.state
  }
  enable () {
    this.state = true
  }
  disable () {
    this.state = false
  }
  transmit (dataUnit) {
    if (this.link === null) {
      throw 'No link connected.'
    }
    this.link.forward(this, dataUnit)
  }
}
