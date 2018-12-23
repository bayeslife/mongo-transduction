function makeMeasurements(){
    var scale = 10
    var events = []
    var measurements = []
    for(var i=0;i<10;i++){
        var start = Math.floor(Math.random()*(scale-2))
        var end = Math.floor( start + Math.random()*(scale-start-1))
        var event = {
                start:i*scale+start,
                end: i*scale+end}
        events.push()
        for(var j=0;j<scale;j++){
            var time = (i*scale)+j
            measurements.push({
                AssetId: 1,
                Epoch: time,
                Value: (time>=event.start && time<=event.end) ? 1: 0
            })
        }
    }
    return {
        events,
        measurements
    }
}

var result = makeMeasurements();

module.exports = result

   