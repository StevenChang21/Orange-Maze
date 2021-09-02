class OPEN {
	static respond(info) {
		const classifier = game.getClassifierByName("Direction");
		resultLabel.innerHTML = info.label;
		probabilityLabel.innerHTML = `${info.probability.toFixed(2) * 100} %`;
		game.player.summonWallDestroyer(() =>
			classifier.classify(game.getFlippedVideo()).then((results) => {
				resultsHandler.handle(results);
			})
		);
	}
}
