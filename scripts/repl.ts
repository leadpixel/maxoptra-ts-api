import repl from "node:repl";
import { MaxoptraClient } from "../src/index.ts";

const apiKey = process.env.MAXOPTRA_API_KEY?.trim();
const baseUrl = process.env.MAXOPTRA_BASE_URL?.trim();

if (!apiKey) {
	console.error("❌ Error: MAXOPTRA_API_KEY environment variable is not set.");
	console.error("Please set it in your .env file or environment variables.");
	process.exit(1);
}

console.log("🚀 Starting MaxOptra Interactive REPL...");

const client = new MaxoptraClient({ apiKey, baseUrl });

console.log(`✅ Client initialized.
🌐 Base URL: ${baseUrl || "https://api.maxoptra.com/api/v6"}

The following variables are available in the global scope:
  - client: MaxoptraClient instance
  - MaxoptraClient: The client class
  
Example usage:
  > await client.drivers.list()
`);

const r = repl.start("> ");

r.context.client = client;
r.context.MaxoptraClient = MaxoptraClient;
