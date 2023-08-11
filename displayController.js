import { gameBoardModule } from "./gameBoardModule.js";
/************ Display Controller ************/
const displayController =(() => {
    /**Selector**/
        const gridContainer = document.querySelector('.grid-content');
    /****/

    /**General Variable **/
        let currentPlayer=null;
        let movePlayed=0
        let myBoard = gameBoardModule.getArray();
        let wrapperFunction;
        let clickEvent;
    /****/

    /**Create board base on array size[i][j] **/ 
        const createBoard = (myBoard) => 
        {
            for(let i=0;i<myBoard.length;i++)
            {
                for (let j = 0; j < myBoard[i].length; j++) 
                {
                const element = document.createElement('div');
                element.classList.add('grid-item')
                /*Add the class correspond to indices of the Array 0-0/0-1/0-2 ...*/
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
            /*Make the element no clickable and add background-color of the player*/
                element.classList.add('is-unclickable')
                element.classList.add(`player-${player.mark}`)
        }
    /****/

    /**Return the element to play for the best Move from Ia based on difficulty choice**/
        const IaBestMove =(difficulty)=>{

        /*Return a best element from all playable element of the board */
            const getRdmElement =() => {
                const boardFreeElement = gridContainer.querySelectorAll('*:not(.is-unclickable)');
                const nodesArray = Array.from(boardFreeElement);
                const randomElement = nodesArray[Math.floor(Math.random() * nodesArray.length)];
                return randomElement;
            }
        /**/
        /*Return the best element to plays for the next move Ia*/
            const getBestElement=()=>
            {
                const indexElement = minimax(myBoard,0,true);
                const elementIa = document.querySelector(`.index-${indexElement.index.x}-${indexElement.index.y}`)
                return elementIa;
            } 
        /**/
            /*If diffilculty is hard return 100% the best move to do next*/
                if(difficulty === "hard")
                {
                return getBestElement()
                }
            /**/
                else 
                    /*If "easy" Mode 50% if tthe time the move will be random*/
                        if(difficulty=== "easy")
                        {
                            if(Math.random()< 0.5)
                                return getRdmElement();
                            else
                                return getBestElement();
                                
                        }
                    /**/
                else
                    /*If "medium" Mode 20% of the time the move will be random*/
                        if(difficulty=== "medium")
                        {
                            if(Math.random() < 0.2)
                                return getRdmElement();
                            else
                                return getBestElement();   
                        }
                    /**/
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
            if (result === 'tie') 
                return {score: 0, index: null};
          
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

    /** Start the game and check for victory or grid full**/
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
                                
                                const result =gameBoardModule.isWinner(gameBoardModule.getArray());
                                if(result && result !== 'tie')
                                {
                                    let otherplayer = currentPlayer === player2 ? player1 :player2
                                    displayResult(currentPlayer,otherplayer,result,null)
                                    return;
                                }
                                if(result === 'tie')
                                    displayResult(player1,player2,false,null)

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
                                    displayResult(player1,player2,result,difficulty)
                                    return;
                                }
                                if(result === 'tie')
                                {
                                    displayResult(player1,player2,false,difficulty)
                                    return;
                                }
                                    

                                getPlayerMove(IaBestMove(difficulty),player2,difficulty)

                                result = gameBoardModule.isWinner(myBoard);
                                
                                if(result && result !== 'tie')
                                {
                                    displayResult(player2,player1,result,difficulty)
                                    return;
                                }
                                if(result === 'tie')
                                {
                                    displayResult(player1,player2,false,difficulty)
                                    return;
                                }
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
            const btn1V1 = document.getElementById('btn-1v1');
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
        const displayResult =(player1,player2,result,difficulty)=>
        {
            const overlay = document.querySelector('.overlay');
            overlay.textContent= result ? `WINNER: ${player1.name}!` : `NO WINNER!`;
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

export{displayController };
/************************/