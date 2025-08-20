// App.tsx
import React, { useEffect } from 'react';
import { View, Text, Platform, StyleSheet, ScrollView } from 'react-native';
import { DaimoPayProvider, DaimoPayButton, getDefaultConfig } from '@daimo/pay';
import { optimismUSDC } from '@daimo/pay-common';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getAddress } from 'viem';

const wagmiConfig = createConfig(
  getDefaultConfig({
    appName: 'Daimo Expo Web Demo',
  }),
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on wallet-related errors
        if (error?.message?.includes('wallet') || error?.message?.includes('ethereum')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

// Handle wallet conflicts and errors
const handleWalletErrors = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Suppress MetaMask provider conflicts
    const originalError = console.error;
    console.error = (...args) => {
      const message = args[0];
      if (
        typeof message === 'string' && 
        (message.includes('MetaMask encountered an error setting the global Ethereum provider') ||
         message.includes('Cannot set property ethereum') ||
         message.includes('Cannot redefine property: ethereum'))
      ) {
        // Silently ignore these wallet conflict errors
        return;
      }
      originalError.apply(console, args);
    };

    // Handle uncaught promise rejections from wallet extensions
    window.addEventListener('unhandledrejection', (event) => {
      if (
        event.reason?.message?.includes('MutationObserver') ||
        event.reason?.message?.includes('solanaActionsContentScript')
      ) {
        event.preventDefault();
        console.warn('Suppressed wallet extension error:', event.reason?.message);
      }
    });
  }
};

export default function App() {
  useEffect(() => {
    handleWalletErrors();
    console.log('🚀 App component mounted!');
    console.log('Platform.OS:', Platform.OS);
  }, []);

  // Debug: Simple fallback UI
  const DebugUI = () => (
    <View
      style={[
        styles.debugContainer,
        Platform.OS === 'web' ? ({ minHeight: '100vh' } as any) : null,
      ]}
    >
      <Text style={styles.debugTitle}>🔧 DEBUG MODE</Text>
      <Text style={styles.debugText}>App is rendering!</Text>
      <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
      <Text style={styles.debugText}>React Native Web working!</Text>
    </View>
  );

  // For debugging, let's try a simple render first
  const isDebugMode = false; // Disabled now that rendering is verified

  if (isDebugMode) {
    return <DebugUI />;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <DaimoPayProvider>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
              {/* Header Section */}
              <View style={styles.header}>
                <Text style={styles.title}>Daimo Pay Demo</Text>
                <Text style={styles.subtitle}>
                  Experience seamless crypto payments with Daimo
                </Text>
              </View>

              {/* Main Content */}
              <View style={styles.content}>
                {Platform.OS === 'web' ? (
                  <View style={styles.paymentSection}>
                    <View style={styles.paymentCard}>
                      <Text style={styles.cardTitle}>Quick Payment</Text>
                      <Text style={styles.cardDescription}>
                        Send $1.00 USDC on Optimism network
                      </Text>
                      
                      <View style={styles.paymentDetails}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Amount:</Text>
                          <Text style={styles.detailValue}>$1.00 USDC</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Network:</Text>
                          <Text style={styles.detailValue}>Optimism</Text>
                        </View>
                      </View>

                      <View style={styles.buttonContainer}>
                        <DaimoPayButton
                          appId="pay-demo"
                          toChain={optimismUSDC.chainId}
                          toUnits="1.00"
                          toToken={getAddress(optimismUSDC.token)}
                          toAddress="0x4E04D236A5aEd4EB7d95E0514c4c8394c690BB58"
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.mobileMessage}>
                    <Text style={styles.mobileIcon}>💻</Text>
                    <Text style={styles.mobileText}>
                      Open this project in a browser to see the Daimo Pay button
                    </Text>
                  </View>
                )}
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Powered by Daimo • Secure • Fast • Decentralized
                </Text>
              </View>
            </View>
          </ScrollView>
        </DaimoPayProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ...(Platform.OS === 'web' && {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  paymentSection: {
    width: '100%',
    maxWidth: 480,
    alignItems: 'center',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  paymentDetails: {
    marginBottom: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a202c',
    fontWeight: '600',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  mobileMessage: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mobileIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  mobileText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  // Debug styles
  debugContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  debugTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginBottom: 20,
    textAlign: 'center',
  },
  debugText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});