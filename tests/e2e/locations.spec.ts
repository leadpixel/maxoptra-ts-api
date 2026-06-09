import { expect, it } from "vitest";
import { createE2EClient, describeE2E } from "./helpers.ts";

describeE2E("Locations (e2e)", () => {
	const client = createE2EClient();

	it("lists locations", async () => {
		const result = await client.locations.list();
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("creates a location", async () => {
		const location = await client.locations.create({
			referenceNumber: "LOC-1",
			name: "Warehouse A",
			address: "456 Industrial Rd",
		});
		expect(typeof location).toBe("object");
	});

	it("gets a location", async () => {
		const location = await client.locations.get("LOC-1");
		expect(typeof location).toBe("object");
	});

	it("deletes a location", async () => {
		await client.locations.delete("LOC-1");
		expect(true).toBe(true);
	});
});
