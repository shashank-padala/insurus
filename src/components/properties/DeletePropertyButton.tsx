"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Loader2 } from "lucide-react";

interface DeletePropertyButtonProps {
  propertyId: string;
  propertyAddress: string;
  onDelete?: () => void;
  onPropertyDeleted?: (propertyId: string, shouldRestore?: boolean) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeletePropertyButton({
  propertyId,
  propertyAddress,
  onDelete,
  onPropertyDeleted,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DeletePropertyButtonProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    // Optimistic update: remove property from UI immediately
    onPropertyDeleted?.(propertyId);
    onDelete?.();

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete property");
      }

      // Success - property already removed optimistically
      setOpen(false);
      setLoading(false);
      
      // Only redirect if we're on the properties page
      if (window.location.pathname === "/properties") {
        // Already updated optimistically, no need to refresh
      } else {
        router.push("/properties");
      }
    } catch (error: any) {
      // Revert optimistic update on error
      onPropertyDeleted?.(propertyId, true); // Signal to restore
      setError(error.message || "Failed to delete property");
      setLoading(false);
      // Keep dialog open to show error
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!loading) {
        setOpen(isOpen);
        if (!isOpen) {
          setError(null); // Clear error when closing
        }
      }
    }}>
        <DialogContent>
          {loading ? (
            <>
              <DialogHeader>
                <DialogTitle>Deleting Property</DialogTitle>
                <DialogDescription>
                  Please wait while we delete the property and all associated data...
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-destructive mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Removing property, checklists, tasks, and all related data...
                </p>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-destructive">Delete Property?</DialogTitle>
                <DialogDescription className="text-base">
                  Are you sure you want to delete this property? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Property: <span className="font-semibold">{propertyAddress}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    All associated data will be permanently deleted:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>All safety checklists</li>
                    <li>All tasks and their completions</li>
                    <li>All verifications and photos</li>
                    <li>All rewards and points history</li>
                    <li>All completion streaks</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Property
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
  );
}

