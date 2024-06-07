let canvas = document.querySelector('canvas');

let c=canvas.getContext('2d');

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

let player=new Player(canvas.width/2,canvas.height/2,50,50,'red');
let platform1=new Platform(canvas.width/2,canvas.height/2,20,200,'blue');
let platform2=new Platform(canvas.width/3,canvas.height-200,200,40,'blue');
let platform3=new Platform(2*canvas.width/3,canvas.height-200,200,40,'blue');
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

function animate () {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    platform1.draw();
    platform2.draw();
    platform3.draw();

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
animate();