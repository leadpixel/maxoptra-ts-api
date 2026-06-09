import type { MaxoptraClient } from "../client.ts";
import {
	type JsonPatch,
	type Location,
	type LocationCreateRequest,
	LocationSchema,
	type LocationsList,
	LocationsListSchema,
	toReplacePatch,
	withData,
} from "../schemas.ts";

export class LocationsApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async list(params?: Record<string, string>): Promise<LocationsList> {
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
			`/locations${queryString ? `?${queryString}` : ""}`,
			{},
			LocationsListSchema,
		);
	}

	async create(location: LocationCreateRequest): Promise<Location> {
		return this.client.request(
			"/locations",
			{
				method: "POST",
				body: JSON.stringify(location),
			},
			withData(LocationSchema),
		);
	}

	async get(referenceNumber: string): Promise<Location> {
		return this.client.request(`/locations/${referenceNumber}`, {}, withData(LocationSchema));
	}

	async update(
		referenceNumber: string,
		location: Partial<LocationCreateRequest>,
	): Promise<Location> {
		return this.client.request(
			`/locations/${referenceNumber}`,
			{
				method: "PUT",
				body: JSON.stringify(location),
			},
			withData(LocationSchema),
		);
	}

	async patch(
		referenceNumber: string,
		data: Partial<LocationCreateRequest> | JsonPatch,
	): Promise<Location> {
		const body = Array.isArray(data) ? data : toReplacePatch(data);
		return this.client.request(
			`/locations/${referenceNumber}`,
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			},
			withData(LocationSchema),
		);
	}

	async delete(referenceNumber: string): Promise<void> {
		await this.client.request(`/locations/${referenceNumber}`, {
			method: "DELETE",
		});
	}
}
