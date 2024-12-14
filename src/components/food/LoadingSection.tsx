export function LoadingSection() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="relative mx-auto w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
        AI is analyzing your meal...
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500">
        This might take a few seconds
      </p>
    </div>
  );
}