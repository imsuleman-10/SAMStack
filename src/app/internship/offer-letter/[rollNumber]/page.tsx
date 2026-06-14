import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import OfferLetterClient from "./OfferLetterClient";

interface PageProps {
  params: Promise<{ rollNumber: string }>;
}

export default async function OfferLetterPage({ params }: PageProps) {
  const { rollNumber } = await params;
  
  // Fetch intern details by roll number
  const intern = await db.interns.get(rollNumber);
  
  if (!intern) {
    notFound();
  }

  const trackTitle = tracks[intern.trackSelected]?.title || `${intern.trackSelected} Specialization`;

  return (
    <OfferLetterClient 
      intern={intern} 
      trackTitle={trackTitle} 
    />
  );
}
