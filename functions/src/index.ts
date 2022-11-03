import * as functions from "firebase-functions";
import Koa from "koa";
import cors from "@koa/cors";
import * as admin from "firebase-admin";
import sqlite3 from "sqlite3";
import { newCommitRepostiroy } from "../../app/src/infra/commit/commit";

admin.initializeApp({
  storageBucket: "gs://keys4-ebdd8.appspot.com",
});
const auth = admin.auth();
const storage = admin.storage();
const firestore = admin.firestore();

const app = new Koa();

app.use(cors());

app.use(async (ctx, next) => {
  const token = ctx.request.header.authorization?.split("Bearer ")?.[1];
  functions.logger.log(ctx.request.header.authorization);
  functions.logger.log("token", token);

  if (token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      const userRef = await firestore.doc(`users/${decodedToken.sub}`).get();
      ctx.state.auth = decodedToken;
      ctx.state.org = userRef.get("org") as string;
    } catch (error) {
      console.error(error);
      ctx.throw("Unauthorized", 401);
    }
  }

  await next();
});

app.use(async (ctx) => {
  ctx.status = 200;
  functions.logger.log("state", ctx.state);

  if (ctx.request.path === "/sqlite") {
    ctx.body = `Hello World!, ${ctx.state.user?.sub}`;
  } else if (ctx.request.path === "/init") {
    const dbFilePath = "/tmp/db.sqlite3";
    const db = new sqlite3.Database(dbFilePath);
    const commitRepository = newCommitRepostiroy(db);
    commitRepository.createTableIfNotExists();
    db.close();

    const org = ctx.state.org;

    await storage.bucket().upload(dbFilePath, {
      destination: `db/${org}/db.sqlite3`,
    });
    ctx.body = "OK";
  } else {
    ctx.throw("PathNotFound", 404);
  }
});

export const api = functions
  .region("asia-northeast1")
  .https.onRequest(app.callback());
