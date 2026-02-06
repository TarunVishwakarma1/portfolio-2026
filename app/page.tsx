import { Settings } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
          Work In Progress...
        </h1>

        <div className="flex items-center gap-6 text-neutral-500">
          <Settings className="w-8 h-8 animate-[spin_3s_linear_infinite]" />
          <Settings className="w-10 h-10 animate-[spin_4s_linear_infinite_reverse]" />
          <Settings className="w-8 h-8 animate-[spin_3s_linear_infinite]" />
        </div>
      </div>
    </main>
  );
}
