use serde_json::Value;
// use sparkline::{SparkThemeName, min_max_for_data, select_sparkline};
use tabled::{
    Table, Tabled,
    settings::{Alignment, Style, object::Columns},
};

//--------------------------------------------------------------

#[derive(Tabled)]
pub struct DexRow {
    coin: String,
    coinbase: String,
    coingecko: String,
    binance: String,
    // sparkline: String,
}

//--------------------------------------------------------------
pub fn collect_results(
    aggregators: &Vec<Value>,
    key: &str,
    coin: Option<&str>,
) -> Option<Vec<DexRow>> {
    let mut rows = Vec::new();
    if key == "dexAggregatorSpecific" {
        let mut avg_coingecko_price = 0.0;
        let mut avg_coinbase_price = 0.0;
        let mut avg_binance_price = 0.0;

        let coin = coin;
        for agg in aggregators {
            let binance = agg.get("Binance").unwrap_or(&Value::Null);
            let coingecko = agg.get("CoinGecko").unwrap_or(&Value::Null);
            let coinbase = agg.get("Coinbase").unwrap_or(&Value::Null);
            if !coingecko.is_null() {
                avg_coingecko_price =
                    (avg_coingecko_price + coingecko.as_f64().unwrap_or(0.0)) / 2.0;
            }
            if !coinbase.is_null() {
                avg_coinbase_price = (avg_coinbase_price + coinbase.as_f64().unwrap_or(0.0)) / 2.0;
            }
            if !binance.is_null() {
                avg_binance_price = (avg_binance_price + binance.as_f64().unwrap_or(0.0)) / 2.0;
            }
        }
        rows.push(DexRow {
            coin: coin.unwrap_or("-").to_string(),
            coingecko: avg_coingecko_price.to_string(),
            coinbase: avg_coinbase_price.to_string(),
            binance: avg_binance_price.to_string(),
            // sparkline: sparkline_str,
        });
    } else {
        for agg in aggregators {
            let info = agg.get("info").unwrap_or(&Value::Null);
            let coin_name = info["name"].as_str().unwrap_or("-").to_string();

            let mut coingecko_price = "-".to_string();
            let mut coinbase_price = "-".to_string();
            let mut binance_price = "-".to_string();
            // let mut sparkline_str = "-".to_string();

            if let Some(results) = agg.get("results").and_then(|r| r.as_array()) {
                for r in results {
                    let provider = r["provider"].as_str().unwrap_or("");
                    let price = r["price"]
                        .as_f64()
                        .map(|p| format!("{:.2}", p))
                        .unwrap_or("-".into());

                    match provider {
                        "CoinGecko" => {
                            coingecko_price = price;
                            // if let Some(arr) = r.get("sparkline_in_7d").and_then(|v| v.as_array()) {
                            //     let points: Vec<f64> =
                            //         arr.iter().filter_map(|v| v.as_f64()).collect();
                            //     let theme =
                            //         sparkline::select_sparkline(sparkline::SparkThemeName::Colour);
                            //     let (min, max) = sparkline::min_max_for_data(&points, None, None);
                            //     sparkline_str = points
                            //         .iter()
                            //         .map(|v| theme.spark(min, max, *v).as_str())
                            //         .collect();
                            // }
                        }
                        "Coinbase" => coinbase_price = price,
                        "Binance" => binance_price = price,
                        _ => {}
                    }
                }
            }

            rows.push(DexRow {
                coin: coin_name,
                coingecko: coingecko_price,
                coinbase: coinbase_price,
                binance: binance_price,
                // sparkline: sparkline_str,
            });
        }
    }

    Some(rows)
}

pub fn display_json_table(json: &Value, key: Option<&str>, coin: Option<&str>) {
    if let Some(errors) = json.get("errors") {
        eprintln!("GraphQL errors: {}", errors);
        return;
    }

    if let Some(aggregators) = json
        .get("data")
        .and_then(|d| d.get(key.unwrap_or("dexAggregator")))
        .and_then(|v| v.as_array())
    {
        let rows = collect_results(aggregators, key.unwrap_or("dexAggregator"), coin);
        if let Some(r) = rows {
            let mut table = Table::new(r);
            table.with(Style::modern());
            table.modify(Columns::first(), Alignment::left());
            println!("{}", table);
        }
    } else {
        println!("{}", serde_json::to_string_pretty(&json).unwrap());
    }
}
