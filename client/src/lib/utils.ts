import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const weiToEth = (
  wei: string,
  returnType?: "string" | "number"
): string | number => {
  const bigIntWei = BigInt(wei);
  const ether = bigIntWei / BigInt(1e18);
  const remainder = bigIntWei % BigInt(1e18);
  const decimal = remainder.toString().padStart(18, "0");
  if (returnType === "number") {
    return parseFloat(`${ether}.${decimal.slice(0, 6)}`);
  }
  return `${ether}.${decimal.slice(0, 6)}`;
};

export function randomIntFromInterval({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export type BalanceChartDataType = {
  date: string;
  outgress: number;
  ingress: number;
};
