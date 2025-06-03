import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read_status: boolean;
  created_at: string;
}

export function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_status: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read_status: !currentStatus } : msg
      ));
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading messages...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet</p>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.read_status ? 'bg-gray-800' : 'bg-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{message.name}</h3>
                  <p className="text-gray-400">{message.email}</p>
                </div>
                <button
                  onClick={() => toggleReadStatus(message.id, message.read_status)}
                  className={`px-3 py-1 rounded text-sm ${
                    message.read_status
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.read_status ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
              <p className="text-gray-300">{message.message}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(message.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}