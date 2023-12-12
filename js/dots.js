let dots = [];
let maxDots = 250; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < maxDots; i++) {
    dots.push(new Dot());
  }
}

function draw() {
  clear();
  background(0,0,15,1); // added a faint background for a more profound effect

  for (let dot of dots) {
    dot.update();
    dot.distort(mouseX, mouseY);
    dot.display();
  }
}

class Dot {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.radius = random(1, 5);
    this.hue = random(360);
    this.speed = random(1, 3); 
  }

  update() {
    this.y -= this.speed;
    this.hue += 0.1;
    if (this.y < 0) this.y = height;
    if (this.hue > 360) this.hue = 0;
  }

  distort(mx, my) {
    let d = dist(this.x, this.y, mx, my);
    if (d < 50) { 
      let angle = atan2(this.y - my, this.x - mx);
      let scale = map(d, 0, 50, 15, 0);
      this.x += cos(angle) * scale;
      this.y += sin(angle) * scale;
    }
  }

  display() {
    fill(this.hue, 80, 80, 80);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
