import { cmcClient } from "../lib/cmc";

export const dexListings = async () => {
  const listings = await cmcClient.getLatestListings();
  return listings;
};
