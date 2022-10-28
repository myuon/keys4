import * as functions from "firebase-functions";
import Koa from "koa";
import cors from "@koa/cors";

const app = new Koa();

app.use(cors());

app.use(async (ctx) => {
  if (ctx.request.path === "/sqlite") {
    ctx.body = "Hello World!";
  }
});

export const api = functions
  .region("asia-northeast1")
  .https.onRequest(app.callback());
