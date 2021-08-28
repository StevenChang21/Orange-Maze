class classifier {
	#name;
	_model;

	get name() {
		return this.#name;
	}

	constructor(name, model) {
		this.#name = name;
		this._model = model;
	}

	async classify(data) {
		if (!data) {
			console.warn("Data given is invalid !!!");
			return;
		}
	}
}
