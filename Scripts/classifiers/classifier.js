class classifier {
	_name;
	_model;

	get name() {
		return this._name;
	}

	constructor(name, model) {
		this._name = name;
		this._model = model;
	}

	async classify(data) {
		if (!data) {
			console.warn("Data given is invalid !!!");
			return;
		}
	}
}
