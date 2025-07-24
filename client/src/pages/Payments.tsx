// ------------------------------------------------------

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import WalletActionModal from "@/components/wallet/action-modal";
import { apiService } from "@/lib";
import { BalanceChartDataType, weiToEth } from "@/lib/utils";
import { onSwapProps, StoreRootState, WalletAction } from "@/types";
import { formatCurrency, web3ActionDescriptions } from "@/utils";
import { ConnectKitButton } from "connectkit";
import dayjs from "dayjs";
import { ArrowUpRight, Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useAccount, useBalance } from "wagmi";

// ------------------------------------------------------

const _onSwap = async (data: onSwapProps) => {
  console.log(data.to, data.from, data.amount);
};

// ------------------------------------------------------

/**
 * Payments Page \n
 * This page displays the user's wallet balance, transaction history, and allows the user to send or swap tokens.
 * It uses the ConnectKitButton component to connect the user's wallet and fetches the transaction history using the apiService.
 * It also uses the DataTable component to display the transaction history and the BarChart component from recharts to display the transaction summary.
 * The page also includes a modal for sending and swapping tokens, which is triggered by the user clicking on the corresponding button.
 */
const Payments = () => {
  const { addresses = [], isConnected, isConnecting } = useAccount();
  const [transactions, setTransactions] = useState([]);
  const {
    data: balance,
    isFetching,
    isFetched,
  } = useBalance({
    address: addresses.length > 0 ? addresses[0] : undefined,
  });
  const [loading, setLoading] = useState(false);

  const walletData = useSelector((state: StoreRootState) => state.wallet);
  const [chartData, setChartData] = useState<BalanceChartDataType[]>([]);

  const [errorSuccessModal, setErrorSuccessModal] = useState({
    open: false,
    title: "",
    description: "",
    trigger: null,
    onCancel: () => {},
  });

  const walletActions: {
    name: WalletAction;
    action: () => void;
    icon: JSX.Element;
  }[] = [
    {
      name: "Send",
      action: () => {},
      icon: <ArrowUpRight />,
    },
    // {
    //   name: "Swap",
    //   action: () => {},
    //   icon: <ArrowLeftRight />,
    // },
  ];

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const transactions = await apiService.getTransactions(addresses[0]);
        setTransactions(transactions);
        const chartData = [
          {
            date: dayjs().format("MMM YYYY"),
            ingress: 0,
            outgress: 0,
          },
        ];
        for (const transaction of transactions) {
          const value = weiToEth(transaction.value, "number");
          const isOutgoing =
            transaction.from.toLowerCase() === addresses[0].toLowerCase();

          if (typeof value === "number") {
            if (isOutgoing) {
              chartData[chartData.length - 1].outgress += value;
            } else {
              chartData[chartData.length - 1].ingress += value;
            }
          } else {
            if (isOutgoing) {
              chartData[chartData.length - 1].outgress += parseFloat(value);
            } else {
              chartData[chartData.length - 1].ingress += parseFloat(value);
            }
          }
        }
        chartData.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
        setChartData(chartData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (isConnected) {
      // fetchWalletData();
    }
  }, [isConnected, addresses]);

  const [data, setData] = useState<onSwapProps>({
    to: "",
    from: "",
    amount: "",
  });

  return (
    <Layout>
      <div className="flex items-center justify-center m-10 gap-5 flex-col">
        <ConnectKitButton
          label="Connect a wallet to get started →"
          customTheme={{
            "--ck-font-family": "Inter",
          }}
        />

        {isConnected && isFetched ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-4xl">
                {parseFloat(balance?.formatted || "").toFixed(4)} ETH
              </div>
            </div>
            <div className="text-2xl ">
              {formatCurrency(
                parseFloat(walletData.info.balance.toFixed(2)),
                "USD"
              )}
            </div>
            <div className="flex gap-3 text-sm">
              {walletActions.map((action) => (
                <WalletActionModal
                  title={action.name}
                  address={addresses[0]}
                  setErrorSuccessModal={setErrorSuccessModal}
                  description={web3ActionDescriptions[action.name]}
                  trigger={
                    <div className="flex flex-col gap-1 items-center">
                      <Button
                        key={action.name}
                        onClick={action.action}
                        className="w-20"
                      >
                        {action.icon}
                        {action.name}
                      </Button>
                    </div>
                  }
                  okText="Send"
                  cancelText="Cancel"
                  Text="Cancel"
                />
              ))}
            </div>
            {/* <p className="text-sm text-gray-500 flex gap-2">
              <span>Swaps powered by 1inch </span>
              <img
                src="https://1inch.io/assets/token-logo/1inch_token.svg"
                className="h-5 w-5"
              />
            </p> */}
          </>
        ) : !isFetching ? (
          <></>
        ) : (
          <Ellipsis className="animate-pulse" />
        )}
      </div>
    </Layout>
  );
};

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className="backdrop-blur-xl border p-2 rounded-md max-w-sm z-1">
        <p>{`Date: ${payload?.[0].payload.date}`}</p>
        {payload?.map((entry, index) => {
          return (
            <p key={`tooltip-${index}`}>
              {`${entry.name} : ${entry.value} ETH`}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default Payments;
