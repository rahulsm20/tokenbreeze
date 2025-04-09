import { check, sleep } from "k6";
import http from "k6/http";

export const options = {
  thresholds: {
    http_req_duration: ["p(99) < 3000"],
  },
  stages: [
    { duration: "30s", target: 15 },
    { duration: "1m", target: 15 },
    { duration: "20s", target: 0 },
  ],
};

const DEX_AGGREGATOR_SPECIFIC = `
  query DexAggregatorSpecific($symbol: String!, $dateRange: DateRange) {
    dexAggregatorSpecific(symbol: $symbol, dateRange: $dateRange){
      date
      price
    }
  }
`;

const API_BASE_URL = __ENV.API_BASE_URL || "http://localhost:4000";

export default function () {
  let res = http.post(
    `${API_BASE_URL}/api/v1/graphql`,
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
