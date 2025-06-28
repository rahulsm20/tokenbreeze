/*
  WalletActionModal.tsx
  This component is used to display a modal for sending or swapping tokens.
  It uses the Form component from react-hook-form to handle form validation and submission.
  It also uses the useSendTransaction hook from wagmi to send transactions to the Ethereum network.
  The component uses the apiService to fetch token prices and send swap transactions.
  The component also uses the TWInput and TWSelect components to render input fields and select dropdowns.
  The component uses the zod library for schema validation of the form inputs.
  The component uses the useEffect hook to fetch the swap price when the form values change.
*/

// -----------------------------------------------------

import Modal from "@/components/modal/index.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { parseEther } from "viem";
import { useSendTransaction } from "wagmi";
import { z } from "zod";
// import { apiService } from "../../api";
import { apiService } from "@/lib/index.ts";
import TWInput from "../TWInput.tsx";
import TWSelect from "../TWSelect.tsx";
import tokenList from "../tokenList.json";

// ------------------------------------------------------

const WalletActionModal = ({ ...props }) => {
  const { sendTransaction, isPaused, isPending } = useSendTransaction();
  const [loading, setLoading] = useState(false);
  const sendFormSchema = z.object({
    to: z.string().min(42, {
      message: "Wallet address must be 42 characters long",
    }),
    value: z.coerce.number().min(0, {
      message: "Value must be greater than 0",
    }),
  });

  const sendForm = useForm({
    resolver: zodResolver(sendFormSchema),
    mode: "onBlur",
  });

  const swapFormSchema = z.object({
    to: z.coerce.number().min(0, {
      message: "Value must be greater than 0",
    }),
    toToken: z.string().min(1, {
      message: "To Token must be selected",
    }),
    from: z.coerce.number().min(0, {
      message: "Value must be greater than 0",
    }),
    fromToken: z.string().min(1, {
      message: "From Token must be selected",
    }),
  });

  const swapForm = useForm({
    resolver: zodResolver(swapFormSchema),
    mode: "onBlur",
  });

  const swapValues = swapForm.watch();

  const tokenOptions = tokenList.map((token, idx) => ({
    label: (
      <div className="flex gap-2 items-center justify-center" key={idx}>
        <span>{token.name}</span>
        <img src={token.img} alt={token.name} className="w-4 h-4" />
      </div>
    ),
    value: token.address,
  }));

  const onSubmit: SubmitHandler<FieldValues> = async ({ to, value }) => {
    setLoading(true);
    try {
      if (props.title == "Send") {
        sendTransaction({ to, value: parseEther(`${value}`) });
      } else {
        await sendSwap();
      }
    } catch (e) {
      console.log({ e });
    } finally {
      setLoading(false);
    }
  };

  const tokenOne = swapForm.watch("fromToken");
  const tokenOneAmount = swapForm.watch("from");
  const tokenTwo = swapForm.watch("toToken");

  async function sendSwap() {
    try {
      const tx = await apiService.sendSwap({
        tokenOne,
        tokenTwo,
        tokenOneAmount,
        address: props.address,
      });

      sendTransaction({
        to: tx.data.tx.to,
        value: tx.data.tx.value,
        data: tx.data.tx.data,
      });
    } catch (err) {
      console.log(err, "error in sendSwap");
      if (err instanceof AxiosError) {
        if (props?.setErrorSuccessModal) {
          props.setErrorSuccessModal({
            modalOpen: true,
            title: "Error",
            trigger: null,
            description: err?.response?.data.message,
            cancelText: "Dismiss",
            onCancel: () => {
              props.setErrorSuccessModal({
                modalOpen: false,
                title: "",
                trigger: null,
                description: "",
                okText: "",
              });
            },
          });
        }
      }
    }
  }

  const fetchSwapPrice = async () => {
    try {
      const { setValue } = swapForm;
      console.log("fetching swap price");
      const tokenPrice = await apiService.getTokenPrice({
        tokenOne,
        tokenTwo,
        tokenOneAmount,
      });
      console.log({ tokenPrice });
      setValue("to", tokenPrice.dstAmount);
      return tokenPrice;
    } catch (err) {
      console.log(err, "error in fetchSwapPrice");
    }
  };

  useEffect(() => {
    if (swapValues.from && swapValues.fromToken && swapValues.toToken) {
      fetchSwapPrice();
    }
  }, [swapValues.from, swapValues.fromToken, swapValues.toToken]);

  return (
    <Modal
      onOk={async () => {
        try {
          onSubmit(sendForm.getValues());
        } catch (err) {
          console.log({ err });
        }
      }}
      loading={loading}
      disableButtons={isPaused || isPending}
      {...props}
    >
      {props.title == "Send" ? (
        <Form {...sendForm}>
          <form className="flex flex-col gap-5">
            <FormField
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TWInput
                      placeholder="Enter address to send to"
                      label="To"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TWInput
                      placeholder="Enter value to send"
                      label="Value (ETH)"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      ) : (
        <Form {...swapForm}>
          <form className="flex flex-col gap-5">
            <div className="flex gap-5">
              <FormField
                name="from"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <TWInput
                          placeholder="Enter value to send"
                          label="From"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="fromToken"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TWSelect
                        placeholder="Enter value to send"
                        label="Token"
                        options={tokenOptions}
                        gap="1.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="flex gap-5">
              <FormField
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TWInput
                        label="To"
                        type="number"
                        disabled={true}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="toToken"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TWSelect
                        placeholder="Enter value to send"
                        label="Token"
                        options={tokenOptions}
                        gap="1.5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      )}
    </Modal>
  );
};

export default WalletActionModal;
