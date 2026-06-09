import { describe, expect, it } from "vitest";
import { MaxoptraClient } from "../../src/index.ts";

const apiKey = process.env.MAXOPTRA_API_KEY?.trim();
const baseUrl = process.env.MAXOPTRA_BASE_URL?.trim();

describe.runIf(apiKey)("Maxoptra Live Integration (Read-only)", () => {
	const client = new MaxoptraClient({
		apiKey: apiKey ?? "",
		baseUrl: baseUrl,
	});

	it("can list drivers", async () => {
		const result = await client.drivers.list();
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("can list vehicles", async () => {
		const result = await client.vehicles.list();
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("can list locations", async () => {
		const result = await client.locations.list();
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("can list orders", async () => {
		const result = await client.orders.list({ status: "open" });
		expect(result).toBeDefined();
		expect(Array.isArray(result.data)).toBe(true);
	});
});
