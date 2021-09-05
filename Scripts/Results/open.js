class OPEN {
	static respond(info) {
		const classifier = game.getClassifierByName("Direction");
		game.gameState.resultLabels.probability.innerHTML = `${info.probability.toFixed(2) * 100} %`;
		game.gameState.resultLabels.class.innerHTML = info.label;
		game.player.summonWallDestroyer(() =>
			classifier.classify(game.getFlippedVideo()).then((results) => {
				resultsHandler.handle(results);
			})
		);
	}
}
