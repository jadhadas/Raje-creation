import { useEffect, useState } from 'react';
import { supabase, subscribeToNewMessages } from './supabase';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [session, setSession] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Subscribe to new messages
    if (session) {
      const subscription = subscribeToNewMessages((payload) => {
        toast.info('New message received!');
        setUnreadCount((count) => count + 1);
      });

      // Get initial unread count
      getUnreadCount();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [session]);

  const getUnreadCount = async () => {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('read_status', false);
    
    setUnreadCount(count || 0);
  };

  return (
    <>
      {!session ? (
        <Auth />
      ) : (
        <Dashboard session={session} unreadCount={unreadCount} />
      )}
      <ToastContainer />
    </>
  );
}

export default App;