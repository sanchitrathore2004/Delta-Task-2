
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
        // this.image=image;
    }

    draw() {
        c.beginPath();
        c.fillStyle=this.color;
        c.fillRect(this.x,this.y,this.width,this.height);

        // c.drawImage(this.image,this.x,this.y);

    }

    update() {
        this.draw();
        this.y+=this.velocity.y;
        this.x+=this.velocity.x;
        if(this.y+this.height<=canvas.height){
            this.velocity.y+=gravity;
        }
        else if(this.y+this.height>canvas.height){
            this.velocity.y=0;
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
        if(this.x+this.width+adjustor>=canvas.width/4 && this.velocity.x>0){
            this.velocity.x=0;
            adjustor+=10+this.width;
        }
        else if(this.x-adjustorX<=3*canvas.width/4 && this.velocity.x<0){
            this.velocity.x=0;
            adjustorX+=10+this.width;
        }
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
        this.velocity.y+=gravity*0.02;
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
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
addEventListener('click', (event) => {
    let angle;
    angle=Math.atan2(event.clientY-player.y,event.clientX-player.x);
    let speed=5;
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
    // console.log(enemy);
    // console.log(enemyRight);
    if(enemy.length>5)
        {
            // console.log("iske ander");
            return;
        }
            enemy.push(new Enemy(0-50,canvas.height-50,50,50,{x:1,y:1},'yellow'));
            enemyRight.push(new Enemy(canvas.width,canvas.height-50,50,50,{x:-1,y:1},'yellow'));
    },1000);
}

let bulletPosition=[0,(canvas.width/4)-25,(canvas.width/4)-85,(canvas.width/4)-145,(canvas.width/4)-205,(canvas.width/4)-265,(canvas.width/4)-325,(3*canvas.width/4)+25,(3*canvas.width/4)+85,(3*canvas.width/4)+145,(3*canvas.width/4)+205,(3*canvas.width/4)+265,(3*canvas.width/4)+325];

function spawnBullet() {
    setInterval(() => {
        let velocity={
            x:null,
            y:null
        }
        let index=Math.floor(((Math.random()*12)+1));
        console.log(index);
        if(index>6){
            let angle = Math.random() * Math.PI/2 ; // Random angle in radians
            let speed = 5;
            velocity = {
                x: -Math.cos(angle) * speed,
                y: -Math.sin(angle) * speed
            };    
        }
        else{
            let angle = Math.random() * Math.PI/2 ; // Random angle in radians
            let speed = 5;
            velocity = {
            x: Math.cos(angle) * speed,
            y: -Math.sin(angle) * speed
        };
        }
        bullets.push(new Bullet(bulletPosition[index], canvas.height - 25, 10, 'white',velocity));
    }, 1000);
}
function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    platform1.draw();
    platform2.draw();
    platform3.draw();
    
    // console.log(enemy);
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
}
spawnEnemies();
// spawnBullet();
animate();