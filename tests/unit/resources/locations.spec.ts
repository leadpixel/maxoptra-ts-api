import { describe, expect, it, vi } from "vitest";
import { LocationsApi } from "../../../src/resources/locations.ts";
import { LocationsListSchema } from "../../../src/schemas.ts";

describe("LocationsApi", () => {
	function createApi() {
		const client = { request: vi.fn() };
		// biome-ignore lint/suspicious/noExplicitAny: mock client
		return { api: new LocationsApi(client as any), request: client.request };
	}

	describe("list", () => {
		it("calls request with /locations and no params", async () => {
			const { api, request } = createApi();
			await api.list();
			expect(request).toHaveBeenCalledWith("/locations", {}, LocationsListSchema);
		});

		it("appends query string from params", async () => {
			const { api, request } = createApi();
			await api.list({ name: "Warehouse" });
			expect(request).toHaveBeenCalledWith("/locations?name=Warehouse", {}, LocationsListSchema);
		});

		it("skips undefined values", async () => {
			const { api, request } = createApi();
			// biome-ignore lint/suspicious/noExplicitAny: testing undefined skip
			await api.list({ name: "Warehouse", region: undefined as any });
			expect(request).toHaveBeenCalledWith("/locations?name=Warehouse", {}, LocationsListSchema);
		});

		it("omits query string when params is empty", async () => {
			const { api, request } = createApi();
			await api.list({});
			expect(request).toHaveBeenCalledWith("/locations", {}, LocationsListSchema);
		});
	});
});
