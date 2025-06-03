import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

interface Project {
  id: string;
  title: string;
  description: string;
  images: string[];
  technologies: string[];
  live_url: string;
  github_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: newStatus } : project
      ));
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading projects...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => setEditingProject(null)} // Reset for new project
        >
          Add New Project
        </button>
      </div>
      
      {projects.length === 0 ? (
        <p className="text-gray-400 text-center">No projects yet</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-gray-800 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                  <p className="text-gray-400">{project.description}</p>
                </div>
                <select
                  value={project.status}
                  onChange={(e) => handleStatusChange(project.id, e.target.value)}
                  className="bg-gray-700 text-white rounded px-2 py-1"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex gap-2 flex-wrap mt-2">
                {project.technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-700 text-sm text-gray-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Last updated: {new Date(project.updated_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}