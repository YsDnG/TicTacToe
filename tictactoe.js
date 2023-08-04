
/*******Game Board Module *******/
const gameBoardModule =(()=>{
    let myBoard=[];

    /*****Create Array based on the board size *******/
        const initializeBoard =(rows,columns) =>{
            for (let i = 0; i < rows; i++) {
                myBoard[i] = []; // Create an empty array at each row index i
                for (let j = 0; j < columns; j++) {
                    myBoard[i][j] = ""; // Set a empty string at each cell (i, j) in the 2D array
                }
            }   
        };
    /****************************************/

    /**Get and Set for Array Value *****/
        const getCellValue=(row,column) => myBoard[row][column];
        const setCellValue=(row,column,value) => myBoard[row][column] = value;
    /**************/

    /*** Reset array*/
        const resetArray=()=> myBoard=[]

    /**Get the Array  *******/
    const getArray=()=>myBoard;

    /***** Look for victory on row *****/
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
    /********************/
    /***Look for victory on column */
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
/*********************/

    const isAccrossTheSame =()=>{
        
        if(myBoard[0][0] === myBoard[1][1] && myBoard[1][1] === myBoard[2][2] && myBoard[0][0] !==""|| myBoard[0][2] === myBoard[1][1] && myBoard[1][1]===myBoard[2][0] && myBoard[2][0] !=="")
            return true
        else
            return false;

    }

    const isWinner=()=>{
        const vitoryOnRow = isRowTheSame();
        const victoryOnColumn=isColumnTheSame();
        const victoryAcross = isAccrossTheSame();
        if(victoryOnColumn || vitoryOnRow || victoryAcross)
            return true;
        else
            return false;
    };

   

    return{
        initializeBoard,
        getCellValue,
        setCellValue,
        getArray,
        isWinner,
        resetArray,
    }; 

    
})();
/**************************/

/***** Display Controller *********/
const displayController =(() => {
    /***Selector ***/
        const gridContainer = document.querySelector('.main-content');
        const btnReset= document.querySelector('.btn-reset')
    /*****/

    /**General Variable ****/
        let currentPlayer=null;
        let movePlayed=0
        myBoard = gameBoardModule.getArray();
        let wrapperFunction;
        let clickEvent;

    /******/

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
    /*******/

    /**Add the Player Move to the array and into the Dom element clicked */
        const getPlayerMove = (element,player) => {
                        /*Split the class attribute of element to get index[row]-[column] for the board array*/
                            const index = element.classList[1].split('-')
                        /*Add the player mark into the ArrayBoard */
                            gameBoardModule.setCellValue(index[0],index[1],player.mark);
                        /*Display the Mark of player on the element clicked*/
                            element.textContent = player.mark
                        /*Make the element no clickable*/
                            element.classList.add('is-unclickable')
                        
        
    /***********/

    }
   
     
    /** Start the game and check for victory or dom full  ****/
    const startGame=(player1,player2)=>{
        /**Init the Game*/
            gameBoardModule.initializeBoard(3,3);
            displayController.createBoard(gameBoardModule.getArray());
            const board = gridContainer.querySelectorAll('*');
            currentPlayer = currentPlayer === null || currentPlayer === player2 ? player1 : player2;
        /*****/

        board.forEach(element => 
        { 
             /*Delete event listener if one was added before */
                if(wrapperFunction)
                    element.removeEventListener('click',wrapperFunction)
            /**Wrapper function to pass the current player when clicked and count the number of move played yet*/
                wrapperFunction = (event) => 
                {
                        getPlayerMove(event.target,currentPlayer);
                        movePlayed++
                    
                };

            /**Event Listener on click for every item of the grid***/
                element.addEventListener('click',wrapperFunction) 

        })
        /*Delete event listener if one was added before */
            if(clickEvent)
                gridContainer.removeEventListener('click',clickEvent)

            clickEvent = (event) => {
            /*Return if the element clicked was already played */
                if(event.target.classList.contains('is-unclickable'))
                    return;

                currentPlayer = currentPlayer === null || currentPlayer === player2 ? player1 : player2;

                if(gameBoardModule.isWinner())
                {
                    gridContainer.classList.add('is-unclickable')
                    document.querySelector('.result-display').textContent =`Winner: ${currentPlayer.name}`
                }
                if(movePlayed >= myBoard.length*myBoard[0].length)
                {
                    gridContainer.classList.add('is-unclickable')
                    document.querySelector('.result-display').textContent =`NO WINNER`
                } 
            };
            gridContainer.addEventListener('click',clickEvent)
        

    
        btnReset.addEventListener("click",resetGame);
            
    }

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

    return{
        createBoard,
        getPlayerMove,
        startGame,
    };
})();
/************************/

/*** Player Factory *******/
function createPlayer(name,mark)
{
    return{
        name,
        mark,
    };
}
/*************************/

const player1 = createPlayer("Carl","X");
const player2 = createPlayer('Ysdng',"O");
displayController.startGame(player1,player2);












