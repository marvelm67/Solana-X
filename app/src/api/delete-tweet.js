import { useWorkspace } from "@/composables";

export const deleteTweet = async (tweet) => {
  const { wallet, program } = useWorkspace();

  if (!wallet.value || !program.value) {
    throw new Error("Wallet not connected");
  }

  await program.value.rpc.deleteTweet({
    accounts: {
      author: wallet.value.publicKey,
      tweet: tweet.publicKey,
    },
  });
};
