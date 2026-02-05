import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = '000000000000000000000001'
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const mood = await prisma.dailyMood.findFirst({
      where: {
        userId,
        date: {
          gte: today
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return sendSuccess(event, mood)
  } catch (error) {
    console.error('Error fetching today mood:', error)
    return sendError(event, 'Failed to fetch today mood', 500)
  }
})
