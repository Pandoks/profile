import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  return res.send("Hello World!");
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is alive on http://localhost:${process.env.SERVER_PORT}`),
);
