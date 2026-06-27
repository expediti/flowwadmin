import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Users, Mail, RefreshCw } from "lucide-react";

// Initializing the build keys securely from Cloudflare environmental compilation targets
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState<"waitlist" | "contact">("waitlist");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
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
    if (supabaseUrl && supabaseAnonKey) {
      fetchData();
    } else {
      setError("Missing environmental Supabase credentials.");
      setLoading(false);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-neutral-200 antialiased selection:bg-neutral-800">
      
      {/* HEADER NAVIGATION */}
      <header className="border-b border-neutral-900 bg-[#050505] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-white flex items-center justify-center font-mono text-[11px] font-bold text-black">i</div>
            <span className="font-mono text-xs tracking-widest text-neutral-400 uppercase">iRREGO // Terminal Central</span>
          </div>
          
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 rounded border border-neutral-800 bg-neutral-950 px-3 py-1.5 font-mono text-[11px] text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Sync Nodes
          </button>
        </div>
      </header>

      {/* WORKSPACE FRAMEWORK */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        
        {/* VIEW SEGMENT SELECTORS */}
        <div className="flex gap-2 border-b border-neutral-900 pb-px">
          <button
            onClick={() => setActiveTab("waitlist")}
            className={`flex items-center gap-2 border-b px-4 py-3 font-mono text-xs tracking-wider uppercase transition-all ${
              activeTab === "waitlist"
                ? "border-white text-white font-medium"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Users size={14} />
            Waitlist Registry
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 border-b px-4 py-3 font-mono text-xs tracking-wider uppercase transition-all ${
              activeTab === "contact"
                ? "border-white text-white font-medium"
                : "border-transparent text-neutral-500 hover:text-neutral-300"
            }`}
          >
            <Mail size={14} />
            Contact Log
          </button>
        </div>

        {/* METRICS & RUNTIME RESPONSE INTERFACE */}
        <div className="mt-8">
          {error && (
            <div className="rounded-lg border border-red-950/50 bg-red-950/10 p-4 font-mono text-xs text-red-400">
              [CRITICAL INTERACTION FAULT]: {error}
            </div>
          )}

          {loading ? (
            <div className="flex h-40 items-center justify-center font-mono text-xs text-neutral-600 tracking-wider">
              [FETCHING CORE REPLICAS...]
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-neutral-900 font-mono text-xs text-neutral-600 tracking-wider">
              [NO RECORDS STORED INSIDE TARGET SCHEMA]
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-neutral-900 bg-[#050505]">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="border-b border-neutral-900 bg-[#090909] font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                    {activeTab === "waitlist" ? (
                      <tr>
                        <th className="px-6 py-3.5 font-medium">Name</th>
                        <th className="px-6 py-3.5 font-medium">Email Object</th>
                        <th className="px-6 py-3.5 font-medium">Profession</th>
                        <th className="px-6 py-3.5 font-medium">Timestamp</th>
                      </tr>
                    ) : (
                      <tr>
                        <th className="px-6 py-3.5 font-medium">Name</th>
                        <th className="px-6 py-3.5 font-medium">Email Object</th>
                        <th className="px-6 py-3.5 font-medium">Category</th>
                        <th className="px-6 py-3.5 font-medium">Message Body</th>
                        <th className="px-6 py-3.5 font-medium">Timestamp</th>
                      </tr>
                    )}
                  </thead>
                  <tbody className="divide-y divide-neutral-900 font-sans text-neutral-300">
                    {data.map((row) => (
                      <tr key={row.id} className="transition-colors hover:bg-[#090909]/40">
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-white">{row.name}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-neutral-400">{row.email}</td>
                        {activeTab === "waitlist" ? (
                          <>
                            <td className="whitespace-nowrap px-6 py-4 text-xs text-neutral-400">
                              <span className="rounded bg-neutral-950 border border-neutral-900 px-2 py-1 text-neutral-300">
                                {row.profession || "Not specified"}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="whitespace-nowrap px-6 py-4 text-xs">
                              <span className="rounded bg-neutral-950 border border-neutral-900 px-2 py-1 text-neutral-400">
                                {row.category || "General"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-neutral-400 max-w-xs truncate" title={row.message}>
                              {row.message}
                            </td>
                          </>
                        )}
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-[11px] text-neutral-500">
                          {new Date(row.created_at).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
