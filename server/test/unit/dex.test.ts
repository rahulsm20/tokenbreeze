import { DEX_AGGREGATOR, DEX_AGGREGATOR_SPECIFIC } from "@/graphql/queries";
import { schema } from "@/graphql/typedefs";
import assert from "assert";
import { describe, it } from "bun:test";
import dotenv from "dotenv";
import { graphql } from "graphql";
dotenv.config();

describe("listing test", () => {
  it("should return listings accurately", async () => {
    const query = DEX_AGGREGATOR;
    const result = await graphql({
      schema,
      source: query,
      variableValues: {
        currency: "usd", // Default currency for the test
      },
    });
    assert.equal(result.errors, undefined);
    assert.notEqual(result.data?.dexAggregator, undefined);
    if (
      result.data?.dexAggregator &&
      Array.isArray(result.data?.dexAggregator)
    ) {
      assert.notEqual(result.data?.dexAggregator.length, undefined);
    } else {
      assert.fail("No data returned");
    }
  });
});

describe("specific coin historical data test", () => {
  it("should return coin historical data accurately", async () => {
    const query = DEX_AGGREGATOR_SPECIFIC;
    const result = await graphql({
      schema,
      source: query,
      variableValues: {
        symbol: "bitcoin",
        currency: "usd",
      },
    });

    assert.equal(result.errors, undefined);
    assert.notEqual(result.data?.dexAggregatorSpecific, undefined);
    if (
      result.data?.dexAggregatorSpecific &&
      Array.isArray(result.data?.dexAggregatorSpecific)
    ) {
      assert.notEqual(result.data?.dexAggregatorSpecific.length, undefined);
    } else {
      assert.fail("No data returned");
    }
  });
});
