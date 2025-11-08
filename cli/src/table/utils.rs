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

#[derive(Tabled)]
pub struct DexRowSpecific {
    coin: String,
    avg_coinbase: String,
    avg_binance: String,
}

enum DexResult {
    Rows(Vec<DexRow>),
    SpecificRows(Vec<DexRowSpecific>),
}

//--------------------------------------------------------------

// fn downsample(values: &[f64], width: usize) -> Vec<f64> {
//     if values.len() <= width {
//         return values.to_vec();
//     }

//     let step = values.len() as f64 / width as f64;
//     (0..width)
//         .map(|i| values[(i as f64 * step) as usize])
//         .collect()
// }

/// Converts numbers to a sparkline string with optional width
// pub fn sparkline_for_table(values: &[f64], width: usize) -> String {
//     let sampled = downsample(values, width);
//     let theme = select_sparkline(SparkThemeName::Colour);
//     let (min, max) = min_max_for_data(&sampled, None, None);

//     sampled
//         .iter()
//         .map(|v| theme.spark(min, max, *v).as_str())
//         .collect()
// }
fn collect_results(aggregators: &Vec<Value>, key: &str, coin: Option<&str>) -> Option<DexResult> {
    let mut rows: Vec<DexRow> = Vec::new();
    let mut specific_rows = Vec::new();
    if key == "dexAggregatorSpecific" {
        let mut avg_coinbase_price = 0.0;
        let mut avg_binance_price = 0.0;

        let coin = coin;
        for agg in aggregators {
            let binance = agg.get("Binance").unwrap_or(&Value::Null);
            let coinbase = agg.get("Coinbase").unwrap_or(&Value::Null);
            if !coinbase.is_null() {
                avg_coinbase_price = (avg_coinbase_price + coinbase.as_f64().unwrap_or(0.0)) / 2.0;
            }
            if !binance.is_null() {
                avg_binance_price = (avg_binance_price + binance.as_f64().unwrap_or(0.0)) / 2.0;
            }
        }
        specific_rows.push(DexRowSpecific {
            coin: coin.unwrap_or("-").to_string(),
            avg_coinbase: avg_coinbase_price.to_string(),
            avg_binance: avg_binance_price.to_string(),
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
                            // if let Some(_arr) = r.get("sparkline_in_7d").and_then(|v| v.as_array())
                            // {
                            //     sparkline_str = agg["results"][0]["sparkline_in_7d"]
                            //         .as_array()
                            //         .map(|arr| {
                            //             let nums: Vec<f64> =
                            //                 arr.iter().filter_map(|v| v.as_f64()).collect();
                            //             sparkline_for_table(&nums, 30) // 20 characters wide
                            //         })
                            //         .unwrap_or("-".to_string());
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
    if key == "dexAggregatorSpecific" {
        Some(DexResult::SpecificRows(specific_rows))
    } else {
        Some(DexResult::Rows(rows))
    }
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
        if let Some(res) = rows {
            match res {
                DexResult::Rows(rows_vec) => {
                    let mut table = Table::new(rows_vec);
                    table.with(Style::modern());
                    table.modify(Columns::first(), Alignment::left())
                    // .with(
                    //     Modify::new(Columns::last()).with(tabled::settings::Width::truncate(100)),
                    // )
                    ;

                    println!("{}", table);
                }
                DexResult::SpecificRows(spec_vec) => {
                    let mut table = Table::new(spec_vec);
                    table.with(Style::modern());
                    table.modify(Columns::first(), Alignment::left());
                    println!("{}", table);
                }
            }
        }
    } else {
        println!("{}", serde_json::to_string_pretty(&json).unwrap());
    }
}
