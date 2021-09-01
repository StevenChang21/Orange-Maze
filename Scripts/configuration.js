class configuration {
	assetCount = 0;
	readyAssetCount = 0;

	get loadedAssets() {
		return this.assetCount === this.readyAssetCount;
	}

	constructor() {
		this.assets = new assets("General");
		this.onAllAssetReadyEvent = new Event("OnAllAssetsReady");
		this.loadedResource = 0;
	}

	onAssetReady() {
		this.readyAssetCount++;
		this.loadedResource = floor((this.readyAssetCount / this.assetCount) * 100);
		// console.log("Ready");
		if (this.readyAssetCount >= this.assetCount) {
			console.log("All assets are ready to use !!!");
			document.dispatchEvent(this.onAllAssetReadyEvent);
		}
	}

	loadAssets(assetType, sources, getData = undefined) {
		this.assetCount += Object.keys(sources).length;
		const dataGetter = getData
			? getData
			: (sources) => {
					this.readyAssetCount += Object.keys(sources).length - 1;
					this.onAssetReady();
					return sources;
			  };
		const sourceAssets = new assets(assetType, dataGetter(sources));
		this.assets.childAssets.push(sourceAssets);
	}

	getResourceAssets() {
		if (this.assets.length <= 0 && this.assets.childAssets.length <= 0) {
			console.log("No data in asset");
			return;
		}
		return this.assets;
	}
}

class assets {
	#data;

	get data() {
		return this.#data;
	}

	constructor(type, data) {
		this.type = type;
		this.#data = data;
		this.childAssets = [];
	}

	getChildAssetByType(type) {
		for (const childAsset of this.childAssets) {
			if (childAsset.type === type) {
				return childAsset;
			}
		}
		return undefined;
	}
}
