import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["tests/**/*.spec.ts"],
		pool: "forks",
		coverage: {
			provider: "v8",
			include: ["src/**/*.ts"],
			exclude: ["src/index.ts"],
			reporter: ["text", "lcov"],
		},
	},
});
