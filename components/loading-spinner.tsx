import { Spinner } from "@heroui/react";

const LoadingSpinner = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner color="success" size="lg" />
    </div>
  );
};

export default LoadingSpinner;
