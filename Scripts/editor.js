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
	const saveColorsButton = document.querySelector("#save-color-button");
	const editorContainer = document.querySelector("#editor-container");
	const colorCustomisationContainer = document.querySelector("#color-customisation-container");

	setColorsButton.addEventListener("click", () => {
		editorContainer.children.forEach((child) => {
			child.style.display = "none";
		});
		saveColorsButton.style.display = "inline";
		closeSetColorsButton.style.display = "inline";
		editorContainer.style.justifyContent = "space-between";
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
		document.querySelectorAll("input").forEach((input) => input.remove());
		document.querySelectorAll("p").forEach((p) => p.remove());
	});

	saveColorsButton.addEventListener("click", (e) => {
		const data = {};
		const colorPickers = document.querySelectorAll("input");
		const colorLabel = document.querySelectorAll("p");
		for (let i = 0; i < colorPickers.length; i++) {
			data[colorLabel[i].innerHTML] = hexToRgb(colorPickers[i].value);
		}
		createStringDict(data).saveJSON("m_Colors");
	});

	useSavedColorButton.mousePressed(() => {
		const fileInput = createFileInput((file) => {
			if (file.type !== "application") {
				console.log("File type is invalid !!!");
				return;
			}
			const colorAsset = config.assets.getChildAssetByType("Color").data;
			loadJSON(file.data, (data) => {
				for (const key in data) {
					colorAsset[key].levels = data[key].levels;
				}
			});
		});

		fileInput.position(useSavedColorButton.position().x, useSavedColorButton.position().y);
		useSavedColorButton.hide();
		createCloseButton(
			{
				x: fileInput.position().x,
				y: fileInput.position().y + fileInput.size().height,
			},
			() => {
				fileInput.remove();
				useSavedColorButton.show();
			}
		);
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
		const colorLabel = createP(key).parent(parent);
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

function createCloseButton(position, onExit) {
	const closeButton = createButton("Close").position(position.x, position.y);
	closeButton.mousePressed(() => {
		closeButton.remove();
		onExit();
	});
}
