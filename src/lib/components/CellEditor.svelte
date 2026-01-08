<script lang="ts">
	import Slider from './Slider.svelte';
	import { gridStore } from '$lib/stores/grid.svelte';

	let selectedCell = $derived(gridStore.selectedCell);
	let cols = $derived(gridStore.cols);

	let colspan = $derived(selectedCell?.colspan ?? 1);
	let rowspan = $derived(selectedCell?.rowspan ?? 1);
</script>

<div class="terminal-box space-y-4 p-4">
	<!-- Section Header -->
	<div class="flex items-center gap-2">
		<span class="text-terminal-green">></span>
		<span class="font-bold text-terminal-amber">CELL_EDITOR</span>
		<span class="text-xs text-terminal-dim">// modify selected</span>
	</div>

	{#if selectedCell}
		<!-- Selected Cell Info -->
		<div class="flex items-center gap-2 text-sm">
			<span class="text-terminal-dim">selected:</span>
			<span class="font-bold text-terminal-cyan">Cell {selectedCell.id}</span>
			<button
				onclick={() => gridStore.selectCell(null)}
				class="ml-auto text-xs text-terminal-dim transition-colors hover:text-terminal-red"
			>
				[x] deselect
			</button>
		</div>

		<!-- Cell Controls -->
		<div class="space-y-3">
			<Slider
				label="colspan"
				bind:value={colspan}
				min={1}
				max={cols}
				onchange={(v) => gridStore.updateCell(selectedCell!.id, { colspan: v })}
			/>
			<Slider
				label="rowspan"
				bind:value={rowspan}
				min={1}
				max={4}
				onchange={(v) => gridStore.updateCell(selectedCell!.id, { rowspan: v })}
			/>
		</div>

		<!-- Quick Span Buttons -->
		<div class="space-y-2">
			<div class="text-xs text-terminal-dim">quick spans:</div>
			<div class="flex flex-wrap gap-2">
				{#each [1, 2, 3] as c}
					{#if c <= cols}
						<button
							onclick={() => gridStore.updateCell(selectedCell!.id, { colspan: c })}
							class="border px-2 py-1 text-xs transition-all {colspan === c
								? 'border-terminal-green bg-terminal-green/20 text-terminal-green'
								: 'border-terminal-border text-terminal-dim hover:border-terminal-green hover:text-terminal-green'}"
						>
							{c}col
						</button>
					{/if}
				{/each}
				<span class="text-terminal-border">|</span>
				{#each [1, 2, 3] as r}
					<button
						onclick={() => gridStore.updateCell(selectedCell!.id, { rowspan: r })}
						class="border px-2 py-1 text-xs transition-all {rowspan === r
							? 'border-terminal-green bg-terminal-green/20 text-terminal-green'
							: 'border-terminal-border text-terminal-dim hover:border-terminal-green hover:text-terminal-green'}"
					>
						{r}row
					</button>
				{/each}
			</div>
		</div>

		<!-- Delete Cell -->
		<button
			onclick={() => gridStore.removeCell(selectedCell!.id)}
			disabled={gridStore.cells.length <= 1}
			class="w-full border border-terminal-red/50 px-3 py-2 text-sm text-terminal-red transition-all hover:border-terminal-red hover:bg-terminal-red/10 disabled:cursor-not-allowed disabled:opacity-50"
		>
			[ DELETE CELL ]
		</button>
	{:else}
		<!-- No Selection State -->
		<div class="space-y-2 py-8 text-center">
			<div class="text-sm text-terminal-dim">No cell selected</div>
			<div class="text-xs text-terminal-border">
				Click a cell in the preview to edit its properties
			</div>
			<div class="animate-pulse text-2xl text-terminal-green">_</div>
		</div>
	{/if}
</div>
