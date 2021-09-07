class InitialState extends GameState {
	GameName = "Welcome to Orange Maze !";
	instructionText = "Ready ? \n Press ENTER to start the game ";
	constructor(gameSystem) {
		super(gameSystem);
		this.start();
	}

	initiate() {
		fill(this.gameSystem.getAsset("Color")["text"]);
		this.instructionText = "Ready? Press ENTER \n to start the game !!!";
	}

	start() {
		this.instructionText = "Be patient ! Dear user 😙😙😙";
	}

	execute() {
		if (!this.gameSystem.ready) {
			this.gameStatus = `Loaded ${config.loadedResource} %`;
			fill(200);
			rect(width / 2 - 50 * 2, height - 50, 100 * 2, 10);
			fill(color(252, 166, 82));
			rect(width / 2 - 50 * 2, height - 50, config.loadedResource * 2, 10);
			textSize(20);
			fill(50);
			text(this.gameStatus, width / 2, height - 100);
		}
		textSize(60);
		textAlign(CENTER);
		textFont("Georgia");

		text(this.GameName, width / 2, oscillator.oscillateInCanvas(height, 1.75, height / 8, -height / 4));
		textSize(40);
		text(this.instructionText, width / 2, height / 2 + 20);

		if (keyIsPressed && keyIsDown(ENTER) && this.gameSystem.ready) {
			this.gameSystem.changeState(PlayState);
		}
	}
}
