<script lang="ts">
	import { gridStore } from '$lib/stores/grid.svelte';

	let cols = $derived(gridStore.cols);
	let gap = $derived(gridStore.gap);
	let cells = $derived(gridStore.cells);
	let selectedCellId = $derived(gridStore.selectedCellId);

	// Map gap value to Tailwind gap class
	const gapClasses: Record<number, string> = {
		0: 'gap-0',
		1: 'gap-1',
		2: 'gap-2',
		3: 'gap-3',
		4: 'gap-4',
		5: 'gap-5',
		6: 'gap-6',
		7: 'gap-7',
		8: 'gap-8'
	};

	// Map cols value to Tailwind grid-cols class
	const colClasses: Record<number, string> = {
		2: 'grid-cols-2',
		3: 'grid-cols-3',
		4: 'grid-cols-4',
		5: 'grid-cols-5',
		6: 'grid-cols-6'
	};

	// Map colspan to Tailwind col-span class
	const colspanClasses: Record<number, string> = {
		1: 'col-span-1',
		2: 'col-span-2',
		3: 'col-span-3',
		4: 'col-span-4',
		5: 'col-span-5',
		6: 'col-span-6'
	};

	// Map rowspan to Tailwind row-span class
	const rowspanClasses: Record<number, string> = {
		1: 'row-span-1',
		2: 'row-span-2',
		3: 'row-span-3',
		4: 'row-span-4'
	};

	function handleCellClick(id: number) {
		if (selectedCellId === id) {
			gridStore.selectCell(null);
		} else {
			gridStore.selectCell(id);
		}
	}
</script>

<div class="terminal-box flex h-full flex-col p-4">
	<!-- Section Header -->
	<div class="mb-4 flex items-center gap-2">
		<span class="text-terminal-green">></span>
		<span class="font-bold text-terminal-amber">PREVIEW</span>
		<span class="text-xs text-terminal-dim">// click cells to select</span>
	</div>

	<!-- Grid Container -->
	<div class="flex min-h-0 flex-1 items-center justify-center rounded bg-terminal-bg/50 p-4">
		<div
			class="grid w-full max-w-2xl {colClasses[cols]} {gapClasses[gap]}"
			style="grid-auto-rows: minmax(80px, auto);"
		>
			{#each cells as cell (cell.id)}
				<button
					onclick={() => handleCellClick(cell.id)}
					class="
						{colspanClasses[cell.colspan]} 
						{rowspanClasses[cell.rowspan]}
						group
						relative
						flex min-h-[80px] cursor-pointer
						items-center justify-center
						border-2 text-lg
						font-bold
						transition-all
						duration-200
						{selectedCellId === cell.id
						? 'glow-border border-terminal-green bg-terminal-green/10 text-terminal-green'
						: 'border-terminal-border bg-terminal-surface text-terminal-dim hover:border-terminal-green/50 hover:text-terminal-text'}
					"
				>
					<!-- Cell Label -->
					<span class="relative z-10">{cell.label}</span>

					<!-- Hover Info -->
					<div
						class="
							absolute right-1 bottom-1
							text-[10px] text-terminal-dim
							opacity-0 transition-opacity
							group-hover:opacity-100
						"
					>
						{cell.colspan}x{cell.rowspan}
					</div>

					<!-- Selected Indicator -->
					{#if selectedCellId === cell.id}
						<div class="absolute top-1 left-1 text-[10px] text-terminal-green">
							<span class="cursor-blink">*</span>
						</div>
					{/if}

					<!-- Corner Brackets for Selected Cell -->
					{#if selectedCellId === cell.id}
						<div class="absolute top-0 left-0 text-xs text-terminal-green">+</div>
						<div class="absolute top-0 right-0 text-xs text-terminal-green">+</div>
						<div class="absolute bottom-0 left-0 text-xs text-terminal-green">+</div>
						<div class="absolute right-0 bottom-0 text-xs text-terminal-green">+</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Preview Footer -->
	<div class="mt-4 flex items-center justify-between text-xs text-terminal-dim">
		<span>grid: {cols} cols</span>
		<span>gap: {gap}</span>
		<span>cells: {cells.length}</span>
	</div>
</div>
