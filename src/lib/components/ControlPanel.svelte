<script lang="ts">
	import Slider from './Slider.svelte';
	import { gridStore, presets } from '$lib/stores/grid.svelte';

	let cols = $derived(gridStore.cols);
	let gap = $derived(gridStore.gap);
	let cellCount = $derived(gridStore.cells.length);
</script>

<div class="terminal-box space-y-6 p-4">
	<!-- Section Header -->
	<div class="flex items-center gap-2">
		<span class="text-terminal-green">></span>
		<span class="font-bold text-terminal-amber">GRID_CONFIG</span>
		<span class="text-xs text-terminal-dim">// adjust parameters</span>
	</div>

	<!-- Grid Settings -->
	<div class="space-y-3">
		<Slider label="cols" bind:value={cols} min={2} max={6} onchange={(v) => gridStore.setCols(v)} />
		<Slider label="gap" bind:value={gap} min={0} max={8} onchange={(v) => gridStore.setGap(v)} />
	</div>

	<!-- Cell Count Controls -->
	<div class="flex items-center gap-3">
		<span class="w-16 shrink-0 text-sm text-terminal-dim">cells:</span>
		<button
			onclick={() => gridStore.removeLastCell()}
			disabled={cellCount <= 1}
			class="text-terminal-green transition-colors hover:text-terminal-amber disabled:cursor-not-allowed disabled:text-terminal-border"
		>
			[-]
		</button>
		<span class="flex-1 text-center font-bold text-terminal-green">{cellCount}</span>
		<button
			onclick={() => gridStore.addCell()}
			disabled={cellCount >= 12}
			class="text-terminal-green transition-colors hover:text-terminal-amber disabled:cursor-not-allowed disabled:text-terminal-border"
		>
			[+]
		</button>
	</div>

	<!-- Divider -->
	<div class="border-t border-terminal-border"></div>

	<!-- Presets Section -->
	<div class="space-y-3">
		<div class="flex items-center gap-2">
			<span class="text-terminal-green">></span>
			<span class="font-bold text-terminal-amber">PRESETS</span>
			<span class="text-xs text-terminal-dim">// quick layouts</span>
		</div>

		<div class="grid grid-cols-1 gap-2">
			{#each presets as preset}
				<button
					onclick={() => gridStore.applyPreset(preset)}
					class="group border border-terminal-border px-3 py-2 text-left transition-all hover:border-terminal-green hover:bg-terminal-green/5"
				>
					<div class="flex items-center justify-between">
						<span class="text-terminal-text transition-colors group-hover:text-terminal-green">
							{preset.name}
						</span>
						<span class="text-xs text-terminal-dim">
							{preset.cols}x{preset.cells.length}
						</span>
					</div>
					<div class="mt-0.5 text-xs text-terminal-dim">
						{preset.description}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Divider -->
	<div class="border-t border-terminal-border"></div>

	<!-- Reset Button -->
	<button
		onclick={() => gridStore.reset()}
		class="w-full border border-terminal-red/50 px-3 py-2 text-sm text-terminal-red transition-all hover:border-terminal-red hover:bg-terminal-red/10"
	>
		[ RESET ]
	</button>
</div>
