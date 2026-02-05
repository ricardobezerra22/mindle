import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = '000000000000000000000001'
    
    const body = await readBody(event)
    const { focusContext, durationMinutes, elapsedMinutes } = body

    if (!durationMinutes || !elapsedMinutes) {
      return sendError(event, 'Missing required fields', 400)
    }

    const focusSession = await prisma.focusSession.create({
      data: {
        userId,
        focusContext: focusContext || null,
        durationMinutes: parseInt(durationMinutes),
        elapsedMinutes: parseInt(elapsedMinutes)
      }
    })

    return sendSuccess(event, focusSession)
  } catch (error) {
    console.error('Error creating focus session:', error)
    return sendError(event, 'Failed to create focus session', 500)
  }
})
