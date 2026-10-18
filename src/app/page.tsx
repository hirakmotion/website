import Contact, { NameStory } from "@/components/Contact";
import Custom from "@/components/Custom";
import Explorer from "@/components/Explorer";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Lab from "@/components/Lab";
import MotionStack from "@/components/MotionStack";
import Nav from "@/components/Nav";
import Platform from "@/components/Platform";
import Roadmap from "@/components/Roadmap";
import Why from "@/components/Why";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <MotionStack />
        <Platform />
        <Explorer />
        <Custom />
        <Why />
        <Lab />
        <Roadmap />
        <NameStory />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
