const debug = require('debug')('transduce')

module.exports = {

  create: async function(database, collection, documents ){

    function noop(){
    }

    var config = {
      host: "10.8.161.147",
      port: 27017,
      database: "coates",
      collection: "measurement",
      destroy: noop 
    }

    debug(`mongodb://${config.host}:${config.port}`)

    return config
  }
}