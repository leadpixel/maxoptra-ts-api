import { expect, it } from "vitest";
import { createE2EClient, describeE2E } from "./helpers.ts";

describeE2E("Orders (e2e)", () => {
	const client = createE2EClient();

	it("creates an order", async () => {
		const order = await client.orders.create({
			referenceNumber: "ORD-123",
			distributionCentreReference: "DC-1",
			orderDate: "2026-06-05",
			customerLocation: {
				referenceNumber: "LOC-1",
				address: "123 Test St",
			},
		});
		expect(typeof order).toBe("object");
	});

	it("gets an order", async () => {
		const order = await client.orders.get("ORD-123");
		expect(typeof order).toBe("object");
	});

	it("deletes an order", async () => {
		await client.orders.delete("ORD-123");
		expect(true).toBe(true);
	});

	it("lists orders", async () => {
		const response = await client.orders.list({ orderDate: "2026-06-05" });
		expect(Array.isArray(response.data)).toBe(true);
	});

	it("lists orders without params", async () => {
		const response = await client.orders.list();
		expect(Array.isArray(response.data)).toBe(true);
	});

	it("gets POD for an order", async () => {
		const pod = await client.orders.getPOD("ORD-123");
		expect(typeof pod).toBe("object");
	});

	it("gets tracking info for an order", async () => {
		const tracking = await client.orders.getTrackingInfo("ORD-123");
		expect(typeof tracking).toBe("object");
	});
});
