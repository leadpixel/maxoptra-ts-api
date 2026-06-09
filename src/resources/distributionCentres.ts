import type { MaxoptraClient } from "../client.ts";
import { type DistributionCentresList, DistributionCentresListSchema } from "../schemas.ts";

export class DistributionCentresApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async list(params?: Record<string, string>): Promise<DistributionCentresList> {
		const searchParams = new URLSearchParams();
		if (params) {
			for (const [key, value] of Object.entries(params)) {
				if (value !== undefined) {
					searchParams.append(key, String(value));
				}
			}
		}
		const queryString = searchParams.toString();
		return this.client.request(
			`/distributionCentres${queryString ? `?${queryString}` : ""}`,
			{},
			DistributionCentresListSchema,
		);
	}
}
