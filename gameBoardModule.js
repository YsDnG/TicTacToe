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

    /*Return the Array */
        const getArray=()=>myBoard;

    /** Look for victory on row **/
        const isRowTheSame =(myBoard)=>{
            for(let i=0;i<myBoard[0].length;i++)
            {
                for(let j=0;j<myBoard[0].length;j+=3)
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
            for(let j=0;j<myBoard.length;j++)
            {
                for(let i=0;i<myBoard.length;i+=3)
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

    /**Return true if vitoryOnRow or victoryOnColumn or victoryAcross or tie if board is full and no victory**/
        const isWinner=(myBoard)=>{
            let openSpot = 9
            for(let i=0;i<myBoard.length;i++)
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

export{gameBoardModule};
/************************/
