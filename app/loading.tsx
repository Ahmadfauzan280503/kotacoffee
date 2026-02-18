"use client";

import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 border-4 border-success/20 rounded-full animate-ping" />
        <div className="absolute w-16 h-16 border-4 border-success/40 rounded-full animate-pulse" />
        <Spinner color="success" size="lg" />
      </div>
      <p className="text-success font-medium animate-pulse">Memuat KotaCoffee...</p>
    </div>
  );
}
