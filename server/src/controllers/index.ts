import { logger } from "@/logger";

export const getTransactions = async (
  _: any,
  { address }: { address: string }
) => {
  try {
    const transactions: any[] = [];
    // const transactions = await ethProvider.getTra
    return transactions;
  } catch (err) {
    logger.error("Error fetching transactions", err);
    return err;
  }
};
