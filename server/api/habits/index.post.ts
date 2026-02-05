import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = '000000000000000000000001'
    
    const body = await readBody(event)
    const { title, icon } = body

    if (!title) {
      return sendError(event, 'Title is required', 400)
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        title,
        icon: icon || null
      }
    })

    return sendSuccess(event, habit)
  } catch (error) {
    console.error('Error creating habit:', error)
    return sendError(event, 'Failed to create habit', 500)
  }
})
