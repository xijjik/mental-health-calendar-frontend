import type { Event } from "$lib/types/index"

export async function load({ fetch }) {
	try {
		const res = await fetch("http://localhost:8080/events")

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`)
		}

		const data = await res.json()

		const eventsWithDateObjects = data.map((event: Event) => ({
			...event,
			date: new Date(event.date),
		}))

		return {
			data: eventsWithDateObjects,
		}
	} catch (error) {
		console.error("Failed to fetch events:", error)
		return {
			data: [],
		}
	}
}
