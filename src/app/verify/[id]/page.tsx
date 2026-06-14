import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import CertificateClient from "./CertificateClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificateVerificationPage({ params }: PageProps) {
  const { id } = await params;
  
  // Query certificate from database
  const certificate = await db.certificates.get(id);

  if (!certificate) {
    notFound();
  }

  // Create simulated cryptographic signature hash
  const certHash = Buffer.from(certificate.certificateNumber + certificate.associatedRollNumber)
    .toString("hex")
    .substring(0, 40);

  return (
    <CertificateClient 
      certificate={certificate} 
      certHash={certHash} 
    />
  );
}

