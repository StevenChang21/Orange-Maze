class WonState extends GameState {
	constructor(gameSystem) {
		super(gameSystem);
		this.start();
	}

	start() {
		fill(this.gameSystem.getAsset("Color")["text"]);
		this.gameSystem.level++;
	}

	modifyDifficulty() {
		const data = this.gameSystem.getAsset("Difficulty");
		this.gameSystem.maze.SetSize(this.gameSystem.maze.cell_length * (1 - data.difficultyOffset / 100), width, height);
		data.difficultyOffset += data.difficultySpeed;
		data.difficultySpeed += data.difficultyAcceleration;
	}

	execute() {
		textSize(50);
		text("CONGRATS \n You have cleared this level !!!\n Press ENTER to go next level", oscillator.oscillateInCanvas(width, 1.5, 300, 0), 200);

		if (keyIsPressed && keyIsDown(ENTER)) {
			this.modifyDifficulty();
			this.gameSystem.changeState(PlayState);
		}
	}
}
