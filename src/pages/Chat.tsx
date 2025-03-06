
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, MoreVertical, Search, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import MessageBubble, { MessageProps } from '@/components/MessageBubble';
import ConversationList, { Conversation } from '@/components/ConversationList';
import ChatInput from '@/components/ChatInput';

// Mock data for conversations
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://avatar.vercel.sh/alice',
    lastMessage: {
      content: 'Hey, how are you doing today?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: true,
    },
    status: 'online',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://avatar.vercel.sh/bob',
    lastMessage: {
      content: 'Can we schedule a meeting tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
    },
    status: 'offline',
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Team Project',
    avatar: 'https://avatar.vercel.sh/team',
    lastMessage: {
      content: 'Let\'s discuss the new features',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      sender: 'Carol',
      isRead: true,
    },
    isGroup: true,
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://avatar.vercel.sh/david',
    lastMessage: {
      content: 'Thanks for your help!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
    },
    status: 'away',
  },
  {
    id: '5',
    name: 'Marketing Team',
    avatar: 'https://avatar.vercel.sh/marketing',
    lastMessage: {
      content: 'New campaign starting next week',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      sender: 'Emily',
      isRead: true,
    },
    isGroup: true,
  }
];

// Mock messages for conversations
const generateMockMessages = (conversationId: string, userId: string): MessageProps[] => {
  const conversation = MOCK_CONVERSATIONS.find(c => c.id === conversationId);
  if (!conversation) return [];

  const otherPersonId = conversation.id;
  const otherPersonName = conversation.name;

  const baseMessages = [
    {
      id: '1',
      content: 'Hi there! How are you?',
      sender: {
        id: otherPersonId,
        name: otherPersonName,
        avatar: conversation.avatar,
      },
      isOutgoing: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: 'read' as const,
    },
    {
      id: '2',
      content: 'I\'m doing well, thanks for asking! What about you?',
      sender: {
        id: userId,
        name: 'You',
      },
      isOutgoing: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
      status: 'read' as const,
    },
    {
      id: '3',
      content: 'I\'m good too. Just working on some projects.',
      sender: {
        id: otherPersonId,
        name: otherPersonName,
        avatar: conversation.avatar,
      },
      isOutgoing: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      status: 'read' as const,
    },
    {
      id: '4',
      content: 'That sounds interesting! What kind of projects?',
      sender: {
        id: userId,
        name: 'You',
      },
      isOutgoing: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      status: 'read' as const,
    },
    {
      id: '5',
      content: 'Mostly web development and some design work.',
      sender: {
        id: otherPersonId,
        name: otherPersonName,
        avatar: conversation.avatar,
      },
      isOutgoing: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      status: 'read' as const,
    },
    {
      id: '6',
      content: 'Check out this mockup I created!',
      sender: {
        id: otherPersonId,
        name: otherPersonName,
        avatar: conversation.avatar,
      },
      isOutgoing: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 minutes ago
      status: 'read' as const,
      type: 'image' as const,
    },
    {
      id: '7',
      content: 'That looks awesome! I love the color scheme.',
      sender: {
        id: userId,
        name: 'You',
      },
      isOutgoing: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      status: 'read' as const,
    },
    {
      id: '8',
      content: 'project_document.pdf',
      sender: {
        id: otherPersonId,
        name: otherPersonName,
        avatar: conversation.avatar,
      },
      isOutgoing: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      status: 'read' as const,
      type: 'file' as const,
    },
    {
      id: '9',
      content: 'Voice message',
      sender: {
        id: userId,
        name: 'You',
      },
      isOutgoing: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      status: 'delivered' as const,
      type: 'audio' as const,
      duration: 45,
    },
    {
      id: '10',
      content: 'Let\'s catch up later this week!',
      sender: {
        id: otherPersonId,
        name: otherPersonName,
        avatar: conversation.avatar,
      },
      isOutgoing: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      status: 'read' as const,
    },
  ];

  if (conversationId === '2') {
    // Different conversation flow for Bob
    return [
      ...baseMessages.slice(0, 4),
      {
        id: '5',
        content: 'I\'m planning the quarterly review meeting. Are you available tomorrow at 2 PM?',
        sender: {
          id: otherPersonId,
          name: otherPersonName,
          avatar: conversation.avatar,
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 40), // 40 minutes ago
        status: 'read' as const,
      },
      {
        id: '6',
        content: 'Yes, that works for me. Should I prepare anything specific?',
        sender: {
          id: userId,
          name: 'You',
        },
        isOutgoing: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 38), // 38 minutes ago
        status: 'read' as const,
      },
      {
        id: '7',
        content: 'meeting_agenda.docx',
        sender: {
          id: otherPersonId,
          name: otherPersonName,
          avatar: conversation.avatar,
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
        status: 'read' as const,
        type: 'file' as const,
      },
      {
        id: '8',
        content: 'Just review this agenda and bring your project updates.',
        sender: {
          id: otherPersonId,
          name: otherPersonName,
          avatar: conversation.avatar,
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: 'delivered' as const,
      },
    ];
  } else if (conversationId === '3') {
    // Group conversation
    return [
      {
        id: '1',
        content: 'Hi team, let\'s discuss the project roadmap',
        sender: {
          id: 'carol-id',
          name: 'Carol',
          avatar: 'https://avatar.vercel.sh/carol',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        status: 'read' as const,
      },
      {
        id: '2',
        content: 'I think we should prioritize the user authentication feature',
        sender: {
          id: userId,
          name: 'You',
        },
        isOutgoing: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 115), // 115 minutes ago
        status: 'read' as const,
      },
      {
        id: '3',
        content: 'I agree. Security should be our first priority.',
        sender: {
          id: 'david-id',
          name: 'David',
          avatar: 'https://avatar.vercel.sh/david',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 110), // 110 minutes ago
        status: 'read' as const,
      },
      {
        id: '4',
        content: 'project_roadmap.pdf',
        sender: {
          id: 'carol-id',
          name: 'Carol',
          avatar: 'https://avatar.vercel.sh/carol',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 100), // 100 minutes ago
        status: 'read' as const,
        type: 'file' as const,
      },
      {
        id: '5',
        content: 'Here\'s the current roadmap for reference',
        sender: {
          id: 'carol-id',
          name: 'Carol',
          avatar: 'https://avatar.vercel.sh/carol',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 99), // 99 minutes ago
        status: 'read' as const,
      },
      {
        id: '6',
        content: 'Let\'s meet tomorrow to finalize the plan.',
        sender: {
          id: 'david-id',
          name: 'David',
          avatar: 'https://avatar.vercel.sh/david',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 80), // 80 minutes ago
        status: 'read' as const,
      },
      {
        id: '7',
        content: 'Sounds good to me. What time works for everyone?',
        sender: {
          id: userId,
          name: 'You',
        },
        isOutgoing: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 75), // 75 minutes ago
        status: 'read' as const,
      },
      {
        id: '8',
        content: 'How about 10 AM?',
        sender: {
          id: 'carol-id',
          name: 'Carol',
          avatar: 'https://avatar.vercel.sh/carol',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 60 minutes ago
        status: 'read' as const,
      },
      {
        id: '9',
        content: 'That works for me.',
        sender: {
          id: userId,
          name: 'You',
        },
        isOutgoing: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
        status: 'read' as const,
      },
      {
        id: '10',
        content: '10 AM is perfect.',
        sender: {
          id: 'david-id',
          name: 'David',
          avatar: 'https://avatar.vercel.sh/david',
        },
        isOutgoing: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
        status: 'read' as const,
      },
    ];
  }

  return baseMessages;
};

const Chat = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load conversation data
  useEffect(() => {
    if (!user) return;

    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      
      if (conversation) {
        setActiveConversation(conversation);
        
        // Generate messages for this conversation
        const mockMessages = generateMockMessages(conversationId, user.id);
        setMessages(mockMessages);
        
        // Mark as read
        setConversations(prevConversations => 
          prevConversations.map(c => {
            if (c.id === conversationId && c.lastMessage) {
              return {
                ...c,
                lastMessage: {
                  ...c.lastMessage,
                  isRead: true
                },
                unreadCount: 0
              };
            }
            return c;
          })
        );
      } else {
        navigate('/chat');
      }
    } else {
      setActiveConversation(null);
      setMessages([]);
    }
  }, [conversationId, user, conversations, navigate]);

  // Handle sending a new message
  const handleSendMessage = (content: string) => {
    if (!user || !conversationId) return;

    const newMessage: MessageProps = {
      id: Date.now().toString(),
      content,
      sender: {
        id: user.id,
        name: user.username,
      },
      isOutgoing: true,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate message status changes
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
        )
      );

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
          )
        );

        setTimeout(() => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === newMessage.id ? { ...msg, status: 'read' as const } : msg
            )
          );
        }, 1000);
      }, 1000);
    }, 1000);

    // Update last message in conversation list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: {
                content,
                timestamp: new Date(),
                isRead: true,
              },
            }
          : conv
      )
    );

    // Simulate a reply for demo purposes
    if (conversationId === '1') {
      setTimeout(() => {
        const replyMessage: MessageProps = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for the message! I'll get back to you soon.",
          sender: {
            id: '1',
            name: 'Alice Johnson',
            avatar: 'https://avatar.vercel.sh/alice',
          },
          isOutgoing: false,
          timestamp: new Date(),
          status: 'delivered',
        };

        setMessages(prev => [...prev, replyMessage]);
        
        // Update last message in conversation list
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  lastMessage: {
                    content: replyMessage.content,
                    timestamp: new Date(),
                    isRead: true,
                  },
                }
              : conv
          )
        );
      }, 5000);
    }
  };

  // Filter conversations by search term
  const filteredConversations = conversations.filter(
    conversation => {
      const matchesSearch = conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'chats' ? !conversation.isGroup : conversation.isGroup;
      return matchesSearch && matchesTab;
    }
  );

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col border-r">
        <div className="p-3 flex justify-between items-center border-b">
          <h1 className="font-bold text-lg">Messages</h1>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <Tabs 
          defaultValue="chats" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'chats' | 'groups')}
          className="flex-1 flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2 p-3">
            <TabsTrigger value="chats" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              <span>Chats</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span>Groups</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chats" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <ConversationList
                conversations={filteredConversations.filter(c => !c.isGroup)}
                activeConversationId={conversationId}
              />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="groups" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <ConversationList
                conversations={filteredConversations.filter(c => c.isGroup)}
                activeConversationId={conversationId}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeConversation ? (
          <>
            <Header
              title={activeConversation.name}
              subtitle={activeConversation.status === 'online' ? 'Online' : activeConversation.status === 'away' ? 'Away' : 'Offline'}
              showBackButton={true}
              showActions={true}
              avatar={activeConversation.avatar}
              status={activeConversation.status}
            />
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} {...message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <ChatInput 
              onSendMessage={handleSendMessage}
              onSendAudio={() => console.log('Audio recording toggled')}
              onAttach={() => console.log('Attach clicked')}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Choose a conversation from the list or start a new one to begin messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
