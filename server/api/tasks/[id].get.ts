import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      return sendError(event, 'Task ID is required', 400)
    }
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        subTasks: true
      }
    })
    
    if (!task) {
      return sendError(event, 'Task not found', 404)
    }
    
    return sendSuccess(event, task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return sendError(event, 'Failed to fetch task', 500)
  }
})
