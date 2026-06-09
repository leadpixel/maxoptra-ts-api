import { describe } from "vitest";
import type { SubscriptionCreateRequest } from "../../src/deno-types.js";
import { MaxoptraClient } from "../../src/index.js";

const MOCK_BASE_URL = "https://stoplight.io/mocks/maxoptra/api-v6-documentation/13517567";

const describeE2E = describe.runIf(process.env.E2E);

export { describeE2E, MOCK_BASE_URL };

export function createE2EClient() {
	return new MaxoptraClient({
		apiKey: "mock-api-key",
		baseUrl: MOCK_BASE_URL,
	});
}

export const createSubscriptionData: SubscriptionCreateRequest = {
	event: "job_status_change",
	url: "https://example.com/webhook",
};
