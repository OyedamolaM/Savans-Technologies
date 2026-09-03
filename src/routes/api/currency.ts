import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/currency")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const country =
          request.headers.get("x-vercel-ip-country") ??
          request.headers.get("cf-ipcountry") ??
          request.headers.get("x-country-code");
        const currency = country ? (country.toUpperCase() === "NG" ? "NGN" : "USD") : null;

        return Response.json({ currency });
      },
    },
  },
});
