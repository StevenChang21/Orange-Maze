class VERTICAL {
	static respond() {
		const classifier = game.getClassifierByName("Vertical");
		classifier.classify(game.getFlippedVideo()).then((results) => {
			resultsHandler.handle(results);
		});
	}
}
