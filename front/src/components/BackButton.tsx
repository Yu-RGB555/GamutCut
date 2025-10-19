'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

interface BackButtonProps {
  className?: string;
  iconSize?: string;
  buttonSize?: string;
}

export function BackButton({
  className = "",
  iconSize = "!h-8 !w-8",
  buttonSize = "h-14 w-14"
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={`${buttonSize} p-0 flex items-center justify-center text-label hover:bg-muted rounded-full transition-all duration-200 hover:scale-105 ${className}`}
    >
      <ArrowLeftIcon className={`${iconSize}`} />
    </Button>
  );
}