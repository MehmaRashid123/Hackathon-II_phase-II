"use client";

import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PriorityBreakdownItem } from '@/lib/types/analytics';
import { APIClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface PriorityBarChartProps {
  workspaceId: string;
}

export function PriorityBarChart({ workspaceId }: PriorityBarChartProps) {
  const [data, setData] = useState<PriorityBreakdownItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useMemo(() => new APIClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<PriorityBreakdownItem[]>(
          `/workspaces/${workspaceId}/analytics/priority`
        );
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error || "Failed to fetch priority breakdown data.");
          toast.error(response.error || "Failed to fetch priority breakdown data.");
        }
      } catch (err) {
        const message = (err instanceof Error) ? err.message : "An unknown error occurred";
        setError(message);
        toast.error(`Error fetching priority breakdown: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchData();
    }
  }, [workspaceId, apiClient]);

  if (loading) {
    return <Card><CardHeader><CardTitle>Priority Breakdown</CardTitle></CardHeader><CardContent><Skeleton className="h-[200px] w-full" /></CardContent></Card>;
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>Priority Breakdown</CardTitle></CardHeader>
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
        <CardTitle>Priority Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="priority" tickFormatter={(value: string) => value.replace(/_/g, ' ').toUpperCase()} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value: any) => [value, "Tasks"]} />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Number of Tasks" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for priority breakdown.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
