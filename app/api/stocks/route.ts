import { NextResponse } from "next/server";

// Mock stock data (replace with real API like Alpha Vantage)
const mockStocks: Record<string, { price: number; change: number; changePercent: number }> = {
  AAPL: { price: 178.52, change: 2.34, changePercent: 1.33 },
  NVDA: { price: 495.22, change: 12.45, changePercent: 2.58 },
  GOOGL: { price: 141.80, change: -1.23, changePercent: -0.86 },
  MSFT: { price: 378.91, change: 4.56, changePercent: 1.22 },
  TSLA: { price: 248.50, change: -5.67, changePercent: -2.23 },
  META: { price: 505.95, change: 8.92, changePercent: 1.79 },
  AMZN: { price: 178.25, change: 3.21, changePercent: 1.83 },
  AMD: { price: 164.38, change: 6.78, changePercent: 4.30 },
};

const indices = [
  { name: "S&P 500", value: "4,783.45", change: "+0.82%" },
  { name: "Dow", value: "37,592.18", change: "+0.56%" },
  { name: "Nasdaq", value: "15,055.65", change: "+1.24%" },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols")?.split(",") || Object.keys(mockStocks);

  const quotes = symbols.map((symbol) => {
    const stock = mockStocks[symbol.toUpperCase()];
    if (!stock) {
      return { symbol: symbol.toUpperCase(), price: 0, change: 0, changePercent: 0 };
    }
    return { symbol: symbol.toUpperCase(), ...stock };
  });

  return NextResponse.json({ quotes, indices });
}
