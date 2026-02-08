"use client";

import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CompletionTrendItem } from '@/lib/types/analytics';
import { APIClient } from '@/lib/api-client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { format } from 'date-fns';

interface CompletionTrendChartProps {
  workspaceId: string;
  days?: number; // Number of days to show trend for
}

export function CompletionTrendChart({ workspaceId, days = 7 }: CompletionTrendChartProps) {
  const [data, setData] = useState<CompletionTrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useMemo(() => new APIClient(), []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<CompletionTrendItem[]>(
          `/workspaces/${workspaceId}/analytics/completion-trend?days=${days}`
        );
        if (response.success && response.data) {
          setData(response.data.map(item => ({
            ...item,
            date: format(new Date(item.date), 'MM/dd') // Format date for display
          })));
        } else {
          setError(response.error || "Failed to fetch completion trend data.");
          toast.error(response.error || "Failed to fetch completion trend data.");
        }
      } catch (err) {
        const message = (err instanceof Error) ? err.message : "An unknown error occurred";
        setError(message);
        toast.error(`Error fetching completion trend: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) {
      fetchData();
    }
  }, [workspaceId, apiClient, days]);

  if (loading) {
    return <Card><CardHeader><CardTitle>Completion Trend</CardTitle></CardHeader><CardContent><Skeleton className="h-[200px] w-full" /></CardContent></Card>;
  }

  if (error) {
    return (
      <Card>
        <CardHeader><CardTitle>Completion Trend</CardTitle></CardHeader>
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
        <CardTitle>Completion Trend (Last {days} Days)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks_created" fill="#8884d8" name="Tasks Created" />
              <Bar dataKey="tasks_completed" fill="#82ca9d" name="Tasks Completed" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for completion trend.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
