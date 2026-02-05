import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId
    
    const body = await readBody(event)
    const { taskId, date } = body

    if (!taskId || !date) {
      return sendError(event, 'Task ID and date are required', 400)
    }

    const existingEntry = await prisma.plannerEntry.findFirst({
      where: {
        userId,
        taskId,
        date: new Date(date)
      }
    })

    if (existingEntry) {
      return sendError(event, 'Task already planned for this day', 400)
    }

    const entry = await prisma.plannerEntry.create({
      data: {
        userId,
        taskId,
        date: new Date(date)
      },
      include: {
        task: true
      }
    })

    return sendSuccess(event, entry)
  } catch (error) {
    console.error('Error creating planner entry:', error)
    return sendError(event, 'Failed to create planner entry', 500)
  }
})
