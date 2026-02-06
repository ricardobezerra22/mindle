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
    category?: string
    categoryColor?: string
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
    error.value = null
    const index = tasks.value.findIndex(t => t.id === id)
    if (index === -1) return

    const previousTask = { ...tasks.value[index] }
    tasks.value[index] = { ...tasks.value[index], ...updates }

    try {
      const response = await $fetch<{ success: boolean; data: Task }>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: updates
      })
      if (response.success) {
        tasks.value[index] = response.data
        return response.data
      } else {
        tasks.value[index] = previousTask
        error.value = 'Failed to update task'
      }
    } catch (e) {
      tasks.value[index] = previousTask
      error.value = 'Failed to update task'
      console.error(e)
      throw e
    }
  }

  const deleteTask = async (id: string) => {
    error.value = null
    const taskIndex = tasks.value.findIndex(t => t.id === id)
    if (taskIndex === -1) return

    const deletedTask = tasks.value[taskIndex]
    tasks.value = tasks.value.filter(t => t.id !== id)

    try {
      await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    } catch (e) {
      tasks.value.splice(taskIndex, 0, deletedTask)
      error.value = 'Failed to delete task'
      console.error(e)
      throw e
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
