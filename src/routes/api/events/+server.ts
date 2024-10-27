import { sql } from "@vercel/postgres"
import { json, type RequestHandler } from "@sveltejs/kit"

async function handleEvent(
	request: Request,
	isUpdate: boolean
): Promise<Response> {
	const { date, content, mood } = await request.json()

	try {
		if (isUpdate) {
			await sql`
				UPDATE events
				SET content = ${content}, mood = ${mood}
				WHERE date = ${date}
			`
		} else {
			await sql`
				INSERT INTO events (date, content, mood)
				VALUES (${date}, ${content}, ${mood})
			`
		}

		return json({
			success: true,
			message: isUpdate
				? "Event updated successfully"
				: "Event added successfully",
		})
	} catch (error) {
		console.error(`Error ${isUpdate ? "updating" : "inserting"} event:`, error)
		return json(
			{
				success: false,
				message: `Failed to ${isUpdate ? "update" : "add"} event`,
			},
			{ status: 500 }
		)
	}
}

export const POST: RequestHandler = async ({ request }) =>
	handleEvent(request, false)
export const PUT: RequestHandler = async ({ request }) =>
	handleEvent(request, true)
