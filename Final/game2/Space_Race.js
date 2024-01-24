//JavaScript Document
//Everything that happens within the game is within this file

//Global Variables 
var mycanvas = document.getElementById("myCanvas"); //Getting the cnavas element from the HTML file 
var ctx = mycanvas.getContext("2d"); //Setting the canvas context to variable
var canvas = { width: 600, height: 800 }; //Canvas dimensions
var score = 0; //Score variable

//Variable that keeps track of the player on the canvas 
var player = {
	x: canvas.width / 2, //starting position in the middle of the screeen
	y: canvas.height - 10, //Starting position at the bottom of the canvas
	speed: 3.5 //number of pixels moved with one press 3.5
};

var allDebris = []; // Setting the Debris as an array of multiple obsticles
var numberOfDebris = 1; //Setting the constant amount of debris on the field starting at 1

//Movement Variables defulted to false as without interaction thhe ship does not move
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;

var horizontalSpeed = 4; // defult horizontal speed of the debris

//Making the diffculty dependent on the score that the player has 
function difficulty(){	
	if(score <=10){//before the player reaches a score of 10
		numberOfDebris = ((score*1.6)+1);//have the number of debris scale of off the players score 
	}
	else if(score<=20 && score>10){ //after reaching a score of 11 and before a score of 20
		numberOfDebris =(score*1.4);//have the number of debris scale of off the players score
		horizontalSpeed = 4.5;//increase debris speed 
	}
	else if(score<=30 && score>20){//after reaching a score of 21 and before a score of 30
		numberOfDebris =(score*1.2);//have the number of debris scale of off the players score
		horizontalSpeed = 5;//increase debris speed 
	}
	else if(score<=40 && score>30){//after reaching a score of 31 and before a score of 40
		numberOfDebris =(score*1);//have the number of debris scale of off the players score
		horizontalSpeed = 5.5;//increase debris speed
	}
	else{
		numberOfDebris =(score*1);//have the number of debris scale of off the players score
		horizontalSpeed = 6; //increase debris speed
	}
}

//Setting which way the player should go depending on which key is pressed 
function move() {
	if (LEFT) {
		player.x -= player.speed;
	}
	if (RIGHT) {
		player.x += player.speed;
	}
	if (UP) {
		player.y -= player.speed;
	}
	if (DOWN) {
		player.y += player.speed;
	}
}

//function to clear canvas
function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); //reset the ship
}

// Draw the player ship 
function ship(x, y) {
	var x = player.x; //Track the ships x postion
	var y = player.y; //Track the ships y position
	ctx.fillStyle = "#FFFFFF"; //Ships colour
	//Drawing the triangle 
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x + 10, y + 35); 
	ctx.lineTo(x - 10, y + 35); 
	ctx.fill();
}

//Function to set borders on the left, right, and bottom to stop the ship
function stopAtBorder() {
	player.x = Math.min(Math.max(10, player.x), canvas.width - 10) // X borders
	player.y = Math.min(Math.max(-45, player.y), canvas.height - 50) // Y border
}

//Fucntion to set a wrap border on the top of the canvas
function warpAtBorder() {
	if (player.y <= 20) { //Hit the top
		player.y = canvas.height - 50; //Warp player back to the spawn
		score++; //add a point to the players score
	}
}

//Add score element to the canvas to display the players score
function showScore() {
	ctx.font = "30px Comic Sans MS";
	ctx.fillStyle = "white";
	ctx.textAlign = "right";
	ctx.fillText(`Score: ${score}`, 550, 50);
}

//Creates a random number within the parameters
function rnd(min, max) {
	return Math.random() * (max - min) + min;
}

//Every update check to see if the player is colliding with any debris that is on the playing field
function checkForCollision() 
{
	const collisionDetected = allDebris.some(debris => { //returning boolean value
		const topDistanceSqrd = (player.x - debris.x)**2 + (player.y - debris.y + 17.5)**2
		return topDistanceSqrd < debris.r**2.5; //Number of pixels that the hitbox includes 
		
		
		
		//const bottomDistanceSqrd = (player.x+10 - debris.x)**2 + ((player.y - 40) - debris.y)**2
		//return bottomDistanceSqrd < debris.r**2.1;
		//todo: Maybe look to add a hitbox with a diameter around the ship or make the ship length decrease
	})

// //If a collsion is detected then reset the score and the playter position
// 	if(collisionDetected) {
// 		score = 0;
// 		allDebris = [];
// 		player.x = canvas.width/2;
// 		player.y = canvas.height - 10;
// 	}

//If a collsion is detected then quit game and go to leaderboard
	if(collisionDetected) {
		const $modal = document.createElement('div');
		$modal.className = 'gameover'
		$modal.innerHTML = `
			<h1>Game Over</h1>
		`
		
		document.body.innerHTML = '';
		document.body.appendChild($modal);
		sendScore(score);
		setTimeout(function() {
			location.href = '/~/Space_Race/Leaderboard'
		}, 2000)
		return true;
	}
	return false;
}

//Picks and spawns the debris on a specifc position
function spawnDebris() {
	while (allDebris.length < numberOfDebris) { //If less debris that supposed to be
		const xleft = rnd(-canvas.width, 0); //random number in specified range
		const xright = rnd(canvas.width, 2 * canvas.width); //random number in specified range
		const direction = rnd(-1, 1) < 0 ? 'left' : 'right'; // Random number and if -1 then left and if 1 then right
		const x = direction === 'left' ? xleft : xright; //Returns the proper direction of the specific debris
		const vx = direction === 'left' ? horizontalSpeed : -horizontalSpeed; //Speed of the debris across the screen in the correct direction
		
		//Creating the bounds for the field where the debris can spawn on the field
		// Small safe zone at the bottom of the canvas to ensure that the player does not instantly get hit by debris on spawn or reset
		const debris = { x: x, y: rnd(0, canvas.height-100), r: rnd(7, 15), vx: vx }; 
		allDebris.push(debris); // Push all debris elements
	}
}

//Check the number of debris currently on the playing 
//If debris is off the border of the screen then delete it and call function to replace it
function checkDebris() {
	allDebris = allDebris.filter(debris => {
		const inWindow = (debris.vx > 0 && debris.x < 600) || (debris.vx < 0 && debris.x > 0);
		return inWindow;
	})
}

//Creates the shape of the debris
function drawDebris() {
	allDebris.forEach(function (debris) {
		// draw your debris
		ctx.beginPath();
		ctx.arc(debris.x, debris.y, debris.r, 2 * Math.PI, false); // circle
		ctx.fillStyle = 'white'; //coulor
		ctx.fill();
	})
}

//Moves the derbis across the screen horizontally at the constant speed that is the vx 
function moveDebris() {
	allDebris.forEach(function (debris) {
		// move the debris
		debris.x += debris.vx;
	})
}

//Looping the function to create a steady flow of frame updates
//Every time the canvas updates call all of the logic update functions, 
//and then all of the visual update functions
function update() {
	// CLEAR
	clearCanvas();

	// LOGIC
	move(); //Move the ship
	moveDebris(); //Move the debris
	difficulty();

	// COLLISIONS
	stopAtBorder(); //Setting borders at the sides and bottom of the canvas
	warpAtBorder(); //Setting warp border at the top of the canvas
	checkDebris(); //Check how many debris entities are currently on the field
	spawnDebris(); //Spawn the debrid in random locations within parameters
	const isGameOver = checkForCollision(); //Check every update for ship collsions with debris 

	// DRAW
	ship(); //draw the player ship
	showScore(); //show the score element in the top right corner 
	drawDebris(); //draw the debris before being spawned onto the field 

	// NEXT FRAME
	if(!isGameOver) window.requestAnimationFrame(update);
}

spawnDebris(); // After the checkDebris function has been called. If any debris have left the field then spawn more.

//Setting when the keys are pressed to move 
document.onkeydown = function (e) {
	if (e.keyCode == 65) LEFT = true;
	if (e.keyCode == 68) RIGHT = true;
	if (e.keyCode == 87) UP = true;
	if (e.keyCode == 83) DOWN = true;
}

//Setting the keys to be not pressed by defult 
document.onkeyup = function (e) {
	if (e.keyCode == 65) LEFT = false;
	if (e.keyCode == 68) RIGHT = false;
	if (e.keyCode == 87) UP = false;
	if (e.keyCode == 83) DOWN = false;
}

//updating the canvas to ensure smooth movement (look up request animation frame)
window.requestAnimationFrame(update);