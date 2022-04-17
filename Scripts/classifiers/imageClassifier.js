class imageClassifier extends classifier {
  constructor(name, model) {
    super(name, model);
  }

  async classify(data) {
    const prediction = await this.model
      .classify(data)
      .catch((err) => console.log(err));
    return {
      label: prediction[0].label,
      probability: prediction[0].confidence,
    };
  }

  async load(URL) {
    return await ml5.imageClassifier(URL + "model.json");
  }
}
