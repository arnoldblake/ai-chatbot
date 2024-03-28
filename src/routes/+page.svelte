<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { onMount } from 'svelte';

	const words = ['Tell me a story.', 'Tell me a joke.'];
	let i: number = 0,
		j: number = 0;
	let currentWord: string = '';
	let isDeleting: boolean = false;
	let done = false;

	function type() {
		currentWord = words[i];
		const typewriter: HTMLElement | null = document.getElementById('typewriter');
		if (isDeleting && typewriter && !done) {
			typewriter.textContent = currentWord.substring(0, --j);
			if (j == 0) {
				isDeleting = false;
				if (++i == words.length) {
					i = 0;
				}
			}
		} else if (typewriter) {
			typewriter.textContent = currentWord.substring(0, ++j);
			if (j == currentWord.length) {
				isDeleting = true;
			}
		}
		setTimeout(type, Math.random() * 200 + 60);
	}

	onMount(() => {
		type();
	});
</script>

<section class="grid h-full grid-flow-col">
	<div class="variant-gradient-primary-secondary bg-gradient-to-br">
		<div class="m-auto flex h-full w-1/2 flex-col items-center justify-center">
			<h2>AI can help you:</h2>
			<h2 id="typewriter">Tell me a story.</h2>
		</div>
	</div>
	<div class="m-auto justify-center">
		<SignIn>
			<div class="variant-soft-primary btn" slot="submitButton">Sign in</div>
		</SignIn>
	</div>
</section>
