import type { MaxoptraClient } from "../client.ts";
import {
	type JsonPatch,
	type Order,
	type OrderAttachments,
	OrderAttachmentsSchema,
	type OrderExecution,
	OrderExecutionSchema,
	type OrderItemsResponse,
	OrderItemsResponseSchema,
	type OrderLoading,
	OrderLoadingSchema,
	OrderSchema,
	type PaginatedOrders,
	PaginatedOrdersSchema,
	type Pod,
	PodSchema,
	type TrackingInfo,
	TrackingInfoSchema,
	toReplacePatch,
	type Widget,
	WidgetSchema,
	withData,
} from "../schemas.ts";

export class OrdersApi {
	private readonly client: MaxoptraClient;

	constructor(client: MaxoptraClient) {
		this.client = client;
	}

	async list(params?: Record<string, string>): Promise<PaginatedOrders> {
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
			`/orders${queryString ? `?${queryString}` : ""}`,
			{},
			PaginatedOrdersSchema,
		);
	}

	async create(order: Order): Promise<Order> {
		return this.client.request(
			"/orders",
			{
				method: "POST",
				body: JSON.stringify(order),
			},
			withData(OrderSchema),
		);
	}

	async get(referenceNumber: string): Promise<Order> {
		return this.client.request(`/orders/${referenceNumber}`, {}, withData(OrderSchema));
	}

	async update(referenceNumber: string, order: Partial<Order>): Promise<Order> {
		return this.client.request(
			`/orders/${referenceNumber}`,
			{
				method: "PUT",
				body: JSON.stringify(order),
			},
			withData(OrderSchema),
		);
	}

	async patch(referenceNumber: string, data: Partial<Order> | JsonPatch): Promise<Order> {
		const body = Array.isArray(data) ? data : toReplacePatch(data);
		return this.client.request(
			`/orders/${referenceNumber}`,
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json-patch+json" },
			},
			withData(OrderSchema),
		);
	}

	async delete(referenceNumber: string): Promise<void> {
		await this.client.request(`/orders/${referenceNumber}`, {
			method: "DELETE",
		});
	}

	async getAttachments(referenceNumber: string): Promise<OrderAttachments> {
		return this.client.request(
			`/orders/${referenceNumber}/attachments`,
			{},
			OrderAttachmentsSchema,
		);
	}

	async getExecution(referenceNumber: string): Promise<OrderExecution> {
		return this.client.request(`/orders/${referenceNumber}/execution`, {}, OrderExecutionSchema);
	}

	async getItems(referenceNumber: string): Promise<OrderItemsResponse> {
		return this.client.request(`/orders/${referenceNumber}/items`, {}, OrderItemsResponseSchema);
	}

	async getLoading(referenceNumber: string): Promise<OrderLoading> {
		return this.client.request(`/orders/${referenceNumber}/loading`, {}, OrderLoadingSchema);
	}

	async getPod(referenceNumber: string): Promise<Pod> {
		return this.client.request(`/orders/${referenceNumber}/pod`, {}, PodSchema);
	}

	async getTrackingInfo(referenceNumber: string): Promise<TrackingInfo> {
		return this.client.request(`/orders/${referenceNumber}/tracking`, {}, TrackingInfoSchema);
	}

	async getWidget(referenceNumber: string): Promise<Widget> {
		return this.client.request(`/orders/${referenceNumber}/widget`, {}, WidgetSchema);
	}
}
