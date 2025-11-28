"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditPropertyModal } from "./EditPropertyModal";
import { DeletePropertyButton } from "./DeletePropertyButton";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

interface PropertyMenuProps {
  property: any;
}

export function PropertyMenu({ property }: PropertyMenuProps) {
  const [open, setOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleEdit = () => {
    setOpen(false);
    setEditModalOpen(true);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setOpen(!open)}
          aria-label="Property options"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>

        {open && (
          <div className="absolute right-0 top-10 z-50 w-48 bg-card border border-border rounded-lg shadow-lg py-1">
            <button
              onClick={handleEdit}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Property
            </button>
            <div className="border-t border-border my-1" />
            <div className="px-1">
              <DeletePropertyButton
                propertyId={property.id}
                propertyAddress={property.address}
                onDelete={() => setOpen(false)}
              />
            </div>
          </div>
        )}
      </div>

      <EditPropertyModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        property={property}
      />
    </>
  );
}

