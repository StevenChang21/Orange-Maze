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
}
