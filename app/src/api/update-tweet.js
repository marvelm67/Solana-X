import { useWorkspace } from "@/composables";

export const updateTweet = async (tweet, topic, content) => {
  const { wallet, program } = useWorkspace();

  if (!wallet.value || !program.value) {
    throw new Error("Wallet not connected");
  }

  await program.value.rpc.updateTweet(topic, content, {
    accounts: {
      author: wallet.value.publicKey,
      tweet: tweet.publicKey,
    },
  });

  tweet.topic = topic;
  tweet.content = content;
};
