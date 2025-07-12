import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
	manifest: {
		name: "dアニメストア Plus",
		description: "dアニメストアをもっと便利にします。",
		permissions: ["storage"],
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
