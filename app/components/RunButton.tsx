'use client';

interface RunButtonProps {
  onClick: () => void;
  disabled: boolean;
  isRunning: boolean;
}

export function RunButton({ onClick, disabled, isRunning }: RunButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
        disabled
          ? 'bg-[#1e1e2e] text-gray-500 cursor-not-allowed'
          : 'bg-[#EE1C2E] hover:bg-[#d91828] text-white'
      }`}
    >
      {isRunning ? (
        <>
          <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
          Running...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Run Sequence
        </>
      )}
    </button>
  );
}
