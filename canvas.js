
let canvas = document.querySelector('canvas');

let c=canvas.getContext('2d');

const image = new Image();
image.src='./zombie image.png';
console.log(image);

let adjustor=0;
let adjustorX=0;
let flag=true;
let points=document.querySelector("#point");
let setScore=0;
let healthStatus=document.querySelector("#health-status");
let healthScore=100;
let reRenderZombie=[];
let timer=document.querySelector("#time-left");
let timeText=document.querySelector(".timer");
let timeLeft=120;

canvas.width=window.innerWidth;
canvas.height=window.innerHeight-50;

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
        if(flag){
        if(this.x+this.width>=this.width && this.velocity.x>0){
            this.velocity.x=0;
        }
        if(this.y+this.height+adjustor<=14*canvas.height/15 && this.x<canvas.width/2){
            this.velocity.y=0;
            adjustor+=20+this.height;
        }
        if(this.x+this.width<=canvas.width && this.velocity.x<0){
            this.velocity.x=0;
        }
        if(this.y+this.height+adjustorX<=14*canvas.height/15 && this.x>canvas.width/2){
            this.velocity.y=0;
            adjustorX+=20+this.height;
        }
        this.y+=this.velocity.y;
        this.x+=this.velocity.x;
    }
    else if (!flag){
        // console.log(reRenderZombie.slice(-1)[0]);
        if(this.x>=reRenderZombie.slice(-1)[0].x && this.velocity.x>0){
           this.velocity.x=0;
        }
        if(this.y<=reRenderZombie.slice(-1)[0].y){
            this.velocity.y=0;
        }
        if(this.x<=reRenderZombie.slice(-1)[0].x && this.velocity.x<0){
            this.velocity.x=0;
        }
        this.y+=this.velocity.y;
        this.x+=this.velocity.x;
    }
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

class Zombies {
    constructor (x,y,width,height,velocity,color) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.velocity=velocity;
        this.color=color;
    }
    draw () {
        c.beginPath();
        c.fillStyle=this.color;
        c.fillRect(this.x,this.y,this.width,this.height);
    }
    update () {
        this.draw();
        if(this.y<=0 || this.y+this.height>=canvas.height){
            this.velocity.y=-this.velocity.y;
        }
        if(this.x<=0 || this.x+this.width>=canvas.width){
            this.velocity.x=-this.velocity.x;
        }
        this.x+=this.velocity.x;
        this.y+=this.velocity.y;
    }
}

let bullets=[];
let enemy=[];
let enemyRight=[];
let playerShoot=[];
let arrivingZombies=[];

let player=new Player(canvas.width/2,canvas.height/2,50,50,'red',image);
let platform1=new Platform(canvas.width/2,4*canvas.height/5,20,200,'blue');
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

let platforms=[];
for(let i=4;i<=23;i++){
    platforms[i-4]=eval(`platform${i}`);
}
console.log(platforms);

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

let bulletPosition=[];

function spawnEnemies () {
    setInterval(()=>{
        if(timeLeft>0){
    if(enemy.length<=8)
        {
            enemy.push(new Enemy(0-50,canvas.height-50,50,50,{x:3,y:-3},'yellow'));
            bulletPosition.push(enemy.slice(-1)[0]);
        }
    else if(enemyRight.length<=8){
        enemyRight.push(new Enemy(canvas.width,canvas.height-50,50,50,{x:-3,y:-3},'yellow'));
        bulletPosition.push(enemyRight.slice(-1)[0]);
    }
    else{
        return;
    } 
}
else {
    return;
}
    },5);
}

function spawnBullet() {
    setInterval(() => {
        let speed=5;
        let velocity={
            x:null,
            y:null
        }
        let xPoint;
        let index=Math.floor(((Math.random()*18)));
        console.log(index);
        if(bulletPosition[index].x>canvas.width/2){
              velocity={
                x:-1*speed,
                y:null
              } 
        }
        else{
              velocity={
                x:1*speed,
                y:null
              }
        }
        bullets.push(new Bullet(bulletPosition[index].x+bulletPosition[index].width, bulletPosition[index].y+bulletPosition[index].height, 10, 'white',velocity));
    }, 200);
    }

function zombieBulletToObstacle() {
    bullets.forEach((bullet,bullIndex) => {
        platforms.forEach((plat,platIndex) => {
            if(bullet.velocity.x>0){
                if(bullet.x+bullet.radius>=plat.x && bullet.x-bullet.radius<=plat.x+plat.width && bullet.y+bullet.radius>=plat.y && bullet.y-bullet.radius<=plat.y+plat.height){
                    bullets.splice(bullIndex,1);
                    plat.height-=33.33;
                    plat.width-=33.33;
                    if(plat.height<=1 && plat.width<=10){
                        platforms.splice(platIndex,1);
                    }
                }
            }
            else if(bullet.velocity.x<0){
                if(bullet.x-bullet.radius<=plat.x+plat.width && bullet.x+bullet.radius>=plat.x && bullet.y+bullet.radius>=plat.y && bullet.y-bullet.radius<=plat.y+plat.height){
                    bullets.splice(bullIndex,1);
                    plat.height-=33.33;
                    plat.width-=33.33;
                    if(plat.height<=1 && plat.width<=1){
                        platforms.splice(platIndex,1);
                    }
                }
            }
        });
    });
}

function zombieBulletToPlayer () {
    bullets.forEach((b,index) => {
        if(b.velocity.x>0){
        if(b.x+b.radius>=player.x && b.x-b.radius<=player.x+player.width && b.y+b.radius>=player.y && b.y-b.radius<=player.y+player.height){
            bullets.splice(index,1);
            healthScore-=25;
            healthStatus.innerHTML=`${healthScore}%`;
            cancelAnimationFrame(animate);
            if(healthScore==0){
            alert('Game over');
        }
        }
    }
    else{
        if(b.x-b.radius<=player.x+player.width && b.x+b.radius>=player.x-player.width && b.y+b.radius>=player.y && b.y-b.radius<=player.y+player.height){
            bullets.splice(index,1);
            healthScore-=25;
            healthStatus.innerHTML=`${healthScore}%`;
            cancelAnimationFrame(animate);
            if(healthScore==0){
            alert('Game over');
        }
        }
    }
    });
}

function playerBulletToZombie () {
    playerShoot.forEach((shoot,index) => {
        enemy.forEach((e,eIndex) => {
            if(shoot.x-shoot.radius<=e.x+e.width && (shoot.y+shoot.radius>=e.y || shoot.y-shoot.radius>=e.y+e.height) && (shoot.y+shoot.radius<=e.y+100 || shoot.y-shoot.radius<=e.y+e.height-100)){
                playerShoot.splice(index,1);
                reRenderZombie.push(new Enemy(e.x,e.y,e.height,e.width,e.velocity,e.color));
                enemy.splice(eIndex,1);
                setScore+=100;
                points.innerHTML=setScore;
                flag=false;
            }
        });
        enemyRight.forEach((er,erIndex) => {
            if(shoot.x+shoot.radius>=er.x && (shoot.y+shoot.radius>=er.y || shoot.y-shoot.radius>=er.y+er.height) && (shoot.y+shoot.radius<=er.y+100 || shoot.y-shoot.radius<=er.y+er.height-100)){
                console.log('condition hit bhai vahi vali');
                playerShoot.splice(index,1);
                reRenderZombie.push(new Enemy(er.x,er.y,er.height,er.width,er.velocity,er.color));
                enemyRight.splice(erIndex,1);
                setScore+=100;
                points.innerHTML=setScore;
                flag=false;
            }
        });
    });
    // console.log(reRenderZombie);
}



function playerBlockCollision () {
    platforms.forEach(platform => {
            if(player.x<=platform.x+platform.width && player.x+player.width>=platform.x && player.y+player.height<=platform.y && player.y+player.height+player.velocity.y>=platform.y){
                console.log('hit hua bhai');
                player.velocity.y=0;
            }
    });
}

function movingZombies () {
    setInterval(() => {
        let xPoint=[0+10,canvas.width-110];
        let xCheck=Math.floor(Math.random()*2);
        let yPoint=Math.random()*canvas.height;
        let speed=4;
        let velocity={
            x:null,
            y:null
        }
        if(xCheck==0){
            velocity={
                x:Math.random()*speed,
                y:-Math.random()*speed
            }
        }
        else if(xCheck==1){
            velocity={
                x:-Math.random()*speed,
                y:Math.random()*speed
            }
        }
        arrivingZombies.push(new Zombies(xPoint[xCheck],yPoint,50,50,velocity,'orange'));
    },1000);
}

function timerFunction () {
    setInterval(() => {
        timeLeft-=1;
        timer.innerHTML=`${timeLeft} SECONDS`;
        if(timeLeft==0){
            timeText.innerHTML="ZOMBIES ARE ARRIVING";
            enemy=[];
            enemyRight=[];
            movingZombies();
            return;
        }
    }, 1000);
}

function playerBulletToMovingZombie () {
    playerShoot.forEach((shoot,index)=>{
        arrivingZombies.forEach((zombie,zIndex)=>{
            if(shoot.x-shoot.radius<=zombie.x+zombie.width && (shoot.y+shoot.radius>=zombie.y || shoot.y-shoot.radius>=zombie.y+zombie.height) && (shoot.y+shoot.radius<=zombie.y+100 || shoot.y-shoot.radius<=zombie.y+zombie.height-100)){
                playerShoot.splice(index,1);
                arrivingZombies.splice(zIndex,1);
            }
        });
    });
}

function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    platform1.draw();
    platform2.draw();
    platform3.draw();
    for(let i=0;i<20;i++){
        if(platforms[i]){
        platforms[i].draw();
    }
    }
    player.update();
    for(let i=0;i<enemy.length;i++){
        enemy[i].update();
    }
    for(let i=0;i<enemyRight.length;i++){
        enemyRight[i].update();
    }
    for(let i=0;i<bullets.length;i++){
        bullets[i].update();
    }
    playerShoot.forEach(shoot => {
        shoot.update();
    });
    for(let i=0;i<arrivingZombies.length;i++){
        if(arrivingZombies[i]){
            arrivingZombies[i].update();
            playerBulletToMovingZombie();
        }
    }
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
    bullets.forEach((bull,bullIndex) => {
        if(bull.x>=canvas.width || bull.x<0){
            bullets.splice(bullIndex,1);
        }
    });
    playerShoot.forEach((shoot,index) => {
        if(shoot.x>=canvas.width || shoot.x<=0 || shoot.y>=canvas.height || shoot.y<=0){
            playerShoot.splice(index,1);
        }
    });
    playerBlockCollision();
    playerBulletToZombie();
    zombieBulletToPlayer();
    zombieBulletToObstacle();
}
spawnEnemies();
setTimeout(()=>{
    spawnBullet();
},7);
timerFunction();
animate();