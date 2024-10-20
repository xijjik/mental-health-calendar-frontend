<script lang="ts">
	import type { Event } from "$lib/types/index"
	import Calendar from "$lib/components/calendar.svelte"

	//data.data.sort((a, b) => a.date.getTime() - b.date.getTime())

	let accessCode = ""
	let correctAccess = false
	let errorMessage = ""

	let eventData: Event[] = []

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

			try {
				const eventsResponse = await fetch("http://localhost:8080/events")
				if (!eventsResponse.ok) {
					throw new Error(`HTTP error! status: ${eventsResponse.status}`)
				}
				const eventsData = await eventsResponse.json()

				eventData = eventsData.map((event: Event) => ({
					...event,
					date: new Date(event.date),
				}))
				console.log(eventData)
			} catch (error) {
				console.error("Failed to fetch events:", error)
				errorMessage = "Failed to load events. Please try again."
				correctAccess = false
			}
		} else {
			errorMessage = "Access denied. Incorrect code."
		}
	}
</script>

<section class="py-10">
	<div class="inner">
		{#if !correctAccess}
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
		{/if}

		{#if correctAccess}
			<Calendar events={eventData} />
		{/if}
	</div>
</section>
