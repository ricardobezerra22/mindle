import type { Task, TaskCategory, SubTask, TaskStatus, Priority } from '~/types'

export const useTasks = () => {
  const tasks = ref<Task[]>([])
  const categories = ref<TaskCategory[]>([])
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

  const fetchCategories = async () => {
    try {
      const response = await $fetch<{ success: boolean; data: TaskCategory[] }>('/api/task-categories')
      if (response.success) {
        categories.value = response.data
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e)
    }
  }

  const createCategory = async (name: string, color: string) => {
    try {
      const response = await $fetch<{ success: boolean; data: TaskCategory }>('/api/task-categories', {
        method: 'POST',
        body: { name, color }
      })
      if (response.success) {
        const exists = categories.value.find(c => c.id === response.data.id)
        if (!exists) {
          categories.value.push(response.data)
        }
        return response.data
      }
    } catch (e: any) {
      const message = e?.data?.error || 'Erro ao criar categoria'
      throw new Error(message)
    }
  }

  const createTask = async (taskData: {
    title: string
    description?: string
    status?: TaskStatus
    priority?: Priority
    dueDate?: Date
    color?: string
    categoryId?: string
    subTasks?: { title: string }[]
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

  const addSubTask = async (taskId: string, title: string) => {
    try {
      const response = await $fetch<{ success: boolean; data: SubTask }>('/api/subtasks', {
        method: 'POST',
        body: { title, taskId }
      })
      if (response.success) {
        const task = tasks.value.find(t => t.id === taskId)
        if (task) {
          if (!task.subTasks) task.subTasks = []
          task.subTasks.push(response.data)
        }
        return response.data
      }
    } catch (e) {
      console.error('Failed to add subtask:', e)
    }
  }

  const toggleSubTask = async (subTaskId: string, done: boolean) => {
    try {
      const response = await $fetch<{ success: boolean; data: SubTask }>(`/api/subtasks/${subTaskId}`, {
        method: 'PATCH',
        body: { done }
      })
      if (response.success) {
        for (const task of tasks.value) {
          const st = task.subTasks?.find(s => s.id === subTaskId)
          if (st) {
            st.done = done
            break
          }
        }
        return response.data
      }
    } catch (e) {
      console.error('Failed to toggle subtask:', e)
    }
  }

  return {
    tasks,
    categories,
    loading,
    error,
    fetchTasks,
    fetchCategories,
    createCategory,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addSubTask,
    toggleSubTask
  }
}
