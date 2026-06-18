# @leadpixel/maxoptra

A modern, type-safe TypeScript SDK for the [Maxoptra API v6](https://maxoptra.stoplight.io/docs/api-v6-documentation) — the industry-leading platform for transport logistics and route optimisation.

## Badges

[![NPM Version](https://img.shields.io/npm/v/@leadpixel/maxoptra.svg)](https://www.npmjs.com/package/@leadpixel/maxoptra)
[![Licence](https://img.shields.io/badge/licence-ISC-blue.svg)](LICENSE)
[![CI Status](https://github.com/leadpixel/maxoptra/actions/workflows/deploy.yml/badge.svg)](https://github.com/leadpixel/maxoptra/actions)
[![Node Version](https://img.shields.io/badge/node-%3E%3D24-brightgreen.svg)](package.json)

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
  - [Orders](#orders)
  - [Drivers](#drivers)
  - [Locations](#locations)
  - [Vehicles](#vehicles)
  - [Subscriptions (Webhooks)](#subscriptions-webhooks)
  - [Schedule & Shifts](#schedule--shifts)
  - [Async Operations](#async-operations)
- [Error Handling](#error-handling)
- [TypeScript & Validation](#typescript--validation)
- [Security](#security)
- [Development & Testing](#development--testing)
- [Contributing](#contributing)
- [Licence](#licence)

---

## Features

- **Full API Coverage** — Seamless integration with Orders, Drivers, Vehicles, Locations, Distribution Centres, Subscriptions, Runs, Schedule/Shifts, and Async operations.
- **Strictly Typed** — All request and response shapes are defined as TypeScript interfaces inferred from [Zod](https://zod.dev/) schemas.
- **Runtime Validation** — Zod schemas validate API responses at runtime, ensuring your application stays resilient against API regressions.
- **Modern Standards** — Zero runtime dependencies (excluding Zod). Built on the native Web `fetch` API.
- **Cross-Platform** — Native support for Node.js 24+, Deno, and modern browser environments.

---

## Installation

Install the library using your preferred package manager:

```bash
# pnpm
pnpm add @leadpixel/maxoptra

# npm
npm install @leadpixel/maxoptra

# yarn
yarn add @leadpixel/maxoptra
```

---

## Getting Started

### 1. Obtain an API Key
You will need an API key from your Maxoptra account. Contact your Maxoptra administrator or support team if you don't have one.

### 2. Initialise the Client
Create a new instance of the `MaxoptraClient`. By default, it points to the production API.

```typescript
import { MaxoptraClient } from "@leadpixel/maxoptra";

const client = new MaxoptraClient({ 
  apiKey: "your-api-key" 
});

// For custom subdomains or sandbox environments:
const customClient = new MaxoptraClient({
  apiKey: "your-api-key",
  baseUrl: "https://your-company.maxoptra.com/api/v6"
});
```

---

## Usage Guide

### Orders
Manage the lifecycle of delivery and collection orders.

```typescript
// Create an order with detailed requirements
const order = await client.orders.create({
  referenceNumber: "ORD-123",
  distributionCentreReference: "DC-NORTH",
  customerReference: "CUST-456",
  customerLocation: {
    address: "10 Downing St, London",
    name: "Prime Minister"
  },
  orderDate: "2026-06-20",
  additionalInstructions: "Ring bell twice"
});

// List orders with filters
const orders = await client.orders.list({ 
  status: "open",
  dateFrom: "2026-06-01" 
});

// Retrieve specific order data
const pod = await client.orders.getPOD("ORD-123");
const tracking = await client.orders.getTrackingInfo("ORD-123");

// Update or Patch
await client.orders.patch("ORD-123", {
  status: "cancelled"
});
```

### Drivers
Manage driver profiles and status.

```typescript
// Create a new driver
const driver = await client.drivers.create({
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+447700900000"
});

// Get driver by ID
const driverInfo = await client.drivers.get(driver.id);
```

### Locations
Define and manage fixed locations for routes.

```typescript
const location = await client.locations.create({
  referenceNumber: "WH-1",
  name: "Main Warehouse",
  address: "Unit 5, Logistics Park, Birmingham",
  latitude: 52.4862,
  longitude: -1.8904
});
```

### Vehicles
Monitor and manage your fleet.

```typescript
const vehicles = await client.vehicles.list();
const activeVehicle = await client.vehicles.get(101);
```

### Subscriptions (Webhooks)
Subscribe to real-time events from Maxoptra.

```typescript
// Create a webhook subscription
const sub = await client.subscriptions.create({
  url: "https://your-api.com/webhooks/maxoptra",
  events: ["order.created", "order.updated", "run.sent"]
});

// Enable/Disable
await client.subscriptions.disable(sub.reference);

// Audit delivery logs
const logs = await client.subscriptions.getLog(sub.reference);
```

### Schedule & Shifts
Query and manage driver shifts and vehicle allocations.

```typescript
// Get shifts for a specific date
const shifts = await client.schedule.getByDate("2026-06-25");

// Get shifts for a specific driver
const driverShifts = await client.schedule.getByDriver(42, "2026-06-25");
```

### Async Operations
Some API calls trigger long-running background tasks. Use the `async` client to track their progress.

```typescript
const status = await client.async.checkStatus("job-uuid-123");

if (status.status === "completed") {
  console.log("Operation successful!");
}
```

---

## Error Handling

The library provides a robust `MaxoptraError` class for handling API failures.

```typescript
import { MaxoptraError } from "@leadpixel/maxoptra";

try {
  await client.orders.get("INVALID-REF");
} catch (error) {
  if (error instanceof MaxoptraError) {
    console.error(`API Error [${error.status}]: ${error.message}`);
    // Access error.response for the raw Response object if needed
  } else {
    console.error("Unknown error:", error);
  }
}
```

---

## TypeScript & Validation

This SDK is built with **TypeScript-first** principles. All interfaces are exported directly.

```typescript
import type { Order, Driver, CreateOrderRequest } from "@leadpixel/maxoptra";

const myOrder: Order = { ... };
```

### Response Validation
All API responses are validated against Zod schemas. If Maxoptra's API returns unexpected data, a `ZodError` will be thrown. This protects your application from silent data corruption.

---

## Security

- **API Key Safety:** Never expose your API key in client-side code (browsers). Use environment variables (e.g., `process.env.MAXOPTRA_API_KEY`) to manage secrets securely.
- **HTTPS Only:** The client defaults to HTTPS. Do not override this with insecure HTTP URLs in production.

---

## Development & Testing

This project uses [pnpm](https://pnpm.io/) and [just](https://github.com/casey/just).

```bash
# Install dependencies
pnpm install

# Build the project
just build

# Run unit tests
just test

# Start the interactive REPL
just repl
```

### Interactive REPL
Explore the API in real-time with a pre-configured client:
```bash
MAXOPTRA_API_KEY=your-key just repl
> await client.drivers.list()
```

---

## Contributing

We welcome contributions! Please see our [RELEASING.md](docs/RELEASING.md) for details on our automated deployment pipeline.

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## Licence

Distributed under the **ISC Licence**. See `LICENSE` for more information.

© 2026 [LeadPixel](https://leadpixel.io)
