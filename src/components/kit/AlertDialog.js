"use client";

import { useEffect, useRef, useState } from "react";
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

export function useDialog() {
  const [promise, setPromise] = useState(null);
  const actionButtonRef = useRef(null)
  const [dialogData, setDialogData] = useState({
    type: "confirm", // "confirm" or "alert"
    title: "Are you sure?",
    description: "This action cannot be undone.",
    confirmText: "Confirm",
    cancelText: "Cancel",
  });

  useEffect(() => {
  if (promise && actionButtonRef.current) {
    setTimeout(() => {
      actionButtonRef.current?.focus();
    }, 20);
  }
}, [promise]);

  // --- CONFIRM dialog (returns true/false)
  const alert = (options = {}) =>
    new Promise((resolve) => {
      setDialogData({
        type: "confirm",
        title: options.title || "Are you sure?",
        description: options.description || "This action cannot be undone.",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
      });
      setPromise({ resolve });
    });

  // --- ALERT dialog (returns nothing)
  const confirm = (options = {}) =>
    new Promise((resolve) => {
      setDialogData({
        type: "alert",
        title: options.title || "Notice",
        description: options.description || "",
        confirmText: options.confirmText || "OK",
      });
      setPromise({ resolve });
    });

  const handleClose = (answer) => {
    if (promise) {
      promise.resolve(answer);
      setPromise(null);
    }
  };

  const ConfirmAlertDialog = (
    <AlertDialog className={'relative z-9999'} open={!!promise} onOpenChange={() => handleClose(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogData.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogData.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {dialogData.type === "confirm" ? (
            <>
              <AlertDialogCancel onClick={() => handleClose(false)}>
                {dialogData.cancelText}
              </AlertDialogCancel>
              <AlertDialogAction 
              ref={actionButtonRef} onClick={() => handleClose(true)}>
                {dialogData.confirmText}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction   ref={actionButtonRef} onClick={() => handleClose(true)}>
              {dialogData.confirmText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return [ConfirmAlertDialog, confirm, alert];
}
