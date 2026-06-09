import type { MaxoptraClient } from "../client.ts";
import {
	type JsonPatch,
	toReplacePatch,
	type Vehicle,
	type VehicleCreateRequest,
	VehicleSchema,
	type VehiclesList,
	VehiclesListSchema,
	withData,
} from "../schemas.ts";

export class VehiclesApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async list(params?: Record<string, string>): Promise<VehiclesList> {
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
			`/vehicles${queryString ? `?${queryString}` : ""}`,
			{},
			VehiclesListSchema,
		);
	}

	async create(data: VehicleCreateRequest): Promise<Vehicle> {
		return this.client.request(
			"/vehicles",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
			withData(VehicleSchema),
		);
	}

	async get(reference: string): Promise<Vehicle> {
		return this.client.request(`/vehicles/${reference}`, {}, withData(VehicleSchema));
	}

	async update(reference: string, data: Partial<VehicleCreateRequest>): Promise<Vehicle> {
		return this.client.request(
			`/vehicles/${reference}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
			withData(VehicleSchema),
		);
	}

	async patch(
		reference: string,
		data: Partial<VehicleCreateRequest> | JsonPatch,
	): Promise<Vehicle> {
		const body = Array.isArray(data) ? data : toReplacePatch(data);
		return this.client.request(
			`/vehicles/${reference}`,
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json-patch+json" },
			},
			withData(VehicleSchema),
		);
	}

	async delete(reference: string): Promise<void> {
		await this.client.request(`/vehicles/${reference}`, {
			method: "DELETE",
		});
	}
}
