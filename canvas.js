
let canvas = document.querySelector('canvas');

let c=canvas.getContext('2d');

const image = new Image();
image.src='./zombie image.png';
console.log(image);

let adjustor=0;
let adjustorX=0;

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width=innerWidth;
    canvas.height=innerHeight;
});

let gravity=0.5;

let keys = {
    right: {
        pressed:false
    },
    left: {
        pressed: false
    }
};

class Player{
    constructor (x,y,height,width,color,velocity) {
        this.x=x;
        this.y=y;
        this.height=height;
        this.width=width;
        this.color=color;
        this.velocity = {
            x:0,
            y:0
        };
    }

    draw() {
        c.beginPath();
        c.fillStyle=this.color;
        c.fillRect(this.x,this.y,this.width,this.height);
    }

    update() {
        this.draw();
        this.y+=this.velocity.y;
        this.x+=this.velocity.x;
        if(this.y+this.height<=canvas.height){
            this.velocity.y+=gravity;
        }
        else if(this.y+this.height>=canvas.height){
            this.velocity.y=0;
        }
        if(this.y<=0){
            this.velocity.y=-this.velocity.y*0.7;
        }
    }
}

class Platform{
    constructor (x,y,height,width,color) {
        this.x=x;
        this.y=y;
        this.height=height;
        this.width=width;
        this.color=color;
    }

        draw() {
            c.beginPath();
            c.fillStyle=this.color;
            c.fillRect(this.x,this.y,this.width,this.height);
        }
    }

class Enemy{
    constructor (x,y,height,width,velocity,color) {
        this.x=x;
        this.y=y;
        this.height=height;
        this.width=width;
        this.velocity=velocity;
        this.color=color;
    }

    draw() {
        c.beginPath();
        c.fillStyle=this.color;
        c.fillRect(this.x,this.y,this.width,this.height);
    }

    update() {
        this.draw();
        if(this.x+this.width>=canvas.width/9 && this.velocity.x>0){
            this.velocity.x=0;
        }
        if(this.y+this.height+adjustor<=5*canvas.height/6 && this.x<canvas.width/2){
            this.velocity.y=0;
            adjustor+=10+this.height;
        }
        if(this.x<=8*canvas.width/9 && this.velocity.x<0){
            this.velocity.x=0;
        }
        if(this.y+this.height+adjustorX<=5*canvas.height/6 && this.x>canvas.width/2){
            this.velocity.y=0;
            adjustorX+=10+this.height;
        }
        this.y+=this.velocity.y;
        this.x+=this.velocity.x;
    }

}

class Bullet {
    constructor (x,y,radius,color,velocity) {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x+=this.velocity.x;
    }
}

class PlayerBullet {
    constructor(x,y,radius,color,velocity) {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.velocity.y+=gravity*0.2;
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

let bullets=[];
let enemy=[];
let enemyRight=[];
let playerShoot=[];

let player=new Player(canvas.width/2,canvas.height/2,50,50,'red',image);
let platform1=new Platform(canvas.width/2,canvas.height/2,20,200,'blue');
let platform2=new Platform(canvas.width/3,canvas.height-200,200,40,'blue');
let platform3=new Platform(2*canvas.width/3,canvas.height-200,200,40,'blue');
let platform4=new Platform(canvas.width/3-100,canvas.height-200-100,100,100,'pink');
let platform5=new Platform(canvas.width/3,canvas.height-200-100,100,100,'aqua');
let platform6=new Platform(canvas.width/3-200,canvas.height-200-100,100,100,'purple');
let platform7=new Platform(canvas.width/3+100,canvas.height-200-100,100,100,'chocolate');
let platform8=new Platform(canvas.width/3-50,canvas.height-400,100,100,'wheat');
let platform9=new Platform(canvas.width/3-150,canvas.height-400,100,100,'gold');
let platform10=new Platform(canvas.width/3+50,canvas.height-400,100,100,'silver');
let platform11=new Platform(canvas.width/3,canvas.height-500,100,100,'green');
let platform12=new Platform(canvas.width/3-100,canvas.height-500,100,100,'violet');
let platform13=new Platform(canvas.width/3-50,canvas.height-600,100,100,'orange');
let platform14=new Platform(2*canvas.width/3-100,canvas.height-200-100,100,100,'pink');
let platform15=new Platform(2*canvas.width/3,canvas.height-200-100,100,100,'aqua');
let platform16=new Platform(2*canvas.width/3-200,canvas.height-200-100,100,100,'purple');
let platform17=new Platform(2*canvas.width/3+100,canvas.height-200-100,100,100,'chocolate');
let platform18=new Platform(2*canvas.width/3-50,canvas.height-400,100,100,'wheat');
let platform19=new Platform(2*canvas.width/3-150,canvas.height-400,100,100,'gold');
let platform20=new Platform(2*canvas.width/3+50,canvas.height-400,100,100,'silver');
let platform21=new Platform(2*canvas.width/3,canvas.height-500,100,100,'green');
let platform22=new Platform(2*canvas.width/3-100,canvas.height-500,100,100,'violet');
let platform23=new Platform(2*canvas.width/3-50,canvas.height-600,100,100,'orange');
addEventListener('click', (event) => {
    let angle;
    angle=Math.atan2(event.clientY-player.y,event.clientX-player.x);
    let speed=10;
    let velocity={
        x:Math.cos(angle)*speed,
        y:Math.sin(angle)*speed
    }
    playerShoot.push(new PlayerBullet(player.x+25,player.y+25,10,'pink',velocity));
})
addEventListener('keydown', (event) => {
    let keyCode=event.keyCode;
    console.log(keyCode);
    switch(keyCode){
        case 65:
            console.log('back');
            keys.left.pressed=true;
            break;
        case 68:
            console.log('forward');
            keys.right.pressed=true;
            break;
        case 83:
            console.log('down');
            break;
        case 87:
            console.log('up');
            player.velocity.y-=10;
            break;
    }
});

addEventListener('keyup', (event) => {
    let keyCode=event.keyCode;
    console.log(keyCode);
    switch(keyCode){
        case 65:
            console.log('back');
            keys.left.pressed=false;
            break;
        case 68:
            console.log('forward');
            keys.right.pressed=false;
            break;
        case 83:
            console.log('down');
            break;
        case 87:
            console.log('up');
            break;
    }
});


function spawnEnemies () {
    setInterval(()=>{
    if(enemy.length>5)
        {
            return;
        }
            enemy.push(new Enemy(0-50,canvas.height-50,50,50,{x:1,y:-1},'yellow'));
            enemyRight.push(new Enemy(canvas.width,canvas.height-50,50,50,{x:-1,y:-1},'yellow'));
    },1000);
}

let bulletPosition=[0,(5*canvas.height/6)-25,(5*canvas.height/6)-85,(5*canvas.height/6)-145,(5*canvas.height/6)-195,(5*canvas.height/6)-255,(5*canvas.height/6)-315];

function spawnBullet() {
    setInterval(() => {
        let speed=5;
        let velocity={
            x:null,
            y:null
        }
        let xPoint;
        let index=Math.floor(((Math.random()*6)+1));
        console.log(index);
        let side;
        side=Math.random()*10;
        if(side>5){
              velocity={
                x:-1*speed,
                y:null
              } 
              xPoint=8*canvas.width/9;
        }
        else{
              velocity={
                x:1*speed,
                y:null
              }
              xPoint=canvas.width/9
        }
        bullets.push(new Bullet(xPoint, bulletPosition[index], 10, 'white',velocity));
    }, 1000);
}

function playerBlockCollision () {
    // console.log('function hit');
    if(player.x<=(canvas.width/3)+200 && player.y+player.height<=canvas.height-300 && player.x+player.width>=(canvas.width/3)-200){
        // console.log('condition hit');
        player.velocity.y=0;
    }
    // if(player.x+player.width>=(2*canvas.width/3)-200 && player.x<=(2*canvas.width/3)+100 && player.y+player.height<=canvas.height>=canvas.height-300){
    //     player.velocity.y=0;
    // }
}

function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    platform1.draw();
    platform2.draw();
    platform3.draw();
    platform4.draw();
    platform5.draw();
    platform6.draw();
    platform7.draw();
    platform8.draw();
    platform9.draw();
    platform10.draw();
    platform11.draw();
    platform12.draw();
    platform13.draw();
    platform14.draw();
    platform15.draw();
    platform16.draw();
    platform17.draw();
    platform18.draw();
    platform19.draw();
    platform20.draw();
    platform21.draw();
    platform22.draw();
    platform23.draw();
    player.update();

    for(let i=0;i<enemy.length;i++){
        enemy[i].update();
        enemyRight[i].update();
    }
    for(let i=0;i<bullets.length;i++){
        bullets[i].update();
    }
    playerShoot.forEach(shoot => {
        shoot.update();
    });
    if(keys.left.pressed){
        player.velocity.x=-5;
    }
    else if(keys.right.pressed){
        player.velocity.x=5;
    }
    else player.velocity.x=0;

    if(player.y+player.height<=platform1.y && player.y+player.height+player.velocity.y>=platform1.y && player.x+player.width>=platform1.x && player.x<=platform1.x+platform1.width){
        player.velocity.y=0;
    }
    if(player.y+player.height<=platform2.y && player.y+player.height+player.velocity.y>=platform2.y && player.x+player.width>=platform2.x && player.x<=platform2.x+platform2.width){
        player.velocity.y=0;
    }
    if(player.y+player.height<=platform3.y && player.y+player.height+player.velocity.y>=platform3.y && player.x+player.width>=platform3.x && player.x<=platform3.x+platform3.width){
        player.velocity.y=0;
    }
    if(player.x<=platform2.x+platform2.width && player.y+player.height>=platform2.y){
        player.velocity.x=0;
        if(keys.right.pressed){
            player.velocity.x=5;
        }
    }
        if(player.x+player.width>=platform3.x && player.y+player.height>=platform3.y){
            player.velocity.x=0;
            if(keys.left.pressed){
                player.velocity.x=-5;
            }
    }
    playerBlockCollision();
}
spawnEnemies();
// spawnBullet();
animate();