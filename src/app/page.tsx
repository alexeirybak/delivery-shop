import { Hero } from "./home/hero/Hero";
import { Stats } from "./home/stats/Stats";
import { PlatformGrid } from "./home/platformGrid/PlatformGrid";
import { DemoSection } from "./home/demoSection/DemoSection";
import { ArchiveSection } from "./home/archiveSection/ArchiveSection";
import { KnowledgeNetwork } from "./home/knowledgeNetwork/KnowledgeNetwork";
import FinalCta from "./home/finalCta/FinalCta";
import { NeuralCore } from "./home/neuralCore/NeuralCore";
import TrustSignals from "./home/trustSignals/TrustSignals";
import { ScrollObserver } from "./home/scrollObserver/ScrollObserver";
import "./globals.css";
import Footer from "./shared/footer/Footer";

const HomePage = () => {
  return (
    <div className="relative min-h-screen overflow-clip isolate">
      <div className="background">
        <KnowledgeNetwork />
      </div>
      <main className="content">
        <ScrollObserver />
        <TrustSignals />
        <Hero />
        <Stats />
        <PlatformGrid />
        <DemoSection />
        <NeuralCore />
        <ArchiveSection />
        <FinalCta />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;
