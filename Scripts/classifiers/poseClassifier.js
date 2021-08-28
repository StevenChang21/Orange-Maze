class poseClassifier extends classifier {
	constructor(name, model) {
		super(name, model);
	}

	async classify(data) {
		super.classify(data);
		const { pose, posenetOutput } = await this._model.estimatePose(data);
		const prediction = await this._model.predict(posenetOutput);
		console.log(prediction[0].className);
		return {
			label: prediction[0].className,
			probability: prediction[0].probability.toFixed(2),
		};
	}
}
