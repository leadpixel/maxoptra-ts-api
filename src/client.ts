import type { z } from "zod";
import { AsyncApi } from "./resources/async.ts";
import { DistributionCentresApi } from "./resources/distributionCentres.ts";
import { DriversApi } from "./resources/drivers.ts";
import { LocationsApi } from "./resources/locations.ts";
import { OrdersApi } from "./resources/orders.ts";
import { RunsApi } from "./resources/runs.ts";
import { ScheduleApi } from "./resources/schedule.ts";
import { SubscriptionsApi } from "./resources/subscriptions.ts";
import { VehiclesApi } from "./resources/vehicles.ts";

export interface MaxoptraConfig {
	apiKey: string;
	baseUrl?: string;
}

export class MaxoptraError extends Error {
	public status: number;
	public statusText: string;
	public data: unknown;

	constructor(status: number, statusText: string, data: unknown) {
		let message = statusText;
		if (data && typeof data === "object") {
			const d = data as { error?: unknown; message?: unknown };
			const errorVal = d.error;
			const messageVal = d.message;

			if (typeof errorVal === "string") {
				message = errorVal;
			} else if (typeof messageVal === "string") {
				message = messageVal;
			}
		}

		super(`Maxoptra API error [${status}]: ${message}`);
		this.status = status;
		this.statusText = statusText;
		this.data = data;
		this.name = "MaxoptraError";
	}
}

export class MaxoptraClient {
	private readonly apiKey: string;
	private readonly baseUrl: string;
	public readonly subscriptions: SubscriptionsApi;
	public readonly orders: OrdersApi;
	public readonly drivers: DriversApi;
	public readonly vehicles: VehiclesApi;
	public readonly async: AsyncApi;
	public readonly locations: LocationsApi;
	public readonly distributionCentres: DistributionCentresApi;
	public readonly runs: RunsApi;
	public readonly schedule: ScheduleApi;

	constructor(config: MaxoptraConfig) {
		this.apiKey = config.apiKey;
		this.baseUrl = config.baseUrl?.replace(/\/$/, "") ?? "https://api.maxoptra.com/api/v6";
		this.subscriptions = new SubscriptionsApi(this);
		this.orders = new OrdersApi(this);
		this.drivers = new DriversApi(this);
		this.vehicles = new VehiclesApi(this);
		this.async = new AsyncApi(this);
		this.locations = new LocationsApi(this);
		this.distributionCentres = new DistributionCentresApi(this);
		this.runs = new RunsApi(this);
		this.schedule = new ScheduleApi(this);
	}

	async request<T>(path: string, options: RequestInit = {}, schema?: z.ZodTypeAny): Promise<T> {
		const url = new URL(`${this.baseUrl}${path}`);

		const response = await fetch(url.toString(), {
			...options,
			headers: {
				"Content-Type": "application/json",
				// biome-ignore lint/style/useNamingConvention: Standard HTTP header
				Authorization: `Bearer ${this.apiKey}`,
				...options.headers,
			},
		});

		if (!response.ok) {
			const errorData = (await response.json().catch(() => ({}))) as {
				message?: string;
			};
			throw new MaxoptraError(response.status, response.statusText, errorData);
		}

		if (response.status === 204) {
			return {} as T;
		}

		const text = await response.text();
		if (text === "") {
			return {} as T;
		}

		const result = JSON.parse(text);

		if (schema) {
			return schema.parse(result) as T;
		}

		return result as T;
	}
}
