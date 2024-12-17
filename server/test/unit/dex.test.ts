import { describe, it } from "mocha";
import { graphql } from "graphql";
import assert from "assert";
import {
  DEX_AGGREGATOR,
  DEX_AGGREGATOR_SPECIFIC,
} from "../../src/graphql/queries";
import { schema } from "../../src/graphql/typedefs";

describe("listing test", () => {
  it("should return listings accurately", async () => {
    const query = DEX_AGGREGATOR;
    const result = await graphql({
      schema,
      source: query,
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
