import { beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "./helpers.ts";

beforeEach(() => {
	vi.spyOn(globalThis, "fetch").mockReset();
});

describe("MaxoptraClient", () => {
	it("instantiates with an API key", () => {
		const client = createClient();
		expect(client).toBeDefined();
	});

	it("instantiates with custom baseUrl", () => {
		const client = createClient({
			baseUrl: "https://custom.example.com/api/v6",
		});
		expect(client).toBeDefined();
	});

	it("strips trailing slash from baseUrl", () => {
		const client = createClient({ baseUrl: "https://example.com/api/v6/" });
		expect(client).toBeDefined();
	});

	it("uses default baseUrl when not provided", () => {
		const client = createClient();
		expect(client).toBeDefined();
	});

	it("exposes all API sub-clients", () => {
		const client = createClient();
		expect(client.subscriptions).toBeDefined();
		expect(client.orders).toBeDefined();
		expect(client.drivers).toBeDefined();
		expect(client.vehicles).toBeDefined();
		expect(client.async).toBeDefined();
		expect(client.locations).toBeDefined();
		expect(client.distributionCentres).toBeDefined();
		expect(client.runs).toBeDefined();
		expect(client.schedule).toBeDefined();
	});

	describe("request", () => {
		it("throws on non-ok response", async () => {
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: async () => ({ message: "Invalid request" }),
			} as unknown as Response);
			const client = createClient();
			await expect(client.request("/test")).rejects.toThrow(
				"Maxoptra API error [400]: Invalid request",
			);
		});

		it("throws with statusText when no error message", async () => {
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: async () => {
					throw new Error("no json");
				},
			} as unknown as Response);
			const client = createClient();
			await expect(client.request("/test")).rejects.toThrow(
				"Maxoptra API error [500]: Internal Server Error",
			);
		});

		it("falls back to statusText when error message is missing", async () => {
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: async () => ({}),
			} as unknown as Response);
			const client = createClient();
			await expect(client.request("/test")).rejects.toThrow(
				"Maxoptra API error [400]: Bad Request",
			);
		});

		it("handles 204 No Content", async () => {
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: true,
				status: 204,
				text: async () => "",
			} as unknown as Response);
			const client = createClient();
			const result = await client.request("/test");
			expect(result).toEqual({});
		});

		it("handles empty response body", async () => {
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => "",
			} as unknown as Response);
			const client = createClient();
			const result = await client.request("/test");
			expect(result).toEqual({});
		});

		it("returns response as-is when no schema is provided", async () => {
			const responseData = { data: { items: ["a", "b"] } };
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => JSON.stringify(responseData),
			} as unknown as Response);
			const client = createClient();
			const result = await client.request("/test");
			expect(result).toEqual(responseData);
		});

		it("returns raw response when no data wrapper", async () => {
			const responseData = { id: "abc", name: "test" };
			vi.mocked(globalThis.fetch).mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => JSON.stringify(responseData),
			} as unknown as Response);
			const client = createClient();
			const result = await client.request("/test");
			expect(result).toEqual(responseData);
		});
	});
});
