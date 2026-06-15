import { describe, expect, it } from "vitest";
import { SubscriptionSchema } from "../../../src/schemas.ts";

describe("SubscriptionSchema", () => {
	it("accepts null for filterStatus and filterRunStatus", () => {
		const data = {
			reference: "sub-1",
			event: "order.created",
			url: "https://example.com/webhook",
			filterStatus: null,
			filterRunStatus: null,
			enabled: true,
		};
		const result = SubscriptionSchema.safeParse(data);
		expect(result.success).toBe(true);
	});

	it("accepts missing filterStatus and filterRunStatus", () => {
		const data = {
			reference: "sub-1",
			event: "order.created",
			url: "https://example.com/webhook",
			enabled: true,
		};
		const result = SubscriptionSchema.safeParse(data);
		expect(result.success).toBe(true);
	});
});

import { SubscriptionUpdateSchema } from "../../../src/schemas.ts";

describe("SubscriptionUpdateSchema", () => {
	it("accepts null for status and other optional fields", () => {
		const data = {
			status: null,
			enabled: null,
			event: null,
		};
		const result = SubscriptionUpdateSchema.safeParse(data);
		expect(result.success).toBe(true);
	});
});
