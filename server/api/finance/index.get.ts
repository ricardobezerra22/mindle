import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = '000000000000000000000001'
    
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
