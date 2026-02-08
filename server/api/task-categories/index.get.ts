import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId

    const categories = await prisma.taskCategory.findMany({
      where: { userId },
      orderBy: { name: 'asc' }
    })

    return sendSuccess(event, categories)
  } catch (error) {
    console.error('Error fetching task categories:', error)
    return sendError(event, 'Failed to fetch task categories', 500)
  }
})
