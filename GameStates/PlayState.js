class PlayState extends GameState {
	constructor(gameSystem) {
		super(gameSystem);
		this.start();
	}

	start() {
		this.listenToVisibilityChangedChannel();
		this.gameSystem.maze.Generate();
		this.gameSystem.player.Spawn(gameSystem.maze);
		// Destination set next to player this.destination = this.gameSystem.maze.GetCellByCoordinate(this.gameSystem.maze.rows_number / 2 + 1, this.gameSystem.maze.columns_number / 2);
		this.destination = this.gameSystem.maze.all_cells[this.gameSystem.maze.all_cells.length - 1];
		this.gameSystem.Classifiers[0].classify(this.gameSystem, this.gameSystem.GetFlippedVideo(), this.gotDirectionResults);
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
		this.gameSystem.Classifiers[0].classify(this.gameSystem, this.gameSystem.GetFlippedVideo(), this.gotDirectionResults);
	}

	pause(source) {
		source.gameSystem.changeState(PauseState);
		source.gameSystem.gameState.previousState = this;
		source.gameSystem.ClassifiedFlippedVideo = null;
	}

	gotDirectionResults(results, image, gameSystem) {
		if (results[0].label === "Idle") {
			label = results[0].label;
			gameSystem.Classifiers[0].classify(gameSystem, gameSystem.GetFlippedVideo(), gameSystem.gameState.gotDirectionResults);
			return;
		}
		const classifier = gameSystem.GetClassifierByName(results[0].label);
		if (!classifier) {
			return;
		}
		classifier.classify(gameSystem, image, (results, image, gameSystem) => {
			label = results[0].label;
			gameSystem.Classifiers[0].classify(gameSystem, gameSystem.GetFlippedVideo(), gameSystem.gameState.gotDirectionResults);
		});
	}

	execute() {
		this.gameSystem.maze.Render(color(244, 162, 97), color(38, 70, 83));
		this.gameSystem.player.Render(color(42, 157, 143));
		this.checkHasWon();
		if (!this.gameSystem.ClassifiedFlippedVideo) {
			return;
		}
		image(this.gameSystem.ClassifiedFlippedVideo, width - gameSystem.video.width, height - gameSystem.video.height);
	}

	checkHasWon() {
		this.destination.Show(color(233, 196, 106), color("black"));
		if (this.gameSystem.player.cell_in === this.destination) {
			document.removeEventListener("visibilitychange", this.onVisibilityChange);
			this.gameSystem.maze.clearCache();
			this.gameSystem.changeState(WonState);
		}
	}
}
