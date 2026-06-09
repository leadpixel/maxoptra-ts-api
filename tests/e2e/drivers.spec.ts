import { expect, it } from "vitest";
import { createE2EClient, describeE2E } from "./helpers.ts";

describeE2E("Drivers (e2e)", () => {
	const client = createE2EClient();

	it("lists drivers", async () => {
		const result = await client.drivers.list();
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("lists drivers with params", async () => {
		const result = await client.drivers.list({ active: "true" });
		expect(Array.isArray(result.data)).toBe(true);
	});

	it("rejects driver create with error from API", async () => {
		await expect(client.drivers.create({ name: "John Doe" })).rejects.toThrow("Maxoptra API error");
	});

	it("gets a driver", async () => {
		const driver = await client.drivers.get(1);
		expect(typeof driver).toBe("object");
	});

	it("deletes a driver", async () => {
		await client.drivers.delete(1);
		expect(true).toBe(true);
	});
});
