
/************ Game Board Module ************/
    const gameBoardModule =(()=>{
        let myBoard=[];

        /**Create Array based on the board size **/
            const initializeBoard =(rows,columns) =>{
                for (let i = 0; i < rows; i++) {
                    myBoard[i] = []; // Create an empty array at each row index i
                    for (let j = 0; j < columns; j++) {
                        myBoard[i][j] = ""; // Set a empty string at each cell (i, j) in the 2D array
                    }
                }   
            };
        /****/

        /*Get and Set for Array Value */
            const getCellValue=(row,column) => myBoard[row][column];
            const setCellValue=(row,column,value) => myBoard[row][column] = value;
        /**/

        /* Reset array*/
            const resetArray=()=>myBoard.length=0;

        /*Get the Array */
            const getArray=()=>myBoard;

        /** Look for victory on row **/
            const isRowTheSame =(myBoard)=>{
                for(i=0;i<myBoard[0].length;i++)
                {
                    for(j=0;j<myBoard[0].length;j+=3)
                    {
                        if(myBoard[i][j] === myBoard[i][j+1] && myBoard[i][j+1] === myBoard[i][j+2]&& myBoard[i][j]!=="")
                            return true
                    }   
                }
                return false;
            };
        /****/

        /**Look for victory on column **/
            const isColumnTheSame=(myBoard)=>{
                for(j=0;j<myBoard.length;j++)
                {
                    for(i=0;i<myBoard.length;i+=3)
                    {
                        if(myBoard[i][j] === myBoard[i+1][j] && myBoard[i+1][j] === myBoard[i+2][j]&& myBoard[i][j]!=="")
                            return true;
                    }
                }  
                return false;
            };
        /****/

        /**Look for victory accross the board **/
            const isAccrossTheSame =(myBoard)=>{
                
                if(myBoard[0][0] === myBoard[1][1] && myBoard[1][1] === myBoard[2][2] && myBoard[0][0] !==""|| myBoard[0][2] === myBoard[1][1] && myBoard[1][1]===myBoard[2][0] && myBoard[2][0] !=="")
                    return true
                else
                    return false;
            };
        /****/

        /**Return true if vitoryOnRow or victoryOnColumn or victoryAcross is true false otherwise **/
            const isWinner=(myBoard)=>{
                let openSpot = 9
                for(i=0;i<myBoard.length;i++)
                {
                    for (let j = 0; j < myBoard[i].length; j++) 
                    {
                        if(myBoard[i][j] !== "")
                            openSpot--
                    }
                }
                const vitoryOnRow = isRowTheSame(myBoard);
                const victoryOnColumn=isColumnTheSame(myBoard);
                const victoryAcross = isAccrossTheSame(myBoard);

                if(openSpot <= 0)
                    return 'tie';

                if(victoryOnColumn || vitoryOnRow || victoryAcross)
                    return true;
                else
                    return false;
            };
        /****/

        return{
            initializeBoard,
            getCellValue,
            setCellValue,
            getArray,
            isWinner,
            resetArray,
        }; 
    })();
/************************/

/************ Display Controller ************/
    const displayController =(() => {
        /**Selector**/
            const gridContainer = document.querySelector('.grid-content');
        /****/

        /**General Variable **/
            let currentPlayer=null;
            let movePlayed=0
            myBoard = gameBoardModule.getArray();
            let wrapperFunction;
            let clickEvent;
        /****/

        /**Create board base on array size[i][j] **/ 
            const createBoard = (myBoard) => 
            {
                for(i=0;i<myBoard.length;i++)
                {
                    for (let j = 0; j < myBoard[i].length; j++) 
                    {
                    const element = document.createElement('div');
                    element.classList.add('grid-item')
                    /*Add the class correspond to indices of the Array*/
                    element.classList.add(`index-${i}-${j}`);
                    gridContainer.appendChild(element);
                    }
                }
            }
        /****/

        /**Add the Player Move to the array and into the Dom element clicked **/
            const getPlayerMove = (element,player) => {
                /*Split the class attribute of element to get index[row]-[column] for the board array*/
                    const index = element.classList[1].split('-')
                /*Add the player mark into the ArrayBoard */
                    gameBoardModule.setCellValue(index[1],index[2],player.mark);
                /*Display the Mark of player on the element clicked*/
                    element.textContent = player.mark
                /*Make the element no clickable*/
                    element.classList.add('is-unclickable')
            }
        /****/

        /**Return the element to play for the best from Ia based on difficulty choice**/
            const IaBestMove =(difficulty)=>{

                const getRdmElement =() => {
                    const boardFreeElement = gridContainer.querySelectorAll('*:not(.is-unclickable)');
                    const nodesArray = Array.from(boardFreeElement);
                    const randomElement = nodesArray[Math.floor(Math.random() * nodesArray.length)];
                    return randomElement;
                }
                const getBestElement=()=>
                {
                    const indexElement = minimax(myBoard,0,true);
                    const elementIa = document.querySelector(`.index-${indexElement.index.x}-${indexElement.index.y}`)
                    return elementIa;
                } 

                if(difficulty === "hard")
                {
                  return getBestElement()
                }
                else 
                    if(difficulty=== "easy")
                    {
                        if(Math.random()< 0.5)
                            return getRdmElement();
                        else
                            return getBestElement();
                            
                    }
                else
                    if(difficulty=== "medium")
                    {
                        if(Math.random() < 0.2)
                            return getRdmElement();
                        else
                            return getBestElement();   
                    }
            } 
        /****/

        /**Return the the index of the next best move for the ia to make **/
            const minimax = (myboard,depth,isIaPlayer) => {
                let result = gameBoardModule.isWinner(myboard);
                if (result !== 'tie' && result)
                {
                    if(!isIaPlayer)
                        return {score: 10, index: null};
                    else
                        return {score: -10, index: null};  
                } 
                if (result === 'tie') return {score: 0, index: null};
                
                if(isIaPlayer)
                {
                    let bestScore = -Infinity;
                    let bestMove = null;

                    for(let i=0;i<3;i++) {
                        for(let j=0;j<3;j++) {
                            if(myboard[i][j]==='') 
                            {
                                myboard[i][j]="O"
                                let currentScore=minimax(myboard,depth+1,false).score
                                if(currentScore > bestScore) 
                                {
                                    bestScore=currentScore;
                                    bestMove={x:i,y:j};
                                }
                                myboard[i][j] = "";
                            }
                        }
                    }
                    return {score: bestScore, index: bestMove}
                }
                else
                {
                    let bestScore = +Infinity;
                    let bestMove= null;
                    for(let i=0;i<3;i++)
                    {
                        for(let j=0;j<3;j++)
                        {
                            if(myboard[i][j]==='')
                            {
                                myboard[i][j]="X"
                                let currentScore=minimax(myboard,depth+1,true).score
                                if(currentScore < bestScore)
                                {
                                    bestScore = currentScore;
                                    bestMove ={x:i,y:j};
                                }
                                myboard[i][j] = "";
                            }
                        }
                    }
                    return {score: bestScore, index: bestMove}
                }
            }
        /****/

        /** Start the game and check for victory or grid full  **/
            const startGame1v1=(player1,player2)=>{
                /*Init the Game*/
                    gameBoardModule.initializeBoard(3,3);
                    displayController.createBoard(gameBoardModule.getArray());
                    const board = gridContainer.querySelectorAll('*');
                    currentPlayer = currentPlayer === null || currentPlayer === player2 ? player1 : player2;
                /**/
                /*For every elements of the board */ 
                    board.forEach(element => 
                    { 
                        /*Delete event listener if one was added before */
                            if(wrapperFunction)
                            {
                                element.removeEventListener('click',wrapperFunction)
                                element.removeEventListener('touchend',wrapperFunction) 
                            }
                        /**/
                        /*Wrapper function to pass the current player when clicked and count the number of move played yet*/
                            wrapperFunction = (event) => 
                            {
                                    event.stopPropagation();
                                    getPlayerMove(event.target,currentPlayer);
                                    movePlayed++
                                    const result =gameBoardModule.isWinner(gameBoardModule.getArray());
                                    if(result && result !== 'tie')
                                    {
                                        displayResult(currentPlayer,result)
                                        return;
                                    }
                                    if(result === 'tie')
                                        displayResult(player1,false)

                            };
                        /**/
                        /*Event Listener on click for every item of the grid*/
                            element.addEventListener('click',wrapperFunction) 
                            element.addEventListener('touchend',wrapperFunction) 
                        /**/
                    })
                /**/
                /*Delete event listener on the grid-container if one was added before */
                    if(clickEvent)
                    {
                        gridContainer.removeEventListener('click',clickEvent,true)
                        gridContainer.removeEventListener('touchend',wrapperFunction) 
                    }
                /**/
                /**/
                    clickEvent = (event) => {
                    /*Return if the element clicked was already played else change player to the next one */
                        if(event.target.classList.contains('is-unclickable'))
                            return;
                        else
                            currentPlayer = currentPlayer === null || currentPlayer === player2 ? player1 : player2;
                    /***/
                    };
                    /*Event listener on click grid-content-> swap player / Btn-reset*/
                        gridContainer.addEventListener('click',clickEvent,true)
                        gridContainer.addEventListener('touchend',clickEvent)
                    /**/       
            };
        /****/

        /**Star game solo vs Ia and check for victory or grid full **/
            const startGameSolo=(player1,player2,difficulty)=>{
                /*Init the Game*/
                let result = null
                    gameBoardModule.initializeBoard(3,3);
                    displayController.createBoard(gameBoardModule.getArray());
                    const board = gridContainer.querySelectorAll('*');
                /**/
                /*For every elements of the board */ 
                    board.forEach(element => 
                    { 
                        /*Delete event listener if one was added before */
                            if(wrapperFunction)
                            {
                                element.removeEventListener('click',wrapperFunction)
                                element.removeEventListener('touchend',wrapperFunction) 
                            }
                        /**/
                        /*Wrapper function to pass the current player when clicked and count the number of move played yet*/
                            wrapperFunction = (event) => 
                            {
                                    event.stopPropagation();
                                    getPlayerMove(event.target,player1);
                                    result = gameBoardModule.isWinner(myBoard);
                                    if(result && result !== 'tie')
                                    {
                                        displayResult(player1,result,difficulty)
                                        return;
                                    }
                                    if(result === 'tie')
                                        displayResult(player1,false)

                                    getPlayerMove(IaBestMove(difficulty),player2,difficulty)

                                    result = gameBoardModule.isWinner(myBoard);
                                    
                                    if(result && result !== 'tie')
                                    {
                                        displayResult(player2,result,difficulty)
                                        return;
                                    }
                                    if(result === 'tie')
                                        displayResult(player1,false,difficulty)
                                    
                                    
                            };
                /**/
                /*Event Listener on click for every item of the grid*/
                    element.addEventListener('click',wrapperFunction) 
                    element.addEventListener('touchend',wrapperFunction) 
                /**/

                    });
                };
        /****/


        /**Reset the board, grid and start a new game every time the reset button is cliked**/
            const resetGame=(player1,player2,difficulty)=>{
                    gameBoardModule.resetArray();
                    while(gridContainer.firstChild)
                        gridContainer.removeChild(gridContainer.firstChild);
            
                    if(gridContainer.classList.contains('is-unclickable'))
                        gridContainer.classList.remove('is-unclickable')
                    document.querySelector('.result-display').textContent =""
                    movePlayed=0;

                 btn1V1.classList.contains('add-focus') ? startGame1v1(player1,player2) : startGameSolo(player1,player2,difficulty)
                    
            }
        /****/
    
        /**Display the result of the game**/
            const displayResult =(player,result,difficulty)=>
            {
                overlay = document.querySelector('.overlay');
                overlay.textContent= result ? `WINNER: ${player.name}!` : `NO WINNER!`;
                overlay.classList.remove('not-active');
                /*Hide the overlay-> result display if click*/
                    const hideOverlayAndReset =(event) =>{
                        overlay.classList.add('not-active');
                        overlay.removeEventListener("click", hideOverlayAndReset);
                        overlay.removeEventListener("touchstart", hideOverlayAndReset);
                        resetGame(player1,player2,difficulty);
                    }
                  
                /**/
                /*Add listenner to the overlay on click*/
                    overlay.addEventListener("click",hideOverlayAndReset)
                    overlay.addEventListener('touchstart',hideOverlayAndReset)
                /**/
            }
        /****/

            return{
                createBoard,
                getPlayerMove,
                startGame1v1,
                startGameSolo,
                resetGame,
            };
    })();
/************************/

/************* Player Factory **************/
    function createPlayer(name,mark)
    {
        return{
            name,
            mark,
        };
    }
/**************************/

/************* General *************/
    const btn1V1 = document.getElementById('btn-1v1')
    const btnSolo=document.getElementById('btn-solo')
    const btnReset= document.querySelector('.btn-reset')
    const btnSoloSetUp = document.querySelector('.btn-solo-setUp')
    const player1 = createPlayer('X',"X");
    const player2 = createPlayer('O',"O");

    btn1V1.classList.contains('add-focus') ? displayController.startGame1v1(player1,player2) : displayController.startGameSolo(player1,player2)

    const isActive = (element) => { element.classList.remove('not-active')};

    const notActive= (element) => { element.classList.add('not-active')}

    const swapfocus = (element1,element2) => { 
        element1.classList.remove('add-focus'); 
        element2.classList.add('add-focus'); 
    };
    
    btn1V1.addEventListener('click',()=>{
    /*Swap focus btn-setup and reset the board*/
        swapfocus(btnSolo,btn1V1);
        notActive(btnSoloSetUp);
        displayController.resetGame(player1,player2);
    /**/  
    })

    btnSolo.addEventListener('click',()=>{
    /*Swap focus btn-setup and reset the board*/
        swapfocus(btn1V1,btnSolo);
        isActive(btnSoloSetUp);
        const boxes = btnSoloSetUp.querySelectorAll('input');
        displayController.resetGame(player1,player2,"hard");
        
            boxes.forEach(element => {
                element.addEventListener('change',() => {
                    if(element.checked)
                    {
                        displayController.resetGame(player1,player2,element.name);
                        boxes.forEach(innerBox => {
                            if (innerBox !== element) {
                                    innerBox.checked = false;
                            }
                        });
                    }
                });
            });
    });

    /**/

    btnReset.addEventListener('click',()=>{
        displayController.resetGame(player1,player2)
    })
      

/**************************/

















