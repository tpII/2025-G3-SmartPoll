import type { NextApiRequest, NextApiResponse } from 'next'

let currentState: 'idle' | 'active' | 'done' = 'idle'

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (currentState === 'done') {
    return res.status(400).json({ message: 'Voting has already ended.' })
  }
  currentState = 'active'
  return res.status(200).json({ message: 'Voter authorized.' })
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({ state: currentState })
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(405).json({ message: 'Method not allowed.' })
}
