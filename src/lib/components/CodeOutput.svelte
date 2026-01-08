<script lang="ts">
	import { gridStore } from '$lib/stores/grid.svelte';
	import { generateCode, tokenizeCode } from '$lib/utils/generateCode';

	let includeComments = $state(false);
	let includePlaceholder = $state(true);
	let copied = $state(false);

	let code = $derived(
		generateCode({
			cols: gridStore.cols,
			gap: gridStore.gap,
			cells: gridStore.cells,
			includeComments,
			includePlaceholder
		})
	);

	let tokens = $derived(tokenizeCode(code));

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Token type to color class mapping
	function getTokenClass(type: string): string {
		switch (type) {
			case 'tag':
				return 'text-terminal-cyan';
			case 'attr':
				return 'text-terminal-amber';
			case 'string':
				return 'text-terminal-green';
			case 'comment':
				return 'text-terminal-dim italic';
			case 'punctuation':
				return 'text-terminal-dim';
			default:
				return 'text-terminal-text';
		}
	}
</script>

<div class="terminal-box flex h-full flex-col p-4">
	<!-- Section Header -->
	<div class="mb-4 flex items-center gap-2">
		<span class="text-terminal-green">></span>
		<span class="font-bold text-terminal-amber">OUTPUT</span>
		<span class="text-xs text-terminal-dim">// generated code</span>

		<div class="ml-auto flex items-center gap-4">
			<!-- Options -->
			<label class="group flex cursor-pointer items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={includeComments} class="peer sr-only" />
				<span class="text-terminal-border transition-colors peer-checked:text-terminal-green">
					[{includeComments ? 'x' : ' '}]
				</span>
				<span class="text-terminal-dim transition-colors group-hover:text-terminal-text">
					comments
				</span>
			</label>

			<label class="group flex cursor-pointer items-center gap-2 text-xs">
				<input type="checkbox" bind:checked={includePlaceholder} class="peer sr-only" />
				<span class="text-terminal-border transition-colors peer-checked:text-terminal-green">
					[{includePlaceholder ? 'x' : ' '}]
				</span>
				<span class="text-terminal-dim transition-colors group-hover:text-terminal-text">
					placeholder
				</span>
			</label>
		</div>
	</div>

	<!-- Code Display -->
	<div class="relative min-h-0 flex-1">
		<div
			class="absolute inset-0 overflow-auto rounded bg-terminal-bg/50 p-4 font-mono text-sm leading-relaxed"
		>
			<pre class="break-all whitespace-pre-wrap">{#each tokens as token}<span
						class={getTokenClass(token.type)}>{token.value}</span
					>{/each}</pre>
		</div>
	</div>

	<!-- Copy Button -->
	<div class="mt-4 flex items-center justify-between">
		<div class="text-xs text-terminal-dim">
			{code.length} characters
		</div>
		<button
			onclick={copyToClipboard}
			class="
				border px-4
				py-2 text-sm
				font-bold transition-all
				{copied
				? 'border-terminal-green bg-terminal-green/20 text-terminal-green'
				: 'border-terminal-green text-terminal-green hover:bg-terminal-green/10'}
			"
		>
			{#if copied}
				<span class="flex items-center gap-2">
					<span>[OK]</span>
					<span>COPIED!</span>
				</span>
			{:else}
				<span class="flex items-center gap-2">
					<span>[^C]</span>
					<span>COPY</span>
				</span>
			{/if}
		</button>
	</div>
</div>
