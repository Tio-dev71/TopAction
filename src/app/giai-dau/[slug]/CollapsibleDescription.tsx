"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleDescriptionProps {
  description: string;
}

export function CollapsibleDescription({ description }: CollapsibleDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) return null;

  return (
    <div className="td-description">
      <div 
        className="flex items-center justify-between cursor-pointer select-none group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="td-section-title !mb-0 transition-colors group-hover:text-primary">
          Giới thiệu giải đấu
        </h3>
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
            className="td-description__content space-y-4"
            dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br/>') }}
          />
        </div>
      </div>
    </div>
  );
}
