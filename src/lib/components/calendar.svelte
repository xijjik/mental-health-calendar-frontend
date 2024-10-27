<script lang="ts">
	export let events: Event[] = []

	import type { Event } from "$lib/types/index"
	let currentDate: Date = new Date()
	let selectedDate: Date | null = null
	let showModal: boolean = false
	let eventText: string = ""
	let mood: "good" | "bad" | "neutral" = "neutral"

	$: month = currentDate.getMonth()
	$: year = currentDate.getFullYear()

	function getDaysInMonth(month: number, year: number): number {
		return new Date(year, month + 1, 0).getDate()
	}

	function getFirstDayOfMonth(month: number, year: number): number {
		return new Date(year, month, 1).getDay()
	}

	function handleDayClick(day: number): void {
		selectedDate = new Date(year, month, day)
		showModal = true
		const selectedEvent = events.find(
			(event) => event.date.toDateString() === selectedDate!.toDateString()
		)
		if (selectedEvent) {
			eventText = selectedEvent.content
			mood = selectedEvent.mood
		} else {
			eventText = ""
			mood = "neutral"
		}
	}

	async function saveEvent(): Promise<void> {
		if (selectedDate) {
			const newEvent = { date: selectedDate, content: eventText, mood: mood }

			try {
				const response = await fetch("/api/events", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(newEvent),
				})

				if (!response.ok) {
					throw new Error("Network response was not ok")
				}

				const data = await response.json()
				console.log("Event posted successfully:", data)
				const existingEventIndex = events.findIndex(
					(event) => event.date.toDateString() === selectedDate?.toDateString()
				)

				if (existingEventIndex !== -1) {
					events[existingEventIndex] = newEvent
				} else {
					events.push(newEvent)
				}

				events = [...events]
			} catch (error) {
				console.error("Error posting event:", error)
			}

			showModal = false
			eventText = ""
			mood = "neutral"
		}
	}

	function changeMonth(delta: number): void {
		currentDate = new Date(year, month + delta, 1)
	}
</script>

<div class="max-w-4xl mx-auto p-4">
	<div class="flex justify-between items-center mb-4">
		<button
			class="px-4 py-2 bg-blue-500 text-white rounded"
			on:click={() => changeMonth(-1)}>&lt;</button
		>
		<h2 class="text-2xl font-bold">
			{currentDate.toLocaleString("default", {
				month: "long",
				year: "numeric",
			})}
		</h2>
		<button
			class="px-4 py-2 bg-blue-500 text-white rounded"
			on:click={() => changeMonth(1)}>&gt;</button
		>
	</div>

	<div class="grid grid-cols-7 gap-2">
		{#each ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as day}
			<div class="text-center font-bold p-2">{day}</div>
		{/each}

		{#each Array(getFirstDayOfMonth(month, year)) as _}
			<div class="p-2 bg-gray-100"></div>
		{/each}

		{#each Array(getDaysInMonth(month, year)) as _, i}
			{@const day = i + 1}
			{@const event = events.find(
				(event) =>
					event.date.toDateString() ===
					new Date(year, month, day).toDateString()
			)}
			<button
				class="p-2 border border-gray-200 cursor-pointer hover:bg-gray-100 relative {event?.mood ===
				'good'
					? 'bg-green-100'
					: event?.mood === 'bad'
						? 'bg-red-100'
						: event?.mood === 'neutral'
							? 'bg-yellow-100'
							: ''}"
				on:click={() => handleDayClick(day)}
			>
				{day}
				{#if event}
					<span class="absolute bottom-1 right-1 text-blue-500">•</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

{#if showModal}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
	>
		<div class="bg-white p-6 rounded-lg shadow-lg">
			<h3 class="text-lg font-bold mb-4">{selectedDate?.toDateString()}</h3>
			<div class="flex space-x-4 mb-4">
				<label class="flex items-center cursor-pointer">
					<input type="radio" bind:group={mood} value="good" class="hidden" />
					<span class="text-2xl" class:opacity-30={mood !== "good"}>😊</span>
				</label>
				<label class="flex items-center cursor-pointer">
					<input type="radio" bind:group={mood} value="bad" class="hidden" />
					<span class="text-2xl" class:opacity-30={mood !== "bad"}>☹️</span>
				</label>
				<label class="flex items-center cursor-pointer">
					<input
						type="radio"
						bind:group={mood}
						value="neutral"
						class="hidden"
					/>
					<span class="text-2xl" class:opacity-30={mood !== "neutral"}>😐</span>
				</label>
			</div>
			<textarea
				bind:value={eventText}
				placeholder="Enter event details"
				class="w-full h-32 p-2 border border-gray-300 rounded mb-4"
			></textarea>
			<div class="flex justify-end space-x-2">
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded"
					on:click={saveEvent}
				>
					Save
				</button>
				<button
					class="px-4 py-2 bg-gray-300 text-gray-700 rounded"
					on:click={() => (showModal = false)}
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
