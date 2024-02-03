class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100
        this.score = 0
        this.shots = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup')
        this.cup.body.setCircle(this.cup.width/4)
        this.cup.body.setOffset(this.cup.width/4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width/2, height - height/10, 'ball')
        this.ball.body.setCircle(this.ball.width/2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)


        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, config.width - wallA.width/2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)
            let shotDirectionX = pointer.x <+ this.ball.x ? 1 : -1
            this.ball.body.setVelocityX(Phaser.Math.Between(0, this.SHOT_VELOCITY_X) * shotDirectionX)
            this.shots += 1     //add one to shots
            this.shotCounter.text = ("Shots: "+this.shots)
            


        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            //reset ball
            cup.body.enable = false
            ball.body.enable = false

            ball.body.setVelocityY(0)
            ball.body.setVelocityX(0)

            ball.setPosition(width/2, height - height/10)
            
            cup.body.enable = true
            ball.body.enable = true
            
            

            //adjust score and percentage
            this.score += 1
            this.percentage = Phaser.Math.RoundTo((this.score / this.shots), -4) * 100
            this.scoreCounter.text = ("Score: "+this.score)
            this.percentageCounter.text = ("Win Percentage: "+this.percentage+"%")

            //reroll obstacle positions
            wallA.setX(Phaser.Math.Between(0 + wallA.width/2, config.width - wallA.width/2))
            wallB.setX(Phaser.Math.Between(0 + wallB.width/2, config.width - wallB.width/2))
            this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))

            

        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)


        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)

        //font style
        this.font = {
            fontSize: 30
        }

        //add score
        this.scoreCounter = this.add.text(10, 10, "Score: "+this.score, this.font)

        //add shot counter
        this.shotCounter = this.add.text(450, 10, "Shots: "+this.shots, this.font)

        //add shot percentage
        this.percentage = this.score / this.shots
        this.percentageCounter = this.add.text(10, 40, "Win Percentage: ", this.font)

    }

    update() {

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[*] Add ball reset logic on successful shot
[*] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ] Make one obstacle move left/right and bounce against screen edges
[*] Create and display shot counter, score, and successful shot percentage
*/