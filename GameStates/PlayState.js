class PlayState extends GameState {
    constructor(gameSystem) {
        super(gameSystem);
    }

    start() {
        this.gameSystem.maze.Generate();
        this.gameSystem.player.Spawn();
        // Destination set next to player this.destination = this.gameSystem.maze.GetCellByCoordinate(this.gameSystem.maze.rows_number / 2 + 1, this.gameSystem.maze.columns_number / 2);
        this.destination = this.gameSystem.maze.all_cells[this.gameSystem.maze.all_cells.length - 1];
    }

    execute() {
        this.gameSystem.maze.Render(color(255, 255, 255), color(60, 60, 60));
        this.gameSystem.player.Render(color(47, 194, 86), color(10, 36, 17));
        this.checkHasWon();
    }

    checkHasWon() {
        this.destination.Show(color("black"), color("white"));
        if (this.gameSystem.player.cell_in === this.destination) {
            this.gameSystem.gameState = new WonState(this.gameSystem);
        }
    }
}
