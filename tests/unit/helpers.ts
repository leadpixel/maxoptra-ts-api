import type { MaxoptraConfig } from "../../src/client.ts";
import { MaxoptraClient } from "../../src/client.ts";

export function createClient(config?: Partial<MaxoptraConfig>) {
	return new MaxoptraClient({ apiKey: "test-key", ...config });
}
