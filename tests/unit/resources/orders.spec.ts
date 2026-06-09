import { describe, expect, it, vi } from "vitest";
import { OrdersApi } from "../../../src/resources/orders.ts";
import { PaginatedOrdersSchema } from "../../../src/schemas.ts";

describe("OrdersApi", () => {
	function createApi() {
		const client = { request: vi.fn() };
		// biome-ignore lint/suspicious/noExplicitAny: mock client
		return { api: new OrdersApi(client as any), request: client.request };
	}

	describe("list", () => {
		it("calls request with /orders and no params", async () => {
			const { api, request } = createApi();
			await api.list();
			expect(request).toHaveBeenCalledWith("/orders", {}, PaginatedOrdersSchema);
		});

		it("appends query string from params", async () => {
			const { api, request } = createApi();
			await api.list({ orderDate: "2026-06-05" });
			expect(request).toHaveBeenCalledWith(
				"/orders?orderDate=2026-06-05",
				{},
				PaginatedOrdersSchema,
			);
		});

		it("skips undefined values", async () => {
			const { api, request } = createApi();
			// biome-ignore lint/suspicious/noExplicitAny: testing undefined skip
			await api.list({ orderDate: "2026-06-05", status: undefined as any });
			expect(request).toHaveBeenCalledWith(
				"/orders?orderDate=2026-06-05",
				{},
				PaginatedOrdersSchema,
			);
		});

		it("omits query string when params is empty", async () => {
			const { api, request } = createApi();
			await api.list({});
			expect(request).toHaveBeenCalledWith("/orders", {}, PaginatedOrdersSchema);
		});
	});
});
