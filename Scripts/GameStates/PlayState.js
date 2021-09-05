class PlayState extends GameState {
	directionClassifier;

	constructor(gameSystem) {
		super(gameSystem);
		this.start();
	}

	start() {
		this.listenToVisibilityChangedChannel();
		this.gameSystem.maze.Generate();
		this.gameSystem.player.Spawn(this.gameSystem.maze);
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

		resultLabel.style.display = "block";
		probabilityLabel.style.display = "block";
	}

	listenToVisibilityChangedChannel() {
		this.onVisibilityChange = () => {
			const playState = this;
			setTimeout(() => {
				if (document.visibilityState !== "hidden") {
					return;
				}
				document.removeEventListener("visibilitychange", this.onVisibilityChange);
				playState.pause(playState);
			}, 5 * 1000);
		};
		document.addEventListener("visibilitychange", this.onVisibilityChange);
	}

	continue() {
		this.listenToVisibilityChangedChannel();
		this.gameSystem
			.getClassifierByName("Direction")
			.classify(this.gameSystem.getFlippedVideo())
			.then((prediction) => {
				resultsHandler.handle(prediction);
			});
	}

	pause(source) {
		console.log("Pausing...");
		source.gameSystem.changeState(PauseState);
		source.gameSystem.gameState.previousState = this;
	}

	execute() {
		if (game.gameState instanceof PlayState && key == "p") {
			game.gameState.pause(game.gameState);
			return;
		}
		this.gameSystem.maze.Render(this.gameColour.mazeWall, this.gameColour.maze);
		this.gameSystem.player.Render(this.gameColour.player);
		this.checkHasWon();
	}

	checkHasWon() {
		this.destination.Show(this.gameColour.mazeWall, this.gameColour.target);
		if (this.gameSystem.player.cell_in === this.destination) {
			// || key == "w") {
			document.removeEventListener("visibilitychange", this.onVisibilityChange);
			this.gameSystem.maze.clearCache();
			this.gameSystem.changeState(WonState);
		}
	}
}
