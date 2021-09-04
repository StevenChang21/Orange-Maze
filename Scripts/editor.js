function globalSetAttributes(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

function runEditor() {
	const initialButtons = document.querySelectorAll(".show-onReady");
	initialButtons.forEach((button) => {
		button.style.display = "inline";
	});

	const setColorsButton = document.querySelector("#customise-color-button");
	const closeSetColorsButton = document.querySelector("#customise-color-close");

	const useSavedColorButton = document.querySelector("#use-save-color-button");
	const closeUseSavedColorButton = document.querySelector("#use-save-color-close");

	const saveColorsButton = document.querySelector("#save-color-button");
	const editorContainer = document.querySelector("#editor-container");
	const colorCustomisationContainer = document.querySelector("#color-customisation-container");

	setColorsButton.addEventListener("click", () => {
		editorContainer.children.forEach((child) => {
			child.style.display = "none";
		});
		saveColorsButton.style.display = "inline";
		closeSetColorsButton.style.display = "inline";
		colorCustomisationContainer.style.display = "grid";
		const colorAssets = config.assets.getChildAssetByType("Color").data;
		showColors(colorAssets, colorCustomisationContainer);
	});

	closeSetColorsButton.addEventListener("click", () => {
		initialButtons.forEach((child) => {
			child.style.display = "inline";
		});
		saveColorsButton.style.display = "none";
		closeSetColorsButton.style.display = "none";
		document.querySelectorAll("input[type=color]").forEach((input) => input.remove());
		document.querySelectorAll(".colorLabel").forEach((p) => p.remove());
	});

	saveColorsButton.addEventListener("click", (e) => {
		const data = {};
		const colorPickers = document.querySelectorAll("input[type=color]");
		const colorLabel = document.querySelectorAll(".colorLabel");
		for (let i = 0; i < colorPickers.length; i++) {
			if (!colorLabel[i]) continue;
			data[colorLabel[i].innerHTML] = hexToRgb(colorPickers[i].value);
		}
		createStringDict(data).saveJSON("m_Colors");
	});

	const colorFileInput = document.querySelector("#color-file-input");

	colorFileInput.addEventListener("input", (e) => {
		const reader = new FileReader();
		reader.onload = () => {
			const colorData = JSON.parse(reader.result);
			const colorAsset = config.assets.getChildAssetByType("Color").data;
			for (const key in colorData) {
				colorAsset[key].levels[0] = colorData[key].r;
				colorAsset[key].levels[1] = colorData[key].g;
				colorAsset[key].levels[2] = colorData[key].b;
			}
		};
		reader.readAsText(e.target.files[0]);
	});

	useSavedColorButton.addEventListener("click", () => {
		editorContainer.children.forEach((child) => {
			child.style.display = "none";
		});
		colorFileInput.style.display = "inline";
		closeUseSavedColorButton.style.display = "inline";
	});

	closeUseSavedColorButton.addEventListener("click", (e) => {
		e.target.style.display = "none";
		colorFileInput.style.display = "none";
		initialButtons.forEach((child) => {
			child.style.display = "inline";
		});
	});
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
		  }
		: null;
}

function showColors(colorData, parent) {
	const colorPickers = [];
	const colorLabels = [];

	for (const key in colorData) {
		const colorValues = colorData[key].levels;
		const colorLabel = createP(key).parent(parent).class("colorLabel");
		const colorPicker = createColorPicker(color(colorValues[0], colorValues[1], colorValues[2])).parent(parent);
		colorLabels.push(colorLabel);
		colorPickers.push({ key, colorPicker });
	}
	let value = "";
	for (let i = 0; i < colorLabels.length * 2 + 1; i += 2) {
		value += "auto ";
	}
	parent.style.gridTemplateColumns = value;
	return { colorPickers, colorLabels };
}
