import crypto from 'crypto'

const secret = process.env.TAV_SECRET!

export function generateTAV() {
  const tav = crypto.randomBytes(64).toString('hex')
  const signature = crypto
    .createHmac('sha256', secret)
    .update(tav)
    .digest('hex')
  return { tav, signature }
}

export function verifyTAV(tav: string, signature: string) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(tav)
    .digest('hex')
  return expectedSignature === signature
}
