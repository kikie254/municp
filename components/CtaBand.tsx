import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare } from "lucide-react";
import { publicImageAssetsApproved } from "@/lib/config/env";

export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden bg-green-900">
      {publicImageAssetsApproved() && (
        <Image
          src="/images/iten-town-aerial.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-25"
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950 via-green-900/92 to-green-900/70" aria-hidden="true" />
      <div className="shell relative py-14 md:py-16">
        <div className="max-w-2xl">
          <p className="eyebrow eyebrow-light mb-4">Get Involved</p>
          <h2 className="text-balance font-display text-[1.7rem] font-extrabold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.1rem] md:text-[2.5rem]">
            A better Iten-Tambach begins with informed participation.
          </h2>
          <p className="mt-4 max-w-xl text-[14.5px] leading-[1.8] text-white/70">
            Residents and stakeholders can follow municipal notices, take part in public consultations and raise matters through the available feedback channels. Your contribution helps keep local priorities in view.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-gold">
              Contact the Municipality <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/feedback" className="btn btn-ghost">
              <MessageSquare aria-hidden="true" /> Share Your Feedback
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
