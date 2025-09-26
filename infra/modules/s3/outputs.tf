output "s3_bucket_arn" {
  value = aws_s3_bucket.smartpoll_bucket.arn
}

output "s3_bucket_id" {
  value = aws_s3_bucket.smartpoll_bucket.id
}

output "s3_bucket_website_endpoint" {
  value = aws_s3_bucket_website_configuration.smartpoll_website.website_domain
}

output "s3_bucket_regional_domain_name" {
  value = aws_s3_bucket.smartpoll_bucket.bucket_regional_domain_name
}
