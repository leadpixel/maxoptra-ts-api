export * from "./client.ts";
export * from "./resources/async.ts";
export * from "./resources/distributionCentres.ts";
export * from "./resources/drivers.ts";
export * from "./resources/locations.ts";
export * from "./resources/orders.ts";
export * from "./resources/runs.ts";
export * from "./resources/schedule.ts";
export * from "./resources/subscriptions.ts";
export * from "./resources/vehicles.ts";
export * from "./schemas.ts";

// Aliases for convenience and domain alignment
import type { LocationCreateRequest, Order } from "./schemas.ts";
export type OrderDetails = Order;
export type LocationDetails = LocationCreateRequest;
