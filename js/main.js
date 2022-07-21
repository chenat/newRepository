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

var gTimeOut
var gSafe = 3
var gIIndx
var gJIndx
var gHighestScore = 0
var gHintLeft = 3
var gFlagHint = 0
var gHintIntreval
var gFirstClick = true
var gNumOfLives = 3
var gTImeDigits = 1
var gInterval
const MINE_IMG = '<img src="img/bomb.png" />'
const FLAG_IMG = '<img src="img/flag.png" />'
const LIVE_IMG = '<img src="img/lives.png" />'
const NORMAL_STATE = '<img src="img/play.png" />'
const WIN_STATE = '<img src="img/win.png" />'
const LOSE_STATE = '<img src="img/lose.png" />'
const HINT_IMG = '<img src="img/hint.png" />'

var gBoard

function initLives(){
    var elLives = document.querySelector('.lives')
    var strHTML = ' '
    if(gLevel.size === 4 && gFirstClick === true && gNumOfLives > 2){
        --gNumOfLives
    }
    for(var i = 0; i < gNumOfLives; i++){
        strHTML += LIVE_IMG
    }
    elLives.innerHTML = strHTML
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
    gHintLeft = 3
    UpdateHints()
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
    board = setBombs(board,minesPos)
    setMinesNegsCount(board)
    return board;
}

function renderBoard(){
    var table = '<table class="mat">'
    for(var i = 0; i < gLevel.size; i++) {
        table += "<tr>"
        for(var j = 0; j < gLevel.size; j++) {
            table += `<td>
                <button id="cell-${i}-${j}" oncontextmenu="markCell(${i},${j})"
                 onclick="cellClicked(${this.id},${i},${j})"
                class="buttons"></button>
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
    return posArr
}

function setTime(){
    if (gGame.isOn) {
        gGame.secsPassed += gTImeDigits 
    }
    var elTimer = document.querySelector('.timer')
    elTimer.innerHTML = `${(gGame.secsPassed)} sec`
}


// looks like shit, will change it to a better function
function setMinesNegsCount(board){
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

function markCell(i,j){
    if(!gBoard[i][j].isShown && gBoard[i][j].isMarked !== true){
        gBoard[i][j].isMarked = true
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        var strHTML = FLAG_IMG
        elCellId.style.backgroundColor = "lightGrey"
        elCellId.style.paddingLeft = '1px'
        elCellId.innerHTML = strHTML
        gGame.markedCount++
        reFreshScoreAndMines()
        checkGameOver()
    }
    else if(gBoard[i][j].isMarked === true && gGame.isOn === true){
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        elCellId.innerHTML = ` `
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        reFreshScoreAndMines()
    }
}

function cellClicked(elCell, i, j){
    if(gBoard[i][j].isMarked === true){
        return
    }
    if((gGame.shownCount === 0) && (gGame.isOn === true) && (gBoard[i][j].isMine === true) && 
    (gBoard[i][j].isMarked !== true)){
        initGame()
        cellClicked(elCell, i, j)
    }
    if(gFirstClick === true){
        gInterval = setInterval(setTime,1000)
        gFirstClick = false
    }

    if(gBoard[i][j].isShown === false && gBoard[i][j].minesAroundCount === 0 &&
         gBoard[i][j].isMine !== true){
        expandIfZero(i,j)
    }

    if(gBoard[i][j].isMine === true && gGame.isOn !== false && gNumOfLives > 0 
            && gBoard[i][j].isShown !== true){
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        elCellId.innerHTML = MINE_IMG
        gBoard[i][j].isShown = true
        elCellId.style.alignItems = 'center'
        elCellId.style.backgroundColor = 'green'
        gNumOfLives--
        initLives()
    }

    if(gBoard[i][j].isMine && gGame.isOn !== false && gNumOfLives === 0){
        
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        elCellId.innerHTML = MINE_IMG
        gBoard[i][j].isShown = true
        elCellId.style.alignItems = 'center'
        elCellId.style.backgroundColor = 'red'
        checkGameOver()
        gameOver()
    }
    else if(gGame.isOn !== false && gBoard[i][j].isMine === false && 
            gBoard[i][j].isShown !== true){
        var elCellId = document.getElementById(`cell-${i}-${j}`)
        var num = gBoard[i][j].minesAroundCount
        gBoard[i][j].isShown = true
        gGame.shownCount++
        elCellId.style.backgroundColor = 'lightGrey'
        if(gBoard[i][j].minesAroundCount !== 0){
            elCellId.innerText = gBoard[i][j].minesAroundCount
            changeTextColor(i,j)
        }
        reFreshScoreAndMines()
        
    }
    if(gGame.isOn && gBoard[i][j].isShown === false){
        checkGameOver()
        reFreshScoreAndMines()
    }
    if(gGame.shownCount === ((gLevel.size * gLevel.size) - gLevel.mines)){
        setTimeOff()
        checkGameOver()

    }
    checkGameOver()
}

function changeTextColor(i,j){
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
    gNumOfLives = 3
    initLives()
    initGame()
}

function changeToMedium(){
    gLevel.size = 8
    gLevel.mines = 12
    if(gGame.secsPassed > 0){
        setTimeOff()
    }
    gNumOfLives = 3
    initLives()
    initGame()
}

function changeToHard(){
    gLevel.size = 12
    gLevel.mines = 30
    if(gGame.secsPassed > 0){
        setTimeOff()
    }
    gNumOfLives = 3
    initLives()
    initGame()
}

function setTimeOff(){
    clearInterval(gInterval)
    gGame.secsPassed = 0
}

function gameOver(){
    var elGameStatus = document.querySelector('.game-status')
    var strHTML = `<h4> current score - ${gGame.shownCount}`
    if(gHighestScore < gGame.shownCount){
        gHighestScore = gGame.shownCount
        strHTML += `
                    `
    }
    strHTML += ` Highest Score - ${gHighestScore}</h4>`
    elGameStatus.innerHTML = strHTML
    gGame.isOn = false
    gGame.shownCount = 0
    uncoverAllCells()
    setTimeOff()
}

function uncoverAllCells(){

    for(var i = 0; i < gLevel.size;i++){
        for(var j = 0; j < gLevel.size;j++){
            var elCellId = document.getElementById(`cell-${i}-${j}`)
            if(gBoard[i][j].isMine === true){

                elCellId.innerHTML = MINE_IMG
                elCellId.style.alignItems = 'center'
            }
            else if(gBoard[i][j].minesAroundCount === '0'){
                elCellId.innerText = ' '
            }
            else{
                elCellId.innerText = gBoard[i][j].minesAroundCount
                changeTextColor(i,j)
            }
        }
    }
    
    return gBoard
}

function newGame(){
    setTimeOff()
    gNumOfLives = 3
    initGame()
}

function reFreshScoreAndMines(){
    var elGameStatus = document.querySelector('.game-status')
    var strHTML = `<button class="score">Score - ${gGame.shownCount}</button>`
    strHTML += `<button class="mines">Marked cells - ${gGame.markedCount}</button>`
    elGameStatus.innerHTML = strHTML
}

function checkGameOver(){
    var elSmiley = document.getElementById('smiley')
    var strHTML = ''
    if(gNumOfLives === 0){
        strHTML += LOSE_STATE
    }
    else if(gGame.shownCount === ((gLevel.size * gLevel.size) - gLevel.mines)){
        strHTML += WIN_STATE
        uncoverAllCells()
    }
    else {
        strHTML += NORMAL_STATE
    }

    elSmiley.innerHTML = strHTML
    
}

function giveHint(){
    var arr = []
    var index 
    
    for(var i = 0; i < gLevel.size; i++){
        for(var j = 0; j < gLevel.size; j++){
            if(gBoard[i][j].isMine !== true && gGame.isOn === true && 
                gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false){
                    arr.push({i:i,j:j})
                }
        }
    }

    arr = shuffleArr(arr)
    index = getRandomInt(0,arr.length)
    gIIndx = arr[index].i
    gJIndx = arr[index].j
    revealSelfAndFriends(gIIndx,gJIndx)
    gHintIntreval = setInterval(hideBack,500)
    gHintLeft--
    UpdateHints()
}

function hideBack(){
    if(gFlagHint === 0){
        gFlagHint++
    }
    else{
        gFlagHint--
        for(var i = gIIndx - 1; i < gIIndx + 2; i++){
            for(var j = gJIndx - 1; j < gJIndx + 2; j++){
                var elCell = document.getElementById(`cell-${i}-${j}`)
                if(i >= 0 && j >= 0 && i <= gLevel.size - 1 && j <= gLevel.size -1){
                    elCell.innerText = ' '
                } 
                if(i >= 0 && j >= 0 && i <= gLevel.size - 1 && j <= gLevel.size -1 && 
                    gBoard[i][j].isMine === true){
                        elCell.innerHTML = ' '
                    }
            }
        }
        clearInterval(gHintIntreval)
    }
}

function UpdateHints(){
    var elbuttons = document.querySelector('.hints')
    var strHTML = ''
    for(var i = 0; i < gHintLeft; i ++){
        strHTML += `<button id="hbtn"onclick="giveHint()">${HINT_IMG}</button>`
    }
    elbuttons.innerHTML = strHTML
}

function revealSelfAndFriends(iIndx,jIndx){ 
    var elCell 

    for(var i = iIndx - 1; i < iIndx + 2; i++){
        for(var j = jIndx - 1; j < jIndx + 2; j++){
            elCell = document.getElementById(`cell-${i}-${j}`)
            if(i >= 0 && j >= 0 && i <= gLevel.size - 1 && j <= gLevel.size -1){
                elCell.innerText = gBoard[i][j].minesAroundCount
            } 
            if(i >= 0 && j >= 0 && i <= gLevel.size - 1 && j <= gLevel.size -1 && 
                    gBoard[i][j].isMine === true){
                elCell.innerHTML = MINE_IMG
            }
        }
    }
}

function safeClick(){
    if(gSafe === 0){
        return
    }
    var arr = []
    var index 
    var elSafe = document.getElementById("safe")
    
    for(var i = 0; i < gLevel.size; i++){
        for(var j = 0; j < gLevel.size; j++){
            if(gBoard[i][j].isMine !== true && gGame.isOn === true && 
                gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false){
                    arr.push({i:i,j:j})
                }
        }
    }

    arr = shuffleArr(arr)
    index = getRandomInt(0,arr.length)
    gIIndx = arr[index].i
    gJIndx = arr[index].j
    var elCell = document.getElementById(`cell-${gIIndx}-${gJIndx}`)
    elCell.style.backgroundColor = `lightGreen`
    setTimeout(() => elCell.style.backgroundColor = `rgb(186, 227, 227)`, 1000)
    gSafe--
    elSafe.innerText = `Safe Click - ${gSafe}`
    
}

function expandIfZero(iIndx,jIndx){
    for(var i = iIndx - 1; i < iIndx + 2; i++){
        for(var j = jIndx - 1; j < jIndx + 2; j++){
            if(i >= 0 && j >= 0 && i <= gLevel.size - 1 && j <= gLevel.size -1 
                && gBoard[i][j].isShown !== true){
                var elCell = document.getElementById(`cell-${i}-${j}`)
                gBoard[i][j].isShown = true
                if(gBoard[i][j].isMine === true){
                    console.log('check if the bug is here')
                }
                else if(gBoard[i][j].minesAroundCount !== 0){
                    elCell.innerText = gBoard[i][j].minesAroundCount
                    changeTextColor(i,j)
                    elCell.style.backgroundColor = 'lightGrey'
                    gGame.shownCount++
                    reFreshScoreAndMines()
                }
                else{
                    elCell.innerText = ' '
                    elCell.style.backgroundColor = 'lightGrey'
                    gGame.shownCount++
                    gTimeOut = setTimeout(furtherExpand(i,j), 500)
                    reFreshScoreAndMines()
                }
                
            }
            
        }
    }
}

function furtherExpand(iIndx,jIndx){
    expandIfZero(iIndx,jIndx)
    clearTimeout(gTimeOut)
}

