let canvas : HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = document.getElementsByTagName("Body")[0].clientWidth;
canvas.height = document.getElementsByTagName("Body")[0].clientHeight;
let canvasContext : CanvasRenderingContext2D = canvas.getContext("2d");

addEventListener("resize", () => {
   canvas.width = document.getElementsByTagName("Body")[0].clientWidth;
   canvas.height = document.getElementsByTagName("Body")[0].clientHeight;

   space.drawStars();
});

let lastTick = performance.now()

let deltaTime = 0.01;//performance.now();
//(function tick(nowish :number) {
//    const delta = nowish - lastTick
//    lastTick = nowish
//
//    deltaTime = delta;
//    window.requestAnimationFrame(tick)
//})(0);


setInterval(() => {

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    space.drawStars();

    space.stars.forEach(star => {
        let gravityVector: Vector2D = new Vector2D(0, 0);

        space.stars.forEach(s => {
            if (star.position.x !== s.position.x && star.position.y !== s.position.y) {
                let g: Vector2D = space.gravity(star, s);

                gravityVector.x = (gravityVector.x - g.x);
                gravityVector.y = (gravityVector.y - g.y);

                //bounce between stars system



                console.log(space.distance(s, star))
                if(space.distance(s, star) <= (s.radius + star.radius)){

                    star.velocity.x += (s.mass * s.velocity.x)/100;
                    star.velocity.y += (s.mass * s.velocity.y)/100;
                    console.log("proc")
                }

            }


        });

        star.update(gravityVector);
    });
}, 0);

class Space
{
    public gravity(star1: Star, star2: Star) :Vector2D{

        let gForce: number = 0;
        let distance: number = this.distance(star1,star2);


        if( distance != 0)
        {
            gForce = ((star1.mass * star2.mass) / distance*distance);
        }


        let distanceX = (this.vectorDistance(star1,star2).x) / distance;
        let distanceY = (this.vectorDistance(star1,star2).y) / distance;

        let x = (gForce / star1.mass) * distanceX;
        let y = (gForce / star1.mass) * distanceY;

        return new Vector2D(x,y);
    }

    public vectorDistance(star1: Star, star2:Star) :Vector2D{
        return new Vector2D((star1.position.x - star2.position.x), (star1.position.y - star2.position.y));
    }

    public distance(star1: Star, star2: Star) : number{
        return Math.hypot(star1.position.x - star2.position.x, star1.position.y -  star2.position.y);
    }

    public stars: Array<Star> = new Array<Star>();

    public drawStars(){
        for (let s = 0; s <= this.stars.length - 1; s++){
            canvasContext.beginPath();
            canvasContext.arc(this.stars[s].position.x, this.stars[s].position.y, this.stars[s].radius, 0, 2 * Math.PI, false);
            canvasContext.fillStyle = "#ffffff";
            canvasContext.fill();

            canvasContext.lineWidth = 1;
            canvasContext.strokeStyle = '#ffffff';
            canvasContext.stroke();
        }
    }
}
class Star {

    public radius : number;
    public position : Point;
    public velocity: Vector2D;
    public mass : number;

    public update(force: Vector2D){
        if(force != null){
            this.velocity.x = this.velocity.x + force.x/10 * deltaTime;
            this.velocity.y = this.velocity.y + force.y/10 * deltaTime;
        }

        this.position.x = this.position.x + (this.velocity.x * deltaTime);
        this.position.y = this.position.y + (this.velocity.y * deltaTime);



        if(this.position.y < 0 || this.position.y > canvas.height){

            this.velocity = new Vector2D(this.velocity.x,this.velocity.y * -1);
        }

        if(this.position.x < 0 || this.position.x > canvas.width){

            this.velocity = new Vector2D(this.velocity.x * -1,this.velocity.y);
        }

    }

    public constructor(position : Point, mass : number, Velocity : Vector2D, radius : number) {

        this.radius = radius;
        this.position = position;
        this.mass = mass;
        this.velocity = Velocity;
    }
}

let space = new Space();
space.drawStars();

class Point{
    x: number;
    y: number;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }
}
class Vector2D{
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

//let star = new Star(new Point(100,600), 20, new Vector2D(0,0));
//let star2 = new Star(new Point(700,50), 20, new Vector2D(0,0.));
//let star3 = new Star(new Point(400,200), 20, new Vector2D(0,0.));

//space.stars.push(star);
//space.stars.push(star2);
//space.stars.push(star3);

for (let i = 0; i < 2; i++) {
    let star = new Star(new Point(Math.random() * canvas.width,Math.random() * canvas.height), 20, new Vector2D(0,0), (Math.random()*10+5));
    space.stars.push(star);
}