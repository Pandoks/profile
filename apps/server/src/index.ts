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

const app = express();
app.use(cors());

app.get("/", (_, res: Response) => {
  return res.send("Hello World!");
});

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

      const link_token = await plaid.linkTokenCreate(configs);
      console.log(link_token);
      return res.json(link_token.data);
    })
    .catch(next);
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is alive on http://localhost:${SERVER_PORT}`),
);
