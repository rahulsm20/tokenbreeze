import axios from "axios";

/**
 * @description This function handles the swap transaction using the 1inch API.
 * @param req
 * @param res
 * @returns
 */
export const quote = async (
  _: any,
  {
    tokenOne,
    tokenTwo,
    tokenOneAmount,
    address,
  }: {
    tokenOne: {
      address: string;
      symbol: string;
      decimals: number;
    };
    tokenTwo: string;
    tokenOneAmount: string;
    address: string;
  }
) => {
  const transactionData = await axios.get(
    `https://api.1inch.dev/swap/v6.0/1/swap?src=${tokenOne}&dst=${tokenTwo}&amount=${tokenOneAmount.padEnd(
      tokenOne.decimals + tokenOneAmount.length,
      "0"
    )}&from=${address}&origin=${address}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
      },
      params: {
        slippage: 1,
      },
    }
  );
  return transactionData.data;
};
