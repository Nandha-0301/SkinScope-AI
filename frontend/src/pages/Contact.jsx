import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";
import Button from "../components/ui/Button.jsx";
import SectionIntro from "../components/home/SectionIntro.jsx";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitNotice, setSubmitNotice] = useState("");

  const handleChange = (key, value) => {
    setSubmitted(false);
    setSubmitNotice("");
    setErrors((prev) => ({ ...prev, [key]: "" }));
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please share your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required so we can respond.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Tell us a little about what you need.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      setSubmitted(false);
      setSubmitNotice("Please fix the highlighted fields and try again.");
      return;
    }

    setSubmitting(true);
    setSubmitNotice("Sending your message...");
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
    setSubmitNotice("Thanks. Your message is ready to be reviewed.");
  };

  const fieldClass = (key) =>
    `field-base ${errors[key] ? "border-red-400 bg-red-400/10 focus:border-red-400 focus:ring-red-400/30" : ""}`;

  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="Contact"
          title="Get in touch"
          subtitle="Reach out for questions, feedback, or product conversations."
        />
      </PageSection>

      <PageSection>
        <SectionIntro
          eyebrow="Support"
          title="Product questions, feedback, and privacy conversations"
          description="We read product feedback, support questions, and partnership inquiries carefully."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <InfoCard title="Send a message" description="We only use this information to respond to your message." tilt={false}>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <input
                    className={fieldClass("name")}
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(event) => handleChange("name", event.target.value)}
                  />
                  {errors.name ? <p className="text-sm text-red-400">{errors.name}</p> : null}
                </div>

                <div className="space-y-2">
                  <input
                    className={fieldClass("email")}
                    type="email"
                    placeholder="Your email"
                    value={form.email}
                    onChange={(event) => handleChange("email", event.target.value)}
                  />
                  {errors.email ? <p className="text-sm text-red-400">{errors.email}</p> : null}
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={5}
                    className={`${fieldClass("message")} min-h-[140px] resize-none`}
                    placeholder="How can we help?"
                    value={form.message}
                    onChange={(event) => handleChange("message", event.target.value)}
                  />
                  {errors.message ? <p className="text-sm text-red-400">{errors.message}</p> : null}
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : submitted ? "Message Sent" : "Send Message"}
                </Button>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={submitNotice || (submitted ? "success" : "default")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`text-sm ${
                      errors.name || errors.email || errors.message
                        ? "text-red-400"
                        : submitted
                          ? "text-mint-300"
                          : "theme-text-secondary"
                    }`}
                  >
                    {submitNotice || "We only use this information to respond to your message."}
                  </motion.p>
                </AnimatePresence>
              </div>
            </form>
          </InfoCard>

          <InfoCard title="Contact info" description="If you prefer direct contact, reach us here." tilt={false} className="h-fit">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="eyebrow-text">Email</p>
                <p className="font-medium text-mint-300">skinscope.ai@gmail.com</p>
              </div>

              <div className="space-y-2">
                <p className="eyebrow-text">Best for</p>
                <p className="theme-text-secondary text-sm leading-7">
                  Product questions, support feedback, privacy concerns, and partnership conversations.
                </p>
              </div>

              <div className="space-y-2">
                <p className="eyebrow-text">What to expect</p>
                <p className="theme-text-secondary text-sm leading-7">
                  We focus on product questions, support feedback, and privacy-related concerns. Medical emergencies
                  should always go to a licensed professional.
                </p>
              </div>
            </div>
          </InfoCard>
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default Contact;
