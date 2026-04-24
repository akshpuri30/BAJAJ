import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Analyzer from "@/components/Analyzer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-background overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col min-h-screen max-w-6xl mx-auto px-6">
        <Navbar />
        <div className="flex-grow">
          <Hero />
          <Analyzer />
        </div>
        <Footer />
      </div>
    </main>
  );
}
