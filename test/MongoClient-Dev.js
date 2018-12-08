const debug = require('debug')('transduce')

module.exports = {

  create: async function(database, collection, documents ){

    debug(`mongodb://${mongoServerInstance.host}:${mongoServerInstance.port}`)

    return {
      host: "10.8.161.147",
      port: 27017,
      database: "coates",
      collection: "measurement" 
    }
  }
}