import { useState, useCallback } from 'react';
import { requestWheelEntries } from '../api/ai';

export type AiWheelStatus = 'idle' | 'loading' | 'error' | 'success';

interface AiWheelState {
  status: AiWheelStatus;
  entries: string[];
  error?: string;
}

export function useAiWheel() {
  const [state, setState] = useState<AiWheelState>({
    status: 'idle',
    entries: [],
    error: undefined,
  });

  const generate = useCallback(async (theme: string, count?: number) => {
    setState({ status: 'loading', entries: [], error: undefined });
    try {
      const entries = await requestWheelEntries(theme, count);
      setState({ status: 'success', entries, error: undefined });
    } catch (err: any) {
      setState({ status: 'error', entries: [], error: err.message || 'Unknown error' });
    }
  }, []);

  return { ...state, generate };
}
