resource "aws_s3_bucket" "smartpoll-bucket" {
  bucket = var.bucket-name
  versioning {
    enabled = true
  }

  acl = "private" # Only private access

  tags = {
    Name = "smartpoll-bucket"
  }
}
