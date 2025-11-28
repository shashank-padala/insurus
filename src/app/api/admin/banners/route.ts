import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "../auth/route";

// GET: Fetch current active banner (public access for display)
export async function GET() {
  try {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("promotional_banners")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" which is fine
      throw error;
    }

    return NextResponse.json(data || null);
  } catch (error: any) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// POST: Create new banner (admin only, deactivates previous)
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, affiliate_link } = await request.json();

    if (!title || !description || !affiliate_link) {
      return NextResponse.json(
        { error: "Title, description, and affiliate_link are required" },
        { status: 400 }
      );
    }

    const supabase = await createServiceRoleClient();

    // Deactivate all existing banners
    await supabase
      .from("promotional_banners")
      .update({ is_active: false })
      .eq("is_active", true);

    // Create new banner
    const { data, error } = await supabase
      .from("promotional_banners")
      .insert({
        title,
        description,
        affiliate_link,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

// PATCH: Update existing banner (admin only)
export async function PATCH(request: NextRequest) {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, description, affiliate_link, is_active } =
      await request.json();

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (affiliate_link !== undefined) updateData.affiliate_link = affiliate_link;
    if (is_active !== undefined) {
      updateData.is_active = is_active;
      // If activating this banner, deactivate all others
      if (is_active) {
        await supabase
          .from("promotional_banners")
          .update({ is_active: false })
          .neq("id", id)
          .eq("is_active", true);
      }
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("promotional_banners")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE: Deactivate banner (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin session
    const isAdmin = await verifyAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
    }

    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("promotional_banners")
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error deactivating banner:", error);
    return NextResponse.json(
      { error: "Failed to deactivate banner" },
      { status: 500 }
    );
  }
}


