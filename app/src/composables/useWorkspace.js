import { computed } from "vue";
import { useAnchorWallet } from "solana-wallets-vue";
import { Connection, PublicKey } from "@solana/web3.js";
import { Provider, Program } from "@project-serum/anchor";
import idl from "@/idl/solana_twitter.json";

const clusterUrl = process.env.VUE_APP_CLUSTER_URL;
const preflightCommitment = "processed";
const commitment = "processed";
const programID = new PublicKey(idl.address);
let workspace = null;

export const useWorkspace = () => workspace;

export const initWorkspace = () => {
  const wallet = useAnchorWallet();
  const connection = new Connection(clusterUrl, {
    commitment,
    confirmTransactionInitialTimeout: 60000,
    wsEndpoint: clusterUrl.replace("http", "ws"),
  });
  const provider = computed(() => {
    if (!wallet.value) return null;
    return new Provider(connection, wallet.value, {
      preflightCommitment,
      commitment,
      skipPreflight: false,
    });
  });
  const program = computed(() => {
    if (!provider.value) return null;
    return new Program(idl, programID, provider.value);
  });

  workspace = {
    wallet,
    connection,
    provider,
    program,
  };
};
