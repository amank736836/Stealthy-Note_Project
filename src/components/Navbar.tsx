"use client";

import { ArrowUpRight, Fingerprint, LayoutDashboard, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/sign-in");
  };

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand" aria-label="Stealthy Note home">
          <span className="brand-mark" aria-hidden="true">
            <Fingerprint size={20} strokeWidth={1.8} />
          </span>
          <span>
            <span className="brand-name block">Stealthy Note</span>
            <span className="brand-caption block">Say it in confidence</span>
          </span>
        </Link>

        <div className="site-nav-links" aria-label="Explore">
          <Link href="/#how-it-works" className="site-nav-link">
            How it works
          </Link>
          <Link href="/#privacy" className="site-nav-link">
            Privacy
          </Link>
        </div>

        <div className="site-nav-actions">
          <ThemeToggle />
          {session?.user ? (
            <>
              <span className="nav-user-label">
                @{session.user.username || session.user.email}
              </span>
              <Link href="/dashboard" className="nav-action nav-action-primary">
                <LayoutDashboard size={15} aria-hidden="true" />
                <span>Dashboard</span>
              </Link>
              <button
                type="button"
                className="nav-action nav-action-secondary"
                onClick={handleLogout}
                aria-label="Log out"
              >
                <LogOut size={15} aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="nav-action nav-action-secondary">
                Log in
              </Link>
              <Link href="/sign-up" className="nav-action nav-action-primary">
                <span>Get started</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
