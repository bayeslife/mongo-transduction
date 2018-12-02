'use strict';
const MongoInMemory = require('mongo-in-memory');

const debug = require('debug')('transduce')

module.exports = {

  create: async function(database, collection, documents ){

    var mongoServerInstance = new MongoInMemory();

    try {
    await mongoServerInstance.start()
    }catch(err){
      console.log(err)
    }

    debug(`mongodb://${mongoServerInstance.host}:${mongoServerInstance.port}`)

    for (let document of documents) {
      await mongoServerInstance.addDocument(database, collection, document);
    };

    return {
      host: mongoServerInstance.host,
      port: mongoServerInstance.port,
      database,
      collection
    }
  }
}