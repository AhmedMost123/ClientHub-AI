import MessageBubble from "./MessageBubble";

interface ChatFile {
  id: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface Message {
  id: string;
  content: string | null;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
  };
  files: ChatFile[];
}

interface Props {
  currentUserId: string;
  messages: Message[];
}

export default function MessageList({ currentUserId, messages }: Props) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          own={message.sender.id === currentUserId}
          sender={message.sender.name ?? "Unknown"}
          content={message.content}
          createdAt={message.createdAt}
          files={message.files}
        />
      ))}
    </div>
  );
}
