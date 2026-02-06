import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.userId
    const query = getQuery(event)

    const where: any = { userId }

    if (query.search) {
      const search = String(query.search)
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { note: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (query.from || query.to) {
      where.dueDate = {}
      if (query.from) where.dueDate.gte = new Date(String(query.from))
      if (query.to) where.dueDate.lte = new Date(String(query.to))
    }

    if (query.archived !== undefined) {
      where.archived = query.archived === 'true'
    }

    const entries = await prisma.financeEntry.findMany({
      where,
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
