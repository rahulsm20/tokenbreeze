use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
struct Quote {
    price: f64,
    percent_change_1h: f64,
    percent_change_24h: f64,
    percent_change_7d: f64,
    percent_change_30d: f64,
    percent_change_60d: f64,
    percent_change_90d: f64,
}

#[derive(Serialize, Deserialize, Debug)]
struct DexAggregatorResult {
    price: f64,
    provider: String,
    price_change_percentage_24h: f64,
    percent_change_7d: f64,
    percent_change_1h: f64,
    percent_change_24h: f64,
    total_supply: f64,
    market_cap: f64,
    total_volume: f64,
    sparkline_in_7d: f64,
}

#[derive(Serialize, Deserialize, Debug)]
struct DexAggregatorInfo {
    id: String,
    name: String,
    symbol: String,
    current_price: f64,
    price_change_percentage_24h: f64,
    image: String,
    providers: Vec<String>,
    quote: serde_json::Value,
    results: Vec<DexAggregatorResult>,
}

pub static DEX_AGGREGATOR_QUERY: &str = r#"
    query dexAggregator($currency: String!) {
        dexAggregator(currency: $currency) {
            info {
                id
                name
                symbol
                current_price
                price_change_percentage_24h
                image
                quote {
                    USD {
                        price
                        percent_change_1h
                        percent_change_24h
                        percent_change_7d
                        percent_change_30d
                        percent_change_60d
                        percent_change_90d
                    }
                    GBP {
                        price
                        percent_change_1h
                        percent_change_24h
                        percent_change_7d
                        percent_change_30d
                        percent_change_60d
                        percent_change_90d
                    }
                    EUR {
                        price
                        percent_change_1h
                        percent_change_24h
                        percent_change_7d
                        percent_change_30d
                        percent_change_60d
                        percent_change_90d
                    }
                    INR {
                        price
                        percent_change_1h
                        percent_change_24h
                        percent_change_7d
                        percent_change_30d
                        percent_change_60d
                        percent_change_90d
                    }
                }
            }
            providers
            results {
                price
                provider
                price_change_percentage_24h
                percent_change_7d
                percent_change_1h
                percent_change_24h
                total_supply
                market_cap
                total_volume
                sparkline_in_7d
            }
        }
    }
"#;

pub static DEX_AGGREGATOR_SPECIFIC_QUERY: &str = r#"
    query dexAggregatorSpecific($id: String!, $symbol: String!, $dateRange: DateRange, $currency: String!) {
        dexAggregatorSpecific(id: $id, symbol: $symbol, dateRange: $dateRange, currency: $currency) {
            date
            CoinGecko
            Coinbase
            Binance
        }
    }
"#;

#[derive(Clone, clap::ValueEnum, Debug, PartialEq, Eq, Hash)]
pub enum DateRange {
    OneHour,
    SevenDays,
    TwentyFourHours,
    ThirtyDays,
}

impl DateRange {
    pub fn as_graphql_str(&self) -> &str {
        match self {
            DateRange::OneHour => "one_hour",
            DateRange::SevenDays => "seven_days",
            DateRange::TwentyFourHours => "twenty_four_hours",
            DateRange::ThirtyDays => "thirty_days",
        }
    }
}
