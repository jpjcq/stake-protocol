import Navbar from "../components/Navbar";
import HomeContent from "../components/HomeContent";
import { GradientBackground } from "../components/GradientBackground";

export default function HomePage() {
  return (
    <>
      <GradientBackground />
      <Navbar />
      <HomeContent />
    </>
  );
}
