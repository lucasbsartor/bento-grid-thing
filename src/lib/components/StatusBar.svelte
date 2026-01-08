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

		<!-- Right: Credit and version -->
		<div class="flex items-center gap-4">
			<span class="text-terminal-dim">{time}</span>
			<span class="text-terminal-border">|</span>
			<span class="flex items-center gap-1">
				<span class="text-terminal-dim">made by</span>
				<a
					href="https://github.com/lucasbsartor/bento-grid-thing"
					target="_blank"
					rel="noopener noreferrer"
					class="group hover:crt-glow flex items-center gap-1 text-terminal-text transition-all hover:text-terminal-green"
				>
					<span>lucasbsartor</span>
					<svg
						class="h-3 w-3 text-terminal-dim transition-colors group-hover:text-terminal-green"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path
							d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
						/>
					</svg>
				</a>
			</span>
			<span class="text-terminal-border">|</span>
			<span class="text-terminal-dim">v0.1.0</span>
		</div>
	</div>
</footer>
