<script lang="ts">
	import type { Event } from "$lib/types/index"
	import Calendar from "$lib/components/calendar.svelte"

	export let data: { events: Event[] }
	let events: Event[] = data.events

	console.log(events)

	let accessCode = ""
	let correctAccess = false
	let errorMessage = ""

	async function handleCodeSubmit() {
		const response = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ accessCode }),
		})

		const data = await response.json()
		if (data.success) {
			correctAccess = true
			errorMessage = ""
		} else {
			errorMessage = "Access denied. Incorrect code."
		}
	}
</script>

<section class="py-10 bg-bg-gothic h-screen">
	<div class="inner">
		{#if !correctAccess}
			<div class="max-w-lg mx-auto bg-white p-4 rounded-lg">
				<div class="">
					<h1 class="text-2xl font-bold mb-4">Enter Access Code</h1>
					<input
						type="password"
						bind:value={accessCode}
						placeholder="Access Code"
						class="w-full p-2 border border-gray-300 rounded mb-4"
					/>
				</div>
				<button
					class="w-full p-2 bg-black text-white rounded"
					on:click={handleCodeSubmit}>Submit Code</button
				>
				{#if errorMessage}
					<p style="color: red;">{errorMessage}</p>
				{/if}
			</div>
		{/if}

		{#if correctAccess}
			<Calendar {events} />
		{/if}
	</div>
</section>
