import ElementBackground from "@/components/ElementBackground";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import QuoteForm from "@/components/QuoteForm";
import ServicesBento from "@/components/ServicesBento";
import SmoothScroll from "@/components/SmoothScroll";
import WhyUs from "@/components/WhyUs";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <ElementBackground />
      <Navbar />
      <main id="main" className="relative z-10">
        <Hero />
        <ServicesBento />
        <QuoteForm />
        <WhyUs />
      </main>
      <Footer />
    </>
  );
}
