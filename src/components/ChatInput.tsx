import { useState } from 'react';

interface ChatInputProps {
  onSend: (theme: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export default function ChatInput({ onSend, disabled, loading }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (value.trim() && !disabled && !loading) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 w-full max-w-md mt-6">
      <textarea
        className="flex-1 rounded-lg border border-gray-300 p-2 resize-none min-h-[48px] max-h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-gray-900"
        placeholder="Describe a theme for your wheel (e.g. 'Fruits', 'Team lunch spots')..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        rows={2}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        onClick={handleSend}
        disabled={disabled || loading || !value.trim()}
        aria-label="Send"
        type="button"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    </div>
  );
}
