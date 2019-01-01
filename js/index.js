 // Initial Setup
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
// var mouse = {
//   x: innerWidth / 2,
//   y: innerHeight / 2 };


var ballCount = 100;
var balls = [];
var gravityPos = [];
var friction = .992;
var explosionDistance = 7;
var shouldExplode = false;

var colors = [
'#5E1742',
'#962E40',
'#C9463D',
'#FF5E35'];


var bgColor = '#252525';


// Event Listeners
// addEventListener("mousemove", function (event) {
//   mouse.x = event.clientX;
//   mouse.y = event.clientY;
//   gravityPos = [mouse.x, mouse.y];
// });

// addEventListener("mouseout", function (event) {
//   gravityPos = [canvas.width / 2, canvas.height / 2];
// });

addEventListener("resize", function () {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// addEventListener("click", function () {
//   init();
// });


// Utility Functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomeFloatFromRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}


// Objects
function Ball(px, py, vx, vy, f, radius, color) {
  this.p = [px, py];
  this.v = [vx, vy];
  this.gv = [0, 0];
  this.gp = 0;
  this.radius = radius;
  this.color = color;
  this.f = f;

  this.update = function () {
    // calculate gravity vector
    this.gv = [gravityPos[0] - this.p[0], gravityPos[1] - this.p[1]];

    // Calculate gravity intensity
    var a = gravityPos[0] - this.p[0];
    var b = gravityPos[1] - this.p[1];
    this.gp = 1 / Math.sqrt(a * a + b * b);

    // Explode if needed
    if (shouldExplode) {
      this.v[0] *= randomeFloatFromRange(-3, 3);
      this.v[1] *= randomeFloatFromRange(-3, 3);
    }

    // Reduce ball's own velocity with friction
    this.v[0] *= this.f;
    this.v[1] *= this.f;

    // Calculate new velocity, add gravity
    this.v[0] += this.gv[0] * this.gp * this.f;
    this.v[1] += this.gv[1] * this.gp * this.f;

    // Move
    this.p[0] += this.v[0];
    this.p[1] += this.v[1];
    this.draw();
  };

  this.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.p[0], this.p[1], this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  };
}


// Implementation
function init() {
  gravityPos = [canvas.width / 2, canvas.height / 2];
  balls = [];
  for (var i = 0; i < ballCount; i++) {
    var rd = randomeFloatFromRange(1, 7);
    var px = randomeFloatFromRange(0, canvas.width / 3) + canvas.width / 3;
    var py = randomeFloatFromRange(0, canvas.height / 3) + canvas.height / 3;
    var vx = randomeFloatFromRange(-3, 3);
    var vy = randomeFloatFromRange(-3, 3);
    var f = friction;
    balls.push(new Ball(px, py, vx, vy, f, rd, randomColor(colors)));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  resetCanvas(bgColor);
  updateShouldExplode();
  for (var i = 0; i < balls.length; i++) {
    balls[i].update();
  }
}

init();
animate();

function resetCanvas(color) {
  if (color) {
    c.save();
    c.fillStyle = color;
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();
  } else {
    c.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function updateShouldExplode() {
  var x = 0;
  var y = 0;
  for (var i = 0; i < balls.length; i++) {
    x += balls[i].v[0] < 0 ? balls[i].v[0] * -1 : balls[i].v[0];
    y += balls[i].v[1] < 0 ? balls[i].v[1] * -1 : balls[i].v[1];
  }
  shouldExplode = x / balls.length < explosionDistance && y / balls.length < explosionDistance;
}