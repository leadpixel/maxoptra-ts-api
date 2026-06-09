import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MaxoptraClient } from "../src/index.ts";

// Simple .env parser for the demo
function loadEnv() {
	try {
		const envPath = join(process.cwd(), ".env");
		const envContent = readFileSync(envPath, "utf-8");
		for (const line of envContent.split("\n")) {
			const [key, ...valueParts] = line.split("=");
			if (key && valueParts.length > 0) {
				process.env[key.trim()] = valueParts.join("=").trim();
			}
		}
	} catch (_e) {
		console.warn("Could not load .env file, using existing environment variables.");
	}
}

async function runDemo() {
	loadEnv();

	const apiKey = process.env.MAXOPTRA_API_KEY;
	const baseUrl = process.env.MAXOPTRA_BASE_URL;

	if (!apiKey) {
		console.error("Error: MAXOPTRA_API_KEY is not set in .env or environment.");
		process.exit(1);
	}

	console.log("🚀 Initialising Maxoptra Client...");
	console.log(`📍 Base URL: ${baseUrl || "https://api.maxoptra.com/api/v6"}`);

	const client = new MaxoptraClient({ apiKey, baseUrl });

	try {
		console.log("\n📦 Fetching Drivers...");
		const drivers = await client.drivers.list();
		console.log(`✅ Found ${drivers.data.length} drivers.`);
		if (drivers.data.length > 0) {
			console.table(
				drivers.data.slice(0, 5).map((d) => ({
					ref: d.referenceNumber,
					name: d.name,
				})),
			);
		}

		console.log("\n🚛 Fetching Vehicles...");
		const vehicles = await client.vehicles.list();
		console.log(`✅ Found ${vehicles.data.length} vehicles.`);
		if (vehicles.data.length > 0) {
			console.table(
				vehicles.data.slice(0, 5).map((v) => ({
					ref: v.referenceNumber,
					name: v.name || "N/A",
				})),
			);
		}

		console.log("\n📍 Fetching Locations...");
		const locations = await client.locations.list();
		console.log(`✅ Found ${locations.data.length} locations.`);
		if (locations.data.length > 0) {
			console.table(
				locations.data.slice(0, 5).map((l) => ({
					ref: l.referenceNumber || "N/A",
					name: l.name || "N/A",
					address: `${l.address.substring(0, 30)}...`,
				})),
			);
		}

		console.log("\n📋 Fetching Open Orders...");
		const orders = await client.orders.list({ status: "open" });
		console.log(`✅ Found ${orders.data.length} open orders.`);
		if (orders.data.length > 0) {
			console.table(
				orders.data.slice(0, 5).map((o) => ({
					ref: o.referenceNumber,
					status: o.status || "N/A",
				})),
			);
		}
	} catch (error) {
		console.error("\n❌ Error during demo:");
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error(error);
		}
	}
}

runDemo();
