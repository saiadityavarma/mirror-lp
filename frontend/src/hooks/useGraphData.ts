import useSWR from "swr";
import { getGraph } from "@/lib/api";
import type { GraphData } from "@/lib/types";

export function useGraphData() {
  const { data, error, isLoading, mutate } = useSWR<GraphData>(
    "/api/graph",
    getGraph,
    { refreshInterval: 0 }
  );

  return {
    graphData: data,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
