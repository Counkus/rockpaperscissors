/** @type {HTMLCanvasElement} */

//Canvas Required Variables

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;

//Emoji global variables
//Scissors Variables
const sciccorImage = new Image();
sciccorImage.src = "scissors_small.png";

//Rock Variables
const rockImage = new Image();
rockImage.src = "rock_small.png";

//Paper Variables
const paperImage = new Image();
paperImage.src = "paper_small.png";

//Classes
//Parent Class
class Emoji {
	constructor(game) {
		this.game = game;
		this.width = 64;
		this.height = 64;
		this.speedX = 0;
		this.speedY = 0;
		this.markedForDeletion = false;
		this.targetLocked = false;
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y);
	}
	move() {
		this.y += this.speedY;
		this.x += this.speedX;
	}
}

class Scissor extends Emoji {
	constructor(game) {
		super(game);
		this.image = sciccorImage;
	}
}

class Rock extends Emoji {
	constructor(game) {
		super(game);
		this.image = rockImage;
	}
}

class Paper extends Emoji {
	constructor(game) {
		super(game);
		this.image = paperImage;
	}
}
class UI {
	constructor(game) {
		this.game = game;
	}
	draw(context) {
		context.fillText("Rock Paper Scissors", 50, 50);
	}
}
class Game {
	constructor() {
		this.scissors = [];
		this.rocks = [];
		this.papers = [];
		this.numberOfScissors = 6;
		this.numberOfRocks = 6;
		this.numberOfPapers = 6;
		this.speedMult = 0.5;
		for (let i = 0; i < this.numberOfScissors; i++) {
			this.scissors.push(new Scissor());
		}
		for (let i = 0; i < this.numberOfRocks; i++) {
			this.rocks.push(new Rock());
		}
		for (let i = 0; i < this.numberOfPapers; i++) {
			this.papers.push(new Paper());
		}
		this.ui = new UI(this);
	}
	update() {
		//Rock Beats Scissors
		this.BeatsLogic(this.rocks,this.scissors,Rock);
		//Paper Beats Rock
		this.BeatsLogic(this.papers,this.rocks,Paper);
		//Scissors Beats Paper
		this.BeatsLogic(this.scissors,this.papers,Scissor);
		
		this.scissors = this.scissors.filter((scissor) => !scissor.markedForDeletion);
		this.rocks = this.rocks.filter((rock) => !rock.markedForDeletion);
		this.papers = this.papers.filter((paper) => !paper.markedForDeletion);
	}
	chase() {
		//Rock Chase Scissors
		this.ChaseLogic(this.rocks,this.scissors);
		if (this.scissors.length === 0) {
			this.rocks.forEach((rock) => {
				rock.speedX = 0;
				rock.speedY = 0;
			});
		}
		//Paper Chase Rock
		this.ChaseLogic(this.papers,this.rocks);
		if (this.rocks.length === 0) {
			this.papers.forEach((paper) => {
				paper.speedX = 0;
				paper.speedY = 0;
			});
		}
		//Scissors Chase Paper
		this.ChaseLogic(this.scissors,this.papers);
		if (this.papers.length === 0) {
			this.scissors.forEach((scissor) => {
				scissor.speedX = 0;
				scissor.speedY = 0;
			});
		}
	}
	draw(context) {
		this.ui.draw(context);
		this.scissors.forEach((scissor) => scissor.draw(context));
		this.rocks.forEach((rock) => rock.draw(context));
		this.papers.forEach((paper) => paper.draw(context));
	}
	checkCollision(rect1, rect2) {
		return (
			rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.height + rect1.y > rect2.y
		);
	}
	distanceSquared(rect1, rect2) {
		return (
			(rect1.x - rect2.x) * (rect1.x - rect2.x) +
			(rect1.y - rect2.y) * (rect1.y - rect2.y)
		);
	}
	BeatsLogic(attackerArray, defenderArray, attackerSpawnObject){
		defenderArray.forEach((defender) => {
			//defender.move();
			attackerArray.forEach((attacker) => {
				if (this.checkCollision(attacker,defender)) {
					defender.markedForDeletion = true;
					attacker.targetLocked = false;
					attackerArray.push(new attackerSpawnObject());
					attackerArray[attackerArray.length -1].x = defender.x;
					attackerArray[attackerArray.length -1].y = defender.y;
				}

			});
		});
	}
	ChaseLogic(attackersArray, defendersArray){
		if (defendersArray.length > 0) {
			attackersArray.forEach((attacker) => {
					let target = defendersArray[0];
				//if (attacker.targetLocked === false) {
					let initialDistance = this.distanceSquared(attacker, target);
					for (let i = 0; i < defendersArray.length; i++) {
						let newDistance = this.distanceSquared(attacker, defendersArray[i]);
						if (newDistance < initialDistance) {
							target = defendersArray[i];
							initialDistance = newDistance;
							//attacker.targetLocked = true;
						}
					//}
					}
					if (attacker.x - target.x > 0){
						attacker.speedX = Math.random() * -this.speedMult;
					} else {
						attacker.speedX = Math.random() * this.speedMult;
					}
					if (attacker.y - target.y > 0){
						attacker.speedY = Math.random() * -this.speedMult;
					} else {
						attacker.speedY = Math.random() * this.speedMult;
					}
					attacker.move();		
			});
		}
	}
}

const game = new Game();

//Animation Loop
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game.draw(ctx);
	game.chase();
	game.update();
	requestAnimationFrame(animate);
}

animate();
