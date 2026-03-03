import { createRequestHandler } from "@react-router/express";
import express from "express";

import * as build from "./build/server/index.js";

const app = express();

app.use(express.static("build/client"));

// ISR-like cache: serves stale HTML instantly, revalidates in background
const ssrCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ISR_PATHS = new Set(["/"]);

function isrMiddleware(req, res, next) {
    if (req.method !== "GET" || !ISR_PATHS.has(req.path)) {
        return next();
    }

    const cached = ssrCache.get(req.path);

    if (cached) {
        const age = Date.now() - cached.timestamp;

        // Serve from cache immediately
        res.set("Content-Type", "text/html");
        res.set("X-Cache", age < CACHE_TTL_MS ? "HIT" : "STALE");
        res.send(cached.html);

        // If stale, revalidate in background
        if (age >= CACHE_TTL_MS) {
            renderAndCache(req).catch(() => {});
        }
        return;
    }

    // First request — render, cache, and respond
    renderAndCache(req)
        .then((html) => {
            res.set("Content-Type", "text/html");
            res.set("X-Cache", "MISS");
            res.send(html);
        })
        .catch(() => next());
}

async function renderAndCache(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    // Only forward safe headers — no cookies/auth to avoid caching user-specific content
    const safeHeaders = {};
    for (const key of ["accept", "accept-language", "user-agent", "host"]) {
        if (req.headers[key]) safeHeaders[key] = req.headers[key];
    }
    const request = new Request(url.href, {
        method: "GET",
        headers: new Headers(safeHeaders),
    });

    const handler = createRequestHandler({ build });
    const response = await handler(request);
    const html = await response.text();

    ssrCache.set(req.path, { html, timestamp: Date.now() });
    return html;
}

app.use(isrMiddleware);
app.all("*splat", createRequestHandler({ build }));

const port = process.env.PORT || 4200;
app.listen(port, "0.0.0.0", () => {
    console.log(`App instances clustering on port ${port}`);
});
