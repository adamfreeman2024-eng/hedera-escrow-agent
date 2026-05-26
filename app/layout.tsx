import "./globals.css";

export const metadata = {
  title: "OnlineMall Smart Escrow Agent",
  description: "Enterprise Escrow AI Agent (Hedera Bounty Week 2)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

