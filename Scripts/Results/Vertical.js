class VERTICAL {
	static respond() {
		const classifier = game.getClassifierByName("Vertical");
		classifier
			.classify(game.getAsset("Video"))
			.then((results) => {
				resultsHandler.handle(results);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
