import { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import PrimaryButton from '../Components/PrimaryButton';
import ProjectCard from './Projects/ProjectCard';
import TaskTable from './Tasks/TaskTable';

export default function Dashboard({ projects: initialProjects }) {
  const [projects, setProjects] = useState(initialProjects || []);

  // keep local state in sync when Inertia navigates back
  useEffect(() => {
    setProjects(initialProjects || []);
  }, [initialProjects]);

  // flatten tasks and attach project metadata
  const tasks = projects.flatMap((p) =>
    p.tasks.map((t) => ({
      ...t,
      projectTitle: p.title || p.name || 'Unknown',
      projectId: p.id,
    })),
  );

  const addProject = () => {
    Inertia.get('/projects');
  };

  const addTask = () => {
    if (projects.length === 0) {
      alert('Please create a project first.');
      return;
    }
    // navigate to first project for task creation; user can switch there
    Inertia.get(`/projects/${projects[0].id}`);
  };

  const openProject = (proj) => {
    Inertia.get(`/projects/${proj.id}`);
  };

  const toggleStatus = (id) => {
    Inertia.post(`/tasks/${id}/toggle-status`);
  };

  const editTask = (task) => {
    Inertia.get(`/projects/${task.projectId}`);
  };

  const deleteTask = (task) => {
    if (confirm('Delete this task?')) {
      Inertia.delete(`/tasks/${task.id}`);
    }
  };

  return (
    <AuthenticatedLayout>
      {/* Projects section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Projects</h2>
          <PrimaryButton onClick={addProject}>+ Add Project</PrimaryButton>
        </div>
        {projects.length === 0 ? (
          <p className="text-gray-500">You don't have any projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onClick={() => openProject(proj)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Tasks section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Tasks</h2>
          <PrimaryButton onClick={addTask}>+ Add Task</PrimaryButton>
        </div>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks to display.</p>
        ) : (
          <TaskTable
            tasks={tasks}
            showProject
            onToggleStatus={toggleStatus}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
