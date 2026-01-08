<script lang="ts">
	let { compact = false }: { compact?: boolean } = $props();
</script>

{#if compact}
	<div class="font-bold text-terminal-green">
		<span class="crt-glow">[ BentoGridThing ]</span>
		<span class="ml-2 text-xs text-terminal-dim">v0.1.0</span>
	</div>
{:else}
	<pre class="crt-glow text-xs leading-tight text-terminal-green select-none">
 ____             _         ____      _     _ _____ _     _             
| __ )  ___ _ __ | |_ ___  / ___|_ __(_) __| |_   _| |__ (_)_ __   __ _ 
|  _ \ / _ \ '_ \| __/ _ \| |  _| '__| |/ _` | | | | '_ \| | '_ \ / _` |
| |_) |  __/ | | | || (_) | |_| | |  | | (_| | | | | | | | | | | | (_| |
|____/ \___|_| |_|\__\___/ \____|_|  |_|\__,_| |_| |_| |_|_|_| |_|\__, |
                                                                  |___/ </pre>
	<div class="mt-1 text-xs text-terminal-dim">
		<span class="text-terminal-amber">$</span> Terminal-style bento grid builder for developers
	</div>
{/if}
