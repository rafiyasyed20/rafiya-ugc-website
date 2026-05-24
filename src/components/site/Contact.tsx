import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Mail, Instagram, ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

type Status = "idle" | "loading" | "success" | "error";

export function Contact() {
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<Status>("idle");

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");

        try {
            await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current!, {
                publicKey: PUBLIC_KEY,
            });
            setStatus("success");
            formRef.current?.reset();
        } catch {
            setStatus("error");
        }
    }

    return (
        <section id="contact" className="relative py-28 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-soft" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-200 h-200 rounded-full bg-rose/20 blur-3xl" />

            <div className="relative mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <p className="text-xs uppercase tracking-[0.3em] text-mauve mb-4">Contact</p>
                    <h2 className="font-serif text-4xl sm:text-6xl leading-tight">
                        Let's create content
                        <br />
                        your audience
                        <span className="font-display italic text-gradient"> connects with.</span>
                    </h2>
                    <p className="text-muted-foreground mt-5 max-w-xl mx-auto">
                        Available for UGC, brand collaborations, and seasonal campaigns. Send a
                        brief and I'll be in touch within 24 hours.
                    </p>
                </motion.div>

                <motion.form
                    ref={formRef}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    onSubmit={handleSubmit}
                    className="glass rounded-4xl p-8 sm:p-10 shadow-glow max-w-2xl mx-auto"
                >
                    <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Your name" name="from_name" placeholder="Jane Doe" required />
                        <Field
                            label="Email"
                            name="from_email"
                            type="email"
                            placeholder="hello@brand.com"
                            required
                        />
                        <Field label="Brand" name="brand" placeholder="Brand name" />
                        <Field label="Budget" name="budget" placeholder="$" />
                    </div>
                    <div className="mt-5">
                        <label className="text-xs uppercase tracking-widest text-muted-foreground">
                            Project Brief
                        </label>
                        <textarea
                            name="message"
                            rows={5}
                            required
                            placeholder="Tell me about your brand and what you're imagining..."
                            className="mt-2 w-full rounded-2xl bg-background/60 border border-border/60 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-ring transition resize-none"
                        />
                    </div>

                    {status === "error" && (
                        <p className="mt-4 text-sm text-destructive text-center">
                            Something went wrong. Please try again or email directly.
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="group mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background py-4 text-sm hover:opacity-90 transition disabled:opacity-60"
                    >
                        {status === "success" ? (
                            "Thank you — I'll be in touch soon."
                        ) : status === "loading" ? (
                            "Sending…"
                        ) : (
                            <>
                                Send Inquiry{" "}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </>
                        )}
                    </button>

                    <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <a
                            href="mailto:theofficialrafiyasyed@gmail.com"
                            className="inline-flex items-center gap-2 hover:text-foreground transition"
                        >
                            <Mail className="w-4 h-4" />
                            theofficialrafiyasyed@gmail.com
                        </a>
                        <div className="flex items-center gap-3">
                            <a
                                href="https://instagram.com/rafiyasyed"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-full glass grid place-items-center hover:-translate-y-0.5 transition"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://tiktok.com/@rafiyaww"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="TikTok"
                                className="w-9 h-9 rounded-full glass grid place-items-center hover:-translate-y-0.5 transition"
                            >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.89a4.85 4.85 0 0 1-1.84-.2Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </motion.form>
            </div>
        </section>
    );
}

function Field({
    label,
    name,
    type = "text",
    placeholder,
    required,
}: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
                {label}
            </label>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                required={required}
                className="mt-2 w-full rounded-full bg-background/60 border border-border/60 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
            />
        </div>
    );
}
