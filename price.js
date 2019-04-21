const brain = require('brain.js');

const bit2c = require('./data.js');

function toObject(arr){
    return {
        open: arr[4],
        high: arr[2],
        low: arr[3],
        close: arr[1]
    };
}

function scaleDown(step) { // normalize
    return {
        open: step.open / 70000,
        high: step.high / 70000,
        low: step.low / 70000,
        close: step.close / 70000
    };
}

function scaleUp(step) { // denormalize
    return {
        open: step.open * 70000,
        high: step.high * 70000,
        low: step.low * 70000,
        close: step.close * 70000
    };
}



bit2c.kLines((data)=>{

    const trainingData = [];

    let i,j,chunk = 10;
    for (i=0,j=data.length; i<j; i+=chunk) {
        let chunkData = data.map(toObject).map(scaleDown).slice(i,i+chunk);
        trainingData.push(
            chunkData
        );
        // do whatever
    }

    const net = new brain.recurrent.LSTMTimeStep({
        inputSize: 4,
        hiddenLayers: [8, 8],
        outputSize: 4
    });

    let numIterations = 10000;
    net.train(trainingData, {
        iterations: numIterations,
        learningRate: 0.005,
        errorThresh: 0.005,
        callback: function(data) {
            let percentage = (data.iterations / numIterations) * 100 + "%";
            //$("#status").html("<strong>Training: </strong>" + percentage);
            console.log(percentage);
        },
        callbackPeriod: 500
    });


   let forecastData = trainingData[trainingData.length-1];

   console.log(forecastData.map(scaleUp));
   console.log(net.forecast(forecastData, 3).map(scaleUp));


});



