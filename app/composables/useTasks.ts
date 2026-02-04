import type { Task, TaskStatus, Priority } from '~/types'

export const useTasks = () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: Task[] }>('/api/tasks')
      if (response.success) {
        tasks.value = response.data
      }
    } catch (e) {
      error.value = 'Failed to fetch tasks'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData: {
    title: string
    description?: string
    status?: TaskStatus
    priority?: Priority
    dueDate?: Date
    color?: string
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: Task }>('/api/tasks', {
        method: 'POST',
        body: taskData
      })
      if (response.success) {
        tasks.value.unshift(response.data)
        return response.data
      }
    } catch (e) {
      error.value = 'Failed to create task'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: Task }>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: updates
      })
      if (response.success) {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
          tasks.value[index] = response.data
        }
        return response.data
      }
    } catch (e) {
      error.value = 'Failed to update task'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = 'Failed to delete task'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    return updateTask(id, { status })
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  }
}
