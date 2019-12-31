//console.log('reading js file...!');
var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

var c = canvas.getContext('2d');
var isPaused = false;
var isFilled = false;
var isDrawWithMouse = false;

var mouse = { x: undefined, y: undefined}
var startRadius = 10;
var maxRadius = 50;
var minRadius = 2;

var particlesArray = [];
var noOfparticles = 20;
var maxNoOfparticles = 400;
var particlePathRadius = 200;
var particleSpacing = 60;

var particleSpeed = 50;

var colorArray = [
					'#0477bf',
					'#024873',
					'#05f240',
					'#f28705',
					'#f24405'
					];

canvas.addEventListener('mousedown', 
						function(event) {
						mouse.x = event.x;
						mouse.y = event.y;

						});

window.addEventListener('resize', 
						function(event) {
							canvas.width = window.innerWidth;
							canvas.height = window.innerHeight;						
							init();
						});

function Particle(x, y, velocity, radius, radians) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.minRadius = radius;
	this.radians = radians;
	this.velocity = velocity;
	this.color = colorArray[Math.floor(Math.random() * colorArray.length) ];
	

	this.draw = function () {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.strokeStyle = this.color;
		if (isFilled) {
			c.fillStyle = this.color;
			c.fill();
		}
		c.stroke();		
	}
	
	this.update = function () {
		//Bounce off edges
		//if (this.x + radius > canvas.width || this.x - (radius) < 0){
		//	this.dx = -this.dx;
		//}
		//if (this.y + radius > canvas.height || this.y - (radius) < 0){
		//	this.dy = -this.dy;
		//}
		
		//Increment movement
		this.x = mouse.x + this.velocity + Math.cos(2 * Math.PI * this.radians)*particlePathRadius;
		this.y = mouse.y + this.velocity + Math.sin(2 * Math.PI * this.radians)*particlePathRadius;
		this.radians = (this.radians + 0.01)%(2 * Math.PI);

		//Increase radius if close to mouse pointer
		if (mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
			mouse.y - this.y < 50 && mouse.y - this.y > -50 &&
			this.radius < maxRadius){
			this.radius += 1;
		}
		
		//Decrease radius if away from mouse pointer
		else if (this.radius > this.minRadius) {
			this.radius -= 1;
		}
		
		this.draw();
	}
}

function addParticles(){
	for (var i = 0; i < noOfparticles; i++){
		var x = Math.abs((Math.random() * canvas.width - minRadius*4)) + minRadius*2;
		var y = Math.abs((Math.random() * canvas.height - minRadius*4)) + minRadius*2;
		var velocity = (Math.random() - 1) * particleSpacing;
		var radius = (Math.random() * startRadius) + 1;
		var radians = (Math.random() * 2 * Math.PI);
	
		var particle = new Particle(x, y, velocity, radius, radians);
		particlesArray.push(particle);
	}	
}

function init(){
	particlesArray = [];	
	addParticles();
}

function animate(){
// 	requestAnimationFrame(animate);
	if (!isPaused){
		//c.clearRect(0,0, innerWidth, innerHeight);
		//for (var i = 0; i < particlesArray.length; i++){
		//	particlesArray[i].update();
		//}
		particlesArray.forEach(particle => { particle.update()});
	}
}

function addManyParticles(){
	noOfparticlesOriginal = noOfParticles;
	noOfparticles = maxNoOfParticles;
	init();
	noOfparticles = noOfparticlesOriginal;
}

function setPaused() { 
	isPaused = !isPaused; 
	element = document.getElementById('btnPause');
	if (isPaused) { element.innerHTML = 'Resume'; }
	else { element.innerHTML = 'Pause'; }
}

function setFill() { 
	isFilled = !isFilled; 
	element = document.getElementById('btnFill');
	if (isFilled) { element.innerHTML = 'Pen'; }
	else { element.innerHTML = 'Paint'; }
}

function moveWithMouse(event) {
	mouse.x = event.x;
	mouse.y = event.y;
}

function setDrawWithMouse() { 
	isDrawWithMouse = !isDrawWithMouse; 
	element = document.getElementById('btnDrawWithMouse');
	
	if (isDrawWithMouse) { 
		element.innerHTML = 'On Click'; 
		canvas.addEventListener('mousemove', moveWithMouse);
	}
	else { 
		element.innerHTML = 'Move With Mouse'; 
		canvas.removeEventListener('mousemove', moveWithMouse);
		init();
	}

}
function makeCircleSmaller() { particlePathRadius -= 20; }

function makeCircleLarger() { particlePathRadius += 20; }

// animate();
init();
setInterval(animate, particleSpeed);