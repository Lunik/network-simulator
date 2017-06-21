/**
 * Created by lunik on 18/06/2017.
 */
'use strict'
import Link from '../lib/components/link'
import Switch from '../lib/device/switch'
import Node from '../lib/device/node'
import IPAddress from '../lib/address/ip'

var node1 = new Node('node1', ['eth1', 'eth0'])
node1.interfaces['eth0'].ip = new IPAddress('192.168.1.101', '255.255.255.0')
var node2 = new Node('node2', ['eth1', 'eth0'])
node2.interfaces['eth0'].ip = new IPAddress('192.168.1.102', '255.255.255.0')
var node3 = new Node('node3', ['eth1', 'eth0'])
node3.interfaces['eth0'].ip = new IPAddress('192.168.1.103', '255.255.255.0')
var sw1 = new Switch('sw1', ['eth1', 'eth0', 'eth2'])

var link1 = new Link()
link1.attach(node1.interfaces['eth0'])
link1.attach(sw1.interfaces['eth0'])

var link2 = new Link()
link2.attach(sw1.interfaces['eth1'])
link2.attach(node2.interfaces['eth0'])

var link3 = new Link()
link3.attach(sw1.interfaces['eth2'])
link3.attach(node3.interfaces['eth0'])

node3.interfaces['eth0'].on('trame', (data) => console.log('trame', data))
var ping = () => {
  node2.interfaces['eth0'].ping('192.168.1.101', (time) => {
    console.log(time)
    setTimeout(ping, 1000)
  })
}

ping()

/*
import Node from '../lib/device/node'
import Switch from '../lib/device/switch'

var raspi = new Node({
  hostname: 'raspi.banana',
  interfaces: ['eth0']
})
raspi.interfaces['eth0'].ip = '192.168.1.180'

var raspidev = new Node({
  hostname: 'raspidev.banana',
  interfaces: ['eth0', 'wlan0']
})
raspidev.interfaces['eth0'].ip = '192.168.1.181'
raspidev.interfaces['wlan0'].ip = '192.168.1.184'

var raspihat = new Node({
  hostname: 'raspihat.banana',
  interfaces: ['eth0', 'wlan0']
})
raspihat.interfaces['eth0'].ip = '192.168.1.182'
raspihat.interfaces['wlan0'].ip = '192.168.1.183'

var swpi = new Switch({
  hostname: 'swpi',
  interfaces: ['eth0', 'eth1', 'eth2', 'eth3', 'eth4']
})

var link1 = new Link()

link1.attach(raspi.interfaces['eth0'])
link1.attach(swpi.interfaces['eth4'])

var link2 = new Link()

link2.attach(raspidev.interfaces['eth0'])
link2.attach(swpi.interfaces['eth3'])

var link3 = new Link()

link3.attach(raspihat.interfaces['eth0'])
link3.attach(swpi.interfaces['eth2'])

raspihat.on('message', (message) => {
  console.log(message)
})

raspi.interfaces['eth0'].send(raspihat.interfaces['eth0'].ip, 'coucou')
  */
