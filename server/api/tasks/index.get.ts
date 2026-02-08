import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId
    const query = getQuery(event)

    const where: any = { userId }

    if (query.categoryId) {
      where.categoryId = String(query.categoryId)
    }

    if (query.from || query.to) {
      where.dueDate = {}
      if (query.from) where.dueDate.gte = new Date(String(query.from))
      if (query.to) where.dueDate.lte = new Date(String(query.to))
    }

    if (query.search) {
      const search = String(query.search)
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        category: true,
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
