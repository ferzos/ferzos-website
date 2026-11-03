"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { label: "Optimal Stopping", href: "/optimal-stopping" },
  { label: "Cost-Benefit Analysis", href: "/cost-benefit-analysis" },
];

interface RouteTabsProps {
  children: ReactNode;
}

export default function RouteTabs({ children }: RouteTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      value={pathname}
      onValueChange={(value) => {
        const tab = tabs.find((tab) => tab.href === value);

        if (tab && tab.href !== pathname) {
          router.push(tab.href);
        }
      }}
    >
      <div className="overflow-x-auto border-b border-border pb-1">
        <TabsList aria-label="Page tabs" variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.href} value={tab.href}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={pathname} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
}