
import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useReport(url: string, params: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(url, { params }).then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, [url, JSON.stringify(params)]);

  return { data, loading };
}
