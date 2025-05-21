interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary?: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
    return (
        <div className="p-4 bg-red-50 border border-red-300 rounded text-red-700">
            <p className="font-bold">문제가 발생했습니다:</p>
            <pre className="whitespace-pre-wrap text-sm mt-2">{error.message}</pre>
            {resetErrorBoundary && (
                <button
                    className="mt-3 px-4 py-1 bg-red-100 hover:bg-red-200 rounded text-sm"
                    onClick={resetErrorBoundary}
                >
                    다시 시도
                </button>
            )}
        </div>
    );
}
