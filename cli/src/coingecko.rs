use serde::Deserialize;
use anyhow::{anyhow, Result};

#[derive(Debug, Deserialize)]
struct PriceResponse {
    #[serde(flatten)]
    prices: std::collections::HashMap<String, std::collections::HashMap<String, f64>>,
}

pub async fn get_price(token: &str, currency: &str) -> Result<f64>  {
    let url = format!(
        "https://api.coingecko.com/api/v3/simple/price?ids={}&vs_currencies={}",
        token, currency
    );

    let response: PriceResponse = reqwest::get(&url).await?.json().await?;

    response
        .prices
        .get(token)
        .and_then(|curr_map| curr_map.get(currency))
        .copied()
        .ok_or_else(|| anyhow!("Price not found for {token}/{currency}"))
}