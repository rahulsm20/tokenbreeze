mod graphql;
mod table;
use crate::graphql::DateRange;
use crate::graphql::GraphQLHandler;
use clap::Parser;
use clap::Subcommand;
use clap::command;
use dotenv::dotenv;
use std::env;

#[derive(Parser)]
#[command(name = "tokenbreeze")]
#[command(about = "Tokenbreeze, 🪙 just another token price aggregator", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Get the current price of a token
    Price {
        #[arg(short, long)]
        token: String,
        #[arg(short, long, default_value = "USD")]
        currency: String,
        #[arg(short, long, default_value = "seven-days")]
        date_range: DateRange,
    },
    /// List top 10 tokens by market cap    
    List {
        #[arg(short, long, default_value = "USD")]
        currency: String,
    },
}

fn main() {
    let cli = Cli::parse();
    dotenv().ok();
    let url =
        env::var("SERVER_URL").unwrap_or_else(|_| "http://localhost:8000/graphql".to_string());
    // println!("Using server URL: {}", url);
    let graphql = GraphQLHandler::new(&url);
    match cli.command {
        Commands::Price {
            token,
            currency,
            date_range,
        } => {
            if let Err(e) =
                graphql.query_dex_aggregator_specific(&token, &token, &date_range, &currency)
            {
                eprintln!("Error querying DEX aggregator: {}", e);
            }
        }
        Commands::List { currency } => {
            if let Err(e) = graphql.query_dex_aggregator(&currency) {
                eprintln!("Error querying DEX aggregator: {}", e);
            }
        }
    }
}
