import { describe, expect, it, vi } from "vitest";
import { VehiclesApi } from "../../../src/resources/vehicles.ts";
import { VehiclesListSchema } from "../../../src/schemas.ts";

describe("VehiclesApi", () => {
	function createApi() {
		const client = { request: vi.fn() };
		// biome-ignore lint/suspicious/noExplicitAny: mock client
		return { api: new VehiclesApi(client as any), request: client.request };
	}

	describe("list", () => {
		it("calls request with /vehicles and no params", async () => {
			const { api, request } = createApi();
			await api.list();
			expect(request).toHaveBeenCalledWith("/vehicles", {}, VehiclesListSchema);
		});

		it("appends query string from params", async () => {
			const { api, request } = createApi();
			await api.list({ active: "true" });
			expect(request).toHaveBeenCalledWith("/vehicles?active=true", {}, VehiclesListSchema);
		});

		it("skips undefined values", async () => {
			const { api, request } = createApi();
			// biome-ignore lint/suspicious/noExplicitAny: testing undefined skip
			await api.list({ active: "true", type: undefined as any });
			expect(request).toHaveBeenCalledWith("/vehicles?active=true", {}, VehiclesListSchema);
		});

		it("omits query string when params is empty", async () => {
			const { api, request } = createApi();
			await api.list({});
			expect(request).toHaveBeenCalledWith("/vehicles", {}, VehiclesListSchema);
		});
	});
});
