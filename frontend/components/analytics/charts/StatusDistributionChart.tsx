"use client";

import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusDistributionItem } from '@/lib/types/analytics';
import { APIClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface StatusDistributionChartProps {
  workspaceId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']; // Example colors

export function StatusDistributionChart({ workspaceId }: StatusDistributionChartProps) {
  const [data, setData] = useState<StatusDistributionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useMemo(() => new APIClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<StatusDistributionItem[]>(
          `/workspaces/${workspaceId}/analytics/status`
        );
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "Failed to fetch status distribution data.");
          toast.error(response.error || "Failed to fetch status distribution data.");
        }
      } catch (err) {
        const message = (err instanceof Error) ? err.message : "An unknown error occurred";
        setError(message);
        toast.error(`Error fetching status distribution: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchData();
    }
  }, [workspaceId, apiClient]);

  if (loading) {
    return <Card><CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader><CardContent><Skeleton className="h-[200px] w-full" /></CardContent></Card>;
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load chart data: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any) => [`${value} tasks`, name?.toString().replace(/_/g, ' ').toUpperCase()]} />
              <Legend formatter={(value) => value.toString().replace(/_/g, ' ').toUpperCase()} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for status distribution.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
