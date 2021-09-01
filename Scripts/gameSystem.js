class gameSystem {
	constructor(maze, player) {
		this.maze = maze;
		this.player = player;
		this.gameState = new InitialState(this);
		this.canvas = document.querySelector("#snap");
	}

	getAsset(type) {
		return this.assets.getChildAssetByType(type).data;
	}

	update() {
		this.gameState.execute();
	}

	changeState(state) {
		new state(this);
	}

	getClassifierByName(name) {
		const classifiers = this.assets.getChildAssetByType("Model").data;
		for (const key in classifiers) {
			if (key === name) {
				return classifiers[key];
			}
		}
		return undefined;
	}

	getFlippedVideo() {
		const ctx = this.canvas.getContext("2d");
		this.canvas.width = webcamVid.videoWidth;
		this.canvas.height = webcamVid.videoHeight;
		ctx.drawImage(webcamVid, 0, 0, webcamVid.videoWidth, webcamVid.videoHeight);
		return ctx;
	}
}
