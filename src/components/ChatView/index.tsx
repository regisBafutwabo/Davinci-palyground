import { useRef, useState } from 'react';

import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import { ChatClient } from '@/services/Chat';
import { ChatDto, ChatMessageDto } from '@/typings/Chat';

import { Message } from './components/Message';

const chatOnInitialize: ChatDto = {
  messages: [
    {
      authorName: 'Therapist',
      id: uuidv4(),
      content: 'Hello! How are you?',
      createdAt: Date.now(),
    },
  ],
};

export const ChatView = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [chat, setChat] = useState<ChatDto>(chatOnInitialize);
  const [message, setMessage] = useState('');

  const updateChatWithApiReply = async (localChat: ChatDto) => {
    const chatApiBaseUrl = process.env.NEXT_PUBLIC_API_CLIENT;

    const chatClient = new ChatClient(chatApiBaseUrl as string);
    const newChat = await chatClient.respondTo(localChat);
    setChat(newChat);
    bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };

  const chatAfterPressSend = (message: ChatMessageDto): ChatDto => {
    const newChat = { messages: [...chat.messages, message] };
    setChat(newChat);
    setMessage('');
    return newChat;
  };

  const handleSendPress = async (message: string) => {
    const newMessage: ChatMessageDto = {
      authorName: 'me',
      createdAt: Date.now(),
      id: crypto.randomUUID(),
      content: message,
    };

    const newChat = chatAfterPressSend(newMessage);
    await updateChatWithApiReply(newChat);
  };

  return (
    <div className="h-full w-full mt-[100px] mb-[100px]">
      <div className="flex flex-col gap-12 p-4 self-start overflow-y-scroll">
        {chat.messages.map((val) => (
          <Message
            key={val.id}
            content={val.content}
            authorName={val.authorName}
            id={val.id}
            createdAt={val.createdAt}
          />
        ))}
      </div>
      <div className="bottom-0 rounded border-2 border-[#3b3b3b] bg-[#3b3b3b] w-full fixed z-10 max-w-[696px] flex items-start ">
        <textarea
          rows={2}
          placeholder="type your message here..."
          className="rounded p-4 w-[660px] :focus-visble outline-none resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className={`py-3 px-2 ${message !== '' ? 'block' : 'hidden'}`}
          onClick={() => handleSendPress(message)}
        >
          <Image src="/send.png" alt="send" width={32} height={32} />
        </button>
      </div>
      <div ref={bottomRef} className="pb-[300px]" />
    </div>
  );
};
