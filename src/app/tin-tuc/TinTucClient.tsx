"use client";

import { useState } from "react";
import { MainContainer } from "@/components/layout/MainContainer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsHeader } from "@/components/news/NewsHeader";
import { FeaturedNews } from "@/components/news/FeaturedNews";
import { LatestNewsList } from "@/components/news/LatestNewsList";
import { NewsSidebar } from "@/components/news/NewsSidebar";

export function TinTucClient() {
  const [activeCategory, setActiveCategory] = useState("Mới nhất");

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full pb-16 pt-8">
        <MainContainer>
          <NewsHeader activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          
          <FeaturedNews />

          <div className="flex flex-col lg:flex-row gap-10 mt-12">
            <div className="flex-1">
               <LatestNewsList />
            </div>
            
            <div className="w-full lg:w-[360px] shrink-0">
               <NewsSidebar />
            </div>
          </div>
        </MainContainer>
      </main>

      <Footer />
    </div>
  );
}
