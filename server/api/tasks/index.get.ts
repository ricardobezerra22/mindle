import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = '000000000000000000000001'
    
    const tasks = await prisma.task.findMany({
      where: { userId },
      include: {
        subTasks: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return sendSuccess(event, tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return sendError(event, 'Failed to fetch tasks', 500)
  }
})
