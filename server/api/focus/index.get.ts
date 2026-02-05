import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = '000000000000000000000001'
    
    const sessions = await prisma.focusSession.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return sendSuccess(event, sessions)
  } catch (error) {
    console.error('Error fetching focus sessions:', error)
    return sendError(event, 'Failed to fetch focus sessions', 500)
  }
})
