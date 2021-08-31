class OPEN {
	static respond(info) {
		const classifier = game.getClassifierByName("Direction");
		game.gameState.prediction = info.label;
		game.player.summonWallDestroyer(() =>
			classifier.classify(game.getFlippedVideo()).then((results) => {
				resultsHandler.handle(results);
			})
		);
	}
}
