class PauseState extends GameState {
	constructor(gameSystem) {
		super(gameSystem);
		this.start();
	}

	start() {
		window.alert("Game is paused !!!");
		fill(this.gameSystem.getAsset("Color")["text"]);
	}

	execute() {
		textSize(50);
		text("Press ENTER to continue the game", width / 2, height / 2);
		if (keyIsDown(ENTER)) {
			console.log("Continue");
			if (this.previousState) {
				this.gameSystem.gameState = this.previousState;
				this.previousState.continue();
			}
		}
	}
}
