import crypto from "crypto";

const secret = "your-secret-key"; // Replace with your actual secret key

export function generateTAV() {
  const tav = crypto.randomBytes(16).toString("hex");
  // const secret = process.env.TAV_SECRET!;
  const signature = crypto.createHmac("sha256", secret).update(tav).digest("hex");
  return { tav, signature };
}

export function verifyTAV(tav: string, signature: string) {
  // const secret = process.env.TAV_SECRET!;
  const expectedSignature = crypto.createHmac("sha256", secret).update(tav).digest("hex");
  return expectedSignature === signature;
}
