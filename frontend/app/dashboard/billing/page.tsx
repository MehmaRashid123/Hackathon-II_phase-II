"use client";

import { useWorkspace } from "@/lib/hooks/use-workspace";
import { SkeletonCard } from "@/components/SkeletonCard"; // Assuming this exists for loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming these exist for error display
import { Terminal } from "lucide-react";
import { PricingCard } from "@/components/billing/PricingCard"; // Will be created later

export default function BillingPage() {
  const { currentWorkspace, isLoading, error } = useWorkspace();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Alert variant="destructive" className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        {error.includes("Not Found") && (
          <button
            onClick={() => window.location.href = "/dashboard/workspaces/create"}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Create Your First Workspace
          </button>
        )}
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Alert className="max-w-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>No Workspace Selected</AlertTitle>
          <AlertDescription>
            Please create a workspace to get started.
          </AlertDescription>
        </Alert>
        <button
          onClick={() => window.location.href = "/dashboard/workspaces/create"}
          className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Create Workspace
        </button>
      </div>
    );
  }

  // Mock data for pricing plans
  const plans = [
    {
      name: "Free",
      price: "$0",
      frequency: "per month",
      features: [
        "Up to 5 Workspaces",
        "Basic Task Management",
        "Limited Analytics",
        "Community Support",
      ],
      current: true,
    },
    {
      name: "Pro",
      price: "$10",
      frequency: "per month",
      features: [
        "Unlimited Workspaces",
        "Advanced Task Management",
        "Full Analytics Dashboard",
        "Email Support",
        "Kanban Board",
        "Activity Feed",
      ],
      current: false,
    },
    {
      name: "Business",
      price: "$29",
      frequency: "per month",
      features: [
        "All Pro features",
        "Team Collaboration",
        "Dedicated Account Manager",
        "SLA Support",
        "Custom Integrations",
      ],
      current: false,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Billing & Subscription: {currentWorkspace.name}</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Choose the plan that best fits your needs.
      </p>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PricingCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
}
