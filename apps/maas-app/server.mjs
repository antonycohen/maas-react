import { createRequestHandler } from "@react-router/express";
import express from "express";

import * as build from "./build/server/index.js";

const app = express();

app.use(express.static("build/client"));

app.all("*splat", createRequestHandler({ build }));

const port = process.env.PORT || 4200;
app.listen(port, "0.0.0.0", () => {
    console.log(`App instances clustering on port ${port}`);
});