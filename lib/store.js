let ideas = []

export function saveIdea({ idea, userId, score }) {
  ideas.push({
    id: Date.now(),
    idea,
    userId,
    score,
    createdAt: new Date().toISOString(),
  })
}

export function getIdeas(userId) {
  const result = userId ? ideas.filter((i) => i.userId === userId) : ideas
  return result.sort((a, b) => b.score - a.score)
}

