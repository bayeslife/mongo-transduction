var debug = require('debug')('transduce')

module.exports={

    makeClient: async function(mongoClient,config) {

        var url = `mongodb://${config.host}:${config.port}`
        debug(url)

        const client = await mongoClient.connect(url,{useNewUrlParser: true});
        const database = config.database

        var db 
        var collection
        
        return {
            setCollection(collectionName){
                debug(`setCollection: ${collection}`)
                db = client.db(database)
                collection =  db.collection(collectionName);
            },
            query: async function() {
                debug("query")
                var results = await collection.find({})
                return results
            },
            close: function(){
                client.close();
            }
        }
    }

 }