import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, MapPin, CalendarDays, Building2, Wallet, CheckCircle2,
} from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand } from "@/components/CtaBand";
import { ProjectCard } from "@/components/ProjectCard";
import { PublishedProjectCard, formatDate } from "@/components/content/PublishedBlocks";
import { getProjectBySlug, getPublishedProjects } from "@/lib/queries";

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const record = await getProjectBySlug(slug);
  if (record) {
    return {
      title: record.title,
      description: record.summary,
      alternates: { canonical: `/projects/${record.slug}` },
      openGraph: { title: record.title, description: record.summary, type: "article", ...(record.imagePath ? { images: [record.imagePath] } : {}) },
      robots: { index: true, follow: true },
    };
  }
  notFound();
}
