/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			backgroundImage: {
				"bg-gothic": "url('/wallpaper-texture.png')",
			},
		},
	},
	plugins: [],
}
