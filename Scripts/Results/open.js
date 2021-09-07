class OPEN {
	static respond(info) {
		const classifier = game.getClassifierByName("Direction");
		game.gameState.resultLabels.probability.innerHTML = `${info.probability.toFixed(2) * 100} %`;
		game.gameState.resultLabels.class.innerHTML = info.label;
		game.player.destroyWalls(() =>
			classifier.classify(game.getFlippedVideo()).then((results) => {
				resultsHandler.handle(results);
			})
		);
	}
}
