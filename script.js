/** @type {HTMLCanvasElement} */

//Canvas Required Variables

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;

//Emoji global variables
//Scissors Variables
    const sciccorImage = new Image();
    sciccorImage.src = 'scissors_small.png';
    
//Rock Variables
    const rockImage = new Image();
    rockImage.src = 'rock_small.png';

//Paper Variables
    const paperImage = new Image();
    paperImage.src = 'paper_small.png';

//Classes
//Parent Class
class Emoji {
    constructor(game){
        this.game = game;
        this.width = 64;
        this.height = 64;
        this.speedX = 0;
        this.speedY = 0;
        this.markedForDeletion = false; 
    }
    update(){
        this.y += this.speedY;
        this.x += this.speedX;
    }
    draw(context){      
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
};

class Scissor extends Emoji {
    constructor(game){
        super(game);
        this.image = sciccorImage;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }
    update(){
        this.y += this.speedY;
        this.x += this.speedX;
    }
}

class Rock extends Emoji {
    constructor(game){
        super(game);
        this.image = rockImage;
        this.x = 800;
        this.y = 100;
    }
    update(){
        this.y += this.speedY;
        this.x += this.speedX;
        //if (this.x + this.width < 0) this.markedForDeletion = true;
    }
}

class Paper extends Emoji {
    constructor(game){
        super(game);
        this.image = paperImage;
        this.x = 800;
        this.y = 400;
    }
    update(){
        this.y += this.speedY;
        this.x += this.speedX;
    }
}
class Background {

}
class UI {
    constructor(game)
    {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Helvetica';
        this.color = 'black';
    }
    draw(context){

    }
}
class Game {
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.scissors = [];
        this.rocks = [];
        this.papers = [];
        this.numberOfScissors = 8;
        this.numberOfRocks = 1;
        this.numberOfPapers = 1;
        for (let i = 0; i < this.numberOfScissors; i++){
            this.scissors.push(new Scissor(this));
        }
        for (let i = 0; i < this.numberOfRocks; i++){
            this.rocks.push(new Rock(this));
        }
        for (let i = 0; i < this.numberOfPapers; i++){
            this.papers.push(new Paper(this));
        }
        this.ui = new UI(this);
    }
    update(){
        //Rock Beats Scissors
        this.scissors.forEach(scissor => {
            scissor.update();
            this.rocks.forEach(rock => {
                if (this.checkCollision(rock,scissor)){
                    scissor.markedForDeletion = true;
                }
            });
        });
        //Paper Beats Rock
        this.rocks.forEach(rock => {
             rock.update();
             this.papers.forEach(paper => {
                if (this.checkCollision(rock, paper)){
                    rock.markedForDeletion = true;
                }                    
             });
        });
        //Scissors Beats Paper
        this.papers.forEach(paper => {
            paper.update();
            this.scissors.forEach(scissor => {
                if (this.checkCollision(paper, scissor)){
                    paper.markedForDeletion = true;
                }
            });
        });

        this.rocks.forEach(rock => {

                //Rock Beats Scissors
                let target = this.scissors[0];
                let short = this.distanceSquared(rock, target);
                for (let i = 0; i < this.scissors.length; i++) {
                     let d = this.distanceSquared(rock, this.scissors[i]);
                     if ( d < short) {
                         target = this.scissors[i];
                         short = d;
                     }
                }

                if ( (rock.x - target.x) > 0 ) {
                    rock.speedX = Math.random() * -.5;
                }
                else {
                    rock.speedX = Math.random() * .5;
                }
                if ( (rock.y - target.y) > 0 ) {
                    rock.speedY = Math.random() * -.5;
                }
                else {
                    rock.speedY = Math.random() * .5;
                }        
            if ( this.scissors.length === 0) {
                rock.speedX = 0;
                rock.speedY = 0;               
            }
        })





        this.scissors = this.scissors.filter(scissor => !scissor.markedForDeletion);
        this.rocks = this.rocks.filter(rock => !rock.markedForDeletion);
        this.papers = this.papers.filter(paper => !paper.markedForDeletion);
    }
    draw(context){
        this.ui.draw(context);
        this.scissors.forEach(scissor => scissor.draw(context));
        this.rocks.forEach(rock => rock.draw(context));
        this.papers.forEach(paper => paper.draw(context));
    }
    checkCollision(rect1, rect2){
        return (    rect1.x < rect2.x + rect2.width &&
                    rect1.x + rect1.width > rect2.x &&
                    rect1.y < rect2.y + rect2.height &&
                    rect1.height + rect1.y > rect2.y)
    }
    distanceSquared(rect1, rect2){
        return ( (rect1.x-rect2.x)*(rect1.x-rect2.x)+(rect1.y-rect2.y)*(rect1.y-rect2.y))
    }
}

const game = new Game(canvas.width, canvas.height);

//Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update();
    requestAnimationFrame(animate);   
}

animate();
