import { describe, expect, it, vi } from "vitest";
import { DriversApi } from "../../../src/resources/drivers.ts";
import { DriversListSchema } from "../../../src/schemas.ts";

describe("DriversApi", () => {
	function createApi() {
		const client = { request: vi.fn() };
		// biome-ignore lint/suspicious/noExplicitAny: mock client
		return { api: new DriversApi(client as any), request: client.request };
	}

	describe("list", () => {
		it("calls request with /drivers and no params", async () => {
			const { api, request } = createApi();
			await api.list();
			expect(request).toHaveBeenCalledWith("/drivers", {}, DriversListSchema);
		});

		it("appends query string from params", async () => {
			const { api, request } = createApi();
			await api.list({ name: "John", active: "true" });
			expect(request).toHaveBeenCalledWith("/drivers?name=John&active=true", {}, DriversListSchema);
		});

		it("skips undefined values", async () => {
			const { api, request } = createApi();
			// biome-ignore lint/suspicious/noExplicitAny: testing undefined skip
			await api.list({ name: "John", email: undefined as any });
			expect(request).toHaveBeenCalledWith("/drivers?name=John", {}, DriversListSchema);
		});

		it("omits query string when params is empty", async () => {
			const { api, request } = createApi();
			await api.list({});
			expect(request).toHaveBeenCalledWith("/drivers", {}, DriversListSchema);
		});
	});
});
