import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";

const statusStyles: Record<Project["status"], string> = {
  Ongoing: "bg-green-700 text-white",
  Completed: "bg-green-950 text-white",
  Planned: "bg-gold-400 text-green-950",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-paper-line bg-white shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-green-950">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-green-950/10" />
        <div className="absolute left-0 top-0 flex">
          <span className={`px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] ${statusStyles[project.status]}`}>
            {project.status}
          </span>
          <span className="bg-white/92 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-green-900">
            Sample
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-700">{project.category}</p>
        <h3 className="mt-2 text-balance font-display text-[15.5px] font-bold leading-snug text-green-900">
          <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-green-600">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 inline-flex items-start gap-1.5 text-[11.5px] text-ink-muted">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" /> {project.location}
        </p>
        <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">{project.summary}</p>

        <div className="mt-auto pt-4">
          <Link href={`/projects/${project.slug}`} className="link-arrow">
            View details <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
