<script lang="ts">
	export let data: { data: Event[] }

	import type { Event } from "$lib/types/index"
	import Calendar from "$lib/components/calendar.svelte"

	console.log(data.data)

	//data.data.sort((a, b) => a.date.getTime() - b.date.getTime())

	let accessCode = ""
	let correctAccess = false
	let eventTitle = ""
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
		} else {
			errorMessage = "Access denied. Incorrect code."
		}
	}

	async function addEvent() {
		if (!correctAccess) {
			errorMessage = "You must enter the correct access code first!"
			return
		}

		console.log("Event added:", eventTitle)
		alert(`Event "${eventTitle}" added successfully!`)
		eventTitle = "" // Clear input
	}
</script>

<section class="py-10">
	<div class="inner">
		<!-- {#if !correctAccess}
			<div class="max-w-lg mx-auto">
				<div>
					<h1 class="text-2xl font-bold mb-4">Enter Access Code</h1>
					<input
						type="password"
						bind:value={accessCode}
						placeholder="Access Code"
						class="w-full p-2 border border-gray-300 rounded mb-4"
					/>
				</div>
				<button
					class="w-full p-2 bg-blue-500 text-white rounded"
					on:click={handleCodeSubmit}>Submit Code</button
				>
				{#if errorMessage}
					<p style="color: red;">{errorMessage}</p>
				{/if}
			</div>
		{/if} -->

		{#if !correctAccess}
			<Calendar events={data.data} />
		{/if}
	</div>
</section>
