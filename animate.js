/*
  AnimateJS
*/

Animate = function (cfg) {
  
  this.duration = cfg.duration;
  this.draw = cfg.draw;
  this.statics = cfg.statics;
  this.state = "stoped";
  this.frame = 0;
  
  // events
  this.eventHandler = {
    play: function(){},
    stop: function(){},
    pause: function(){},
    end: function(){}
  };
  
  // Frames per Second (fps)
  let fps = cfg.fps;
  if (typeof fps == "number") {
    this.requestAnimationFrame = function (callback) {
      setTimeout(function(){
        callback(performance.now());
      }, 1000 / fps);
    };
    this.fps = fps;
  }
  else this.fps = "auto";
  
  
  // timing
  let timing = cfg.timing || Animate.LINEAR;
  switch (cfg.erase) {
    // eraseOut
    case "out": 
      this.timing = function (n) {
        return 1 - timing(1 - n);
      };
      break;
    
    // eraseInOut
    case "both": case "in-out":
      this.timing = function (n) {
        if (n <= 0.5) return timing(2 * n) / 2;
        else return (2 - timing(2 * (1 - n))) / 2;
      };
      break;
    
    // eraseIn
    default: this.timing = timing;
  }
};


// RENDER FRAME (DRAW)
Animate.prototype.renderFrame = function (time) {
  let frame = (time - this.timeStart) / this.duration;
  if (frame >= 1) frame = 1;
  this.frame = frame;
  this.draw(this.timing(frame), this.statics);
  
  if (frame < 1) {
    if (this.state == "playing") this.requestAnimationFrame(this.renderFrame.bind(this));
  }
  else {
    this.state = "stoped";
    console.log(this)
    this.eventHandler.end();
  }
};


// actions
// PLAY ANIMATION
Animate.prototype.play = function () {
  
  let timeStart = performance.now();
  if (this.state == "paused") timeStart -= this.duration * this.frame;
  this.timeStart = timeStart;
  
  this.state = "playing";
  this.eventHandler.play();
  this.renderFrame(timeStart);
};

// STOP ANIMATION
Animate.prototype.stop = function () {
  this.state = "stoped";
  this.eventHandler.stop();
};

// PAUSE ANIMATION
Animate.prototype.pause = function () {
  if (this.state == "playing") {
    this.state = "paused";
    this.eventHandler.pause();
  }
}

// MOVE ANIMATION
Animate.prototype.toFrame = function (frame) {
  let time = performance.now();
  this.timeStart = time - this.duration * frame;
  this.frame = frame;
  this.renderFrame(time);
}


// EVENTS
Animate.prototype.on = function (event, callback) {
  this.eventHandler[event] = callback;
};


// TIMING
Animate.prototype.requestAnimationFrame = function(fn){window.requestAnimationFrame(fn)};
Animate.LINEAR = function (n) { return n };
Animate.REVERSE = function (n) { return 1 - n };
Animate.QUAD = function (n) { return Math.pow(n, 2) };
Animate.QUBIC = function (n) { return Math.pow(n, 3) };
Animate.CIRC = function (n) { return 1 - Math.sin(Math.acos(n)) };
Animate.ARROW = function (n) { 
  let x = 1.5;
  return Math.pow(n, 2) * ((x + 1) * n - x) 
};
Animate.BOUNCE = function (n) {
  for (let a = 0, b = 1; 1; a += b, b /= 2) {
    if (n >= (7 - 4 * a) / 11) {
      return - Math.pow((11 - 6 * a - 11 * n) / 4, 2) + Math.pow(b, 2)
    }
  }
};
Animate.ELASTIC = function (n) {
  let x = 1.5;
  return Math.pow(2, 10 * (n - 1)) * Math.cos(20 * Math.PI * x / 3 * n)
}