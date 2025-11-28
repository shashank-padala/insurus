"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  Home,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  X,
  Edit,
  Trash2,
  Plus,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalCompletedTasks: number;
  totalPendingTasks: number;
  totalPointsEarned: number;
  activeUsersLast30Days: number;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  affiliate_link: string;
  is_active: boolean;
  created_at: string;
}

interface AdminTask {
  id: string;
  task_name: string;
  description: string;
  deadline: string;
  is_active: boolean;
  created_at: string;
  task_categories: { name: string; code: string };
  risk_categories: { name: string; code: string };
}

interface Category {
  id: string;
  name: string;
  code: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([]);
  const [taskCategories, setTaskCategories] = useState<Category[]>([]);
  const [riskCategories, setRiskCategories] = useState<Category[]>([]);

  // Banner form state
  const [bannerForm, setBannerForm] = useState({
    title: "",
    description: "",
    affiliate_link: "",
  });
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Task form state
  const [taskForm, setTaskForm] = useState({
    task_name: "",
    description: "",
    task_category_id: "",
    risk_category_id: "",
    base_points_value: 5,
    verification_type: "photo",
    deadline: "",
  });
  const [taskLoading, setTaskLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.status === 401) {
        router.push("/admin/login");
      }
    } catch (error) {
      router.push("/admin/login");
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadStats(),
        loadBanners(),
        loadAdminTasks(),
        loadCategories(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadBanners = async () => {
    try {
      const [activeResponse, listResponse] = await Promise.all([
        fetch("/api/admin/banners"),
        fetch("/api/admin/banners/list"),
      ]);

      if (activeResponse.ok) {
        const active = await activeResponse.json();
        setActiveBanner(active);
      }

      if (listResponse.ok) {
        const list = await listResponse.json();
        setBanners(list);
      }
    } catch (error) {
      console.error("Error loading banners:", error);
    }
  };

  const loadAdminTasks = async () => {
    try {
      const response = await fetch("/api/admin/tasks");
      if (response.ok) {
        const data = await response.json();
        setAdminTasks(data);
      }
    } catch (error) {
      console.error("Error loading admin tasks:", error);
    }
  };

  const loadCategories = async () => {
    try {
      // We'll need to create a public API endpoint for categories or use service role
      // For now, we'll fetch from a public endpoint or create one
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setTaskCategories(data.taskCategories || []);
        setRiskCategories(data.riskCategories || []);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bannerForm),
      });

      if (response.ok) {
        await loadBanners();
        setBannerForm({ title: "", description: "", affiliate_link: "" });
        alert("Banner created successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to create banner");
      }
    } catch (error) {
      alert("Failed to create banner");
    }
  };

  const handleUpdateBanner = async (banner: Banner) => {
    try {
      const response = await fetch("/api/admin/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: banner.id,
          ...bannerForm,
        }),
      });

      if (response.ok) {
        await loadBanners();
        setEditingBanner(null);
        setBannerForm({ title: "", description: "", affiliate_link: "" });
        alert("Banner updated successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update banner");
      }
    } catch (error) {
      alert("Failed to update banner");
    }
  };

  const handleToggleBanner = async (banner: Banner) => {
    try {
      const response = await fetch("/api/admin/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: banner.id,
          is_active: !banner.is_active,
        }),
      });

      if (response.ok) {
        await loadBanners();
      } else {
        alert("Failed to toggle banner");
      }
    } catch (error) {
      alert("Failed to toggle banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadBanners();
        alert("Banner deleted successfully!");
      } else {
        alert("Failed to delete banner");
      }
    } catch (error) {
      alert("Failed to delete banner");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskLoading(true);
    try {
      const response = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskForm),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Task created successfully! ${data.tasksCreated} tasks pushed to users.`
        );
        setTaskForm({
          task_name: "",
          description: "",
          task_category_id: "",
          risk_category_id: "",
          base_points_value: 5,
          verification_type: "photo",
          deadline: "",
        });
        await loadAdminTasks();
      } else {
        alert(data.error || "Failed to create task");
      }
    } catch (error) {
      alert("Failed to create task");
    } finally {
      setTaskLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (error) {
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage banners, tasks, and view statistics
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="tasks">Admin Tasks</TabsTrigger>
          </TabsList>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalUsers || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Home className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Properties
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalProperties || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Completed Tasks
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalCompletedTasks || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pending Tasks
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalPendingTasks || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Points Earned
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.totalPointsEarned || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl shadow-card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Users (30d)
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats?.activeUsersLast30Days || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Banners Tab */}
          <TabsContent value="banners">
            <div className="space-y-6">
              {/* Current Active Banner */}
              {activeBanner && (
                <div className="bg-card p-6 rounded-xl shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-heading font-bold text-foreground">
                      Active Banner
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingBanner(activeBanner);
                          setBannerForm({
                            title: activeBanner.title,
                            description: activeBanner.description,
                            affiliate_link: activeBanner.affiliate_link,
                          });
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleBanner(activeBanner)}
                      >
                        {activeBanner.is_active ? (
                          <EyeOff className="w-4 h-4 mr-2" />
                        ) : (
                          <Eye className="w-4 h-4 mr-2" />
                        )}
                        Hide
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">
                      {activeBanner.title}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {activeBanner.description}
                    </p>
                    <a
                      href={activeBanner.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {activeBanner.affiliate_link}
                    </a>
                  </div>
                </div>
              )}

              {/* Create/Edit Banner Form */}
              <div className="bg-card p-6 rounded-xl shadow-card">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                  {editingBanner ? "Edit Banner" : "Create New Banner"}
                </h2>
                <form
                  onSubmit={
                    editingBanner
                      ? (e) => {
                          e.preventDefault();
                          handleUpdateBanner(editingBanner);
                        }
                      : handleCreateBanner
                  }
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={bannerForm.description}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="affiliate_link">Affiliate Link</Label>
                    <Input
                      id="affiliate_link"
                      type="url"
                      value={bannerForm.affiliate_link}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          affiliate_link: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="hero">
                      {editingBanner ? (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Banner
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Banner
                        </>
                      )}
                    </Button>
                    {editingBanner && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingBanner(null);
                          setBannerForm({
                            title: "",
                            description: "",
                            affiliate_link: "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* All Banners List */}
              {banners.length > 0 && (
                <div className="bg-card p-6 rounded-xl shadow-card">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    All Banners
                  </h2>
                  <div className="space-y-3">
                    {banners.map((banner) => (
                      <div
                        key={banner.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold">{banner.title}</h3>
                            {banner.is_active && (
                              <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {banner.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleBanner(banner)}
                          >
                            {banner.is_active ? "Hide" : "Show"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBanner(banner.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Admin Tasks Tab */}
          <TabsContent value="tasks">
            <div className="space-y-6">
              {/* Create Task Form */}
              <div className="bg-card p-6 rounded-xl shadow-card">
                <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                  Create Admin Task
                </h2>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="task_name">Task Name</Label>
                    <Input
                      id="task_name"
                      value={taskForm.task_name}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, task_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task_category_id">Task Category</Label>
                      <select
                        id="task_category_id"
                        value={taskForm.task_category_id}
                        onChange={(e) =>
                          setTaskForm({
                            ...taskForm,
                            task_category_id: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        required
                      >
                        <option value="">Select category</option>
                        {taskCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="risk_category_id">Risk Category</Label>
                      <select
                        id="risk_category_id"
                        value={taskForm.risk_category_id}
                        onChange={(e) =>
                          setTaskForm({
                            ...taskForm,
                            risk_category_id: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        required
                      >
                        <option value="">Select category</option>
                        {riskCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="base_points_value">Points Value</Label>
                      <Input
                        id="base_points_value"
                        type="number"
                        min="1"
                        max="10"
                        value={taskForm.base_points_value}
                        onChange={(e) =>
                          setTaskForm({
                            ...taskForm,
                            base_points_value: parseInt(e.target.value) || 5,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verification_type">
                        Verification Type
                      </Label>
                      <select
                        id="verification_type"
                        value={taskForm.verification_type}
                        onChange={(e) =>
                          setTaskForm({
                            ...taskForm,
                            verification_type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                        required
                      >
                        <option value="photo">Photo</option>
                        <option value="receipt">Receipt</option>
                        <option value="document">Document</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={taskForm.deadline}
                        onChange={(e) =>
                          setTaskForm({
                            ...taskForm,
                            deadline: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    disabled={taskLoading}
                    className="w-full"
                  >
                    {taskLoading ? "Creating..." : "Push Task to All Users"}
                  </Button>
                </form>
              </div>

              {/* Admin Tasks List */}
              {adminTasks.length > 0 && (
                <div className="bg-card p-6 rounded-xl shadow-card">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-4">
                    Recent Admin Tasks
                  </h2>
                  <div className="space-y-3">
                    {adminTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 bg-muted rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold">{task.task_name}</h3>
                          {task.is_active && (
                            <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>
                            Category: {task.task_categories?.name || "N/A"}
                          </span>
                          <span>
                            Risk: {task.risk_categories?.name || "N/A"}
                          </span>
                          <span>Deadline: {task.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


