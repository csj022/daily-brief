"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { Calendar, Mail, TrendingUp, TrendingDown, Clock, ExternalLink, Sparkles, Newspaper, Cpu, BarChart2, PieChart, Eye, Plus, RefreshCw, LogOut, User } from "lucide-react";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>
);

export default function DailyBrief() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (session) { 
      fetch("/api/calendar").then(r => r.json()).then(d => console.log(d));
      setIsLoading(false);
    }
  }, [session]);

  if (status === "loading") return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 rounded-full border-t-transparent" /></div>;
  if (!session) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="p-8 text-center max-w-md">
        <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Daily Brief</h1>
        <button onClick={() => signIn("google")} className="bg-indigo-600 text-white px-6 py-3 rounded-lg">Sign in with Google</button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {session.user?.name}</h1>
        <button onClick={() => signOut()} className="text-gray-500"><LogOut className="w-5 h-5" /></button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4"><div className="flex items-center gap-2 mb-3"><Calendar className="w-5 h-5 text-indigo-500" /><h2 className="font-semibold">Schedule</h2></div><p className="text-gray-500">Calendar events will appear here</p></Card>
        <Card className="p-4"><div className="flex items-center gap-2 mb-3"><Mail className="w-5 h-5 text-red-500" /><h2 className="font-semibold">Inbox</h2></div><p className="text-gray-500">Emails will appear here</p></Card>
        <Card className="p-4"><div className="flex items-center gap-2 mb-3"><PieChart className="w-5 h-5 text-emerald-500" /><h2 className="font-semibold">Portfolio</h2></div><p className="text-gray-500">Stocks will appear here</p></Card>
      </div>
    </div>
  );
}
