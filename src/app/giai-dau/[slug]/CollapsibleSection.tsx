"use client";
 
import { useState } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  content: string;
  icon?: LucideIcon;
  defaultExpanded?: boolean;
  className?: string;
}

export function CollapsibleSection({ 
  title, 
  content, 
  icon: Icon, 
  defaultExpanded = false,
  className = ""
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!content) return null;

  return (
    <div className={`td-collapsible-section ${className}`}>
      <div 
        className="flex items-center justify-between cursor-pointer select-none group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5 text-primary group-hover:text-primary/80" />}
          <h3 className="td-section-title !mb-0 transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-secondary transition-colors"
          aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          <ChevronDown 
            className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>
      
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div 
            className="td-collapsible-section__content space-y-4"
            dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
          />
        </div>
      </div>
    </div>
  );
}
