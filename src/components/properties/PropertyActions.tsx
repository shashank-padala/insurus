"use client";

import { PropertyMenu } from "./PropertyMenu";

interface PropertyActionsProps {
  property: any;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  return <PropertyMenu property={property} />;
}

