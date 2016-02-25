var initGlobalVar =  function () {
    var canvas = document.getElementById("canvas");
        ctx = canvas.getContext('2d');

    return globalVars = {
        canvas: canvas,
        ctx: ctx,
        directions: {
            "left": -1.3,
            "right": +1.3,
            "up": -0.7,
            "down": +0.7
        },
        allShapes: []
    }
}

function getRand (min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

var Canvas = function () {
    this.coordinateX;
    this.coordinateY;
    this.w;
    this.h;
}

Canvas.prototype.canvasSetup =  function(){
    this.w = $( window ).innerWidth();
    this.h = $( window ).innerHeight();
    globalVars.canvas.setAttribute('width', this.w);
    globalVars.canvas.setAttribute('height', this.h);
}

Canvas.prototype.init = function(event){
    this.coordinateX= event.clientX;
    this.coordinateY = event.clientY;

    var directionX = (getRand(0, 2) % 2 === 0) ? "left" : "right",
        directionY = (getRand(0, 2) % 2 === 0) ? "up" : "down",
        type = (getRand(0, 2) % 2 === 0) ? "rectangle" : "circle",
        speed =  getRand (1, 5),
        radius = getRand(25, 80),
        side = getRand(50, 150),
        opasity = .05 + Math.random() * .5;

    var figure = new Shapes(this.coordinateX, this.coordinateY, radius, side, speed, opasity, type, {
        x: directionX,
        y: directionY
    });

    globalVars.allShapes.push(figure);
    animationFrame();
}

function Shapes (x, y, radius, side, speed, opasity, type, direction){

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.side = side;
    this.speed = speed;
    this.opasity = opasity;
    this.type = type;
    this.direction = direction;
    this.endPoint;
    this.startPoint;

}

Shapes.prototype.draw = function(ctx) {
    ctx.beginPath();

    if(this.type == 'circle') {
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    } else {
        ctx.rect(this.x, this.y, this.side, this.side);
    }

    ctx.fillStyle = 'rgba(185, 211, 238,' + this.opasity + ')';
    ctx.fill();
    ctx.stroke();
};

Shapes.prototype.move = function() {
    this.x += (this.speed/globalVars.allShapes.length) * globalVars.directions[this.direction.x];
    this.y += (this.speed/globalVars.allShapes.length) * globalVars.directions[this.direction.y];
};

Shapes.prototype.bounce = function(maxX, maxY) {

    switch(this.type){
        case 'rectangle':
            this.startPoint = 0;
            this.endPoint = this.side;
            break;
        case 'circle':
            this.startPoint = this.radius;
            this.endPoint = this.radius;
            break;
    }

    if (this.x < this.startPoint) {
        this.direction.x = "right";
    };

    if (this.x > maxX - this.endPoint) {
        this.direction.x = "left";
    };

    if (this.y < this.startPoint) {
        this.direction.y = "down";
    };

    if (this.y > maxY - this.endPoint) {
        this.direction.y = "up";
    };
};

function animationFrame() {
    var requestAnimationFrame = window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

    globalVars.ctx.clearRect(0, 0, globalVars.ctx.canvas.width, globalVars.ctx.canvas.height);

    for (var i = 0; i < globalVars.allShapes.length; i += 1) {
        globalVars.allShapes[i].move();
        globalVars.allShapes[i].bounce(globalVars.ctx.canvas.width, globalVars.ctx.canvas.height);

        globalVars.allShapes[i].draw(globalVars.ctx);
    }

    requestAnimationFrame(animationFrame);

}

$(document).ready(function(){
    initGlobalVar();

    var canvas = new Canvas();
    canvas.canvasSetup();

    $(window).on('resize', function(){
        canvas.canvasSetup();
    });

    $('#canvas').on('click', function(){
        canvas.init(event);
    });
});