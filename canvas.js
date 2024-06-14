
let canvas = document.querySelector('canvas');

let c=canvas.getContext('2d');

const backgroundImage=new Image();
backgroundImage.src='./background2.jpg';
console.log(backgroundImage);

const character = new Image();
character.src='./character2.png';
console.log(character);

const zombie=new Image();
zombie.src='./character3.png';

const obstacles = new Image();
obstacles.src='./obstacles.png';

const pillar=new Image();
pillar.src='./pillarnobg.png';

const plank=new Image();
plank.src='./plank.png';

function drawBackground() {
    c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

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
let status='not done';
let pauseBtn=document.querySelector('.pause');
let playBtn=document.querySelector('.play');
console.log(pauseBtn,playBtn);
let standOn=[];
let platforms=[];
let enemy=[];
let enemyRight=[];
let animationFrameID;
let resetBtn=document.querySelector(".reset");
let scoreArray=[];
let closeLeaderboard=document.querySelector(".close");
let leader=document.querySelector("#leader");
let lBtn=document.querySelector(".leaderboard");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight-50;

closeLeaderboard.addEventListener("click", function () {
    leader.style.visibility='hidden';
});

lBtn.addEventListener("click", function () {
    leader.style.visibility='visible';
});

resetBtn.addEventListener('click', function (){
    location.reload();
});

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
        // c.beginPath();
        // c.fillStyle=this.color;
        // c.fillRect(this.x,this.y,this.width,this.height);
        c.drawImage(character,this.x,this.y,this.width,this.height);
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
    constructor (x,y,height,width,color,velocity) {
        this.x=x;
        this.y=y;
        this.height=height;
        this.width=width;
        this.color=color;
        this.velocity=velocity;
    }

        draw() {
            c.drawImage(obstacles,this.x,this.y,this.width,this.height);
        }

        update() {
            this.draw();
            this.velocity.y+=gravity;
            standOn.forEach((stand)=>{
                if(this.y+this.height>=stand.y && this.y<canvas.height/2+170){
                    this.velocity.y=0;
                }
            });
            if(this.y+this.height>=canvas.height){
                this.velocity.y=0;
            }
            
            this.y+=this.velocity.y;
        }
    }

    class Pillar{
        constructor (x,y,height,width,color,velocity) {
            this.x=x;
            this.y=y;
            this.height=height;
            this.width=width;
            this.color=color;
            this.velocity=velocity;
        }
    
            draw() {
                c.beginPath();
                c.fillStyle=this.color;
                c.fillRect(this.x,this.y,this.width,this.height);
                // c.drawImage(pillar,this.x,this.y,this.width,this.height);
            }
    
            update() {
                this.draw();
            }
        }

        class Plank{
            constructor (x,y,height,width,color,velocity) {
                this.x=x;
                this.y=y;
                this.height=height;
                this.width=width;
                this.color=color;
                this.velocity=velocity;
            }
        
                draw() {
                    c.beginPath();
                    c.fillStyle=this.color;
                    c.fillRect(this.x,this.y,this.width,this.height);
                    // c.drawImage(plank,this.x,this.y,this.width,this.height);
                }
        
                update() {
                    this.draw();
                }
            }

class Enemy{
    constructor (x,y,height,width,velocity,color,collisionStatus) {
        this.x=x;
        this.y=y;
        this.height=height;
        this.width=width;
        this.velocity=velocity;
        this.color=color;
        this.collisionStatus=collisionStatus;
    }

    draw() {
        // c.beginPath();
        // c.fillStyle=this.color;
        // c.fillRect(this.x,this.y,this.width,this.height);
        c.drawImage(zombie,this.x,this.y,this.height,this.width);
    }

    update() {
        this.draw();
        if(this.x<canvas.width/2){
        this.velocity.x=1;
    }
    else if(this.x>canvas.width/2){
        this.velocity.x=-1;
    }
        platforms.forEach((platform)=>{
            if(this.x+this.width>=platform.x &&  this.velocity.x>0 && this.y+this.height>=platform.y && this.y<=platform.y+platform.height){
                this.velocity.x=0;
            }
            if(this.x<=platform.x+platform.width && this.velocity.x<0 && this.y+this.height>=platform.y && this.y<=platform.y+platform.height){
                this.velocity.x=0;
            }
        });
        for(let i=1;i<enemy.length;i++){
            if(enemy[i-1].x-enemy[i].x-enemy[i].width<=2){
                enemy[i].velocity.x=0;
            }
        }
        for(let i=1;i<enemyRight.length;i++){
            if(enemyRight[i].x-enemyRight[i-1].x-enemyRight[i-1].width<=2){
                enemyRight[i].velocity.x=0;
            }
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
    constructor (x,y,width,height,velocity,color,hasCollided) {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.velocity=velocity;
        this.color=color;
        this.hasCollided=hasCollided;
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
let playerShoot=[];
let arrivingZombies=[];
    
let player=new Player(canvas.width/2,canvas.height/2,100,100,'red');
let platform1=new Plank(canvas.width/2,4*canvas.height/5,20,200,'blue');
let platform2=new Pillar(canvas.width/3,canvas.height-200,200,40,'blue');
let platform3=new Pillar(2*canvas.width/3,canvas.height-200,200,40,'blue');
let platform3a=new Plank(canvas.width/3+2*player.width,8*canvas.height/9,20,200,'blue');
// let platform3b=new Plank(canvas.width/3+3*player.width,canvas.height/3,20,200,'pink');
let platform3c=new Plank(canvas.width/8,3*canvas.height/4,20,200,'blue');
let platform3d=new Plank(3*canvas.width/4,5*canvas.height/6-50,20,200,'blue');
// let platform3e=new Plank(canvas.width/3+3*player.width,canvas.height/4,20,100,'blue');
// let platform3f=new Plank(canvas.width/3+3*player.width,canvas.height/6,20,50,'blue');
// let platform3g=new Plank(canvas.width/3+3*player.width,canvas.height/10,20,25,'blue');

standOn=[platform1,platform2,platform3,platform3a,platform3c,platform3d];

let platform20=new Platform(3*canvas.width/4,3*canvas.height/5+10,100,100,'silver',{x:0,y:1});
let platform21=new Platform(canvas.width/8,3*canvas.height/4-100,100,100,'green',{x:0,y:1});
let platform22=new Platform(canvas.width/2-147,canvas.height-178,100,100,'violet',{x:0,y:1});
let platform23=new Platform(2*canvas.width/3-150,canvas.height-240,100,100,'orange',{x:0,y:1});
let platform24=new Platform(canvas.width/3,canvas.height-100,100,100,'orange',{x:0,y:1});
let platform25=new Platform(canvas.width/4,canvas.height-100,100,100,'orange',{x:0,y:1});
let platform26=new Platform(canvas.width/6,canvas.height-100,100,100,'orange',{x:0,y:1});
let platform27=new Platform(2*canvas.width/3+70,canvas.height-100,100,100,'orange',{x:0,y:1});
let platform28=new Platform(2*canvas.width/3-60,canvas.height-100,100,100,'orange',{x:0,y:1});
let platform29=new Platform(4*canvas.width/5,canvas.height-100,100,100,'orange',{x:0,y:1});

for(let i=20;i<=29;i++){
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
    playerShoot.push(new PlayerBullet(player.x+100,player.y+50,10,'pink',velocity));
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
            if(player.velocity.y==0){
            player.velocity.y-=10;
        }
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
    if(enemy.length<=4)
        {
            enemy.push(new Enemy(0-50,canvas.height-100,80,100,{x:0.5,y:null},'yellow','not collided'));
            bulletPosition.push(enemy.slice(-1)[0]);
        }
    if(enemyRight.length<=4){
        enemyRight.push(new Enemy(canvas.width,canvas.height-100,80,100,{x:-0.5,y:null},'yellow','not collided'));
        bulletPosition.push(enemyRight.slice(-1)[0]);
    }
    else{
        return;
    }
    },1000);
}

function zombieBulletToObstacle() {
    bullets.forEach((bullet,bullIndex) => {
        platforms.forEach((plat,platIndex) => {
            if(bullet.velocity.x>0){
                if(bullet.x+bullet.radius>=plat.x && bullet.x-bullet.radius<=plat.x+plat.width && bullet.y+bullet.radius>=plat.y && bullet.y-bullet.radius<=plat.y+plat.height){
                    bullets.splice(bullIndex,1);
                    plat.width-=33.33;
                    plat.height-=33.33;
                    if(plat.height<=1){
                    platforms.splice(platIndex,1);
                }
                }
            }
            else if(bullet.velocity.x<0){
                if(bullet.x-bullet.radius<=plat.x+plat.width && bullet.x+bullet.radius>=plat.x && bullet.y+bullet.radius>=plat.y && bullet.y-bullet.radius<=plat.y+plat.height){
                    bullets.splice(bullIndex,1)
                    plat.width-=33.33;
                    plat.height-=33.33;
                    if(plat.height<=1){
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
            if(healthScore==0){
            alert('Game over');
            cancelAnimationFrame(animationFrameID);

        }
        }
    }
    else{
        if(b.x-b.radius<=player.x+player.width && b.x+b.radius>=player.x-player.width && b.y+b.radius>=player.y && b.y-b.radius<=player.y+player.height){
            bullets.splice(index,1);
            healthScore-=25;
            healthStatus.innerHTML=`${healthScore}%`;
            if(healthScore==0){
            alert('Game over');
            cancelAnimationFrame(animationFrameID);

        }
        }
    }
    });
}

function playerBulletToZombie () {
    playerShoot.forEach((shoot,index) => {
        enemy.forEach((e,eIndex) => {
            if(shoot.x-shoot.radius<=e.x+e.width && shoot.x+shoot.radius>=e.x && (shoot.y+shoot.radius>=e.y || shoot.y-shoot.radius>=e.y+e.height) && (shoot.y+shoot.radius<=e.y+100 || shoot.y-shoot.radius<=e.y+e.height-100)){
                playerShoot.splice(index,1);
                console.log(enemy[eIndex]);
                enemy.splice(eIndex,1);
                setScore+=100;
                points.innerHTML=setScore;
            }
        });
        enemyRight.forEach((er,erIndex) => {
            if(shoot.x+shoot.radius>=er.x && shoot.x-shoot.radius<=er.x+er.width &&(shoot.y+shoot.radius>=er.y || shoot.y-shoot.radius>=er.y+er.height) && (shoot.y+shoot.radius<=er.y+100 || shoot.y-shoot.radius<=er.y+er.height-100)){
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
}
function playerBlockCollision () {
    platforms.forEach(platform => {
            if(player.x+20<=platform.x+platform.width && player.x+player.width-50>=platform.x && player.y+player.height<=platform.y && player.y+player.height+player.velocity.y>=platform.y){
                console.log('hit hua bhai');
                player.velocity.y=0;
            }
    });
}

function spawnBullet() {
    console.log(bulletPosition);
    setInterval(() => {
        let speed=5;
        let velocity={
            x:null,
            y:null
        }
        let xPoint;
        let index=Math.floor(((Math.random()*10)));
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
        if(arrivingZombies.length>0){
            let aIndex=Math.floor(Math.random()*arrivingZombies.length);
            if(arrivingZombies[aIndex].x<=canvas.width){
                velocity={
                    x:1*speed,
                    y:null
                }
            }
            else if(arrivingZombies[aIndex].x>=canvas.width){
                velocity={
                    x:-1*speed,
                    y:null
                }
            }
            bullets.push(new Bullet(arrivingZombies[aIndex].x+arrivingZombies[aIndex].width,arrivingZombies[aIndex].y+arrivingZombies[aIndex].height*Math.random(),10,'black',velocity));
            
            return;
        }
        else{
        bullets.push(new Bullet(bulletPosition[index].x+bulletPosition[index].width, bulletPosition[index].y+bulletPosition[index].height*Math.random(), 10, 'black',velocity));
    }
    }, 2000);
    }

    function zombiePlayerCollision () {
        enemy.forEach((e)=>{
            if(e.collisionStatus=='not collided' && e.x+e.width>=player.x && e.y+e.height>=player.y && e.y<=player.y+player.height && e.x<=player.x+player.width){
                healthScore-=25;
                healthStatus.innerHTML=`${healthScore}%`;
                if(healthScore==0){
                    alert('game over');
                    cancelAnimationFrame(animationFrameID);

                }
                e.collisionStatus='collided';
            }
        });
        enemyRight.forEach((er)=>{
            if(er.x<=player.x+player.width && er.x+er.width>=player.x && er.y+er.height>=player.y && er.y<=player.y+player.height && er.collisionStatus=='not collided'){
                healthScore-=25;
                healthStatus.innerHTML=`${healthScore}%`;
                if(healthScore==0){
                    alert('game over');
                    cancelAnimationFrame(animationFrameID);

                }
                er.collisionStatus='collided';
            }
        });
    }

pauseBtn.addEventListener('click', ()=>{
    console.log('click hua');
    cancelAnimationFrame(animationFrameID);
});
playBtn.addEventListener('click', ()=>{
    console.log('hua');
    animate();
});

function animate () {
    animationFrameID=requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);

    drawBackground();
    standOn.forEach((stand)=>{
        stand.draw();
    });
    for(let i=0;i<platforms.length;i++){
        if(platforms[i]){
        platforms[i].update();
    }
    }
    for(let i=0;i<enemy.length;i++){
        enemy[i].update();
    }
    for(let i=0;i<enemyRight.length;i++){
        enemyRight[i].update();
    }
    player.update();
    standOn.forEach((stand)=>{
        if(player.y+player.height<=stand.y && player.y+player.height+player.velocity.y>=stand.y && player.x+player.width-50>=stand.x && player.x+20<=stand.x+stand.width){
            player.velocity.y=0;
        }
    });
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
    zombiePlayerCollision();
}
spawnEnemies();
setTimeout(()=>{
    spawnBullet();
},1000);
animate();
