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
}

export function DeletePropertyButton({
  propertyId,
  propertyAddress,
  onDelete,
}: DeletePropertyButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete property");
      }

      onDelete?.();
      router.push("/properties");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to delete property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          onDelete?.();
        }}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-md"
      >
        <Trash2 className="w-4 h-4" />
        Delete Property
      </button>

      <Dialog open={open} onOpenChange={(isOpen) => !loading && setOpen(isOpen)}>
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
                <DialogTitle>Delete Property</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this property? This action cannot
                  be undone. All associated data will be permanently deleted, including:
                </DialogDescription>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>All safety checklists</li>
                  <li>All tasks and their completions</li>
                  <li>All verifications and photos</li>
                  <li>All rewards and points history</li>
                  <li>All completion streaks</li>
                </ul>
              </DialogHeader>

              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Property: <span className="font-medium">{propertyAddress}</span>
                </p>
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
    </>
  );
}

