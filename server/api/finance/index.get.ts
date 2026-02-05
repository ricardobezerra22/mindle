import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId
    
    const entries = await prisma.financeEntry.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return sendSuccess(event, entries)
  } catch (error) {
    console.error('Error fetching finance entries:', error)
    return sendError(event, 'Failed to fetch finance entries', 500)
  }
})
