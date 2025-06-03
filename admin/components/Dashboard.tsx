import { useState } from 'react';
import { ProjectsManager } from './ProjectsManager';
import { MessagesManager } from './MessagesManager';
import { supabase } from '../supabase';

export function Dashboard({ session, unreadCount }) {
  const [activeTab, setActiveTab] = useState('projects');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'projects'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('projects')}
            >
              Projects
            </button>
            <button
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'messages'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('messages')}
            >
              Messages {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'projects' ? (
          <ProjectsManager session={session} />
        ) : (
          <MessagesManager session={session} />
        )}
      </main>
    </div>
  );
}