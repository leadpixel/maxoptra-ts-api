import type { MaxoptraClient } from "../client.ts";
import {
	type JsonPatch,
	type Subscription,
	type SubscriptionLogEntry,
	SubscriptionLogSchema,
	SubscriptionSchema,
	SubscriptionsListSchema,
	type SubscriptionUpdateRequest,
	toReplacePatch,
	withData,
} from "../schemas.ts";

export class SubscriptionsApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async list(): Promise<Subscription[]> {
		return this.client.request("/subscriptions", {}, SubscriptionsListSchema);
	}

	async create(data: {
		event: string;
		url: string;
		headers?: Record<string, string>;
	}): Promise<Subscription> {
		return this.client.request(
			"/subscriptions",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
			withData(SubscriptionSchema),
		);
	}

	async get(id: string): Promise<Subscription> {
		return this.client.request(`/subscriptions/${id}`, {}, withData(SubscriptionSchema));
	}

	async patch(id: string, data: SubscriptionUpdateRequest | JsonPatch): Promise<Subscription> {
		const body = Array.isArray(data) ? data : toReplacePatch(data);
		return this.client.request(
			`/subscriptions/${id}`,
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			},
			withData(SubscriptionSchema),
		);
	}

	async delete(id: string): Promise<void> {
		await this.client.request(`/subscriptions/${id}`, {
			method: "DELETE",
		});
	}

	async disable(id: string): Promise<Subscription> {
		return this.client.request(
			`/subscriptions/${id}/disable`,
			{ method: "POST" },
			SubscriptionSchema,
		);
	}

	async enable(id: string): Promise<Subscription> {
		return this.client.request(
			`/subscriptions/${id}/enable`,
			{ method: "POST" },
			SubscriptionSchema,
		);
	}

	async getLog(id: string): Promise<SubscriptionLogEntry[]> {
		return this.client.request(`/subscriptions/${id}/log`, {}, SubscriptionLogSchema);
	}
}
