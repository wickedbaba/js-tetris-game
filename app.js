// event listener
document.addEventListener( 'DOMContentLoaded' , ()=>{

    // gets all the query with teh class - grid
const grid = document.querySelector('.grid')
    // selectes all queries with class  = .grid || the Array.from converts the input into an array
let squares = Array.from(document.querySelectorAll('.grid div'))
    // . -> class
    // # -> id
const scoreDisplay = document.querySelector('#score');
const StartBtn = document.querySelector('#start-button');

const width = 10
let nextRandom = 0
let timerId
let score = 0
const colors = [
  'orange',
  'red',
  'purple',
  'green',
  'blue'
]


const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

  const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]


  const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino ,iTetromino]


  // getting a random number 

  let randomValue = Math.floor(Math.random()*theTetrominoes.length)

  let currentPosition = 4
  let currentRotation = 0
  let current = theTetrominoes[randomValue][currentRotation]


  // function to draw the tetremino
  function draw ()
  {
      current.forEach( index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[nextRandom]
      })
  }

    // function to erase the tetremino

    function undraw()
    {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }


    // timerId = setInterval(moveDown,1000)


    function control(e)
    {
        if(e.keyCode === 37)
        {
            moveLeft()
        }
        else if (e.keyCode === 38) 
        {
            rotate()
        } 
        else if (e.keyCode === 39) 
        {
            moveRight()
        } 
        else if (e.keyCode === 40)
        {
            moveDown()
        }
    }

    document.addEventListener('keyup',control)

    function moveDown()
    {
        undraw()
        currentPosition +=width
        draw()
        freeze()
    }


    function freeze()
    {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken')))
        {
            current.forEach(index => squares[currentPosition + index ].classList.add('taken'))
            
            randomValue = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current  = theTetrominoes[randomValue][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    // draw()

    // putting bloackages so that the tetromino does not move out of bounds


    function moveLeft()
    {
        undraw()

        const  isAtLeftEdge = current.some(index => (currentPosition + index)% 10 === 0)

        // move left only if it is not at the left most edge
        if(!isAtLeftEdge)
        {
            currentPosition -=1
        }

        // checking if there already exists a tetromino there
        if( current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition +=1
        }

        draw()
    }


    function moveRight() {
        undraw()

        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)

        if(!isAtRightEdge) 
        
        currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
          currentPosition -=1
        }

        draw()
      }

    function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
        if (isAtLeft()){
        currentPosition -= 1
        checkRotatedPosition(P)
        }
    }
    }

        //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
        currentRotation = 0
        }
        current = theTetrominoes[randomValue][currentRotation]
        checkRotatedPosition()
        draw()
    } 

     //show up-next tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
     }


     StartBtn.addEventListener('click', () =>
     {
        if(timerId)
        {
            clearInterval(timerId)
            timerId= null
        }
        else
        {
            draw()
            timerId = setInterval(moveDown,1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
     })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
        
        // if the last row has all taken squares... then we need to remove it
        if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score

            // change their taken tag and remove it using splice
            row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
            })

            // then add them back using concat and append child 
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
        }
    }

     //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
        }
    }

})



// arrow function allow us to write shorter function syntax

    // eg - > 
// hello = function()
// {
//     return 'hello world'
// }

    // after arrow ->
// hello  = () => {'Hello World'}
//           ^ you can pass parameters in this bracket

    // use of Arrow function  + for each 
// itemArray.forEach(item => item+2)


    // use of splice 
//splice is used to remove and add new values into an array

// eg -> var  planets = ['Mars', 'Saturn', 'Pluto', 'Earth' ]
        //console.log(planets.splice(2,1))  ----> ['Pluto]
// and pluto would have been removed from the original array
        //console.log(planets) --------> ['Mars', 'Saturn', 'Earth' ]