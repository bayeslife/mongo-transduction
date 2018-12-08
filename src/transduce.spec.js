const debug = require('debug')('transduce')


const mongoFactory = require('../test/MongoClient-Mock.js')
//const mongoFactory = require('../test/MongoClient-Dev.js')
const mockMeasurements = require('../test/mockMeasurement');

const { transduceAsyncHasNextIterator, mapping, compose,filtering,take} = require('funprog')

const assert = require('assert')

const mongoClient = require('mongodb').MongoClient
const clientFactory = require('./client.js')

const identity = x => x
const assetP = id =>  
    x => 
        x.AssetId === id
const getValue = x => x.Value


function concat (xs, val) {
    return xs.concat(val)
}

function append (xs, val) {
    return xs+val
}

describe('Given a mongo instance populated with test data', function(){
    this.timeout(0)
    var client, collection
    before(async function(){
        var measurements = mockMeasurements.getMeasurements()
        mongoServer = await mongoFactory.create("databasename",  "measurementCollection", measurements) 
        client = await clientFactory.makeClient(mongoClient,mongoServer)
        client.setCollection(mongoServer.collection)
    })
    after(function(){
        client.close()
        mongoServer.destroy()
    })

    describe('When we query measurements a datasource is returned from which we can asynchronously retrieve results', () => { 
        var datasource
        before(async () => {
        })
        it('Then', async () => {
            datasource = await client.query()
            var i=0
            while(await datasource.hasNext()){
                var n = await datasource.next()
                if(i++>3) break
            }
        })
    })

        describe('When we query measurements a datasource is returned from which we can iterate using for await of', () => { 
            var datasource
            before(async () => {
            })
            it('Then', async () => {
                datasource = await client.query()
                var i = 0
                for await (const n of datasource){
                    debug(n)
                    if(i++>3) break;
                }
            })
        })

    describe('When we query measurements a datasource is returned from which we can asynchronously retrieve results', () => {
        
        describe.only('Then we are able to transduce measurements successfully into an array', () => { 
            var datasource
            before(async () => {
                datasource = await client.query()
            }) 
            var datasink = []
            it('Then', async () => {
                const transform = compose(
                    mapping(identity),
                    filtering(assetP(1)),
                    mapping(getValue),
                    take(3),
                )
                var result = await transduceAsyncHasNextIterator(transform,concat,datasink,datasource)
                assert.equal(result.toString(), [ 1, 1, 1 ].toString())
            }) 
        })
        describe('Then we are able to transduce measurements successfully into a buffer', () => { 
            var datasource
            before(async () => {
                datasource = await client.query()
            }) 
            var datasink = ""
            it.only('Then', async () => {
                const transform = compose(
                    mapping(identity),
                    filtering(assetP(1)),
                    mapping(getValue),
                    take(3),
                )
                var result = await transduceAsyncHasNextIterator(transform,append,datasink,datasource)
                assert.equal(result, "111")
            }) 
        }) 
    }) 

})