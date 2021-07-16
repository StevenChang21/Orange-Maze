class GameSystem{
    maze;
    player;
    gameState;

    constructor(maze, player){
        this.maze = maze;
        this.player = player;
        this.gameState = new PlayState(this);
    }

    update(){
        this.gameState.execute();
    }
}