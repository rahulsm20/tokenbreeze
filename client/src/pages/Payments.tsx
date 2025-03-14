import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ConnectKitButton } from "connectkit";
import { ArrowUpDown, ArrowUpRight } from "lucide-react";

const Payments = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center m-10 gap-5 flex-col">
        <ConnectKitButton />
        <div className="flex gap-2 items-center justify-center mt-2">
          <p className="text-sm">Swaps powered by</p>
          <img src="/uniswap.png" className="h-5 w-5" />
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button className="rounded-full">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <span className="text-sm">Swap</span>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button className="rounded-full">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <span className="text-sm">Send</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
