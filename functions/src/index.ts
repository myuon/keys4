import * as functions from "firebase-functions";
import Koa from "koa";
import cors from "@koa/cors";
import * as admin from "firebase-admin";

admin.initializeApp();
const auth = admin.auth();

const app = new Koa();

app.use(cors());

app.use(async (ctx, next) => {
  const token = ctx.request.header.authorization;
  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      ctx.state.auth = decodedToken;
    } catch (error) {
      console.error(error);
      ctx.throw("Unauthorized", 401);
    }
  }

  await next();
});

app.use(async (ctx) => {
  if (ctx.request.path === "/sqlite") {
    ctx.body = `Hello World!, ${ctx.state.user?.sub}`;
  }
});

export const api = functions
  .region("asia-northeast1")
  .https.onRequest(app.callback());
