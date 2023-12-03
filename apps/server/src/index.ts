import express, { NextFunction, Request, Response } from "express";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
  RemovedTransaction,
  Transaction,
  TransactionsSyncRequest,
} from "plaid";
import cors from "cors";

const SERVER_PORT = process.env.SERVER_PORT || 3333;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});
const plaid = new PlaidApi(configuration);
/**
 * Plaid FLOW
 *
 * Initialization:
 * 1. Client requests link token from server
 * 2. Server requests Plaid for link token
 * 3. Server sends link token to client
 * 4. Client sends link token to Plaid after bank logins
 * 5. Plaid sends public token to client
 * 6. Client sends public token to server
 * 7. Server sends public token to Plaid
 * 8. Plaid sends access token to server
 * 9. Server stores access token for user
 *
 * Plaid API:
 * 1. CLient requests data from server
 * 2. Server requests data from Plaid with access token and other params
 * 3. Plaid sends data to server
 * 4. Server sends data to client
 */

const PLAID_PRODUCTS = process.env.PLAID_PRODUCTS
  ? process.env.PLAID_PRODUCTS.split(",").map(
      (product: string) => product as Products,
    )
  : [Products.Transactions];
const PLAID_COUNTRY_CODES = process.env.PLAID_COUNTRY_CODES
  ? process.env.PLAID_COUNTRY_CODES.split(",").map(
      (code: string) => code as CountryCode,
    )
  : [CountryCode.Us];

// We store the access_token in memory - in production, store it in a secure
// persistent data store
let ACCESS_TOKEN: string = "";

// Cursor is a bookmark for fetched transactions so Plaid doesn't have to send entire history everytime
// Store with Access Token so you don't lose your place. Keep track of original cursor as you paginate
// through transactions just in case you need to restart. Once you get all transaction data needed, then
// you update
let CURSOR: string = "";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res: Response) => {
  return res.send("Hello World!");
});

// 1. 2. 3. Server requests Plaid for link token and sends it to client
app.get("/api/link_token", async (_, res: Response, next: NextFunction) => {
  try {
    const configs = {
      user: {
        client_user_id: "user-id",
      },
      client_name: "Plaid Quickstart",
      products: PLAID_PRODUCTS,
      country_codes: PLAID_COUNTRY_CODES,
      language: "en",
    };
    const token_response = await plaid.linkTokenCreate(configs);
    console.log("Token response:\n", token_response.data);
    return res.json(token_response.data);
  } catch (error) {
    next(error);
  }
});

// 4. 5. 6. 7. 8. 9. Client sends public token to server, server sends it to Plaid, Plaid sends access token to server
app.post(
  "/api/access_token",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("/api/access_token hit");
    try {
      const token_response = await plaid.itemPublicTokenExchange({
        public_token: req.body.public_token,
      });
      ACCESS_TOKEN = token_response.data.access_token;
      return res.status(200);
    } catch (error) {
      next(error);
    }
  },
);

app.get("/api/transactions", async () => {
  let database_cursor = CURSOR;
  let temporary_cursor = database_cursor;

  // new transaction updates since cursor
  let added: Array<Transaction> = [];
  let modified: Array<Transaction> = [];
  let removed: Array<RemovedTransaction> = [];

  let has_more = true; // transactions are sent paginated
  while (has_more) {
    const request: TransactionsSyncRequest = {
      access_token: ACCESS_TOKEN,
      cursor: temporary_cursor,
    };
    const response = await plaid.transactionsSync(request);
    const data = response.data;

    added = added.concat(data.added);
    modified = modified.concat(data.modified);
    removed = removed.concat(data.removed);

    has_more = data.has_more;

    temporary_cursor = data.next_cursor;
  }

  console.log("Added: ", added);
  console.log("Modified: ", modified);
  console.log("Removed: ", removed);
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is alive on http://localhost:${SERVER_PORT}`),
);
