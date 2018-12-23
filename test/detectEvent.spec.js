const debug = require('debug')('transduce')
const assert = require('assert')

const { events, measurements } = require('./generatedEventsAndMeasurement.js')


const mongoFactory = require('./MongoClient-Mock.js')

const { transduceAsyncHasNextIterator, mapping, compose,eventing,take,concat,select, digitize} = require('funprog')


const mongoClient = require('mongodb').MongoClient
const clientFactory = require('../src/client.js')


describe('Given a mongo instance populated with test data', function(){
    this.timeout(0)
    var client, collection
    before(async function(){

        mongoServer = await mongoFactory.create("databasename",  "measurementCollection", measurements) 
        client = await clientFactory.makeClient(mongoClient,mongoServer)
        client.setCollection(mongoServer.collection)
    })
    after(function(){
        client.close()
        mongoServer.destroy()
    })

    describe('When we query measurements a datasource is returned from which we can asynchronously retrieve results', () => {

        describe('Then we are able to transduce to detect the original events', () => { 
            var datasource
            before(async () => {
                datasource = await client.query()
            }) 
            var datasink = []
            it('Then the detected events match the expected', async () => {
                const transform = compose(
                    eventing(select('Value')) 
                )
                var result = await transduceAsyncHasNextIterator(transform,concat,datasink,datasource)
                for(var i=0;i<events.length;i++){
                    var event = events[i]
                    var detectedEvent = result[i]
                    assert.equal(event.start, detectedEvent.start)
                }
            }) 
        }) 
    }) 

})