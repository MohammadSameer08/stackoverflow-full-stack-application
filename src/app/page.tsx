import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <LatestQuestions />
      <TopContributers />
      <Footer />
    </main>
  );
}
