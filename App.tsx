// App.tsx
import React, { useEffect } from "react";
import { View, Text, Platform, StyleSheet } from "react-native";
import { DaimoPayProvider, DaimoPayButton, getDefaultConfig } from "@daimo/pay";
import { baseUSDC, optimismUSDC } from "@daimo/pay-common";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAddress } from "viem";

// Add minimal CSS reset for web
if (Platform.OS === "web") {
  const style = document.createElement("style");
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    #root {
      height: 100vh;
    }
  `;
  document.head.appendChild(style);
}

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: "Daimo Expo Web Demo",
  })
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on wallet-related errors
        if (
          error?.message?.includes("wallet") ||
          error?.message?.includes("ethereum")
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DaimoPayProvider>
          <View style={styles.container}>
            <Text style={styles.title}>🔧 Daimo Pay Expo Demo</Text>
            <Text style={styles.text}>Rendering from Expo</Text>
            <Text style={styles.text}>Platform: {Platform.OS}</Text>
            <DaimoPayButton
              intent="Deposit"
              appId="pay-demo"
              toChain={baseUSDC.chainId}
              toToken={getAddress(baseUSDC.token)}
              toAddress="0x4E04D236A5aEd4EB7d95E0514c4c8394c690BB58"
            />
          </View>
        </DaimoPayProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151", // Dark gray
    marginBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 10,
    textAlign: "center",
  },
});
