"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api/auth";
import { ActivityFeed } from "@/components/activity/ActivityFeed";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Activity, Clock, TrendingUp } from "lucide-react";

export default function ActivityPage() {
  const router = useRouter();

  // Redirect to tasks page (activity requires workspace - disabled)
  useEffect(() => {
    router.push("/dashboard/tasks");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to tasks...</p>
      </div>
    </div>
  );
}
