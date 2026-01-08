export interface GridCell {
	id: number;
	colspan: number;
	rowspan: number;
	label: string;
}

export interface GridConfig {
	cols: number;
	gap: number;
	cells: GridCell[];
	selectedCellId: number | null;
}

export interface Preset {
	name: string;
	description: string;
	cols: number;
	gap: number;
	cells: Omit<GridCell, 'id'>[];
}

// Preset layouts
export const presets: Preset[] = [
	{
		name: 'Dashboard',
		description: 'Classic admin dashboard layout',
		cols: 4,
		gap: 4,
		cells: [
			{ colspan: 2, rowspan: 1, label: '1' },
			{ colspan: 1, rowspan: 1, label: '2' },
			{ colspan: 1, rowspan: 2, label: '3' },
			{ colspan: 1, rowspan: 1, label: '4' },
			{ colspan: 2, rowspan: 1, label: '5' },
			{ colspan: 3, rowspan: 1, label: '6' }
		]
	},
	{
		name: 'Portfolio',
		description: 'Showcase grid for projects',
		cols: 3,
		gap: 4,
		cells: [
			{ colspan: 2, rowspan: 2, label: '1' },
			{ colspan: 1, rowspan: 1, label: '2' },
			{ colspan: 1, rowspan: 1, label: '3' },
			{ colspan: 1, rowspan: 1, label: '4' },
			{ colspan: 1, rowspan: 1, label: '5' },
			{ colspan: 1, rowspan: 1, label: '6' }
		]
	},
	{
		name: 'Features',
		description: 'Feature showcase layout',
		cols: 3,
		gap: 6,
		cells: [
			{ colspan: 1, rowspan: 1, label: '1' },
			{ colspan: 1, rowspan: 1, label: '2' },
			{ colspan: 1, rowspan: 1, label: '3' },
			{ colspan: 2, rowspan: 1, label: '4' },
			{ colspan: 1, rowspan: 1, label: '5' }
		]
	},
	{
		name: 'Hero',
		description: 'Landing page hero section',
		cols: 4,
		gap: 4,
		cells: [
			{ colspan: 2, rowspan: 2, label: '1' },
			{ colspan: 2, rowspan: 1, label: '2' },
			{ colspan: 1, rowspan: 1, label: '3' },
			{ colspan: 1, rowspan: 1, label: '4' }
		]
	},
	{
		name: 'Minimal',
		description: 'Clean 2x2 grid',
		cols: 2,
		gap: 4,
		cells: [
			{ colspan: 1, rowspan: 1, label: '1' },
			{ colspan: 1, rowspan: 1, label: '2' },
			{ colspan: 1, rowspan: 1, label: '3' },
			{ colspan: 1, rowspan: 1, label: '4' }
		]
	}
];

// Create the grid store
function createGridStore() {
	// Default to Dashboard preset
	const defaultPreset = presets[0];

	let config = $state<GridConfig>({
		cols: defaultPreset.cols,
		gap: defaultPreset.gap,
		cells: defaultPreset.cells.map((cell, index) => ({
			...cell,
			id: index + 1
		})),
		selectedCellId: null
	});

	let nextId = $state(defaultPreset.cells.length + 1);

	return {
		get config() {
			return config;
		},
		get cols() {
			return config.cols;
		},
		get gap() {
			return config.gap;
		},
		get cells() {
			return config.cells;
		},
		get selectedCellId() {
			return config.selectedCellId;
		},
		get selectedCell() {
			return config.cells.find((c) => c.id === config.selectedCellId) ?? null;
		},

		setCols(value: number) {
			config.cols = Math.max(2, Math.min(6, value));
			// Clamp cell colspans to new max
			config.cells.forEach((cell) => {
				if (cell.colspan > config.cols) {
					cell.colspan = config.cols;
				}
			});
		},

		setGap(value: number) {
			config.gap = Math.max(0, Math.min(8, value));
		},

		selectCell(id: number | null) {
			config.selectedCellId = id;
		},

		updateCell(id: number, updates: Partial<Pick<GridCell, 'colspan' | 'rowspan' | 'label'>>) {
			const cell = config.cells.find((c) => c.id === id);
			if (cell) {
				if (updates.colspan !== undefined) {
					cell.colspan = Math.max(1, Math.min(config.cols, updates.colspan));
				}
				if (updates.rowspan !== undefined) {
					cell.rowspan = Math.max(1, Math.min(4, updates.rowspan));
				}
				if (updates.label !== undefined) {
					cell.label = updates.label;
				}
			}
		},

		addCell() {
			config.cells.push({
				id: nextId,
				colspan: 1,
				rowspan: 1,
				label: String(nextId)
			});
			nextId++;
		},

		removeCell(id: number) {
			if (config.cells.length <= 1) return; // Keep at least one cell
			config.cells = config.cells.filter((c) => c.id !== id);
			if (config.selectedCellId === id) {
				config.selectedCellId = null;
			}
		},

		removeLastCell() {
			if (config.cells.length <= 1) return;
			const lastCell = config.cells[config.cells.length - 1];
			this.removeCell(lastCell.id);
		},

		applyPreset(preset: Preset) {
			config.cols = preset.cols;
			config.gap = preset.gap;
			config.cells = preset.cells.map((cell, index) => ({
				...cell,
				id: index + 1
			}));
			config.selectedCellId = null;
			nextId = preset.cells.length + 1;
		},

		reset() {
			this.applyPreset(presets[0]);
		}
	};
}

export const gridStore = createGridStore();
