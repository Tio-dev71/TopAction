"use client";

import { Newspaper } from "lucide-react";
import { FadeIn } from "@/components/animations/MotionWrapper";
import Marquee from "react-fast-marquee";

interface PressSectionProps {
  press: Array<{
    id: string;
    name: string;
    logo_url?: string | null;
    website_url?: string | null;
  }>;
}

export function PressSection({ press }: PressSectionProps) {
  if (!press || press.length === 0) return null;

  return (
    <section className="w-full bg-card py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="td-organizers__section m-0">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground mb-6 justify-center sm:justify-start">
            <Newspaper className="h-5 w-5 text-primary" />
            Báo chí
          </h3>
          <div className="relative overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6 shadow-sm">
            <Marquee gradient={true} gradientColor="var(--background)" speed={30} autoFill={true}>
              {press.map((pr) => {
                const logoContent = pr.logo_url ? (
                  <img src={pr.logo_url} alt={pr.name} className="h-10 sm:h-12 w-auto object-contain max-w-[140px] opacity-80 transition-opacity hover:opacity-100 filter grayscale hover:grayscale-0" />
                ) : (
                  <div className="flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary/50 px-4 font-semibold text-secondary-foreground">
                    <Newspaper className="h-5 w-5" />
                    <span>{pr.name}</span>
                  </div>
                );
                
                return (
                  <div key={pr.id} className="mx-6 sm:mx-10 flex shrink-0 items-center justify-center">
                    {pr.website_url ? (
                      <a href={pr.website_url} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:scale-105">
                        {logoContent}
                      </a>
                    ) : (
                      logoContent
                    )}
                  </div>
                );
              })}
            </Marquee>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
