/**
 * Initialize the Game and start it.
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}


/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a 
 * singleton.
 */
var imageRepository = new function() {
	// Define images
	this.background = new Image();
	this.primer = new Image();
	this.ball = new Image();
	this.cup = new Image();

	// Ensure all images have loaded before starting the game
	var numImages = 4;
	var numLoaded = 0;
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	this.background.onload = function() {
		imageLoaded();
	}
	this.primer.onload = function() {
		imageLoaded();
	}
	this.ball.onload = function() {
		imageLoaded();
	}
	this.cup.onload = function() {
		imageLoaded();
	}
	
	// Set images src
	this.background.src = "imgs/bg.png";
	this.primer.src = "imgs/ball.png";
	this.ball.src = "imgs/ball.png";
	this.cup.src = "imgs/cup.png";
}


/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up defualt variables
 * that all child objects will inherit, as well as the defualt
 * functions. 
 */
function Drawable() {
	this.init = function(x, y, width, height) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
	this.move = function() {
	};

}
/**
 * Creates the Background object which will become a child of
 * the Drawable object. The background is drawn on the "background"
 * canvas.
 */
function Background() {
	this.speed = 0; // No movement
	
	// Implement abstract function
	this.draw = function() {
		this.context.drawImage(imageRepository.background, this.x, this.y);
	};
}
// Set Background to inherit properties from Drawable
Background.prototype = new Drawable();


/**
* Creates the Ball object that the player shoots. The balls are drawn on the 
* "main" canvas.
*/
function Ball(object) {	
	this.alive = false; // Is true if the ball is currently in use
	var self = object;
	/*
	 * Sets the ball values
	 */
	this.spawn = function(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};

	/*
	 * Uses a "drity rectangle" to erase the bullet and moves it.
	 * Returns true if the bullet moved off the screen, indicating that
	 * the bullet is ready to be cleared by the pool, otherwise draws
	 * the bullet.
	 */
	this.draw = function() {
		this.context.clearRect(this.x, this.y, this.width, this.height);
		var stableHeight = this.canvasHeight;

		this.y -= this.speed;
		this.x += .5; // keeps ball centered
		// shrink ball as it is thrown
		this.width -= 1.2;
		this.height -= 1.2;

		if (self === "ball" && this.y <= stableHeight/2.5) {
			return true; // clears ball object
		}
		else {
			// update position and size
			this.context.drawImage(imageRepository.ball, this.x, this.y, this.width, this.height);
			return false;
		}
	};
	
	/*
	 * Resets the bullet values
	 */
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.width = imageRepository.ball.width;
		this.height = imageRepository.ball.height;
		this.speed = 0;
		this.alive = false;
	};
}
Ball.prototype = new Drawable();

/**
* Custom Pool object. Holds and manages balls to prevent garbage colleciton.
*/
function Pool(maxSize) {
	var size = maxSize; // Max bullets allowed in the pool
	var pool = [];
	
	/*
	 * Populates the pool array with the given object
	 */
	this.init = function(object) {
		if (object == "ball") {
			for (var i = 0; i < size; i++) {
				// Initalize the ball object
				var ball = new Ball("ball");
				ball.init(0,0, imageRepository.ball.width,
				            imageRepository.ball.height);
				pool[i] = ball;
			}
		}
		else if (object == "cup") {
			for (var i = 0; i < size; i++) {
				var cup = new Cup();
				cup.init(0,0, imageRepository.cup.width, 
					imageRepository.cup.height);
				pool[i] = cup;
			}
		}
	};

	/*
	* Grabs the last item in the list and intializes it and pushes it to the 
	* front of the array
	*/
	this.get = function(x, y, speed) {
		if(!pool[size - 1].alive) {
			pool[size - 1].spawn(x, y, speed);
			pool.unshift(pool.pop());
		}
	};

	/*
	* Draws any in use Balls. If a ball goes out of range, clears it and 
	* pushes it to front of the array.
	*/
	this.animate = function() {
		for (var i = 0; i < size; i++) {
			// Only draw until we find a ball that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};
}

/**
* Create the Cup object.
*/
function Cup() {
	this.alive = false;
	/*
	* Sets Cup values
	*/
	this.spawn = function(x,y,speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.alive = true;
	};
	/*
	* Move the cup
	*/
	this.draw = function() {
		// this.context.clearRect(this.x, this.y, this.width, this.height);
		this.context.globalCompositeOperation="destination-over";
		this.context.drawImage(imageRepository.cup, this.x, this.y);
		this.context.restore();
	};
	/*
	* Resets the cup values
	*/
	this.clear = function() {
		this.x = 0;
		this.y = 0;
		this.speed = 0;
		this.alive = false;
	};
}
Cup.prototype = new Drawable();

/**
* Create the Primer object that the player controls. The primer is drawn on the
* "ball" canvas and uses dirty rectangles to move around the screen.
*/
function Primer() {
	this.speed = 3;
	this.ballPool = new Pool(1);
	this.ballPool.init("ball");

	var shootRate = 1;
	var counter = 0;

	this.draw = function() {
		this.context.drawImage(imageRepository.primer, this.x, this.y);
	};
	this.move = function() {	
		counter++;
		// Determine if the action is move action
		if (KEY_STATUS.left || KEY_STATUS.right) {
			// The ship moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			// Update x and y according to the direction to move and
			// redraw the ship. Change the else if's to if statements
			// to have diagonal movement.
			if (KEY_STATUS.left) {
				this.x -= this.speed
				if (this.x <= 0) // Keep player within the screen
					this.x = 0;
			} else if (KEY_STATUS.right) {
				this.x += this.speed
				if (this.x >= this.canvasWidth - this.width)
					this.x = this.canvasWidth - this.width;
			}
			
			// Finish by redrawing the ship
			this.draw();
		}
		
		if (KEY_STATUS.click && counter >= shootRate) {
			this.shoot();
			counter = 0;
		}
	};

	/*
	* Shoots 1 ball
	*/
	this.shoot = function() {
		this.ballPool.get(this.x, this.y, 4);
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	};
}
Primer.prototype = new Drawable();

/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
	/*
	 * Gets canvas information and context and sets up all game
	 * objects. 
	 * Returns true if the canvas is supported and false if it
	 * is not. This is to stop the animation script from constantly
	 * running on older browsers.
	 */
	this.init = function() {
		// Get the canvas element
		this.bgCanvas = document.getElementById('background');
		this.primerCanvas = document.getElementById('primer');
		this.mainCanvas = document.getElementById('main');
		
		// Test to see if canvas is supported. Only need to check one canvas
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.primerContext = this.primerCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');
		
			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Primer.prototype.context = this.primerContext;
			Primer.prototype.canvasWidth = this.primerCanvas.width;
			Primer.prototype.canvasHeight = this.primerCanvas.height;

			Ball.prototype.context = this.mainContext;
			Ball.prototype.canvasWidth = this.mainCanvas.width;
			Ball.prototype.canvasHeight = this.mainCanvas.height;

			Cup.prototype.context = this.mainContext;
			Cup.prototype.canvasWidth = this.mainCanvas.width;
			Cup.prototype.canvasHeight = this.mainCanvas.height;

			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0

			// Initialize the primer object
			this.primer = new Primer();
			// Set the primer to start near the bottom middle of the canvas
			var primerStartX = this.primerCanvas.width/2 - imageRepository.primer.width/2;
			var primerStartY = this.primerCanvas.height-100;
			// var primerStartY = this.primerCanvas.height/4*3 + imageRepository.primer.height*2;
			this.primer.init(primerStartX, primerStartY, imageRepository.primer.width,
			               imageRepository.primer.height);

			// Initialize the cup pool object
			this.cupPool = new Pool(30);
			this.cupPool.init("cup");
			var height = imageRepository.cup.height;
			var width = imageRepository.cup.width;
			var x = (this.primerCanvas.width/2) - (width*4/2);
			var y = height*4;
			var spacer = y/16;
			for (var i = 1; i <= 10; i++) {
				this.cupPool.get(x,y,0);
				x += width;
				if (i == 4) {
					x = (this.primerCanvas.width/2) - (width*3/2);
					y += spacer;
				} else if (i == 7) {
					x = (this.primerCanvas.width/2) - (width);
					y += spacer;
				} else if (i == 9) {
					x = (this.primerCanvas.width/2) - (width/2);
					y += spacer;
				}
			}

			return true;
		} else {
			return false;
		}
	};
	
	// Start the animation loop
	this.start = function() {
		this.primer.draw();
		animate();
	};
}

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
	requestAnimFrame( animate );
	game.background.draw();
	game.primer.move();
	game.primer.ballPool.animate();
	game.cupPool.animate();
}

// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  65: 'left', // a
  68: 'right', // d
  0: 'click'
}

// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
	e.preventDefault();
	KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}
/**
 * Sets up the document to listen to onkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets the appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}
/**
* Sets up the doc to listen to onmousedown events (fired when user clicks on 
* an element).
*/
document.onmousedown = function(e) {
	keyCode = 0;
	if (KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = true;
	}
}
/**
* Sets up the doc to listen to onmouseup events (fired when user releases mouse
* ).
*/
document.onmouseup = function(e) {
	keyCode = 0;
	if (KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = false;
	}
}

/**	
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop, 
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();