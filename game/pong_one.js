/**
 * Initialize the Game and starts it.
 */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

/**
* Defines a singleton object to hold all images so they are only created once.
*/

var imageRepo = new function() {
	// Define images
	this.empty = null;
	this.background = new Image();

	// Set images src
	this.background.src = "imgs/bg.png";
}

/** Creates abstract object Drawable used as the base class for all
drawable objects in the game. Sets up default variables that all child
objects will inherit, as well as default functions. */

function Drawable() {
	this.init = function(x,y) {
		// Default variables
		this.x;
		this.y;
	}
	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;

	// Define abstract function to be implemented in child objects
	this.draw = function() {
	};
}

/** * Creates Backgroun object which will become a child of the Drawable object.
The background is drawn on the "background" canvas.
*/

function Background() {
	this.speed = 1; // Redefine speed for panning
	// Implement abstract function
	this.draw = function() {
		// Pan background
		this.y += this.speed;
		this.context.drawImage(imageRepo.background, this.x, this.y);
		// Draw another image at top edge of first
		this.context.drawImage(imageRepo.background, this.x, this.y - this.canvasHeight);

		// Reset if the image scrolled off the screen
		if (this.y >= this.canvasHeight)
			this.y = 0;
	};
}
// Set background to inherit properties from Drawable. This does inheritance.
Background.prototype = new Drawable();

/**
* Creates the Game object which will hold all objects and data for the game.
*/
function Game() {
	/*
	* Gets canvas information and context and sets up all game objects.
	* Returns true ir the canvas is supported and false otherwise. This is to stop the animation script from constatnly running on older browsers.
	*/
	this.init = function() {
		// Get canvas element
		this.bgCanvas = document.getElementById('background');
		// Test if canvas is supported
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			// Initialize objects to coantin their context and canvas information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			// Initialize background object
			this.background = new Background();
			this.background.init(0,0); // Set draw point to 0,0
			return true;
		} else {
			return false;
		}
	};

	// Stat animation loop
	this.start = function() {
		animate();
	};
}

/**
* The animation loop. Calls the requestAnimationFrame shim to optimize the game loop and draws all game objects. This funciton must be a global function and cannot be within an object.
*/
function animate() {
	requestAnimFrame( animate );
	game.background.draw();
}

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();