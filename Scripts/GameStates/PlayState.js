class PlayState extends GameState {
	directionClassifier;

	constructor(gameSystem) {
		super(gameSystem);
		this.start();
	}

	start() {
		this.gameSystem.maze.Generate();
		this.gameSystem.player.Spawn(this.gameSystem.maze);
		gadget.generate(2, game.maze, this.gameSystem.getAsset("Image").bomb);
		this.destination = this.gameSystem.maze.all_cells[this.gameSystem.maze.all_cells.length - 1];

		const colorAssets = this.gameSystem.getAsset("Color");

		this.gameColour = {
			maze: colorAssets.maze,
			mazeWall: colorAssets.mazeWall,
			player: colorAssets.player,
			target: colorAssets.target,
		};

		this.gameSystem
			.getClassifierByName("Direction")
			.classify(this.gameSystem.getFlippedVideo())
			.then((prediction) => {
				resultsHandler.handle(prediction);
			});

		this.resultLabels = {
			class: document.querySelector("#result-label"),
			probability: document.querySelector("#probability-label"),
		};

		for (const key in this.resultLabels) {
			this.resultLabels[key].style.display = "block";
		}
	}

	continue() {
		this.gameSystem
			.getClassifierByName("Direction")
			.classify(this.gameSystem.getFlippedVideo())
			.then((prediction) => {
				resultsHandler.handle(prediction);
			});
		for (const key in this.resultLabels) {
			this.resultLabels[key].style.display = "block";
		}
	}

	pause(source) {
		source.gameSystem.changeState(PauseState);
		source.gameSystem.gameState.previousState = this;
		for (const key in this.resultLabels) {
			this.resultLabels[key].style.display = "none";
		}
	}

	execute() {
		if (game.gameState instanceof PlayState && key == "p") {
			game.gameState.pause(game.gameState);
			return;
		}
		this.gameSystem.maze.Render(this.gameColour.mazeWall, this.gameColour.maze);
		this.gameSystem.player.Render(this.gameColour.player);
		this.gameSystem.gadgets.forEach((gadget) => {
			gadget.render();
		});
		this.checkHasWon();
	}

	checkHasWon() {
		this.destination.Show(this.gameColour.mazeWall, this.gameColour.target);
		if (this.gameSystem.player.cell_in === this.destination) {
			//|| key == "w") {
			document.removeEventListener("visibilitychange", this.onVisibilityChange);
			this.gameSystem.maze.clearCache();
			for (const key in this.resultLabels) {
				this.resultLabels[key].style.display = "none";
			}
			this.gameSystem.changeState(WonState);
		}
	}
}
