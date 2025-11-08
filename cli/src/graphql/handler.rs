use indexmap::IndexMap;
use reqwest::blocking::Client;
use serde_json::{Value, json};
use std::result::Result::Ok;

use crate::{
    DateRange,
    graphql::{DEX_AGGREGATOR_QUERY, DEX_AGGREGATOR_SPECIFIC_QUERY},
};

pub struct GraphQLHandler {
    url: String,
    client: Client,
}

impl GraphQLHandler {
    pub fn new(url: &str) -> Self {
        GraphQLHandler {
            url: url.to_string(),
            client: Client::new(),
        }
    }

    fn handle_request(&self, query: &str, variables: Option<Value>) -> serde_json::Value {
        let body = if let Some(vars) = variables {
            json!({ "query": query, "variables": vars })
        } else {
            json!({ "query": query })
        };

        let resp = self.client.post(&self.url).json(&body).send();

        match resp {
            Ok(response) => {
                let json_resp: Value = response
                    .json()
                    .unwrap_or_else(|_| json!({"error": "Failed to parse JSON response"}));
                json_resp
            }
            Err(_) => json!({"error": "Request failed"}),
        }
    }

    pub fn query_dex_aggregator(&self, currency: &str) -> Result<(), anyhow::Error> {
        let query = DEX_AGGREGATOR_QUERY;
        let curr = currency.to_uppercase();
        let mut vars = IndexMap::new();
        vars.insert("currency", json!(curr));

        let variables = Value::Object(vars.into_iter().map(|(k, v)| (k.to_string(), v)).collect());

        let res = self.handle_request(query, Some(variables));
        crate::table::display_json_table(&res, Some("dexAggregator"), None);
        Ok(())
    }

    pub fn query_dex_aggregator_specific(
        &self,
        id: &str,
        symbol: &str,
        date_range: &DateRange,
        currency: &str,
    ) -> Result<(), anyhow::Error> {
        let query = DEX_AGGREGATOR_SPECIFIC_QUERY;

        let mut vars = IndexMap::new();
        vars.insert("id", json!(id));
        vars.insert("symbol", json!(symbol));
        vars.insert("dateRange", json!(date_range.as_graphql_str()));
        vars.insert("currency", json!(currency));

        let variables = Value::Object(vars.into_iter().map(|(k, v)| (k.to_string(), v)).collect());

        let res = self.handle_request(query, Some(variables));
        crate::table::display_json_table(&res, Some("dexAggregatorSpecific"), Some(id));

        Ok(())
    }
}
