const gridContainer = document.querySelector(".grid")

//create grid
function createGrid() {
  for (let i=0; i<100; i++) {
    let div = document.createElement("div")
    div.setAttribute("id", i)
    gridContainer.appendChild(div)
  }
}
createGrid()
const scoreEl = document.querySelector("span")
const msg = document.getElementById("msg")
const startBtn = document.getElementById("start-btn")
const grid = document.querySelectorAll(".grid div")

const width = 10 //grid size
let snake = [2, 1, 0] //div ids for [head, body, tail]
let score = 0
let appleIndex = 0
let direction = 1 
let speed = 0.94
let intervalTime = 0
let intervalId = null

let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0

function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].screenX
  touchStartY = event.changedTouches[0].screenY
  event.preventDefault()
  
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].screenX
  touchEndY = event.changedTouches[0].screenY
  control()
}

//start game
function startGame() {
  snake.forEach(index => grid[index].classList.remove("snake"))
  grid[appleIndex].classList.remove("apple")
  clearInterval(intervalId)
  score = 0 
  randomApple()
  direction = 1
  scoreEl.textContent = score
  msg.textContent = ""
  intervalTime = 750
  snake = [2, 1, 0]
  snake.forEach(index => grid[index].classList.add("snake"))
  intervalId = setInterval(move, intervalTime)
}

function move() {
  //death
  if (
    snake[0] + width >= width * width && direction == width ||
    snake[0] % width == width-1 && direction == 1 ||
    snake[0] % width == 0 && direction == -1 ||
    snake[0] - width < 0 && direction == -width ||
    grid[snake[0] + direction].classList.contains("snake")
  ) {
    msg.textContent = "Game over!"
    return clearInterval(intervalId)
  }

  const tail = snake.pop()
  grid[tail].classList.remove("snake")
  snake.unshift(snake[0] + direction)
  grid[snake[0]].classList.add("snake")
  //apple reached

  if(grid[snake[0]].classList.contains("apple")) {
    grid[snake[0]].classList.remove("apple")
    grid[tail].classList.add("snake")
    snake.push(tail)
    randomApple()
    score++
    scoreEl.textContent = score
    clearInterval(intervalId)
    intervalTime = intervalTime * speed
    intervalId = setInterval(move, intervalTime)
  }
  
}

function randomApple() {
  do {
    appleIndex = Math.floor(Math.random() * grid.length)
  } while(grid[appleIndex].classList.contains('snake'))

  grid[appleIndex].classList.add("apple")
}

function control(e = null) {
  //grid[currentIndex].classList.remove("snake") 
  if (e) {
      
    if (e.keyCode == 39 && direction != -1) { //right
      direction = 1
    } else if (e.keyCode == 38 && direction != width) { //up
      direction = -width
    } else if (e.keyCode == 37 && direction != 1) {
     //left
      direction = -1
    } else if (e.keyCode == 40 && direction != -width) {
     //down
      direction = width
    }
  //for touch, X and Y start top left and are inverted
  } else {
    if (touchStartX < touchEndX && direction != -1) {
      msg.textContent = "swiped right"
      direction = 1
    } else if (touchStartY < touchEndY && direction != -width) {
      msg.textContent = "swiped down"
      direction = width
    } else if (touchStartX > touchEndX && direction != 1) {
      msg.textContent = "swiped left"
      direction = -1
    } else if (touchStartY > touchEndY && direction != width) { 
      msg.textContent = "swiped up"
      direction = -width
    }
  }

}

document.addEventListener('keyup', control)
gridContainer.addEventListener('touchmove', (e) => {
  e.preventDefault()
})
gridContainer.addEventListener('touchstart', handleTouchStart)
gridContainer.addEventListener('touchend', handleTouchEnd)
startBtn.addEventListener('click', startGame)




