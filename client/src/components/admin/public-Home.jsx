import { useEffect } from "react";
import GridCanvas from "../../components/public/GridCanvas";
import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/Hero";
import About from "../../components/public/About";
import Experience from "../../components/public/Experience";
import Education from "../../components/public/Education";
import Systems from "../../components/public/Systems";
import Stack from "../../components/public/Stack";
import Work from "../../components/public/Work";
import Contact from "../../components/public/Contact";
import Footer from "../../components/public/Footer";
import { trackVisit } from "../../api/analyticsApi";

export default function Home() {
    useEffect(() => {
        if (!sessionStorage.getItem("visit_tracked")) {
            trackVisit()
                .then(() => sessionStorage.setItem("visit_tracked", "true"))
                .catch(() => { });
        }
    }, []);

    return (
        <div
            className="relative min-h-screen w-full text-slate-100"
            style={{ backgroundColor: "#070B14" }}
        >
            <div className="pointer-events-none fixed inset-0 z-0">
                <GridCanvas />
            </div>

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <About />
                <Experience />
                <Education />
                <Systems />
                <Stack />
                <Work />
                <Contact />
                <Footer />
            </div>
        </div>
    );
}
