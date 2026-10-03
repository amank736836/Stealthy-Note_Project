"use client";

import MessageWall from "@/components/MessageWall";
import RevealOnScroll from "@/components/RevealOnScroll";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Fingerprint,
  Heart,
  Link2,
  LockKeyhole,
  MessageCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const steps = [
  {
    number: "01",
    title: "Make your link",
    description:
      "Create a private inbox in a few seconds. Your personal link is ready to share whenever you are.",
    icon: Link2,
  },
  {
    number: "02",
    title: "Pass it around",
    description:
      "Send your link to your circle, or post it where your people will find it. No app download needed.",
    icon: Send,
  },
  {
    number: "03",
    title: "Hear what’s real",
    description:
      "Read thoughtful, anonymous notes in your inbox. Keep messages on—or pause them—any time.",
    icon: MessageSquare,
  },
];

function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) router.replace("/dashboard");
  }, [session, router]);

  return (
    <main className="landing-page">
      <div className="landing-ambience" aria-hidden="true">
        <span className="ambient-orb ambient-orb-one" />
        <span className="ambient-orb ambient-orb-two" />
      </div>
      <RevealOnScroll />

      <div className="landing-content">
        <section className="hero-section site-container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Your space for honest messages
            </p>
            <h1 id="hero-title" className="hero-title">
              Make room for <span className="hero-highlight">honest words.</span>
            </h1>
            <p className="hero-description">
              Give your people a safe little space to say what they really mean.
              Share your link, get thoughtful anonymous notes, and stay in
              control of your inbox.
            </p>

            <div className="hero-actions">
              <Link href="/sign-up" className="cta-primary">
                Create your inbox
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link href="#how-it-works" className="cta-secondary">
                See how it works
                <ArrowDown size={15} aria-hidden="true" />
              </Link>
            </div>

            <ul className="hero-assurances" aria-label="Stealthy Note highlights">
              <li>
                <Check size={14} aria-hidden="true" /> No names attached
              </li>
              <li>
                <Check size={14} aria-hidden="true" /> You stay in control
              </li>
              <li>
                <Check size={14} aria-hidden="true" /> Free to start
              </li>
            </ul>
          </div>

          <div
            className="hero-art"
            role="img"
            aria-label="A preview of an anonymous message inbox"
          >
            <div className="floating-chip floating-chip-lock">
              <LockKeyhole size={14} aria-hidden="true" />
              Anonymous by default
            </div>
            <div className="inbox-preview">
              <div className="preview-topbar">
                <div className="preview-brand">
                  <span className="preview-brand-icon">
                    <Fingerprint size={16} aria-hidden="true" />
                  </span>
                  <span>your little inbox</span>
                </div>
                <span className="preview-status">
                  <span className="preview-status-dot" aria-hidden="true" />
                  accepting notes
                </span>
              </div>

              <div className="preview-heading">
                <h2>A note for you</h2>
                <span>2 new</span>
              </div>

              <article className="preview-message preview-message-featured">
                <div className="preview-message-meta">
                  <span className="preview-sender">
                    <span className="preview-sender-icon">
                      <UserRound size={13} aria-hidden="true" />
                    </span>
                    Someone in your circle
                  </span>
                  <span>just now</span>
                </div>
                <p>
                  You make people feel like they can be completely themselves.
                  I hope you know what a rare thing that is.
                </p>
              </article>

              <article className="preview-message">
                <div className="preview-message-meta">
                  <span className="preview-sender">
                    <span className="preview-sender-icon">
                      <MessageCircle size={13} aria-hidden="true" />
                    </span>
                    An anonymous note
                  </span>
                  <span>8 min ago</span>
                </div>
                <p>
                  Still smiling about that ridiculous story you told at lunch.
                  More of those, please.
                </p>
              </article>

              <div className="preview-composer">
                <span>Write something kind, anonymously…</span>
                <span className="preview-send">
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
              </div>
            </div>
            <div className="floating-chip floating-chip-heart">
              <Heart size={14} aria-hidden="true" />
              The nice things, too
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="section-block site-container"
          aria-labelledby="steps-title"
          data-reveal
        >
          <div className="section-intro">
            <span className="section-eyebrow">A little note goes a long way</span>
            <h2 id="steps-title" className="section-title">
              Easy to share. <br className="sm:hidden" />Easy to make yours.
            </h2>
            <p className="section-copy">
              No complicated setup or awkward introductions. Just a link, a
              message, and a little more honesty between friends.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map(({ number, title, description, icon: Icon }) => (
              <article className="step-card" key={number}>
                <div className="step-card-top">
                  <span className="step-icon">
                    <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="step-number">{number}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="privacy"
          className="privacy-band site-container"
          aria-labelledby="privacy-title"
          data-reveal
        >
          <div className="privacy-copy">
            <span className="section-eyebrow">Your inbox, your rules</span>
            <h2 id="privacy-title">A little mystery. A lot of control.</h2>
            <p>
              Anonymous should feel comfortable—not out of your hands. Your
              messages stay in your inbox, and you can switch off incoming
              notes whenever you need a quieter moment.
            </p>
            <div className="privacy-points">
              <span>
                <ShieldCheck size={14} aria-hidden="true" /> Private inbox
              </span>
              <span>
                <LockKeyhole size={14} aria-hidden="true" /> Pause any time
              </span>
              <span>
                <Check size={14} aria-hidden="true" /> Your call, always
              </span>
            </div>
          </div>
          <div className="privacy-visual" aria-hidden="true">
            <div className="privacy-lock-orbit">
              <div className="privacy-lock-ring">
                <LockKeyhole size={39} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>

        <section
          className="message-wall-section site-container"
          aria-labelledby="message-wall-title"
          data-reveal
        >
          <div className="section-intro">
            <span className="section-eyebrow">Good things are easier to say</span>
            <h2 id="message-wall-title" className="section-title">
              A few words can <br className="sm:hidden" />stay with you.
            </h2>
            <p className="section-copy">
              A note can be a thank you, a tiny confession, or something you
              have been meaning to say for a while.
            </p>
          </div>
          <MessageWall />
        </section>

        <section className="landing-cta site-container" data-reveal>
          <span className="section-eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            Ready when you are
          </span>
          <h2>Make a little room for the words that matter.</h2>
          <p>
            Start your private inbox, share it with your people, and see what
            they have been wanting to tell you.
          </p>
          <Link href="/sign-up" className="cta-primary">
            Get your anonymous inbox
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </section>

        <footer className="landing-footer site-container">
          <span className="landing-footer-brand">
            <Fingerprint size={17} aria-hidden="true" />
            Stealthy Note
          </span>
          <span>© {new Date().getFullYear()} Stealthy Note. Made for honest conversations.</span>
        </footer>
      </div>
    </main>
  );
}

export default Home;
