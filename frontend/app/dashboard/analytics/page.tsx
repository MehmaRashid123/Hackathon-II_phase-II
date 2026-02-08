"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/api/auth";
import { useTasks } from "@/lib/hooks/useTasks";
import { SkeletonCard } from "@/components/SkeletonCard";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  Calendar,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const router = useRouter();

  // Redirect to tasks page (analytics requires workspace - disabled)
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
