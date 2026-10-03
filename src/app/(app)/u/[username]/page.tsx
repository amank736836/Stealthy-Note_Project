"use client";

import { messageSchema } from "@/backend/schemas/messageSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Heart,
  Loader2,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const specialChar = "||";
const initialMessageString =
  "What’s a small thing that always makes you smile?||What’s something you wish you had more time for?||What’s one thing you appreciate about your friends?";

const parseStringMessages = (messageString: string) =>
  messageString
    .split(specialChar)
    .map((message) => message.trim())
    .filter(Boolean);

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [messageString, setMessageString] = useState(initialMessageString);
  const [isCompletionLoading, setIsCompletionLoading] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const messageArray = parseStringMessages(messageString);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });
  const messageContent = form.watch("content") || "";

  const handleMessageClick = (message: string) => {
    form.setValue("content", message, { shouldValidate: true });
  };

  const fetchSuggestedMessages = useCallback(async () => {
    setIsCompletionLoading(true);
    setCompletionError("");

    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages", {
        exclude: initialMessageString,
      });

      if (response.data.success && response.data.message) {
        setMessageString(response.data.message);
      } else {
        setCompletionError(
          response.data.message || "Try again in a moment for fresh prompts."
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setCompletionError(
        axiosError.response?.data.message ||
          "We couldn’t load fresh prompts, but you can still write your own."
      );
    } finally {
      setIsCompletionLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSuggestedMessages();
  }, [fetchSuggestedMessages]);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      if (response.data.success) {
        form.reset({ content: "" });
      }

      toast({
        title: response.data.success ? "Your note is on its way" : "Message not sent",
        description:
          response.data.message ||
          (response.data.success
            ? "Thanks for sharing something kind."
            : "Please try again in a moment."),
        variant: response.data.success ? "default" : "destructive",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Message not sent",
        description:
          axiosError.response?.data.message ||
          "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="public-page">
      <div className="public-shell">
        <header className="public-hero">
          <span className="public-privacy-pill">
            <LockKeyhole size={13} aria-hidden="true" />
            Anonymous by design
          </span>
          <h1>
            Send a note to <span>@{username}</span>
          </h1>
          <p>
            Say the kind thing, share a thought, or ask a question. Your name
            won’t be attached to the message.
          </p>
        </header>

        <div className="public-compose-grid">
          <section className="public-panel public-compose-panel" aria-labelledby="compose-title">
            <div className="public-panel-heading">
              <span className="public-panel-heading-icon">
                <MessageSquare size={19} aria-hidden="true" />
              </span>
              <span>
                <h2 id="compose-title">Write your note</h2>
                <p>Keep it thoughtful. Keep it anonymous.</p>
              </span>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="anonymous-message">
                        Your message
                      </FormLabel>
                      <FormControl>
                        <textarea
                          id="anonymous-message"
                          {...field}
                          rows={6}
                          maxLength={300}
                          aria-describedby="message-help message-count"
                          className="w-full resize-none"
                          placeholder="There’s something I’ve been meaning to tell you…"
                        />
                      </FormControl>
                      <div className="public-field-footer" id="message-help">
                        <span>10–300 characters</span>
                        <span id="message-count" aria-live="polite">
                          {messageContent.length}/300
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading || !messageContent.trim()}
                  className="public-send-button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      Sending your note…
                    </>
                  ) : (
                    <>
                      Send anonymously
                      <Send size={15} aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </section>

          <aside className="public-panel public-suggestion-panel" aria-labelledby="suggestion-title">
            <div className="public-suggestion-top">
              <div>
                <h2 id="suggestion-title">Need a first line?</h2>
                <p>Tap a prompt to add it to your note.</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="suggestion-refresh"
                onClick={() => void fetchSuggestedMessages()}
                disabled={isCompletionLoading}
                aria-label="Suggest new message prompts"
                title="Suggest new prompts"
              >
                {isCompletionLoading ? (
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw size={14} aria-hidden="true" />
                )}
              </Button>
            </div>

            <div className="suggestion-list">
              {isCompletionLoading && messageArray.length === 0 ? (
                <div className="public-loading" role="status">
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  Finding a little inspiration…
                </div>
              ) : (
                messageArray.map((message, index) => (
                  <Button
                    key={`${message}-${index}`}
                    type="button"
                    variant="outline"
                    onClick={() => handleMessageClick(message)}
                    className="suggestion-prompt"
                  >
                    <Sparkles
                      size={13}
                      className="mr-2 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {message}
                  </Button>
                ))
              )}
            </div>
            {completionError && (
              <p className="public-error" role="status">
                {completionError}
              </p>
            )}
          </aside>
        </div>

        <p className="public-privacy-note">
          <ShieldCheck size={15} aria-hidden="true" />
          Your note arrives without your name or profile attached.
          <Heart size={13} aria-hidden="true" />
        </p>
        <p className="public-signup-prompt">
          Want your own anonymous inbox?
          <Link href="/sign-up">Create yours <span aria-hidden="true">→</span></Link>
        </p>
      </div>
    </main>
  );
}
