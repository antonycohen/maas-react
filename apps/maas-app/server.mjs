import { createRequestHandler } from "@react-router/express";
import { createRequestHandler as createFetchHandler } from "react-router";
import express from "express";

import * as build from "./build/server/index.js";

const app = express();

app.use(express.static("build/client"));

// ISR-like cache: serves stale HTML instantly, revalidates in background
const ssrCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ISR_PATHS = new Set(["/"]);
const revalidating = new Set();

// Fetch-style handler for ISR rendering (no Express res needed)
const fetchHandler = createFetchHandler(build);

app.use((req, res, next) => {
    if (req.method !== "GET" || !ISR_PATHS.has(req.path)) {
        return next();
    }

    // ?purge=1 clears the cache for this path and forces a fresh render
    if (req.query.purge === "1") {
        console.log(`[ISR] ${req.path} — PURGE (forced rebuild)`);
        ssrCache.delete(req.path);
        return ssrRender(req)
            .then((result) => {
                if (result.statusCode === 200) {
                    ssrCache.set(req.path, { ...result, timestamp: Date.now() });
                    console.log(`[ISR] Rebuilt and cached ${req.path} (${result.body.length} bytes)`);
                }
                res.set("X-Cache", "PURGE");
                sendCached(res, result);
            })
            .catch((err) => {
                console.error(`[ISR] Purge render failed for ${req.path}:`, err);
                next();
            });
    }

    const cached = ssrCache.get(req.path);

    if (cached) {
        const age = Date.now() - cached.timestamp;
        const status = age < CACHE_TTL_MS ? "HIT" : "STALE";
        console.log(`[ISR] ${req.path} — ${status} (${Math.round(age / 1000)}s old)`);

        res.set("X-Cache", status);
        sendCached(res, cached);

        // If stale, revalidate in background
        if (age >= CACHE_TTL_MS && !revalidating.has(req.path)) {
            revalidating.add(req.path);
            ssrRender(req)
                .then((result) => {
                    if (result) {
                        ssrCache.set(req.path, { ...result, timestamp: Date.now() });
                        console.log(`[ISR] Revalidated ${req.path}`);
                    }
                })
                .catch((err) => console.error(`[ISR] Revalidation failed:`, err))
                .finally(() => revalidating.delete(req.path));
        }
        return;
    }

    // First request — render, cache, respond
    console.log(`[ISR] ${req.path} — MISS (first render)`);
    ssrRender(req)
        .then((result) => {
            if (result.statusCode === 200) {
                ssrCache.set(req.path, { ...result, timestamp: Date.now() });
                console.log(`[ISR] Cached ${req.path} (${result.body.length} bytes)`);
            }
            res.set("X-Cache", "MISS");
            sendCached(res, result);
        })
        .catch((err) => {
            console.error(`[ISR] Render failed for ${req.path}:`, err);
            next();
        });
});

function sendCached(res, cached) {
    for (const [key, value] of Object.entries(cached.headers)) {
        res.set(key, value);
    }
    res.status(cached.statusCode).send(cached.body);
}

async function ssrRender(req) {
    // Build a Web Request from the Express req
    const proto = req.protocol || "http";
    const host = req.get("host") || "localhost";
    const url = `${proto}://${host}${req.originalUrl}`;

    const request = new Request(url, {
        method: "GET",
        headers: new Headers({
            accept: req.get("accept") || "text/html",
            "accept-language": req.get("accept-language") || "",
            "user-agent": req.get("user-agent") || "",
        }),
    });

    const response = await fetchHandler(request);
    const body = await response.text();

    const headers = {};
    for (const [key, value] of response.headers.entries()) {
        headers[key] = value;
    }

    return { statusCode: response.status, headers, body };
}

app.all("*splat", createRequestHandler({ build }));

const port = process.env.PORT || 4200;
app.listen(port, "0.0.0.0", () => {
    console.log(`App instances clustering on port ${port}`);
});
