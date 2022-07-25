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
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	update() {
		this.y += this.speedY;
		this.x += this.speedX;
	}
}

class Scissor extends Emoji {
	constructor(game) {
		super(game);
		this.image = sciccorImage;
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
	}
}

class Rock extends Emoji {
	constructor(game) {
		super(game);
		this.image = rockImage;
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
	}
}

class Paper extends Emoji {
	constructor(game) {
		super(game);
		this.image = paperImage;
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
	}
}
class UI {
    constructor(game)
    {
        this.game = game;
    }
    draw(context){
		context.fillText('Rock Paper Scissors', 50,50)
    }
}
class Game {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.scissors = [];
		this.rocks = [];
		this.papers = [];
		this.numberOfScissors = 4;
		this.numberOfRocks = 4;
		this.numberOfPapers = 4;
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
		this.scissors.forEach((scissor) => {
			scissor.update();
			this.rocks.forEach((rock) => {
				if (this.checkCollision(rock, scissor)) {
					scissor.markedForDeletion = true;
                    this.rocks.push(new Rock());
                    this.rocks[this.rocks.length -1].x = scissor.x
                    this.rocks[this.rocks.length -1].y = scissor.y
                    // this.rocks = this.rocks.filter((rock) => !rock.markedForDeletion);
				}
			});
		});
		//Paper Beats Rock
		this.rocks.forEach((rock) => {
			rock.update();
			this.papers.forEach((paper) => {
				if (this.checkCollision(rock, paper)) {
					rock.markedForDeletion = true;
                    this.papers.push(new Paper());
                    this.papers[this.papers.length -1].x = rock.x
                    this.papers[this.papers.length -1].y = rock.y
                    // this.papers = this.papers.filter((paper) => !paper.markedForDeletion);
				}
			});
		});
		//Scissors Beats Paper
		this.papers.forEach((paper) => {
			paper.update();
			this.scissors.forEach((scissor) => {
				if (this.checkCollision(paper, scissor)) {
					paper.markedForDeletion = true;
                    this.scissors.push(new Scissor());
                    this.scissors[this.scissors.length -1].x = paper.x
                    this.scissors[this.scissors.length -1].y = paper.y
                    // this.scissors = this.scissors.filter((scissor) => !scissor.markedForDeletion);
				}
			});
		});
		
		this.scissors = this.scissors.filter((scissor) => !scissor.markedForDeletion);
		this.rocks = this.rocks.filter((rock) => !rock.markedForDeletion);
		this.papers = this.papers.filter((paper) => !paper.markedForDeletion);
	}
	chase() {
		//Rock Chase Scissors
		if (this.scissors.length > 0) {
			this.rocks.forEach((rock) => {
				let rockTarget = this.scissors[0];
				let shortestScissor = this.distanceSquared(rock, rockTarget);
				for (let i = 0; i < this.scissors.length; i++) {
					let dScissor = this.distanceSquared(rock, this.scissors[i]);
					if (dScissor < shortestScissor) {
						rockTarget = this.scissors[i];
						shortestScissor = dScissor;
					}
				}
				if (rock.x - rockTarget.x > 0) {
					rock.speedX = Math.random() * -this.speedMult;
				} else {
					rock.speedX = Math.random() * this.speedMult;
				}
				if (rock.y - rockTarget.y > 0) {
					rock.speedY = Math.random() * -this.speedMult;
				} else {
					rock.speedY = Math.random() * this.speedMult;
				}
			});
		}
		if (this.scissors.length === 0) {
			this.rocks.forEach((rock) => {
				rock.speedX = 0;
				rock.speedY = 0;
			});
		}

		//Paper Chase Rock
		if (this.rocks.length > 0) {
			this.papers.forEach((paper) => {
				let paperTarget = this.rocks[0];
				let shortestRock = this.distanceSquared(paper, paperTarget);
				for (let i = 0; i < this.rocks.length; i++) {
					let dRock = this.distanceSquared(paper, this.rocks[i]);
					if (dRock < shortestRock) {
						paperTarget = this.rocks[i];
						shortestRock = dRock;
					}
				}
				if (paper.x - paperTarget.x > 0) {
					paper.speedX = Math.random() * -this.speedMult;
				} else {
					paper.speedX = Math.random() * this.speedMult;
				}
				if (paper.y - paperTarget.y > 0) {
					paper.speedY = Math.random() * -this.speedMult;
				} else {
					paper.speedY = Math.random() * this.speedMult;
				}
			});
		}
		if (this.rocks.length === 0) {
			this.papers.forEach((paper) => {
				paper.speedX = 0;
				paper.speedY = 0;
			});
		}

		//Scissors Chase Paper
		if (this.papers.length > 0) {
			this.scissors.forEach((scissor) => {
				let scissorTarget = this.papers[0];
				let shortestPaper = this.distanceSquared(
					scissor,
					scissorTarget
				);
				for (let i = 0; i < this.papers.length; i++) {
					let dPaper = this.distanceSquared(scissor, this.papers[i]);
					if (dPaper < shortestPaper) {
						scissorTarget = this.papers[i];
						shortestPaper = dPaper;
					}
				}
				if (scissor.x - scissorTarget.x > 0) {
					scissor.speedX = Math.random() * -this.speedMult;
				} else {
					scissor.speedX = Math.random() * this.speedMult;
				}
				if (scissor.y - scissorTarget.y > 0) {
					scissor.speedY = Math.random() * -this.speedMult;
				} else {
					scissor.speedY = Math.random() * this.speedMult;
				}
			});
		}

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
}

const game = new Game(canvas.width, canvas.height);

//Animation Loop
function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game.draw(ctx);
	game.update();
	game.chase();
	requestAnimationFrame(animate);
}

animate();
