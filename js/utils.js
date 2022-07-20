function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function getRandomInt(min,max){
    return Math.round(Math.random() * (max-min) + min)
}

// still there is a bug, will sometimes create less than the mine intended, will fix it later
function buildArr(){
    var arr = []
    for(var i = 0; i < gLevel.size * gLevel.mines; i++){
        arr[i] = getRandomInt(0,gLevel.size - 1)
    }
    return arr
}

function ranArray(){
    var arr = []
    var index = 0
    for(var i = 0; i < gLevel.size; i++){
        for(var j = 0; j < gLevel.size; j++){
            arr[index] = {iIndx:i,jIndx:j}
            index++
        }
    }

    return arr
}

function shuffleArr(array){

    var currentIndex = array.length,  randomIndex
    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array;
}