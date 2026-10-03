"use client";

import { Message } from "@/backend/model/User";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const createdAt = new Date(message.createdAt);
  const formattedDate = Number.isNaN(createdAt.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(createdAt);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      if (response.data.success) {
        onMessageDelete(String(message._id));
        toast({
          title: "Message deleted",
          description: "The note has been removed from your inbox.",
        });
      } else {
        toast({
          title: "Couldn’t delete this message",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Couldn’t delete this message",
        description:
          axiosError.response?.data.message ||
          "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="inbox-message-card">
      <CardHeader className="inbox-message-header space-y-0">
        <div className="inbox-message-label">
          <span className="inbox-message-label-icon">
            <MessageCircle size={14} aria-hidden="true" />
          </span>
          <span>Anonymous note</span>
        </div>
        <time
          className="inbox-message-date"
          dateTime={Number.isNaN(createdAt.getTime()) ? undefined : createdAt.toISOString()}
        >
          {formattedDate}
        </time>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="inbox-delete-button"
              aria-label="Delete this message"
            >
              <Trash2 size={14} aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this note?</AlertDialogTitle>
              <AlertDialogDescription>
                This message will be permanently removed from your inbox. This
                action can’t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Keep message</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting…" : "Delete note"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="p-0">
        <p className="inbox-message-content">{message.content}</p>
      </CardContent>
    </Card>
  );
}

export default MessageCard;
