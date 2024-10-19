import { SECRET_CODE } from "$env/static/private"

export async function POST({ request }) {
	const { accessCode } = await request.json()

	const secretCode = SECRET_CODE
	if (accessCode === secretCode) {
		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} else {
		return new Response(JSON.stringify({ success: false }), {
			status: 403,
			headers: {
				"Content-Type": "application/json",
			},
		})
	}
}
