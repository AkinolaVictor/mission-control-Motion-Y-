import { Outfit } from "next/font/google";
import TasksCard from "../components/TasksCard";
import ContentCard from "../components/ContentCard";
import AgentsCard from "../components/AgentsCard";
import DashboardLayout from "@/components/DashboardLayout";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const geistSans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistMono = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans text-foreground bg-background min-h-screen`}>
      {/* Top Navigation */}
      {/* <NavBar /> */}

      {/* Main Content */}
      <DashboardLayout where="Home">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Card */}
          <div className="h-[320px]">
            <TasksCard />
          </div>

          {/* Content Card */}
          <div className="h-[320px]">
            <ContentCard />
          </div>

          {/* Agents Card */}
          <div className="h-[320px]">
            <AgentsCard />
          </div>
        </div>

        {/* Leads Activities */}
        <div className="bg-surface rounded-2xl p-8 border border-border-subtle min-h-[200px] text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-out-up-right preview-icon"><path d="M22 12A10 10 0 1 1 12 2"/><path d="M22 2 12 12"/><path d="M16 2h6v6"/></svg>
            </div>
            <h2 className="text-lg font-semibold">Leads Activities</h2>
          </div>
          <div className="w-full flex justify-center items-center mt-5">
            <p className="text-text-secondary text-sm">Upcoming...</p>
          </div>
        </div>
      </DashboardLayout>
      
    </div>
  );
}