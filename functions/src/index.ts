import * as functions from "firebase-functions";
import Koa from "koa";
import cors from "@koa/cors";
import * as admin from "firebase-admin";
import sqlite3 from "sqlite3";
import { newCommitRepostiroy } from "../../app/src/infra/commit/commit";
import * as fs from "fs";

admin.initializeApp();
const auth = admin.auth();
const storage = admin.storage();

const app = new Koa();

app.use(cors());

app.use(async (ctx, next) => {
  const token = ctx.request.header.authorization?.split("Bearer ")?.[1];
  functions.logger.log(ctx.request.header.authorization);
  functions.logger.log("token", token);
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
  } else if (ctx.request.path === "/init") {
    fs.writeFile("./db.sqlite3", "", (err) => {
      console.error(err);
    });

    const db = new sqlite3.Database("./db.sqlite3");
    const commitRepository = newCommitRepostiroy(db);
    commitRepository.createTableIfNotExists();
    db.close();

    storage
      .bucket("gs://keys4-ebdd8.appspot.com")
      .file("db.sqlite3")
      .save("./db.sqlite3", (err) => {
        if (err) {
          console.error(err);
          ctx.throw("InternalServerError", 500);
        }

        ctx.body = "OK";
      });
  }
});

export const api = functions
  .region("asia-northeast1")
  .https.onRequest(app.callback());
