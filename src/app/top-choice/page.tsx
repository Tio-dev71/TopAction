import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopChoiceHero } from "@/components/top-choice/TopChoiceHero";
import { CategoryNav } from "@/components/top-choice/CategoryNav";
import { RankingSection } from "@/components/top-choice/RankingSection";
import { HighestRated } from "@/components/top-choice/HighestRated";
import { HallOfFame } from "@/components/top-choice/HallOfFame";
import { DealsAndPartners } from "@/components/top-choice/DealsAndPartners";
import { TrustBar } from "@/components/top-choice/TrustBar";
import { MainContainer } from "@/components/layout/MainContainer";

export const metadata: Metadata = {
  title: "TOP Choice | TOPPLAY",
  description: "Nơi tìm kiếm những lựa chọn tốt nhất cho người chơi",
};

export default function TopChoicePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      
      {/* 
        To match the reference, the page container must be centered and consistent. 
        We use MainContainer for sections that need to be bounded.
      */}
      <main className="flex-1 w-full pb-16">
        <MainContainer className="pt-8">
          <TopChoiceHero />
          <CategoryNav />
          
          <RankingSection />
          
          <HighestRated />
          
          <HallOfFame />
          
          <DealsAndPartners />
        </MainContainer>
        
        <TrustBar />
      </main>

      <Footer />
    </div>
  );
}
