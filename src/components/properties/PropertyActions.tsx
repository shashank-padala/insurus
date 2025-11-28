"use client";

import { useRouter } from "next/navigation";
import { PropertyMenu } from "./PropertyMenu";

interface PropertyActionsProps {
  property: any;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const router = useRouter();
  
  return (
    <PropertyMenu 
      property={property}
      onPropertyDeleted={() => {
        // Redirect to properties page when deleted from detail page
        router.push("/properties");
      }}
    />
  );
}

