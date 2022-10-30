import * as functions from "firebase-functions";
import Koa from "koa";
import cors from "@koa/cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const auth = admin.auth();

const app = new Koa();

app.use(cors());

app.use(async (ctx) => {
  const authorization = ctx.request.headers.authorization;
  if (!authorization) {
    ctx.status = 401;
    return;
  }
  const sub = (await auth.verifyIdToken(authorization)).sub;

  if (ctx.request.path === "/sqlite") {
    ctx.body = `Hello World!, ${sub}`;
  }
});

export const api = functions
  .region("asia-northeast1")
  .https.onRequest(app.callback());
