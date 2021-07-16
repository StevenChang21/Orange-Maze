class GameState{
    gameSystem;

    constructor(gameSystem){
        this.gameSystem = gameSystem;
        this.start();
    }

    start(){
    }

    execute(){
    }
}

class PlayState extends GameState{
    constructor(gameSystem){
        super(gameSystem);
    }

    start(){
        this.gameSystem.maze.Generate();
        this.gameSystem.player.Spawn();
    }

    execute(){
        this.gameSystem.maze.Render(color(255,255,255), color(60, 60, 60));
        this.gameSystem.player.Render(color(47, 194, 86), color(10, 36, 17));
        this.checkHasWon();
    }

    checkHasWon(){
        this.gameSystem.destination.Show(color("black"), color("white"));
        if(this.gameSystem.player.cell_in == this.gameSystem.destination){
            this.gameSystem.gameState = new WonState(this.gameSystem);
        }
    }
}

class WonState extends GameState{
    constructor(gameSystem){
        super(gameSystem);
    }

    start(){
        const nextLevelButton = createButton("Next Level");
        nextLevelButton.mousePressed();
    }

    execute(){
        textSize(15);
        text("CONGRATS, You have cleared this level !!!", 100, 100)
    }
}