/*************Import *************/
import { displayController } from './displayController.js';
/**************************/

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
const Main=(()=>{
    /**Variables **/
        const btn1V1 = document.getElementById('btn-1v1')
        const btnSolo= document.getElementById('btn-solo')
        const btnReset = document.querySelector('.btn-reset')
        const btnSoloSetUp = document.querySelector('.btn-solo-setUp')
        const player2 = createPlayer('X',"X");
        const player1 = createPlayer('O',"O");
    /****/

    /**Start a game by default 1v1 **/
        btn1V1.classList.contains('add-focus') ? displayController.startGame1v1(player1,player2) : displayController.startGameSolo(player1,player2)
    /****/

    /**FUNCTIONS **/
        const isActive = (element) => { element.classList.remove('not-active')};
        const notActive= (element) => { element.classList.add('not-active')}
        const swapfocus = (element1,element2) => { 
            element1.classList.remove('add-focus'); 
            element2.classList.add('add-focus'); };
    /****/

    /**Start game 1v1 if 1v1 btn is clicked **/
        btn1V1.addEventListener('click',()=>{
        /*Swap focus btn-setup and start new game 1v1*/
            swapfocus(btnSolo,btn1V1);
            notActive(btnSoloSetUp);
            displayController.resetGame(player1,player2);
        /**/  
        })
    /****/

    /**Start game solo if solo btn is clicked **/
        btnSolo.addEventListener('click',()=>{
            swapfocus(btn1V1,btnSolo);
            isActive(btnSoloSetUp);
            const boxes = btnSoloSetUp.querySelectorAll('input');
            displayController.resetGame(player1,player2,"hard");
                /*New game if the difficulty is changed*/
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
                /**/
        });
    /****/
    /**New Game if the reset button is clicked**/
        btnReset.addEventListener('click',()=>{
            
            if(btnSolo.classList.contains('add-focus'))
            {
                const boxes = Array.from(btnSoloSetUp.querySelectorAll('input'));
                const checkBox = boxes.find(element => element.checked);
                displayController.resetGame(player1,player2,checkBox.name)
            }
            else
                displayController.resetGame(player1,player2,null);
            
        
        })
    /****/

})();
/**************************/

















