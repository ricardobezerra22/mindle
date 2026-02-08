import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      return sendError(event, 'SubTask ID is required', 400)
    }

    const { done, title } = body

    const subTask = await prisma.subTask.update({
      where: { id },
      data: {
        ...(done !== undefined && { done }),
        ...(title !== undefined && { title })
      }
    })

    return sendSuccess(event, subTask)
  } catch (error) {
    console.error('Error updating subtask:', error)
    return sendError(event, 'Failed to update subtask', 500)
  }
})
