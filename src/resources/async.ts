import type { MaxoptraClient } from "../client.ts";
import { type AsyncStatus, AsyncStatusSchema } from "../schemas.ts";

export class AsyncApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async getStatus(operationReference: string, taskReference: string): Promise<AsyncStatus> {
		return this.client.request(
			`/async/${operationReference}/${taskReference}`,
			{},
			AsyncStatusSchema,
		);
	}

	async cancel(operationReference: string, taskReference: string): Promise<void> {
		await this.client.request(`/async/${operationReference}/${taskReference}`, {
			method: "DELETE",
		});
	}
}
