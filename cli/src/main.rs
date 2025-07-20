mod coingecko;
use clap::command;
use clap::Parser; // Import the Parser derive macro
use clap::Subcommand;


#[derive(Parser)]
#[command(name = "tokenbreeze")]
#[command(about = "🪙 just another token price aggregator", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Get the current price of a token
    Price {
        token: String,

        #[arg(short, long, default_value = "usd")]
        currency: String,
    },
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    match cli.command {
        Commands::Price { token, currency } => {
            match coingecko::get_price(&token, &currency).await {
                Ok(price) => println!("{} = {} {}", token.to_uppercase(), price, currency.to_uppercase()),
                Err(e) => eprintln!("Error: {}", e),
            }
        }
    }
}
