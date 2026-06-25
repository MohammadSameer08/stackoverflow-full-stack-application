import HeroSection from "./components/HeroSection";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMapQuestion, IconUser } from "@tabler/icons-react";

export default function Home() {
  const navItems = [
    { name: "Home", link: "/", icon: <IconHome className="w-4 h-4" /> },
    { name: "Questions", link: "/questions", icon: <IconMapQuestion className="w-4 h-4" /> },
    { name: "Users", link: "/users", icon: <IconUser className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-black">
      <FloatingNav navItems={navItems} />
      <HeroSection />
    </div>
  );
}
