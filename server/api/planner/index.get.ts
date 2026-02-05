import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId
    
    const entries = await prisma.plannerEntry.findMany({
      where: { userId },
      include: {
        task: true
      },
      orderBy: {
        date: 'asc'
      }
    })
    
    return sendSuccess(event, entries)
  } catch (error) {
    console.error('Error fetching planner entries:', error)
    return sendError(event, 'Failed to fetch planner entries', 500)
  }
})
