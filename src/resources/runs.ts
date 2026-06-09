import type { MaxoptraClient } from "../client.ts";
import { type RunLoadingInfo, RunLoadingInfoSchema } from "../schemas.ts";

export class RunsApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async lock(runReference: string): Promise<void> {
		await this.client.request(`/runs/${runReference}/lock`, {
			method: "POST",
		});
	}

	async unlock(runReference: string): Promise<void> {
		await this.client.request(`/runs/${runReference}/unlock`, {
			method: "POST",
		});
	}

	async send(reference: string): Promise<void> {
		await this.client.request(`/runs/${reference}/send`, {
			method: "POST",
		});
	}

	async getLoadingInfo(runReference: string): Promise<RunLoadingInfo> {
		return this.client.request(`/runs/${runReference}/loading`, {}, RunLoadingInfoSchema);
	}
}
