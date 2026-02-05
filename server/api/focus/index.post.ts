import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId
    
    const body = await readBody(event)
    const { focusContext, durationMinutes, elapsedMinutes } = body

    if (!durationMinutes || !elapsedMinutes) {
      return sendError(event, 'Missing required fields', 400)
    }

    const focusSession = await prisma.focusSession.create({
      data: {
        userId,
        focusContext: focusContext || null,
        duration: parseInt(durationMinutes),
        elapsed: parseInt(elapsedMinutes)
      }
    })

    return sendSuccess(event, focusSession)
  } catch (error) {
    console.error('Error creating focus session:', error)
    return sendError(event, 'Failed to create focus session', 500)
  }
})
