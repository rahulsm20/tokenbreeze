import { Auth0Client } from "@auth0/auth0-spa-js";
import axios, { AxiosInstance } from "axios";
import { FieldValues } from "react-hook-form";
import { UserDetailsType } from "../types";

/**
 * ApiService class to handle API requests.
 * It uses Axios for making HTTP requests and Auth0 for authentication.
 * The class provides methods to interact with the API endpoints for news, user details, stocks, wallet, transactions, and expenses.
 */
class ApiService {
  private api: AxiosInstance;
  private auth0Client: Auth0Client;

  constructor(auth0Client: Auth0Client, baseUrl: string) {
    this.auth0Client = auth0Client;

    this.api = axios.create({
      baseURL: baseUrl,
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private async getToken(): Promise<string | null> {
    try {
      return await this.auth0Client.getTokenSilently();
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  }

  async getNews(query: string) {
    try {
      const response = await this.api.get(`/news?q=${query}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async addUpdateUserDetails(userDetails: UserDetailsType) {
    try {
      const response = await this.api.post("/user", { userDetails });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async getUserDetails() {
    try {
      const response = await this.api.get("/user");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async getStockData() {
    try {
      const response = await this.api.get("/user/stocks");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async getWalletData() {
    try {
      const response = await this.api.get("/user/wallet");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async deleteStock(stockId: string) {
    try {
      const response = await this.api.delete("/user/stocks", {
        data: { stockId },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async searchStock(query: string) {
    try {
      const response = await this.api.get(`/user/stocks?search=${query}`);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async getBalanceInUSD(balance: bigint | 0) {
    try {
      const response = await this.api.post(`/user/balanceInUSD`, { balance });
      return response.data.balanceInUSD;
    } catch (err) {
      console.error(err);
    }
  }

  async getTransactions(address: string) {
    try {
      const response = await this.api.post("/user/transactions", { address });
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async addUpdateExpenseItem(data: FieldValues) {
    try {
      const response = await this.api.post("/user/expenses", data);
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async getExpenseData() {
    try {
      const response = await this.api.get("/user/expenses");
      return response.data;
    } catch (err) {
      console.error(err);
    }
  }

  async sendSwap({ tokenOne, tokenTwo, tokenOneAmount, address }: FieldValues) {
    const response = await this.api.post("/swap", {
      tokenOne,
      tokenTwo,
      tokenOneAmount,
      address,
    });
    return response.data;
  }

  async getTokenPrice({ tokenOne, tokenTwo, tokenOneAmount }: FieldValues) {
    try {
      const response = await this.api.post("/quote", {
        tokenOne,
        tokenTwo,
        tokenOneAmount,
      });
      return response.data;
    } catch (err) {
      console.log({ err });
    }
  }
}

export default ApiService;
