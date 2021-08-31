class HORIZONTAL {
	static respond() {
		const classifier = game.getClassifierByName("Horizontal");
		classifier.classify(game.getFlippedVideo()).then((results) => {
			resultsHandler.handle(results);
		});
	}
}
