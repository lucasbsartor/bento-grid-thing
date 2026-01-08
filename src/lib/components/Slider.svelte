<script lang="ts">
	interface Props {
		label: string;
		value: number;
		min?: number;
		max?: number;
		onchange?: (value: number) => void;
	}

	let { label, value = $bindable(), min = 0, max = 10, onchange }: Props = $props();

	// Calculate the visual representation
	const totalSegments = 10;

	let filledSegments = $derived(Math.round(((value - min) / (max - min)) * totalSegments));

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		value = parseInt(target.value, 10);
		onchange?.(value);
	}

	function increment() {
		if (value < max) {
			value++;
			onchange?.(value);
		}
	}

	function decrement() {
		if (value > min) {
			value--;
			onchange?.(value);
		}
	}
</script>

<div class="group flex items-center gap-3">
	<span class="w-16 shrink-0 text-sm text-terminal-dim">{label}:</span>

	<button
		onclick={decrement}
		disabled={value <= min}
		class="text-terminal-green transition-colors hover:text-terminal-amber disabled:cursor-not-allowed disabled:text-terminal-border"
		aria-label="Decrease {label}"
	>
		[-]
	</button>

	<div class="relative flex-1">
		<!-- Visual bar representation -->
		<div class="pointer-events-none flex items-center gap-0.5 text-sm select-none">
			<span class="text-terminal-border">[</span>
			{#each Array(totalSegments) as _, i}
				<span class={i < filledSegments ? 'text-terminal-green' : 'text-terminal-border'}>
					{i < filledSegments ? '=' : '-'}
				</span>
			{/each}
			<span class="text-terminal-border">]</span>
		</div>

		<!-- Hidden range input for accessibility -->
		<input
			type="range"
			{min}
			{max}
			{value}
			oninput={handleInput}
			class="absolute inset-0 w-full cursor-pointer opacity-0"
			aria-label={label}
		/>
	</div>

	<button
		onclick={increment}
		disabled={value >= max}
		class="text-terminal-green transition-colors hover:text-terminal-amber disabled:cursor-not-allowed disabled:text-terminal-border"
		aria-label="Increase {label}"
	>
		[+]
	</button>

	<span class="w-6 text-right font-bold text-terminal-green">{value}</span>
</div>
