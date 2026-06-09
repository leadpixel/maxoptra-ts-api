import type { MaxoptraClient } from "../client.ts";
import {
	type ScheduleResponse,
	ScheduleResponseSchema,
	type UnallocateResponse,
	UnallocateResponseSchema,
} from "../schemas.ts";

export class ScheduleApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async getForDate(distributionCentreReference: string, date: string): Promise<ScheduleResponse> {
		return this.client.request(
			`/schedules/dc/${distributionCentreReference}/${date}`,
			{},
			ScheduleResponseSchema,
		);
	}

	async import(
		distributionCentreReference: string,
		date: string,
		schedule: ScheduleResponse,
	): Promise<ScheduleResponse> {
		return this.client.request(
			`/schedules/dc/${distributionCentreReference}/${date}`,
			{
				method: "POST",
				body: JSON.stringify(schedule),
			},
			ScheduleResponseSchema,
		);
	}

	async unallocateAll(
		distributionCentreReference: string,
		date: string,
	): Promise<UnallocateResponse> {
		return this.client.request(
			`/schedules/dc/${distributionCentreReference}/${date}`,
			{ method: "DELETE" },
			UnallocateResponseSchema,
		);
	}

	async getForDriver(driverReference: string, date: string): Promise<ScheduleResponse> {
		return this.client.request(
			`/schedules/driver/${driverReference}/${date}`,
			{},
			ScheduleResponseSchema,
		);
	}

	async getForVehicle(vehicleReference: string, date: string): Promise<ScheduleResponse> {
		return this.client.request(
			`/schedules/vehicle/${vehicleReference}/${date}`,
			{},
			ScheduleResponseSchema,
		);
	}

	async unallocateOrder(orderReference: string): Promise<void> {
		await this.client.request(`/schedules/order/${orderReference}`, {
			method: "DELETE",
		});
	}

	async unallocateRun(runReference: string): Promise<void> {
		await this.client.request(`/schedules/run/${runReference}`, {
			method: "DELETE",
		});
	}
}
