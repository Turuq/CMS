"use client";

import { toast } from "sonner";
import { Button } from "../ui/button";

interface IFeedbackToastProps {
  buttonLabel: string;
  buttonVariant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | null
    | undefined;
  feedBackTitle: string;
  feedbackDescription?: string;
  toastVariant: "success" | "error" | "warning" | "info";
  duration?: number;
}

const styles = {
  success: {
    backgroundColor: "#F3FBEF",
    color: "#3B8C2A",
  },
  error: {
    backgroundColor: "#FEEFEE",
    color: "#D8000C",
  },
  warning: {
    backgroundColor: "#FFF4CE",
    color: "#C09853",
  },
  info: {
    backgroundColor: "#D9EDF7",
    color: "#3A87AD",
  },
};

export default function FeedbackToast({
  buttonLabel,
  buttonVariant,
  feedBackTitle,
  feedbackDescription,
  toastVariant,
  duration,
}: IFeedbackToastProps) {
  // You can use the button to trigger the toast, or you can call the toast directly after
  // a successful action, like adding a new product
  return (
    <Button
      variant={buttonVariant ?? "default"}
      className="w-40"
      onClick={() =>
        toast[toastVariant](feedBackTitle, {
          description: feedbackDescription ?? null,
          style: styles[toastVariant],
          duration: duration ?? 5000,
          closeButton: true,
        })
      }
    >
      {buttonLabel}
    </Button>
  );
}
