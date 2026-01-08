<script lang="ts">
	import { onMount } from 'svelte';
	import AsciiHeader from '$lib/components/AsciiHeader.svelte';
	import ControlPanel from '$lib/components/ControlPanel.svelte';
	import CellEditor from '$lib/components/CellEditor.svelte';
	import GridPreview from '$lib/components/GridPreview.svelte';
	import CodeOutput from '$lib/components/CodeOutput.svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';

	// Boot sequence state
	let bootPhase = $state(0);
	let booted = $state(false);

	const bootMessages = [
		'Initializing system...',
		'Loading grid engine...',
		'Configuring terminal interface...',
		'Ready.'
	];

	onMount(() => {
		const interval = setInterval(() => {
			if (bootPhase < bootMessages.length - 1) {
				bootPhase++;
			} else {
				clearInterval(interval);
				setTimeout(() => {
					booted = true;
				}, 400);
			}
		}, 300);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>BentoGridThing - Terminal Grid Builder</title>
</svelte:head>

{#if !booted}
	<!-- Boot Sequence -->
	<div class="flex min-h-screen items-center justify-center bg-terminal-bg p-8">
		<div class="w-full max-w-xl space-y-4">
			<pre class="crt-glow text-xs text-terminal-green">
 ____             _         ____      _     _ _____ _     _             
| __ )  ___ _ __ | |_ ___  / ___|_ __(_) __| |_   _| |__ (_)_ __   __ _ 
|  _ \ / _ \ '_ \| __/ _ \| |  _| '__| |/ _` | | | | '_ \| | '_ \ / _` |
| |_) |  __/ | | | || (_) | |_| | |  | | (_| | | | | | | | | | | | (_| |
|____/ \___|_| |_|\__\___/ \____|_|  |_|\__,_| |_| |_| |_|_|_| |_|\__, |
                                                                  |___/ </pre>

			<div class="space-y-1 text-sm">
				{#each bootMessages as message, i}
					{#if i <= bootPhase}
						<div class="fade-in flex items-center gap-2">
							<span class="text-terminal-green">[{i < bootPhase ? 'OK' : '..'}]</span>
							<span class={i < bootPhase ? 'text-terminal-dim' : 'text-terminal-text'}>
								{message}
							</span>
							{#if i === bootPhase && bootPhase < bootMessages.length - 1}
								<span class="cursor-blink text-terminal-green">_</span>
							{/if}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{:else}
	<!-- Main Application -->
	<div class="flex min-h-screen flex-col bg-terminal-bg">
		<!-- Header -->
		<header class="border-b border-terminal-border p-4">
			<AsciiHeader />
		</header>

		<!-- Main Content -->
		<main class="grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-12">
			<!-- Left Panel: Controls -->
			<aside class="space-y-4 overflow-y-auto lg:col-span-3">
				<ControlPanel />
				<CellEditor />
			</aside>

			<!-- Center Panel: Preview -->
			<section class="min-h-[400px] lg:col-span-5">
				<GridPreview />
			</section>

			<!-- Right Panel: Code Output -->
			<aside class="min-h-[400px] lg:col-span-4">
				<CodeOutput />
			</aside>
		</main>

		<!-- Status Bar -->
		<StatusBar />
	</div>
{/if}
