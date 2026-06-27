import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, Mail, RefreshCw } from "lucide-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Safely initialize client only if credentials exist to prevent runtime crashes
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export default function App() {
  const [activeTab, setActiveTab] = useState<"waitlist" | "contact">("waitlist");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    if (!supabase) {
      setError("Missing environmental Supabase credentials in Cloudflare Settings.");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const targetTable = activeTab === "waitlist" ? "waitlist" : "contact_messages";
      
      const { data: rows, error: dbError } = await supabase
        .from(targetTable)
        .select("*")
        .order("created_at", { ascending: false });

      if (dbError) throw dbError;
      setData(rows || []);
    } catch (err: any) {
      setError(err.message || "Failed to communicate with database nodes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // If configuration is completely broken, render a clean error dashboard state
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-mono text-xs text-red-500 p-6">
        <div className="border border-red-950 bg-red-950/10 p-4 rounded-xl max-w-md w-full">
          <p className="font-bold uppercase tracking-wider mb-2">[System Configuration Mismatch]</p>
          <p className="text-neutral-400">VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing from Cloudflare's Environment variables panel.</p>
        </div>
      </div>
    );
  }

  // ... rest of your return code remains exactly the same
