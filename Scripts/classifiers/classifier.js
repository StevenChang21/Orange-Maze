class classifier {
	_name;
	model;

	get name() {
		return this._name;
	}

	constructor(name, model) {
		this._name = name;
		this.model = model;
	}

	async classify(data) {
		if (!data) {
			console.warn("Data given is invalid !!!");
			return;
		}
	}
}
