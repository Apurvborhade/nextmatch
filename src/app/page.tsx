"use client"

import Header from "./components/Landing/Header";
import Hero from "./components/Landing/Hero";
import Features from "./components/Landing/Features";
import Testimonials from "./components/Landing/Testimonials";
import CTA from "./components/Landing/Cta";
import Footer from "./components/Landing/Footer";

export default function Home() {

  return (

    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>

  );
}
