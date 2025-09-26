resource "aws_s3_bucket" "smartpoll_bucket" {
  bucket = var.bucket_name

  tags = {
    Name = "smartpoll-bucket"
  }
}

resource "aws_s3_bucket_website_configuration" "smartpoll_website" {
  bucket = aws_s3_bucket.smartpoll_bucket.id

  index_document {
    suffix = "index.html"
  }
}

# resource "aws_s3_bucket_acl" "smartpoll_bucket_acl" {
#   bucket = aws_s3_bucket.smartpoll_bucket.id
#   acl    = "private"
# }

resource "aws_s3_bucket_public_access_block" "smartpoll_bucket_public_access" {
  bucket = aws_s3_bucket.smartpoll_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "smartpoll_bucket_versioning" {
  bucket = aws_s3_bucket.smartpoll_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}
