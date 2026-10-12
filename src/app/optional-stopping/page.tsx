import type { Metadata } from "next";
import RouteTabs from "../../components/RouteTabs";
import { StopCalculator } from "./components/StopCalculator";
import { AboutSection } from "./components/About";

export const metadata: Metadata = {
  title: "Optional Stopping",
  description: "Know when to stop searching.",
};

export default function OptionalStoppingPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-6 py-12 sm:px-10 sm:py-20">
        <RouteTabs>
          <main className="py-7">
            <h1 className="text-2xl font-semibold tracking-tight">When should I stop looking?</h1>
            <p className="mb-6 mt-1.5 text-sm text-muted-foreground">
                Enter what you have left. We tell you how long to explore.
            </p>
            <StopCalculator />
            <AboutSection />
          </main>
        </RouteTabs>
      </div>
    </div>
  );
}