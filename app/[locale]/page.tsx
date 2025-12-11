'use client';
// import { useState } from "react";
import AboutUs from "@/components/AboutUs";
// import Blog from "@/components/Blog";
// import Consultation from "@/components/Consultation";
import Contact from "@/components/Contact";
// import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Partners from "@/components/Partners";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
// import Testimonials from "@/components/Testimonials";
import FeatureSection from "@/components/FeatureSection";
import VideoSection from "@/components/VideoSection";
// import Consultation from "@/components/Consultation";
// import Pagination from "@/components/Pagination";


// export function generateStaticParams() {
//   return [
//     { locale: 'ar' },
//     { locale: 'en' }
//   ]
// }
 
export default function Home() {


  return (
    <div 
      className="min-h-screen w-full bg-[#EFEDEA] overflow-x-hidden" 
      dir="rtl" 
      style={{ fontFamily: 'IBM Plex Sans Arabic , serif'}}
    >
      <Navbar />
      {/* Hero Section - Full height on mobile */}
      <div className=" md:min-h-full ">
        <Hero />
      </div>

      {/* Main Content with Responsive Spacing */}
      <main className="">
        <div className="">
          {/* Cards Grid Section */}
          
            {/* <FeatureCards /> */}
           {/* <VideoSection /> */}

          {/* Projects Section */}
          
            <Projects />

            <AboutUs />
           
           {/* <Blog />
      
            <Consultation />
            */}

{/* <Consultation /> */}

          
      
          <Services />

          {/* Blog Section */}
          
          <FeatureSection />
          <Partners />
          {/* Contact Section */}
          <FAQ />
         
          {/* <Testimonials /> */}
            <Contact />
           

          {/* FAQ Section */}
          

           
        </div>

        {/* Footer Section */}
        <Footer />
      </main>
    </div>
  );
}