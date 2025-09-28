// src/Dashboard.jsx
import { Header } from "./components/Header";
import { ImpactOverview } from "./components/ImpactOverview";
import { RecentActivity } from "./components/RecentActivity";
import { CharityUpdates } from "./components/CharityUpdates";
import { GoalsProgress } from "./components/GoalsProgress";
import { CharitySuggestions } from "./components/CharitySuggestions";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Your Impact Dashboard</h2>
            <p className="text-muted-foreground">
              See how your everyday purchases are making a difference in the world
            </p>
          </div>

          {/* Impact Overview */}
          <section>
            <ImpactOverview />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <RecentActivity />
              <CharityUpdates />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <GoalsProgress />
              <CharitySuggestions />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
