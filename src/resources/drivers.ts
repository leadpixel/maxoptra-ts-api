import type { MaxoptraClient } from "../client.ts";
import {
	type Driver,
	type DriverCreateRequest,
	DriverSchema,
	type DriversList,
	DriversListSchema,
	type JsonPatch,
	toReplacePatch,
	withData,
} from "../schemas.ts";

export class DriversApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async list(params?: Record<string, string>): Promise<DriversList> {
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
			`/drivers${queryString ? `?${queryString}` : ""}`,
			{},
			DriversListSchema,
		);
	}

	async create(driver: DriverCreateRequest): Promise<Driver> {
		return this.client.request(
			"/drivers",
			{
				method: "POST",
				body: JSON.stringify(driver),
			},
			withData(DriverSchema),
		);
	}

	async get(id: string | number): Promise<Driver> {
		return this.client.request(`/drivers/${id}`, {}, withData(DriverSchema));
	}

	async update(id: string | number, driver: Partial<DriverCreateRequest>): Promise<Driver> {
		return this.client.request(
			`/drivers/${id}`,
			{
				method: "PUT",
				body: JSON.stringify(driver),
			},
			withData(DriverSchema),
		);
	}

	async patch(
		id: string | number,
		data: Partial<DriverCreateRequest> | JsonPatch,
	): Promise<Driver> {
		const body = Array.isArray(data) ? data : toReplacePatch(data);
		return this.client.request(
			`/drivers/${id}`,
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json-patch+json" },
			},
			withData(DriverSchema),
		);
	}

	async delete(id: string | number): Promise<void> {
		await this.client.request(`/drivers/${id}`, { method: "DELETE" });
	}
}
