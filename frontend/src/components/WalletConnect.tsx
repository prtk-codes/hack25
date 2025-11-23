import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  // connectors comes from the wagmi config
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // pick the injected connector (MetaMask, Brave, etc.)
  const injectedConnector = connectors.find((c) => c.id === "injected");

  if (!isConnected) {
    return (
      <button
        className="button button-secondary"
        onClick={() =>
          injectedConnector && connect({ connector: injectedConnector })
        }
        disabled={!injectedConnector || isPending}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </button>
    );
  }

  const short = `${address?.slice(0, 6)}...${address?.slice(-4)}`;

  return (
    <div className="wallet-row">
      <div className="wallet-address">{short}</div>
      <button className="button" onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}
