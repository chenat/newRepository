var gLevel = {
    size:4,
    mines:2,
}
var gGame ={
    isOn:false,
    shownCount:0,
    markedCount:0,
    secsPassed:0
}

var gFirstClick = true
var gNumOfLives = 3
var gTImeDigits = 1
var gInterval
const MINE_IMG = '<img src="img/bomb.png" />'
const FLAG_IMG = '<img src="img/flag.png" />'
const LIVE_IMG = '<img src="img/lives.png" />'

var gBoard

function initLives(numOfLives){
    var elLives = document.querySelector('.lives')
    var strHTML = ' '
    for(var i = 0; i < gNumOfLives; i++){
        strHTML += LIVE_IMG
    }
    elLives.innerHTML = 'Lives left -'
    elLives.innerHTML += strHTML
}

function checkBombs(){
    if(gBoard[0][0].isMine === true || gBoard[gLevel.size - 1][gLevel.size - 1].isMine
         === true || gBoard[0][gLevel.size - 1].isMine === true || 
         gBoard[gLevel.size - 1][0].isMine === true){
            initGame()
    }
}

function setBombs(board,minePos){
    for(var i = 0; i < gLevel.mines; i++){
        console.log(minePos)
        var mineIndx  = minePos[i]
        board[mineIndx.iIndx][mineIndx.jIndx].isMine = true
    }

    return board
}

function clearBombs(){
    for(var i = 0; i < gLevel.size; i++){
        for(var j = 0; j < gLevel.size; j++){
            gBoard[i][j].isMine = false;
        }
    }
}

function initGame(){
    gBoard = buildBoard()
    checkBombs()
    renderBoard()
    initLives()
    gGame ={
        isOn:false,
        shownCount:0,
        markedCount:0,
        secsPassed:0
    }
    gFirstClick = true
    gGame.isOn = true
    gGame.shownCount = 0
}

function buildBoard() {
    var board = createMat(gLevel.size, gLevel.size)
    var minesPos = getMinesPos()

    for(var i = 0; i < gLevel.size; i++){
        for(var j = 0; j < gLevel.size; j++){
            var cell = {minesAroundCount:0,isShown:false,isMine:false,isMarked:false}
            board[i][j] = cell;
        }
    }
    console.log(board)
    board = setBombs(board,minesPos)
    setMinesNegsCount(board)
    return board;
}

function renderBoard(){
    var table = "<table>"
    for(var i = 0; i < gLevel.size; i++) {
        table += "<tr>"
        for(var j = 0; j < gLevel.size; j++) {
            table += `<td>
                <button id="cell-${i}-${j}" onclick="cellClicked(${this.id},${i},${j})"
                oncontextmenu="cellMarked(${this.id},${i},${j})" class="buttons"></button>
            </td>`
        }
        table += "</tr>"
    }
    table += "</table>"
    document.getElementById("table").innerHTML = table
} 

function getMinesPos(){
    var posArr = []
    var indexArr = ranArray()
    indexArr = shuffleArr(indexArr)

    switch(gLevel.size) {
        
        case 4:
            for(var i = 0; i < gLevel.mines;i++){
                posArr[i] = indexArr[i]            
            }
            break;
        case 8:
            for(var i = 0; i < gLevel.mines;i++){
                posArr[i] = indexArr[i]
            }
            break;
        case 12:
            for(var i = 0; i < gLevel.mines;i++){
                posArr[i] = indexArr[i]
            }
            break;
        default:
            return
    }
    console.log(posArr)
    return posArr
}

function setTime(){
    if (gGame.isOn) {
        gGame.secsPassed += gTImeDigits 
    }
    var elTimer = document.querySelector('.timer')
    elTimer.innerHTML = `${(gGame.secsPassed)}sec`
}


// looks like shit, will change it to a better function
function setMinesNegsCount(board){
    console.log(board)
    for(var i = 0; i < gLevel.size; i++){
        for(var j = 0; j < gLevel.size; j++){
            if(board[i][j].isMine === true){

                if(i > 0){
                    board[i-1][j].minesAroundCount++
                }   
                if(j > 0){
                    board[i][j-1].minesAroundCount++
                }             
                if(i > 0 && j > 0){
                    board[i-1][j-1].minesAroundCount++
                }
                if(i < gLevel.size - 1){
                    board[i+1][j].minesAroundCount++
                }
                if(i < gLevel.size - 1 && j > 0){
                    board[i+1][j-1].minesAroundCount++
                }
                if(j < gLevel.size - 1){
                    board[i][j+1].minesAroundCount++
                }
                if(j < gLevel.size -1 && i > 0){
                    board[i-1][j+1].minesAroundCount++
                }
                if(i < gLevel.size - 1 && j < gLevel.size - 1){
                    board[i+1][j+1].minesAroundCount++
                }
            } 
        }
    }
}

function cellMarked(elCell,i,j){
    if(gBoard[i][j].isShown === true && gGame.isOn === true){
        markCell(i,j)
    }
}

function markCell(i,j){
    if(!gBoard[i][j].isMarked){
        gBoard[i][j].isMarked = true
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        elCellId.innerHTML = FLAG_IMG
    }
}

function cellClicked(elCell, i, j){
    if((gGame.shownCount === 0) && (gGame.isOn === true) && (gBoard[i][j].isMine === true)){
        initGame()
        cellClicked(elCell, i, j)
    }
    if(gFirstClick === true){
        gInterval = setInterval(setTime,1000)
        gFirstClick = false
    }

    if(gBoard[i][j].isMine && gGame.isOn !== false && gNumOfLives > 0){
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        elCellId.innerHTML = MINE_IMG
        elCellId.style.alignItems = 'center'
        elCellId.style.backgroundColor = 'green'
        gNumOfLives--
        initLives(gNumOfLives)
    }

    if(gBoard[i][j].isMine && gGame.isOn !== false && gNumOfLives === 0){
        
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        // gBoard = uncoverAllCells()        
        elCellId.innerHTML = MINE_IMG
        elCellId.style.alignItems = 'center'
        elCellId.style.backgroundColor = 'red'
        gameOver()
    }
    else if(gGame.isOn !== false && gBoard[i][j].isMine === false){
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        var num = gBoard[i][j].minesAroundCountd
        gBoard[i][j].isShown = true
        gGame.shownCount++
        elCellId.style.backgroundColor = 'lightGrey'
        if(gBoard[i][j].minesAroundCount !== 0){
            elCellId.innerText = gBoard[i][j].minesAroundCount
            changeTextColor(num,i,j)
        }
        
    }
    reFreshScoreAndMines()
    if(gGame.shownCount === ((gLevel.size * gLevel.size) - gLevel.mines)){
        setTimeOff()
        console.log('win')
    }
}

function changeTextColor(elCell,i,j){
    var elCellId = document.getElementById(`cell-${i}-${j}`)
    switch(elCellId.innerText){
        case '1':
            elCellId.style.color = 'blue'
            break;
        case '2':
            elCellId.style.color = 'green'
            break;
        case '3':
            elCellId.style.color = 'darkYellow'
            break;
        case '4':
            elCellId.style.color = 'red'
            break;
        case '5':
            elCellId.style.color = 'purple'
            break;
        case '6':
            elCellId.style.color = 'brown'
            break;
        default:
            elCellId.style.color = 'black'
    }
}

function changeToEasy(){
    gLevel.size = 4
    gLevel.mines = 2
    if(gGame.secsPassed > 0){
        setTimeOff()
    }
    initGame()
}

function changeToMedium(){
    gLevel.size = 8
    gLevel.mines = 12
    if(gGame.secsPassed > 0){
        setTimeOff()
    }
    initGame()
}

function changeToHard(){
    gLevel.size = 12
    gLevel.mines = 30
    if(gGame.secsPassed > 0){
        setTimeOff()
    }
    initGame()
}

function setTimeOff(){
    clearInterval(gInterval)
    gGame.secsPassed = 0
}

function gameOver(){
    var elGameStatus = document.querySelector('.game-status')
    var strHTML = '<h2> game Over! </h2>'
    elGameStatus.innerHTML = strHTML
    gGame.isOn = false
    gGame.shownCount = 0
    setTimeOff()
}

function uncoverAllCells(){

    for(var i = 0; i < gLevel.size;i++){
        for(var j = 0; j < gLevel.size;j++){
            var elCellId = document.getElementById(`cell-${i}-${j}`)
            console.log('hell')
            if(gBoard[i][j].isMine === true){

                elCellId.innerHTML = MINE_IMG
                elCellId.style.alignItems = 'center'
                console.log('h')
            }
            else{
                console.log('hi')
                elCellId.innerText = gBoard[i][j].minesAroundCount
                changeTextColor(elCellId.innerText,i,j)
            }
        }
    }
    
    return gBoard
}

function newGame(){
    setTimeOff()
    gBoard = buildBoard()
    renderBoard()
    gGame.shownCount = 0
}

function reFreshScoreAndMines(){
    var elGameStatus = document.querySelector('.game-status')
    console.log(elGameStatus)
    var strHTML = `<h3 class="score">Score - ${gGame.shownCount}</h3>`
    strHTML += `<h3 class="mines">Marked cells - ${gGame.markedCount}</h3>`
    console.log(strHTML)
    elGameStatus.innerHTML = strHTML
}