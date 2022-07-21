/** @type {HTMLCanvasElement} */

//Canvas Required Variables
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

CANVAS_WIDTH = canvas.width = 1000;
CANVAS_HEIGHT = canvas.height = 600;

//Event Listeners for Mouse

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
  }

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
  })

//Scissors Variables
    const numberOfScissors = 15;
    const scissorsArray = [];

    const sciccorImage = new Image();
    sciccorImage.src = 'scissors.png';
    

//Rock Variables
    const numberOfRocks = 5;
    const rocksArray = [];

    const rockImage = new Image();
    rockImage.src = 'rock.png';

//Paper Variables
    const numberOfPapers = 5;
    const paperArray = [];

    const paperImage = new Image();
    paperImage.src = 'paper.png';

//Classes
//Parent Class
class Emoji {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 0; //Math.random() * 4 - 2;
    }
    update(){
        this.x += this.speed;
        this.y += this.speed;
    }
    draw(image){      
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
    }
};

//Child Classes
class Scissor extends Emoji {

}

class Rock extends Emoji {

}

class Paper extends Emoji {

}


//Draw Objects
let rock2;
function init() {
    for (let i = 0; i < numberOfScissors; i++){
        scissorsArray.push(new Scissor(50,50));
    }

    for (let i = 0; i < numberOfRocks; i++){
        rocksArray.push(new Rock());
    }

    rock2 = new Rock(undefined,undefined);

    for (let i = 0; i < numberOfPapers; i++){
        paperArray.push(new Paper());
    }
}


//Animation Loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    scissorsArray.forEach(scissor => {
        scissor.update();
        scissor.draw(sciccorImage);
    })

    rock2.x = mouse.x;
    rock2.y = mouse.y;
    rock2.update();
    rock2.draw(rockImage);

    //  rocksArray.forEach(rock => {
    //     rock.update();
    //     rock.draw(rockImage);
    // })

    // paperArray.forEach(paper => {
    //     paper.update();
    //     paper.draw(paperImage);
    // })

    
}

init();
animate();
