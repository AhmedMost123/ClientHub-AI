import MessageBubble from "./MessageBubble";

interface Message {
  id: string;

  content: string;

  createdAt: Date;

  sender: {
    id: string;

    name: string | null;
  };
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
        />
      ))}
    </div>
  );
}
