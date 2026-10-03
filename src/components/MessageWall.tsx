import { Heart, MessageCircle, Sparkles, UserRound } from "lucide-react";
import examples from "@/messages.json";

const iconByIndex = [Heart, MessageCircle, Sparkles];
const toneByIndex = ["sample-note-soft", "", "sample-note-green"];
const timeByIndex = ["just now", "a little while ago", "today"];

function MessageNote({
  title,
  content,
  index,
}: {
  title: string;
  content: string;
  index: number;
}) {
  const Icon = iconByIndex[index % iconByIndex.length];
  const tone = toneByIndex[index % toneByIndex.length];

  return (
    <article className={`sample-note ${tone}`}>
      <div className="sample-note-top">
        <span className="sample-note-label">
          <Icon size={14} aria-hidden="true" />
          {title}
        </span>
        <time>{timeByIndex[index % timeByIndex.length]}</time>
      </div>
      <blockquote>{content}</blockquote>
      <div className="sample-note-byline">
        <span className="anonymous-avatar">
          <UserRound size={14} aria-hidden="true" />
        </span>
        From someone in your circle
      </div>
    </article>
  );
}

export default function MessageWall() {
  const notes = [
    ...examples.messageFirstRow.slice(0, 2),
    ...examples.messageSecondRow.slice(0, 1),
  ];

  return (
    <div className="message-wall">
      <div className="message-wall-column">
        {notes.slice(0, 2).map((note, index) => (
          <MessageNote
            key={note.title}
            title={note.title}
            content={note.content}
            index={index}
          />
        ))}
      </div>
      <div className="message-wall-column">
        {notes.slice(2).map((note, index) => (
          <MessageNote
            key={note.title}
            title={note.title}
            content={note.content}
            index={index + 2}
          />
        ))}
      </div>
    </div>
  );
}
