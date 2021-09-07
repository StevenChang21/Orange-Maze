class oscillator {
	static oscillateInCanvas(side, frequency = 1, amplitude = 1, offset = 0) {
		return map(cos(radians(frameCount * frequency)), -1, 1, side / 2 - amplitude, side / 2 + amplitude) + offset;
	}

	static oscillateInCell(cellSize, position, offset, frequency = 1) {
		return map(sin(radians(frameCount * frequency + offset)), -1, 1, position - cellSize / 2, position + cellSize / 2);
	}
}
