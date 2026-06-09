# @leadpixel/maxoptra

A typed TypeScript client library for the [Maxoptra API v6](https://maxoptra.stoplight.io/docs/api-v6-documentation) — a platform for transport logistics and route optimisation.

## Features

- **Full API coverage** — Orders, Drivers, Vehicles, Locations, Distribution Centres, Subscriptions, Runs, Schedule/Shifts, and Async operations
- **Type-safe** — All request and response shapes are defined as TypeScript types inferred from [Zod](https://zod.dev/) schemas
- **Runtime validation** — Zod schemas validate API responses at runtime, catching regressions early
- **Zero runtime dependencies** (except Zod) — Uses the Web `fetch` API, no heavy HTTP client required
- **Works in Node.js 24+ and modern browsers**

## Installation

```bash
pnpm add @leadpixel/maxoptra
```

```bash
npm install @leadpixel/maxoptra
```

```bash
yarn add @leadpixel/maxoptra
```

## Usage

### Initialise the client

```typescript
import { MaxoptraClient } from "@leadpixel/maxoptra";

const client = new MaxoptraClient({ apiKey: "your-api-key" });
```

The client automatically points to `https://api.maxoptra.com/api/v6`. You can override the base URL with the `baseUrl` option.

### Orders

```typescript
// List orders
const orders = await client.orders.list({ status: "open" });

// Get a single order
const order = await client.orders.get("REF-001");

// Create an order
const created = await client.orders.create({
  referenceNumber: "REF-001",
  customerReference: "CUST-123",
  // ...
});

// Update an order (full replacement)
const updated = await client.orders.update("REF-001", {
  customerReference: "CUST-456",
});

// Partial update
const patched = await client.orders.patch("REF-001", {
  customerReference: "CUST-789",
});

// Delete an order
await client.orders.delete("REF-001");

// Get order attachments, execution, items, loading info
const pod = await client.orders.getPOD("REF-001");
const tracking = await client.orders.getTrackingInfo("REF-001");
const widget = await client.orders.getWidget("REF-001");
```

### Drivers

```typescript
// List drivers
const drivers = await client.drivers.list();

// Get a driver
const driver = await client.drivers.get(42);

// Create a driver
const created = await client.drivers.create({
  name: "Alice Smith",
  email: "alice@example.com",
});

// Update
await client.drivers.update(42, { name: "Alice Jones" });

// Delete
await client.drivers.delete(42);
```

### Locations

```typescript
// List locations
const locations = await client.locations.list();

// Create a location
const location = await client.locations.create({
  referenceNumber: "LOC-001",
  name: "Warehouse A",
  address: "123 Main St",
});

// Get, update, patch, delete — analogous to Orders and Drivers
```

### Vehicles

```typescript
const vehicles = await client.vehicles.list();
const vehicle = await client.vehicles.get(1);
await client.vehicles.delete(1);
```

### Subscriptions (Webhooks)

```typescript
// List subscriptions
const subs = await client.subscriptions.list();

// Create a subscription
const sub = await client.subscriptions.create({
  url: "https://myapp.com/webhooks/maxoptra",
  events: ["order.created", "order.updated"],
});

// Update (Partial or JSON Patch)
await client.subscriptions.patch(sub.reference, {
  url: "https://myapp.com/new-url",
});

// Enable / disable
await client.subscriptions.enable(sub.reference);
await client.subscriptions.disable(sub.reference);

// View delivery logs
const log = await client.subscriptions.getLog(sub.reference);
```

### Distribution Centres

```typescript
const centres = await client.distributionCentres.list();
```

### Runs

```typescript
await client.runs.lock(42);
await client.runs.unlock(42);
await client.runs.send(42);
const loading = await client.runs.getLoading(42);
```

### Schedule / Shifts

```typescript
const shifts = await client.schedule.getByDate("2026-06-05");
const driverShifts = await client.schedule.getByDriver(42, "2026-06-05");
```

### Async Operations

```typescript
const status = await client.async.checkStatus("async-job-id");
await client.async.cancel("async-job-id");
```

## API Resources

| Resource             | Accessor                     | Key Methods                                                                |
| -------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| Orders               | `client.orders`              | `list`, `create`, `get`, `update`, `patch`, `delete`, attachments, POD     |
| Drivers              | `client.drivers`             | `list`, `create`, `get`, `update`, `patch`, `delete`                       |
| Vehicles             | `client.vehicles`            | `list`, `get`, `delete`                                                    |
| Locations            | `client.locations`           | `list`, `create`, `get`, `update`, `patch`, `delete`                       |
| Distribution Centres | `client.distributionCentres` | `list`                                                                     |
| Subscriptions        | `client.subscriptions`       | `list`, `create`, `get`, `update`, `delete`, `enable`, `disable`, `getLog` |
| Runs                 | `client.runs`                | `lock`, `unlock`, `send`, `getLoading`                                     |
| Schedule / Shifts    | `client.schedule`            | `getByDate`, `getByDriver`, `getByVehicle`, `import`, `unallocate`         |
| Async                | `client.async`               | `checkStatus`, `cancel`                                                    |

## Development

This project uses [pnpm](https://pnpm.io/) as the package manager and [just](https://github.com/casey/just) as the task runner.

```bash
# Install dependencies
pnpm install

# Build
just build

# Lint
just lint

# Format
just format

# Run tests
just test
```

### Running E2E tests

E2E tests run against the [Stoplight mock server](https://maxoptra.stoplight.io/docs/api-v6-documentation) and require the `E2E` environment variable:

```bash
E2E=true pnpm test
```

### Running Live Integration tests

Live integration tests run against the real Maxoptra API and require `MAXOPTRA_API_KEY` and `MAXOPTRA_BASE_URL`:

```bash
MAXOPTRA_API_KEY=your-key MAXOPTRA_BASE_URL=https://your-domain.maxoptra.com/api/v6 pnpm test
```

These tests are read-only and will not modify any data.

## Contributing

Contributions are welcome. Please ensure your code follows the established linting and formatting standards.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `just lint` and `just test`
5. Open a pull request

## License

[ISC](LICENSE) © 2026 LeadPixel
plight.io/docs/api-v6-documentation) and require the `E2E` environment variable:

```bash
E2E=true pnpm test
```

## Contributing

Contributions are welcome. Please ensure your code follows the established linting and formatting standards.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `just lint` and `just test`
5. Open a pull request

## License

[ISC](LICENSE) © 2026 LeadPixel
