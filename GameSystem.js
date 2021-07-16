class GameSystem{
    maze;
    player;
    gameState;

    constructor(maze, player){
        this.maze = maze;
        this.player = player;
        this.gameState = new PlayState(this);
        this.destination = maze.GetCellByCoordinate(11, 10);
    }

    update(){
        this.gameState.execute();
    }
}