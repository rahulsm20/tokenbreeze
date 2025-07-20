use anyhow::{Result, anyhow};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct PriceResponse {
    #[serde(flatten)]
    prices: std::collections::HashMap<String, std::collections::HashMap<String, f64>>,
}

/// Fetches the current price of a token in a specified currency from CoinGecko.
///
/// ### Arguments
/// * `token` - The ID of the token to fetch the price for (e.g., "bitcoin").
/// * `currency` - The currency to get the price in (e.g., "usd").
///
/// ### Returns
/// A Result containing the price as f64 if successful, or an error if not.
pub async fn get_price(token: &str, currency: &str) -> Result<f64> {
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
