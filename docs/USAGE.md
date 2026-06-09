# Usage Guide: @leadpixel/maxoptra

This guide provides detailed instructions on how to use the Maxoptra TypeScript client library.

## Table of Contents
1. [Initialisation](#initialisation)
2. [API Resources](#api-resources)
3. [Common Operations](#common-operations)
4. [Error Handling](#error-handling)
5. [Validation & Types](#validation--types)
6. [Testing](#testing)

---

## Initialisation

The `MaxoptraClient` is the main entry point for the library. It requires an API key and optionally a base URL.

```typescript
import { MaxoptraClient } from "@leadpixel/maxoptra";

const client = new MaxoptraClient({
  apiKey: "your-api-key",
  // Optional: Defaults to https://api.maxoptra.com/api/v6
  baseUrl: "https://your-custom-domain.maxoptra.com/api/v6" 
});
```

---

## API Resources

The client is organised into sub-clients based on Maxoptra resources:

| Resource | Accessor |
| :--- | :--- |
| **Orders** | `client.orders` |
| **Drivers** | `client.drivers` |
| **Vehicles** | `client.vehicles` |
| **Locations** | `client.locations` |
| **Distribution Centres** | `client.distributionCentres` |
| **Subscriptions (Webhooks)** | `client.subscriptions` |
| **Runs** | `client.runs` |
| **Schedule / Shifts** | `client.schedule` |
| **Async Status** | `client.async` |

---

## Common Operations

### Listing Resources
Most list operations support optional query parameters.

```typescript
const openOrders = await client.orders.list({ status: "open" });
const activeDrivers = await client.drivers.list({ active: "true" });
```

### CRUD Operations
Standard CRUD methods are available for primary resources (Orders, Drivers, Locations).

```typescript
// Create
const newOrder = await client.orders.create({
  referenceNumber: "ORD-123",
  distributionCentreReference: "DC-1",
  customerLocation: {
    address: "123 High St, London",
    name: "John Doe"
  },
  orderDate: "2026-06-10"
});

// Get
const order = await client.orders.get("ORD-123");

// Patch (Partial Update)
await client.orders.patch("ORD-123", {
  additionalInstructions: "Leave at front door"
});

// Delete
await client.orders.delete("ORD-123");
```

---

## Error Handling

The library throws a `MaxoptraError` when the API returns a non-OK response. This error includes the status code, status text, and any error message from the API.

```typescript
try {
  await client.drivers.get("non-existent-id");
} catch (error) {
  if (error instanceof MaxoptraError) {
    console.error(`Status: ${error.status}`); // e.g., 404
    console.error(`Message: ${error.message}`); // e.g., "Maxoptra API error [404]: Driver not found"
  }
}
```

---

## Validation & Types

All responses are validated at runtime using [Zod](https://zod.dev/). If the API returns data that doesn't match the expected schema, a `ZodError` will be thrown. 

You can import types directly from the library:

```typescript
import type { Order, DriverSummary } from "@leadpixel/maxoptra";

const driver: DriverSummary = drivers.data[0];
```

---

## Testing

### Mocking for Unit Tests
We recommend mocking the global `fetch` API for unit tests.

```typescript
import { vi } from "vitest";

vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  text: async () => JSON.stringify({ data: [] })
}));
```

### Live Integration Tests
To verify against the live service, ensure your `.env` file contains valid credentials:

```bash
MAXOPTRA_API_KEY=your-actual-key
MAXOPTRA_BASE_URL=https://your-domain.maxoptra.com/api/v6
```

Then run the integration tests:
```bash
pnpm vitest run tests/integration/live.spec.ts
```

### Demonstration Script
A demo script is provided to quickly verify connectivity and view live data:
```bash
npx tsx scripts/demo.ts
```
