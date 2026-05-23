import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Stats } from "@/components/site/Stats";
import { Portfolio } from "@/components/site/Portfolio";
import { Brands } from "@/components/site/Brands";
import { Services } from "@/components/site/Services";
import { WhyMe } from "@/components/site/WhyMe";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "Rafiya Syed — UGC Creator · Beauty & Lifestyle · Toronto" },
            {
                name: "description",
                content:
                    "Toronto-based UGC creator crafting aesthetic, high-converting beauty, skincare and lifestyle content for modern brands.",
            },
            { property: "og:title", content: "Rafiya Syed — UGC Creator" },
            {
                property: "og:description",
                content:
                    "Beauty, skincare & lifestyle UGC designed to stop the scroll. Available for brand collaborations.",
            },
        ],
    }),
    component: Index,
});

function Index() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <About />
            <Stats />
            <Portfolio />
            <Brands />
            <Services />
            <WhyMe />
            <Contact />
            <Footer />
        </main>
    );
}
