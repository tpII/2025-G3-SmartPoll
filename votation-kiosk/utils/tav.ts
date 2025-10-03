import crypto from "crypto";

function generateTAV() {
  const tav = crypto.randomBytes(16).toString("hex");
  const secret = process.env.TAV_SECRET!;
  const signature = crypto.createHmac("sha256", secret).update(tav).digest("hex");
  return { tav, signature };
}

function verifyTAV(tav: string, signature: string) {
  const secret = process.env.TAV_SECRET!;
  const expectedSignature = crypto.createHmac("sha256", secret).update(tav).digest("hex");
  return expectedSignature === signature;
}
