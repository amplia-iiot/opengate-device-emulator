var newVal = 'DEV_SPOOL_10'

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://preproapi.opengate.es:1883', {
    clientId: newVal,
    username: newVal,
    password: '2102481c-2a19-4e59-8a0e-1e5fe3393bc9'
})

client.on('connect', function () {
    console.log('conectado')
  client.subscribe('/odm/request/'+ newVal, function (err) {
    if (!err) {
      client.publish('/odm/request/'+ newVal, 'Hello mqtt')
    }
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})