import { expect, it } from "vitest";
import { createE2EClient, describeE2E } from "./helpers.ts";

describeE2E("Subscriptions (e2e)", () => {
	const client = createE2EClient();

	it("lists subscriptions", async () => {
		const subscriptions = await client.subscriptions.list();
		expect(Array.isArray(subscriptions)).toBe(true);
	});

	it("gets a subscription by ID", async () => {
		const subscription = await client.subscriptions.get("sub-1");
		expect(typeof subscription).toBe("object");
	});

	it("deletes a subscription", async () => {
		await client.subscriptions.delete("sub-1");
		expect(true).toBe(true);
	});

	it("disables a subscription", async () => {
		const result = await client.subscriptions.disable("sub-1");
		expect(typeof result).toBe("object");
	});

	it("enables a subscription", async () => {
		const result = await client.subscriptions.enable("sub-1");
		expect(typeof result).toBe("object");
	});

	it("gets subscription communication log", async () => {
		const log = await client.subscriptions.getLog("sub-1");
		expect(Array.isArray(log)).toBe(true);
	});
});
