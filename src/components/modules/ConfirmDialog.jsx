"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function useConfirmDialog() {
  const [promise, setPromise] = useState(null);
  const [dialogData, setDialogData] = useState({
    title: "Are you sure?",
    description: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  // call confirm() and pass dynamic message and description
  const confirm = (options = {}) =>
    new Promise((resolve) => {
      setDialogData({
        title: options.title || "Are you sure?",
        description: options.description || "This action cannot be undone.",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
      });
      setPromise({ resolve });
    });

  const handleClose = (answer) => {
    if (promise) {
      promise.resolve(answer);
      setPromise(null);
    }
  };

  const ConfirmDialog = (
    <AlertDialog open={!!promise} onOpenChange={() => handleClose(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogData.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialogData.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose(false)}>
            {dialogData.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => handleClose(true)}>
            {dialogData.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [ConfirmDialog, confirm];
}
