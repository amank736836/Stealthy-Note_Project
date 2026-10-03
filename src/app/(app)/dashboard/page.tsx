"use client";

import { Message } from "@/backend/model/User";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import MessageCard from "@/components/MessageCard";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import {
  Check,
  Copy,
  Inbox,
  Link2,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const { toast } = useToast();
  const { data: session, status } = useSession();
  const username = session?.user?.username;
  const profileUrl =
    typeof window === "undefined" || !username
      ? ""
      : `${window.location.origin}/u/${username}`;

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => String(message._id) !== messageId)
    );
  };

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setAcceptMessages(response.data.isAcceptingMessage ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Couldn’t load inbox settings",
        description:
          axiosError.response?.data.message ||
          "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [toast]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      setMessages(response.data.messages || []);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Couldn’t load your messages",
        description:
          axiosError.response?.data.message ||
          "Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchMessages();
      void fetchAcceptMessage();
    }
  }, [status, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        isAcceptingMessage: checked,
      });
      setAcceptMessages(response.data.isAcceptingMessage ?? checked);
      toast({
        title: checked ? "Your inbox is open" : "Your inbox is paused",
        description: checked
          ? "You can receive anonymous notes again."
          : "You won’t receive new notes until you turn it back on.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Couldn’t update inbox settings",
        description:
          axiosError.response?.data.message ||
          "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!profileUrl) return;

    try {
      await navigator.clipboard.writeText(profileUrl);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 1800);
      toast({
        title: "Link copied",
        description: "Your inbox link is ready to share.",
      });
    } catch {
      toast({
        title: "Couldn’t copy the link",
        description: "Copy the address from the field and share it instead.",
        variant: "destructive",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="dashboard-loading-state" role="status">
        <Loader2 className="dashboard-loading-spinner" size={24} />
        <span>Opening your private inbox…</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <main className="app-page">
        <div className="inbox-empty-state mx-auto max-w-xl">
          <span className="inbox-empty-icon">
            <LockKeyhole size={23} aria-hidden="true" />
          </span>
          <h3>Sign in to open your inbox</h3>
          <p>Your anonymous notes and inbox settings are waiting for you.</p>
          <Link href="/sign-in" className="cta-primary mt-5">
            Sign in <MessageSquare size={15} aria-hidden="true" />
          </Link>
        </div>
      </main>
    );
  }

  const displayName = username || session.user.email || "there";

  return (
    <main className="app-page">
      <div className="dashboard-shell">
        <header className="dashboard-welcome-row">
          <div>
            <p className="dashboard-eyebrow">
              <ShieldCheck size={14} aria-hidden="true" />
              Your private space
            </p>
            <h1 className="dashboard-title">Hey, {displayName}.</h1>
            <p className="dashboard-subtitle">
              Your inbox is yours. Share your link and let the honest notes roll in.
            </p>
          </div>
          <div className="dashboard-count-card" aria-label={`${messages.length} messages in your inbox`}>
            <span className="dashboard-count-icon">
              <Mail size={18} aria-hidden="true" />
            </span>
            <span>
              <span className="dashboard-count-value">{messages.length}</span>
              <span className="dashboard-count-label">{messages.length === 1 ? "message" : "messages"}</span>
            </span>
          </div>
        </header>

        <section className="dashboard-overview-grid" aria-label="Inbox controls">
          <div className="dashboard-panel dashboard-share-panel">
            <div className="dashboard-panel-heading">
              <span className="dashboard-panel-icon">
                <Link2 size={19} aria-hidden="true" />
              </span>
              <span>
                <h2>Your personal inbox link</h2>
                <p>Share it with your people to start receiving notes.</p>
              </span>
            </div>
            <div className="profile-share-row">
              <label htmlFor="profileUrl" className="sr-only">
                Your anonymous inbox link
              </label>
              <input
                id="profileUrl"
                type="text"
                value={profileUrl}
                readOnly
                placeholder="Your link is loading…"
                className="profile-url-input"
              />
              <Button
                className="profile-copy-button"
                onClick={copyToClipboard}
                disabled={!profileUrl}
                aria-label={hasCopied ? "Link copied" : "Copy inbox link"}
              >
                {hasCopied ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                )}
                {hasCopied ? "Copied" : "Copy link"}
              </Button>
            </div>
          </div>

          <div className="dashboard-panel dashboard-status-panel">
            <div className="dashboard-status-head">
              <h2>Accepting messages</h2>
              <span
                className={`dashboard-live-pill ${acceptMessages ? "" : "is-closed"}`}
                aria-live="polite"
              >
                {acceptMessages && <span className="dashboard-live-dot" aria-hidden="true" />}
                {acceptMessages ? "Inbox open" : "Inbox paused"}
              </span>
            </div>
            <div className="dashboard-status-body">
              <p className="dashboard-status-copy">
                {acceptMessages
                  ? "Your link is live. Notes can find their way to you."
                  : "Take a breather. You can open your inbox again any time."}
              </p>
              <Switch
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="dashboard-switch"
                aria-label="Accept anonymous messages"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="inbox-title">
          <div className="inbox-section-heading">
            <div>
              <h2 id="inbox-title">Your messages</h2>
              <p>Only you can see what lands here.</p>
            </div>
            <Button
              className="refresh-button"
              variant="outline"
              onClick={() => void fetchMessages()}
              disabled={isLoading}
              aria-label="Refresh messages"
            >
              <RefreshCw
                className={isLoading ? "animate-spin" : ""}
                size={14}
                aria-hidden="true"
              />
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="inbox-empty-state" role="status">
              <Loader2 className="dashboard-loading-spinner" size={22} />
              <h3>Gathering your notes</h3>
              <p>Your private inbox is just a moment away.</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="inbox-message-grid">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="inbox-empty-state">
              <span className="inbox-empty-icon">
                <Inbox size={24} aria-hidden="true" />
              </span>
              <h3>Your inbox is ready for its first note</h3>
              <p>
                Share your link with a friend, add it to your socials, or send
                it to your group chat. The nice things are waiting to be said.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Dashboard;
