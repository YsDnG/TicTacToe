
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
            const resetArray=()=>myBoard=[];

        /*Get the Array */
            const getArray=()=>myBoard;

        /** Look for victory on row **/
            const isRowTheSame =()=>{
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
            const isColumnTheSame=()=>{
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
            const isAccrossTheSame =()=>{
                
                if(myBoard[0][0] === myBoard[1][1] && myBoard[1][1] === myBoard[2][2] && myBoard[0][0] !==""|| myBoard[0][2] === myBoard[1][1] && myBoard[1][1]===myBoard[2][0] && myBoard[2][0] !=="")
                    return true
                else
                    return false;
            };
        /****/

        /**Return true if vitoryOnRow or victoryOnColumn or victoryAcross is true false otherwise **/
            const isWinner=()=>{
                const vitoryOnRow = isRowTheSame();
                const victoryOnColumn=isColumnTheSame();
                const victoryAcross = isAccrossTheSame();
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
            const btnReset= document.querySelector('.btn-reset')
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
                    element.classList.add((i)+'-'+(j));
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
                    gameBoardModule.setCellValue(index[0],index[1],player.mark);
                /*Display the Mark of player on the element clicked*/
                    element.textContent = player.mark
                /*Make the element no clickable*/
                    element.classList.add('is-unclickable')
            }
        /****/

        /** Start the game and check for victory or dom full  **/
            const startGame=(player1,player2)=>{
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
                                    const result =gameBoardModule.isWinner();
                                    if(result)
                                    {
                                        if(event.type==="touchend")
                                            setTimeout(()=>{},2000)
                                        displayResult(currentPlayer,result)
                                    }
                                    if(movePlayed >= myBoard.length*myBoard[0].length)
                                    {
                                        displayResult(currentPlayer,result)
                                    }  
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
                        btnReset.addEventListener("click",resetGame);
                    /**/       
            }
        /****/

        /**Reset the board, grid and start a new game every time the reset button is cliked**/
            const resetGame=()=>{
                    gameBoardModule.resetArray();

                    while(gridContainer.firstChild)
                        gridContainer.removeChild(gridContainer.firstChild);
            
                    if(gridContainer.classList.contains('is-unclickable'))
                        gridContainer.classList.remove('is-unclickable')
                    document.querySelector('.result-display').textContent =""
                    movePlayed=0;
                    displayController.startGame(player1,player2);
            }
        /****/
    
        /**Display the result of the game**/
            const displayResult =(player,result)=>
            {
                overlay = document.querySelector('.overlay');
                overlay.textContent= result ? `WINNER: ${player.name}!` : `NO WINNER!`;
                overlay.classList.remove('not-active');
                /*Hide the overlay-> result display if click*/
                    const hideOverlayAndReset =(event) =>{
                        overlay.classList.add('not-active');
                        resetGame();
                        overlay.removeEventListener("click", hideOverlayAndReset);
                        overlay.removeEventListener("touchstart", hideOverlayAndReset);
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
                startGame,
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

const player1 = createPlayer("X","X");
const player2 = createPlayer('O',"O");
displayController.startGame(player1,player2);












