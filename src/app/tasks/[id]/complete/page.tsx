"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, FileText, Upload, X, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import Link from "next/link";

export default function CompleteTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [task, setTask] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    params.then((p) => {
      setTaskId(p.id);
      fetchTask(p.id);
    });
  }, [params]);

  const fetchTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTask(data);
      }
    } catch (error) {
      console.error("Failed to fetch task:", error);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "photo" | "receipt"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "photo") {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      return data.url;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      let photoUrl: string | null = null;
      let receiptUrl: string | null = null;

      // Upload files if provided
      if (photoFile) {
        photoUrl = await uploadFile(photoFile);
      }

      if (receiptFile) {
        receiptUrl = await uploadFile(receiptFile);
      }

      // Check verification type requirements
      if (task.verification_type === "photo" && !photoUrl) {
        throw new Error("Photo is required for this task");
      }
      if (task.verification_type === "receipt" && !receiptUrl) {
        throw new Error("Receipt is required for this task");
      }
      if (task.verification_type === "both" && !photoUrl && !receiptUrl) {
        throw new Error("Photo or receipt is required for this task");
      }

      // Submit task completion
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoUrl,
          receiptUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete task");
      }

      // Show success state
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/tasks`);
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to complete task");
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) {
    return (
      <DashboardLayout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-2" />
            <p className="text-muted-foreground">Loading task...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (success) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-card p-8 sm:p-12 rounded-xl shadow-card text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
              Task Completed!
            </h2>
            <p className="text-muted-foreground mb-8">
              Your submission is being verified. You'll earn points once verification is complete.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" asChild>
                <Link href="/tasks">Complete Another Task</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/tasks">View All Tasks</Link>
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </Link>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
            Complete Task: {task.task_name}
          </h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>

        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Verification Type</Label>
              <p className="text-sm text-muted-foreground capitalize">
                {task.verification_type === "both"
                  ? "Photo or Receipt"
                  : task.verification_type}
              </p>
            </div>

            {(task.verification_type === "photo" ||
              task.verification_type === "both") && (
              <div className="space-y-2">
                <Label htmlFor="photo">Photo *</Label>
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-64 sm:h-80 object-contain rounded-lg bg-muted"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full hover:bg-destructive/90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="photo"
                    className="flex flex-col items-center justify-center w-full min-h-[120px] sm:min-h-[200px] border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/50 transition-colors active:bg-muted"
                  >
                    <Camera className="w-16 h-16 sm:w-20 sm:h-20 text-accent mb-4" />
                    <p className="text-base sm:text-lg font-medium text-foreground mb-2">
                      Tap to take or upload photo
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Use camera or select from gallery
                    </p>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "photo")}
                      disabled={submitting || uploading}
                    />
                  </label>
                )}
              </div>
            )}

            {(task.verification_type === "receipt" ||
              task.verification_type === "both") && (
              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt</Label>
                {receiptPreview ? (
                  <div className="relative">
                    <img
                      src={receiptPreview}
                      alt="Receipt preview"
                      className="w-full h-64 sm:h-80 object-contain rounded-lg bg-muted"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setReceiptFile(null);
                        setReceiptPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full hover:bg-destructive/90 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="receipt"
                    className="flex flex-col items-center justify-center w-full min-h-[120px] sm:min-h-[200px] border-2 border-dashed border-input rounded-lg cursor-pointer hover:bg-muted/50 transition-colors active:bg-muted"
                  >
                    <FileText className="w-16 h-16 sm:w-20 sm:h-20 text-accent mb-4" />
                    <p className="text-base sm:text-lg font-medium text-foreground mb-2">
                      Tap to take or upload receipt
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      PDF or image format
                    </p>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*,application/pdf"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "receipt")}
                      disabled={submitting || uploading}
                    />
                  </label>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={submitting || uploading}
                className="min-h-[44px]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="hero" 
                disabled={submitting || uploading}
                className="min-h-[44px] flex-1 sm:flex-initial"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Submit for Verification"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

