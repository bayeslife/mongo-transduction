
const mockMongoDb = require('../test/mocMongoDb.js')
const mockMeasurements = require('../test/mockMeasurement');

const { transduceAsyncHasNextIterator, mapping, compose} = require("funprog")

const assert = require('assert'); 

const mongoClient = require('mongodb').MongoClient;
const clientFactory = require('./client.js')

const identity = x => x
const getValue = x => x.Value

describe('Given a mongo instance populated with test data', function(){
    this.timeout(0)
    var client, collection
    before(async function(){
        var measurements = mockMeasurements.getMeasurements();
        var mongoConfig = await mockMongoDb.create("databasename",  "measurementCollection", measurements);  
        client = await clientFactory.makeClient(mongoClient,mongoConfig)
        client.setCollection(mongoConfig.collection)
    });
    after(function(){
        client.close()
    })
  
    describe('When we query measurements a cursor is returned from which we can asynchronously retrieve results', () => { 
        var cursor
        before(async () => {
        });
        it('Then', async () => {
            cursor = await client.query()
            var n
            while(await cursor.hasNext()){
                n = await cursor.next();
                //console.log(n)
            }
        })
        describe('Then we are able to transduce measurements successfully', () => { 
            before(async () => {
                cursor = await client.query()
            });
            it('Then', async () => {
                const transform = compose(
                    mapping(identity),
                    mapping(getValue)
                )
                function concat (xs, val) {
                    return xs.concat(val)
                }
                var result = await transduceAsyncHasNextIterator(transform,concat,[],cursor)
                assert.equal(result.toString(), [ 1, 1, 0 ].toString())
            }) 
        }) 
    }) 

     
});


 
