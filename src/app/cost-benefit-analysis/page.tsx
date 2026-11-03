import type { Metadata } from "next";

import { CostBenefitAnalysis } from "./components/CostBenefitAnalysis";
import RouteTabs from "@/components/RouteTabs";

export const metadata: Metadata = {
  title: "Cost-Benefit Analysis",
  description: "Compare your options side by side and see which one comes out on top.",
};

export default function CostBenefitAnalysisPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-foreground">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 sm:py-16">
        <RouteTabs>
          <main className="py-7">
            <h1 className="text-2xl font-semibold tracking-tight">Cost-Benefit Analysis</h1>
            <p className="mb-6 mt-1.5 text-sm font-semibold">
              Compare your options side by side.
            </p>
            <ol className="my-2 max-w-[70ch] list-decimal space-y-0.5 pl-5 text-sm leading-relaxed text-muted-foreground">
              <li>Add the options you’re choosing between, like three pairs of shoes.</li>
              <li>Add what matters to you, like price or comfort.</li>
              <li>
                Rate each option from 1 to 10 on each one, and choose whether a higher or lower
                rating is better.
              </li>
            </ol>
            <p className="mb-6 text-sm text-muted-foreground">
              Each variable counts equally. Empty or invalid ratings count as zero.
            </p>
            <CostBenefitAnalysis />
          </main>
        </RouteTabs>
      </div>
    </div>
  );
}
