<script lang="ts">
	import { gridStore } from '$lib/stores/grid.svelte';

	let cols = $derived(gridStore.cols);
	let gap = $derived(gridStore.gap);
	let cellCount = $derived(gridStore.cells.length);
	let selectedCell = $derived(gridStore.selectedCell);

	// Calculate rough grid dimensions
	let gridInfo = $derived(() => {
		const totalColSpans = gridStore.cells.reduce((sum, cell) => sum + cell.colspan, 0);
		const estimatedRows = Math.ceil(totalColSpans / cols);
		return `${cols}x${estimatedRows}`;
	});

	// Current time for that extra terminal feel
	let time = $state(new Date().toLocaleTimeString('en-US', { hour12: false }));

	$effect(() => {
		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString('en-US', { hour12: false });
		}, 1000);

		return () => clearInterval(interval);
	});
</script>

<footer class="border-t border-terminal-border bg-terminal-surface px-4 py-2">
	<div class="flex items-center justify-between text-xs">
		<!-- Left: Status -->
		<div class="flex items-center gap-4">
			<span class="flex items-center gap-1">
				<span class="text-terminal-green">SYS:</span>
				<span class="text-terminal-text">ready</span>
			</span>

			<span class="text-terminal-border">|</span>

			<span class="flex items-center gap-1">
				<span class="text-terminal-dim">CELLS:</span>
				<span class="text-terminal-amber">{cellCount}</span>
			</span>

			<span class="text-terminal-border">|</span>

			<span class="flex items-center gap-1">
				<span class="text-terminal-dim">GRID:</span>
				<span class="text-terminal-cyan">{gridInfo()}</span>
			</span>

			<span class="text-terminal-border">|</span>

			<span class="flex items-center gap-1">
				<span class="text-terminal-dim">GAP:</span>
				<span class="text-terminal-text">{gap}</span>
			</span>

			{#if selectedCell}
				<span class="text-terminal-border">|</span>
				<span class="flex items-center gap-1">
					<span class="text-terminal-dim">SEL:</span>
					<span class="text-terminal-green">#{selectedCell.id}</span>
				</span>
			{/if}
		</div>

		<!-- Right: Time and version -->
		<div class="flex items-center gap-4">
			<span class="text-terminal-dim">{time}</span>
			<span class="text-terminal-border">|</span>
			<span class="text-terminal-dim">v0.1.0</span>
		</div>
	</div>
</footer>
