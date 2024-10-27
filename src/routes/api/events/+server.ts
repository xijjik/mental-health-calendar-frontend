import { sql } from "@vercel/postgres"
import { json, type RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request }) => {
	const { date, content, mood } = await request.json()

	try {
		await sql`
            INSERT INTO events (date, content, mood)
            VALUES (${date}, ${content}, ${mood})
        `

		return json({ success: true, message: "Event added successfully" })
	} catch (error) {
		console.error("Error inserting event:", error)
		return json(
			{ success: false, message: "Failed to add event" },
			{ status: 500 }
		)
	}
}
