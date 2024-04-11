<script lang="ts">
    import { Avatar } from "@skeletonlabs/skeleton";

    // Types
	interface Person {
		id: number;
		avatar: number;
		name: string;
	}
	interface MessageFeed {
		id: number;
		host: boolean;
		avatar: number;
		name: string;
		timestamp: string;
		message: string;
		color: string;
	}

    // For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
	}

	async function getAIResponse(currentMessage: string) {
		// We call fetch to the api/chat endpoint
		const formData = new FormData();
		formData.append('message', currentMessage);
		formData.append('history', messageFeed.join('\n'));
		const response = await fetch('/api/chat', { 
			method: 'POST', 
			body: formData
		});
		const data = await response.json();
		console.log(data);

		const newMessage = {
			id: messageFeed.length,
			host: false,
			avatar: 14,
			name: 'Helpfull AI Assistant',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: data.message,
			color: 'variant-soft-primary'
		};
		messageFeed = [...messageFeed, newMessage];

		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	async function addMessage() {
		getAIResponse(currentMessage)
		const newMessage = {
			id: messageFeed.length,
			host: true,
			avatar: 48,
			name: 'Jane',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: currentMessage,
			color: 'variant-soft-primary'
		};
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
		// Clear prompt
		currentMessage = '';
		// Smooth scroll to bottom
		// Timeout prevents race condition
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

    function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addMessage();
		}
	}

    // Chat HTML Element
    let elemChat: HTMLElement;

	// Navigation List
	const people: Person[] = [
		{ id: 0, avatar: 14, name: 'Michael' },
		{ id: 1, avatar: 40, name: 'Janet' },
	];

	// Messages
	let messageFeed: MessageFeed[] = [
		{
			id: 0,
			host: false,
			avatar: 14,
			name: 'Helpfull AI Assistant',
			timestamp: `Today @ ${getCurrentTimestamp()}`,
			message: "Hello, how can I help you?",
			color: 'variant-soft-primary'
		},
	];
	let currentMessage = '';

</script>

<section class="card m-auto mt-8 w-5/6">
    <div class="chat w-full h-full">
        <!-- Chat -->
        <div class="grid grid-row-[1fr_auto]">
            <!-- Conversation -->
            <section bind:this={elemChat} class="min-h-[500px] max-h-[750px] p-4 overflow-y-auto space-y-4">
                {#each messageFeed as bubble}
                    {#if bubble.host === true}
                        <div class="grid grid-cols-[auto_1fr] gap-2">
                            <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
                            <div class="card p-4 variant-soft rounded-tl-none space-y-2">
                                <header class="flex justify-between items-center">
                                    <p class="font-bold">{bubble.name}</p>
                                    <small class="opacity-50">{bubble.timestamp}</small>
                                </header>
                                <p>{bubble.message}</p>
                            </div>
                        </div>
                    {:else}
                        <div class="grid grid-cols-[1fr_auto] gap-2">
                            <div class="card p-4 rounded-tr-none space-y-2 {bubble.color}">
                                <header class="flex justify-between items-center">
                                    <p class="font-bold">{bubble.name}</p>
                                    <small class="opacity-50">{bubble.timestamp}</small>
                                </header>
                                <p>{bubble.message}</p>
                            </div>
                            <Avatar src="https://i.pravatar.cc/?img={bubble.avatar}" width="w-12" />
                        </div>
                    {/if}
                {/each}
            </section>
            <!-- Prompt -->
            <section class="border-t border-surface-500/30 p-4">
                <div class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token">
                    <button class="input-group-shim">+</button>
                    <textarea
                        bind:value={currentMessage}
                        class="bg-transparent border-0 ring-0"
                        name="prompt"
                        id="prompt"
                        placeholder="Write a message..."
                        rows="1"
                        on:keydown={onPromptKeydown}
                    />
                    <button class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'} on:click={addMessage}>
                        <i class="fa-solid fa-paper-plane" />
                    </button>
                </div>
            </section>
        </div>
    </div>
</section>
