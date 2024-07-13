const optioncontainer = document.querySelector('.option-container');
const flipbutton = document.querySelector('#flip-button');
const gamesboardcontainer=document.querySelector('#gamesboard-container')
const startButton=document.querySelector('#start-button')
const infoDisplay=document.querySelector('#info')
const turnDisplay=document.querySelector('#turn-display')
let angl = 0;
function flip() {
  const options = Array.from(optioncontainer.children);
  
  // Toggle the angle
  angl = (angl === 0) ? 90 : 0;
  
  // Apply the rotation to each option
  options.forEach((option) => {
    option.style.transform = `rotate(${angl}deg)`;
  });
}
flipbutton.addEventListener('click', flip);

const width=10

function createboard(color,user){
    const gamesboardcontainer1= document.createElement('div')
    gamesboardcontainer1.classList.add('game-board')
    gamesboardcontainer1.style.backgroundColor=color
    gamesboardcontainer.append(gamesboardcontainer1)
    gamesboardcontainer1.id=user
    for(let i=0;i<width*width;i++){
        const gamesboardcontainer2= document.createElement('div')
        gamesboardcontainer2.classList.add('block')
        gamesboardcontainer2.id=i
        gamesboardcontainer1.append(gamesboardcontainer2)
    }

}
createboard('yellow','player')
createboard('pink','computer')

//creating ships
class Ship{
constructor(name,length){
    this.name=name
    this.length=length
}
}
const destroyer=new Ship('destroyer',2)
const submarine=new Ship('submarine',3)
const cruiser=new Ship('cruiser',3)
const battelship=new Ship('battelship',4)
const carrier=new Ship('carrier',5)

const ships=[destroyer,submarine,cruiser,battelship,carrier]
let notdropeed

function getvalidity(allBoardBlocks,isHorizantal,startindex,ship){
    let validstart = isHorizantal ? 
      (startindex <= width * width - ship.length ? startindex : width * width - ship.length) : 
      (startindex <= width * width - ship.length * width ? startindex : startindex - ship.length * width + width);
  
    let shipBlocks = [];
    for (let i = 0; i < ship.length; i++) {
      if (isHorizantal) {
        shipBlocks.push(allBoardBlocks[Number(validstart) + i]);
      } else {
        shipBlocks.push(allBoardBlocks[Number(validstart) + i * width]);
      }
    }
  
    let valid = true; // Initialize valid to true
    if (isHorizantal) {
      shipBlocks.every((_shipBlock, index) => {
        valid = valid && (shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
        return valid; // Ensure every continues correctly
      });
    } else {
      shipBlocks.every((_shipBlock, index) => {
        valid = valid && (shipBlocks[0].id < 90 + (width * index + 1));
        return valid; // Ensure every continues correctly
      });
    }
  
    console.log(`Valid: ${valid}`); // Debugging statement
    const nottaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));
    console.log(`Not taken: ${nottaken}`); // Debugging statement
    return {shipBlocks,valid,nottaken}
}







function addShipPiece(user, ship, startid) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    let randombollean = Math.random() < 0.5;
    let isHorizantal = user === 'player' ? angl === 0 : randombollean;
    let randomstartindex = Math.floor(Math.random() * width * width);
    let startindex = startid ? startid : randomstartindex;
    let {shipBlocks,valid,nottaken} = getvalidity(allBoardBlocks,isHorizantal,startindex,ship)
    
  
    if (valid && nottaken) {
      shipBlocks.forEach(shipBlock => {
        shipBlock.classList.add(`${ship.name}-color`);
        shipBlock.classList.add('taken');
        console.log(`${user} successful`);
      });
    } else {
      console.log(`Valid or not taken condition failed for ${user}`); // Debugging statement
  
      if (user === 'computer') {
        addShipPiece('computer', ship);
      }
      if (user == 'player') {
        console.log("not dropped true");
        notdropeed = true;
      }
    }
  }
  
  // Rest of your code
  

ships.forEach((ship)=>{
    addShipPiece("computer",ship)
})


// drag player ship
let draggedShip
const optionships= Array.from(optioncontainer.children)
optionships.forEach(optionship => optionship.addEventListener('dragstart',dragstart))
// Select all <div> elements inside the <div> with id "player" 
const allplayerblocks=document.querySelectorAll('#player div')
allplayerblocks.forEach(playerblock=>{
    playerblock.addEventListener('dragover',dragover)
    //playerblock.addEventListener('dragenter',dragenter)
    //playerblock.addEventListener('dragleave',dragleave)
    playerblock.addEventListener('drop',dropship)
})
function dragstart(e){
    notdropeed=false
   //e.target will give you element
   draggedShip=e.target

}
function dragover(e){
    e.preventDefault()
    const ship=ships[draggedShip.id]
    highlightarea(e.target.id,ship)
}
function dropship(e){
    const startid=e.target.id
    // now to get id of dragged ship
    // order matter in ship array
    const ship=ships[draggedShip.id]
    
    addShipPiece('player',ship,startid)
    if(!notdropeed){
        draggedShip.remove()
    }
}


// add highlight
function highlightarea(startindex,ship){
    const allboardblocks=document.querySelectorAll('#player div')
    let isHorizantal=angl===0
    const{shipBlocks,valid,nottaken}=getvalidity(allboardblocks,isHorizantal,startindex,ship)
if(valid && nottaken){
    shipBlocks.forEach(shipBlock=>{
        shipBlock.classList.add('hover')
        setTimeout(()=>shipBlock.classList.remove('hover'),500)
    })
}
}


let gameOver=false
let PlayerTurn

//start game
function startgame() {
  // Check if the player has placed all their ships
  if (optioncontainer.children.length !== 0) {
      infoDisplay.textContent = "Please place all your Warriors first!!";
      return;
  }

  // If the game has already started, do nothing
  if (PlayerTurn !== undefined) {
      return;
  }

  // Set up the game for the player
  const allBoardsBlocks = document.querySelectorAll('#computer div');
  allBoardsBlocks.forEach((block) => {
      block.addEventListener('click', handleclick);
  });

  // Initialize the game state
  PlayerTurn = true;
  infoDisplay.textContent = "Your Turn";
  infoDisplay.textContent = "THE GAME HAS STARTED";
}

startButton.addEventListener('click', startgame);
let playerHits=[]
let computerHits=[]
const playerSunkShips=[]
const computerSunkShips=[]
function handleclick(e){
  if(!gameOver){
    if(e.target.classList.contains('taken')){
      e.target.classList.add('boom')
      infoDisplay.textContent="you hit the computer ship"
      let classes=Array.from(e.target.classList)
      classes=classes.filter(className=>className!=='block')
           classes=classes.filter(className=>className!=='boom')
           classes=classes.filter(className=>className!=='taken')
           playerHits.push(...classes)
           checkscore('player',playerHits,playerSunkShips)
           
    }
    if(!e.target.classList.contains('taken')){
      infoDisplay.textContent="Nothing hits this time"
      e.target.classList.add('empty')
  }
  PlayerTurn=false
  const allBoardsBlocks=document.querySelectorAll('#computer div')
  allBoardsBlocks.forEach(block=>{
    block.replaceWith(block.cloneNode(true))})
    setTimeout(computerGo,1500)

}
}
// define computer go
function computerGo(){
  if(!gameOver){
      turnDisplay.textContent="Computers Turn!"
      infoDisplay.textContent='computers Thinking...'
      setTimeout(()=>{
        let randomGo=Math.floor(Math.random()*width*width)
        const allBoardsBlocks=document.querySelectorAll('#player div')
        if(allBoardsBlocks[randomGo].classList.contains('taken') && allBoardsBlocks[randomGo].classList.contains('boom')){
          computerGo()
          return
        }
        else if(allBoardsBlocks[randomGo].classList.contains('taken') && !allBoardsBlocks[randomGo].classList.contains('boom')){
         console.log("in else");
          allBoardsBlocks[randomGo].classList.add('boom')
          infoDisplay.textContent="computer hit your ship"
          let classes=Array.from( allBoardsBlocks[randomGo].classList)
      classes=classes.filter(className=>className!=='block')
           classes=classes.filter(className=>className!=='boom')
           classes=classes.filter(className=>className!=='taken')
           computerHits.push(...classes)
           checkscore('computer',computerHits,computerSunkShips)

        }else{
          infoDisplay.textContent="Nothing hits this time"
          allBoardsBlocks[randomGo].classList.add('empty')
        }
      },1500)

      setTimeout(()=>{
PlayerTurn=true
turnDisplay.textContent="Your turn"
    infoDisplay.textContent="Please take your go"
    const allBoardsBlocks=document.querySelectorAll('#computer div')
    allBoardsBlocks.forEach(block=>{
      block.addEventListener('click',handleclick)
    })
      },3000)

  }
}

function checkscore(user,userhits,usersunk){
  function checkship(shipname,shiplength){
    if(
      userhits.filter(storedshipname=> storedshipname==`${shipname}-color`).length==shiplength
    ){
      
      if(user==='player'){
         infoDisplay.textContent=`you sunk the Computers ${shipname} `
        playerHits=userhits.filter(storedshipname=>storedshipname !== `${shipname}-color`)
      }
      else if(user==='computer'){
         infoDisplay.textContent=`you sunk the players ${shipname} `
        computerHits=userhits.filter(storedshipname=>storedshipname !== `${shipname}-color`)
      }
      usersunk.push(shipname)
    }
  }
  checkship('destroyer',2)
          checkship('submarine',3)
          checkship('cruiser',3)
          checkship('battleship',4)
          checkship('carrier',5)
          console.log('playerhits',playerHits);
          console.log('playersunk ships',playerSunkShips);
          if(playerSunkShips.length===5){
            infoDisplay.textContent="You won the game"
            gameover=true
          }
          if(computerSunkShips.length===5){
            infoDisplay.textContent="You lost the game"
            gameover=true
          }
  }