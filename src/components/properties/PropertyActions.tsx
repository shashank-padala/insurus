"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EditPropertyModal } from "./EditPropertyModal";
import { DeletePropertyButton } from "./DeletePropertyButton";
import { Edit } from "lucide-react";

interface PropertyActionsProps {
  property: any;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditModalOpen(true)}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit
      </Button>
      <DeletePropertyButton
        propertyId={property.id}
        propertyAddress={property.address}
      />
      <EditPropertyModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        property={property}
      />
    </>
  );
}

