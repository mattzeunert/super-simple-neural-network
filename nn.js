const INPUT_LAYER_SIZE = 16
const OUTPUT_LAYER_SIZE = 1
const HIDDEN_LAYER_SIZE = 3
const ITERATIONS = 20000

function main(){
    var trainingSet = generateTestData(0, 100)
    var testSet = generateTestData(10000, 11000)

    var weights = getRandomWeights()
    var bestWeights = cloneObject(weights)
    var bestCorrectness = -1

    for (var i=0; i<ITERATIONS; i++){
        weights = getRandomWeights()
        var correctness = getCorrectness(weights, trainingSet)

        if (correctness > bestCorrectness) {
            console.log("Iteration " + i + ": New best correctness in training set:", correctness * 100, "%")
            bestCorrectness = correctness
            bestWeights = cloneObject(weights)

            var testSetCorrectness = getCorrectness(weights, testSet)
            console.log("Correctness in test set: ", testSetCorrectness * 100, "%\n")
        }
    }
}

function getRandomWeights(){
    return {
        hiddenLayer: getRandomLayerWeights(INPUT_LAYER_SIZE, HIDDEN_LAYER_SIZE),
        outputLayer: getRandomLayerWeights(HIDDEN_LAYER_SIZE, OUTPUT_LAYER_SIZE)
    }
}
function getRandomLayerWeights(inputSize, neuronCount){
    var layerWeights = [];
    for (var j=0; j<neuronCount; j++) {
        var neuronWeights = getArrayWithNRandomNumbers(inputSize, -5, 5);
        layerWeights.push(neuronWeights)
    }
    return layerWeights;
}

function predict(inputLayer, weights){
    var neuronLayers = [
        weights.hiddenLayer.map(weight => new Neuron(weight)),
        weights.outputLayer.map(weight => new Neuron(weight))
    ]

    var previousLayerResult = inputLayer;

    neuronLayers.forEach(function(layer){
        previousLayerResult = layer.map(neuron => neuron.process(previousLayerResult))
    })

    return previousLayerResult
}
function exampleIsPredictedCorrectly(example, weights){
    var prediction = predict(example.input, weights);
    prediction[0] = limitRangeBetween0And1(prediction[0])

    var error = Math.abs(example.output[0] - prediction[0])
    return error < .5;
}
function getCorrectness(weights, set){
    var correctResults = 0;
    set.forEach(function(example){
        if (exampleIsPredictedCorrectly(example, weights)) {
            correctResults++;
        }
    })

    return correctResults / set.length
}

function cloneObject(obj){
    return JSON.parse(JSON.stringify(obj))
}
function getArrayWithNRandomNumbers(N, min, max){
    var numbers = [];
    var range = max - min;
    for (var i=0; i<N; i++) {
        numbers.push(Math.random() * range - max)
    }
    return numbers
}
function limitRangeBetween0And1(val){
    val = Math.min(1, val)
    val = Math.max(0, val)
    return val
}

var toBinaryArrayCache = {};
function toBinaryArray(num) {
    function padLeft(nr, n, str){
        return Array(n-String(nr).length+1).join(str||'0')+nr;
    }

    if (!toBinaryArrayCache[num]) {
        var nn =  padLeft((num).toString(2), 16, "0")
        toBinaryArrayCache[num] = nn.split("").map(parseFloat)
    }
    return toBinaryArrayCache[num]
}

function generateTestData(from, to){
    var set = [];
    for (var i=from; i<to; i++){
        var isEven = i % 2 === 0;
        set.push({
            input: toBinaryArray(i),
            output: isEven ? [1] : [0]
        })
    }
    return set;
}

function Neuron(weights){
    this.weights = weights;
}
Neuron.prototype.process = function(inputs){
    var sum = 0;
    for (var i=0;i<inputs.length;i++) {
        sum += inputs[i] * this.weights[i]
    }

    return sum;
}

main();
