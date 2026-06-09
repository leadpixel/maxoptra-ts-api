import { expect, it } from "vitest";
import { createE2EClient, describeE2E } from "./helpers.ts";

describeE2E("Vehicles (e2e)", () => {
	const client = createE2EClient();

	it("gets a vehicle", async () => {
		const vehicle = await client.vehicles.get("V-1");
		expect(typeof vehicle).toBe("object");
	});

	it("deletes a vehicle", async () => {
		await client.vehicles.delete("V-1");
		expect(true).toBe(true);
	});

	it("lists vehicles", async () => {
		const result = await client.vehicles.list();
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("lists vehicles with params", async () => {
		const result = await client.vehicles.list({ active: "true" });
		expect(Array.isArray(result.data)).toBe(true);
	});
});
