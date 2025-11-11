# Caching & CDN Recommendations for BPR Digital Signage

## 1. Application Caching Strategy

### Cache Configuration
- Default TTL: 1 hour for most data
- Shorter TTL (5-10 minutes) for frequently changing data like device status
- Longer TTL (1-6 hours) for static content like assets, products

### Cache Keys Strategy
- Use descriptive keys: `device:{deviceId}`, `playlist:{playlistId}`, `product:{productId}`
- Cache hierarchical data separately to optimize invalidation
- Use cache tags for bulk invalidation when needed

### Current Implementation
- NodeCache is used with standard TTL values
- Implemented in device playlist resolution endpoint
- Consider Redis for production for distributed caching

## 2. S3/CDN Setup for Assets

### Architecture
```
Client Request -> CDN (CloudFront/Fastly) -> S3 Bucket -> Origin Server
```

### Environment Variables
```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=your-bucket-name

# Enable S3 uploads
USE_S3=true
```

### S3 Bucket Configuration
- Set up public-read ACL for assets
- Configure CORS for web access
- Enable static website hosting (optional)
- Use CloudFront CDN for better global performance

### Migration Path
1. Set up S3 bucket with appropriate permissions
2. Update .env with S3 credentials
3. Set USE_S3=true to enable S3 uploads
4. Update existing assets to use S3 URLs (optional migration script)

## 3. Performance Optimization

### Caching Best Practices
- Cache API responses at the service layer
- Implement cache-aside pattern for database queries
- Use cache warming for critical data
- Implement cache invalidation strategies

### CDN Best Practices
- Cache static assets (images, videos) for longer periods
- Use proper cache headers (Cache-Control, ETags)
- Implement origin failover
- Use different caching strategies for different asset types

## 4. Production Considerations

### Caching in Production
- Replace NodeCache with Redis for multi-instance deployments
- Implement cache warming on application startup
- Add cache monitoring and metrics
- Set up cache invalidation queues for real-time updates

### CDN in Production
- Use CloudFront with S3 origin for AWS environments
- Set up failover to origin server
- Configure security headers
- Implement signed URLs for sensitive content

## 5. Implementation Guide

### Adding Cache to New Endpoints
```javascript
import { cached } from '../services/cacheService.js';

const data = await cached(
  'cache-key',
  ttlSeconds, 
  // Function to execute if cache miss
  async () => {
    // Expensive operation
    return result;
  }
);
```

### S3 Upload Process
1. File is uploaded via multipart form
2. Image optimization occurs with Sharp
3. If USE_S3=true, file is uploaded to S3
4. CDN URL is stored in database
5. Local file storage is used as fallback