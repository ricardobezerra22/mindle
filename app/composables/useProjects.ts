import type {
  Project,
  Topic,
  Subtopic,
  ProjectTask,
  TaskCategory,
} from "~/types";

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export const useProjects = () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchProjects = async (params?: {
    search?: string;
    categoryId?: string;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const query: Record<string, string> = {};
      if (params?.search) query.search = params.search;
      if (params?.categoryId) query.categoryId = params.categoryId;

      const response = await $fetch<APIResponse<Project[]>>("/api/projects", {
        query,
      });
      if (response.success) {
        projects.value = response.data;
      }
    } catch (e) {
      error.value = "Failed to fetch projects";
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const createProject = async (data: {
    title: string;
    description?: string;
    categoryId?: string;
  }) => {
    try {
      const response = await $fetch<APIResponse<Project>>("/api/projects", {
        method: "POST",
        body: data,
      });
      if (response.success) {
        projects.value.push(response.data);
        return response.data;
      }
    } catch (e) {
      console.error("Failed to create project:", e);
      throw e;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index === -1) return;

    const previous = { ...projects.value[index] };
    projects.value[index] = { ...projects.value[index], ...updates };

    try {
      const response = await $fetch<APIResponse<Project>>(
        `/api/projects/${id}`,
        {
          method: "PUT",
          body: updates,
        },
      );
      if (response.success) {
        projects.value[index] = response.data;
        return response.data;
      } else {
        projects.value[index] = previous;
      }
    } catch (e) {
      projects.value[index] = previous;
      console.error("Failed to update project:", e);
      throw e;
    }
  };

  const deleteProject = async (id: string) => {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index === -1) return;

    const removed = projects.value.splice(index, 1)[0];

    try {
      await $fetch(`/api/projects/${id}`, { method: "DELETE" });
    } catch (e) {
      projects.value.splice(index, 0, removed);
      console.error("Failed to delete project:", e);
      throw e;
    }
  };

  const createTopic = async (projectId: string, title: string) => {
    try {
      const response = await $fetch<APIResponse<Topic>>(
        "/api/projects/topics",
        {
          method: "POST",
          body: { title, projectId },
        },
      );
      if (response.success) {
        const project = projects.value.find((p) => p.id === projectId);
        if (project) {
          if (!project.topics) project.topics = [];
          project.topics.push(response.data);
        }
        return response.data;
      }
    } catch (e) {
      console.error("Failed to create topic:", e);
      throw e;
    }
  };

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    try {
      const response = await $fetch<APIResponse<Topic>>(
        "/api/projects/topics",
        {
          method: "PUT",
          body: { id, ...updates },
        },
      );
      if (response.success) {
        for (const project of projects.value) {
          const topicIndex = project.topics?.findIndex((t) => t.id === id);
          if (topicIndex !== undefined && topicIndex >= 0 && project.topics) {
            project.topics[topicIndex] = response.data;
            break;
          }
        }
        return response.data;
      }
    } catch (e) {
      console.error("Failed to update topic:", e);
      throw e;
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await $fetch("/api/projects/topics", {
        method: "DELETE",
        body: { id },
      });
      for (const project of projects.value) {
        if (project.topics) {
          project.topics = project.topics.filter((t) => t.id !== id);
        }
      }
    } catch (e) {
      console.error("Failed to delete topic:", e);
      throw e;
    }
  };

  const createSubtopic = async (topicId: string, title: string) => {
    try {
      const response = await $fetch<APIResponse<Subtopic>>(
        "/api/projects/subtopics",
        {
          method: "POST",
          body: { title, topicId },
        },
      );
      if (response.success) {
        for (const project of projects.value) {
          const topic = project.topics?.find((t) => t.id === topicId);
          if (topic) {
            if (!topic.subtopics) topic.subtopics = [];
            topic.subtopics.push(response.data);
            break;
          }
        }
        return response.data;
      }
    } catch (e) {
      console.error("Failed to create subtopic:", e);
      throw e;
    }
  };

  const updateSubtopic = async (id: string, updates: Partial<Subtopic>) => {
    try {
      const response = await $fetch<APIResponse<Subtopic>>(
        "/api/projects/subtopics",
        {
          method: "PUT",
          body: { id, ...updates },
        },
      );
      if (response.success) {
        for (const project of projects.value) {
          for (const topic of project.topics || []) {
            const idx = topic.subtopics?.findIndex((s) => s.id === id);
            if (idx !== undefined && idx >= 0 && topic.subtopics) {
              topic.subtopics[idx] = response.data;
              return response.data;
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to update subtopic:", e);
      throw e;
    }
  };

  const deleteSubtopic = async (id: string) => {
    try {
      await $fetch("/api/projects/subtopics", {
        method: "DELETE",
        body: { id },
      });
      for (const project of projects.value) {
        for (const topic of project.topics || []) {
          if (topic.subtopics) {
            topic.subtopics = topic.subtopics.filter((s) => s.id !== id);
          }
        }
      }
    } catch (e) {
      console.error("Failed to delete subtopic:", e);
      throw e;
    }
  };

  const createProjectTask = async (
    parentId: string,
    title: string,
    level: "project" | "topic" | "subtopic" = "subtopic",
  ) => {
    try {
      const body: Record<string, string> = { title };
      if (level === "project") body.projectId = parentId;
      else if (level === "topic") body.topicId = parentId;
      else body.subtopicId = parentId;

      const response = await $fetch<APIResponse<ProjectTask>>(
        "/api/projects/project-tasks",
        { method: "POST", body },
      );
      if (response.success) {
        if (level === "project") {
          const project = projects.value.find((p) => p.id === parentId);
          if (project) {
            if (!project.tasks) project.tasks = [];
            project.tasks.push(response.data);
          }
        } else if (level === "topic") {
          for (const project of projects.value) {
            const topic = project.topics?.find((t) => t.id === parentId);
            if (topic) {
              if (!topic.tasks) topic.tasks = [];
              topic.tasks.push(response.data);
              break;
            }
          }
        } else {
          for (const project of projects.value) {
            for (const topic of project.topics || []) {
              const subtopic = topic.subtopics?.find((s) => s.id === parentId);
              if (subtopic) {
                if (!subtopic.tasks) subtopic.tasks = [];
                subtopic.tasks.push(response.data);
                return response.data;
              }
            }
          }
        }
        return response.data;
      }
    } catch (e) {
      console.error("Failed to create project task:", e);
      throw e;
    }
  };

  const findProjectTask = (id: string) => {
    for (const project of projects.value) {
      const pt = project.tasks?.find((t) => t.id === id);
      if (pt) return pt;
      for (const topic of project.topics || []) {
        const tt = topic.tasks?.find((t) => t.id === id);
        if (tt) return tt;
        for (const subtopic of topic.subtopics || []) {
          const st = subtopic.tasks?.find((t) => t.id === id);
          if (st) return st;
        }
      }
    }
    return null;
  };

  const toggleProjectTask = async (id: string, done: boolean) => {
    try {
      const response = await $fetch<APIResponse<ProjectTask>>(
        "/api/projects/project-tasks",
        { method: "PUT", body: { id, done } },
      );
      if (response.success) {
        const task = findProjectTask(id);
        if (task) task.done = done;
      }
    } catch (e) {
      console.error("Failed to toggle project task:", e);
      throw e;
    }
  };

  const deleteProjectTask = async (id: string) => {
    try {
      await $fetch("/api/projects/project-tasks", {
        method: "DELETE",
        body: { id },
      });
      for (const project of projects.value) {
        if (project.tasks) {
          project.tasks = project.tasks.filter((t) => t.id !== id);
        }
        for (const topic of project.topics || []) {
          if (topic.tasks) {
            topic.tasks = topic.tasks.filter((t) => t.id !== id);
          }
          for (const subtopic of topic.subtopics || []) {
            if (subtopic.tasks) {
              subtopic.tasks = subtopic.tasks.filter((t) => t.id !== id);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to delete project task:", e);
      throw e;
    }
  };

  const archivedProjects = ref<Project[]>([]);

  const fetchArchivedProjects = async (params?: {
    search?: string;
    order?: "asc" | "desc";
  }) => {
    try {
      const query: Record<string, string> = {};
      if (params?.search) query.search = params.search;
      if (params?.order) query.order = params.order;

      const response = await $fetch<APIResponse<Project[]>>(
        "/api/projects/archived",
        { query },
      );
      if (response.success) {
        archivedProjects.value = response.data;
      }
    } catch (e) {
      console.error("Failed to fetch archived projects:", e);
    }
  };

  const archiveProject = async (id: string) => {
    const index = projects.value.findIndex((p) => p.id === id);
    if (index === -1) return;

    const removed = projects.value.splice(index, 1)[0];

    try {
      const response = await $fetch<APIResponse<Project>>(
        `/api/projects/${id}`,
        {
          method: "PUT",
          body: { archived: true },
        },
      );
      if (response.success) {
        archivedProjects.value.unshift(response.data);
      }
    } catch (e) {
      projects.value.splice(index, 0, removed);
      console.error("Failed to archive project:", e);
      throw e;
    }
  };

  const restoreProject = async (id: string) => {
    const index = archivedProjects.value.findIndex((p) => p.id === id);
    if (index === -1) return;

    const removed = archivedProjects.value.splice(index, 1)[0];

    try {
      const response = await $fetch<APIResponse<Project>>(
        `/api/projects/${id}`,
        {
          method: "PUT",
          body: { archived: false },
        },
      );
      if (response.success) {
        projects.value.push(response.data);
      }
    } catch (e) {
      archivedProjects.value.splice(index, 0, removed);
      console.error("Failed to restore project:", e);
      throw e;
    }
  };

  return {
    projects,
    archivedProjects,
    loading,
    error,
    fetchProjects,
    fetchArchivedProjects,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    restoreProject,
    createTopic,
    updateTopic,
    deleteTopic,
    createSubtopic,
    updateSubtopic,
    deleteSubtopic,
    createProjectTask,
    toggleProjectTask,
    deleteProjectTask,
  };
};
