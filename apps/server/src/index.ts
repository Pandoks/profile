import express, { NextFunction, Request, Response } from "express";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
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
let PUBLIC_TOKEN: string = "";

const app = express();
app.use(cors());

app.get("/", (_, res: Response) => {
  return res.send("Hello World!");
});

// 1. 2. 3. Server requests Plaid for link token and sends it to client
app.post("/api/link_token", (_, res: Response, next: NextFunction) => {
  Promise.resolve()
    .then(async () => {
      const configs = {
        user: {
          client_user_id: "user",
        },
        client_name: "Plaid Quickstart",
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: "en",
      };

      const token_response = await plaid.linkTokenCreate(configs);
      console.log(token_response);
      return res.json(token_response.data);
    })
    .catch(next);
});

// 4. 5. 6. 7. 8. 9. Client sends public token to server, server sends it to Plaid, Plaid sends access token to server
app.post(
  "/api/access_token",
  (req: Request, res: Response, next: NextFunction) => {
    PUBLIC_TOKEN = req.body.public_token;
    Promise.resolve()
      .then(async () => {
        const token_response = await plaid.itemPublicTokenExchange({
          public_token: PUBLIC_TOKEN,
        });
        console.log(token_response);
        ACCESS_TOKEN = token_response.data.access_token;
        return res.status(200);
      })
      .catch(next);
  },
);

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is alive on http://localhost:${SERVER_PORT}`),
);
