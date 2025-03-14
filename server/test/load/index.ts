import http from "k6/http";
import { check, sleep } from "k6";
import { DEX_AGGREGATOR_SPECIFIC } from "@/graphql/queries";

// Test configuration
export const options = {
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ["p(99) < 3000"],
  },
  // Ramp the number of virtual users up and down
  stages: [
    { duration: "30s", target: 15 },
    { duration: "1m", target: 15 },
    { duration: "20s", target: 0 },
  ],
};

// Simulated user behavior
export default function () {
  let res = http.post(
    "http://localhost:3000/api/v1/graphql",
    JSON.stringify({
      query: DEX_AGGREGATOR_SPECIFIC,
      operationName: "DexAggregatorSpecific",
      variables: {
        symbol: "tether",
      },
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  // Validate response status
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}
