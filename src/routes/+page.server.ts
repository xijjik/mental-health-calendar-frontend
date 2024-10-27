import { sql } from "@vercel/postgres"

export async function load() {
	const result = await sql`SELECT * FROM events`
	return {
		events: result.rows.map((event) => ({
			...event,
			date: new Date(event.date),
		})),
	}
}
