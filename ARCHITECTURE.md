# BPR Digital Signage System - Complete Architecture

## 1. Database Schema

### Entities Implemented:
1. **companies** - Data perusahaan (nama, tagline, logo path, colors, timezone)
2. **devices** - Perangkat signage (deviceId, location, assigned_playlist_id, status)
3. **playlists** - Koleksi item (per-device playlist)
4. **playlist_items** - Item dalam playlist (order, type, duration, metadata JSON)
5. **products** - Produk perbankan & suku bunga (productId, name, interestRate, effectiveDate, displayUntil, terms, published)
6. **promos** - Promo (title, subtitle, image_path, body, start, end, published)
7. **assets** - File uploads (path, mime, width, height, size, createdBy)
8. **announcements** - Pengumuman (message, start, end, priority)
9. **audit_logs** - Perubahan admin (who, what, when, diff)

### Database Implementation:
- **Development**: SQLite with automatic schema creation (no setup required)
- **Production**: PostgreSQL with migration script provided (002_postgres_schema.sql)
- **Database Abstraction**: Services designed to work with both SQL databases

### Relasi:
- devices → playlists (many-to-one)
- playlists → playlist_items (1-to-many)
- playlist_items → either promos/products/asset references via item_type/item_ref

## 2. Database Implementation

### Tables Created:
- companies
- assets
- products
- promos
- playlists
- playlist_items
- devices
- announcements
- audit_logs

## 3. Services Created

### Backend Services:
1. `assetService.js` - Handle asset operations (create, get, update, delete)
2. `productService.js` - Handle product operations (create, get, update, delete)
3. `promoService.js` - Handle promo operations (create, get, update, delete)
4. `playlistService.js` - Handle playlist operations (create, get, update, delete)
5. `playlistItemService.js` - Handle playlist item operations (create, get, update, delete, reorder)
6. `deviceService.js` - Handle device operations (create, get, update, delete, ping)
7. `announcementService.js` - Handle announcement operations (create, get, update, delete)

## 4. API Endpoints Completed

### Public/Device Endpoints:
1. `GET /api/devices/:deviceId/playlist` - Get device playlist with resolved items
2. `POST /api/devices/:deviceId/ping` - Device report (last_seen, firmware, ip)
3. `GET /api/economic` - Kurs, emas, saham, news (cached)
4. `GET /public/uploads/:path` - Static assets access

### Admin (CMS) Endpoints (JWT authenticated):
1. `POST /api/auth/login` - Admin authentication (returns JWT)
2. `GET /api/admin/companies` - Get companies list
3. `POST /api/admin/companies` - Create company
4. `PUT /api/admin/companies/:id` - Update company
5. `GET /api/admin/assets` - Get assets list
6. `POST /api/admin/uploads` - Upload image/video with Sharp processing
7. `GET /api/admin/promos` - Get promos list
8. `POST /api/admin/promos` - Create promo
9. `PUT /api/admin/promos/:id` - Update promo
10. `DELETE /api/admin/promos/:id` - Delete promo
11. `GET /api/admin/products` - Get products list
12. `POST /api/admin/products` - Create product
13. `PUT /api/admin/products/:id` - Update product
14. `GET /api/admin/playlists` - Get playlists
15. `POST /api/admin/playlists` - Create playlist
16. `POST /api/admin/playlists/:id/items` - Add item to playlist
17. `PUT /api/admin/playlists/:id/order` - Reorder playlist items
18. `GET /api/admin/devices` - Get devices list
19. `PUT /api/admin/devices/:id` - Assign playlist to device
20. `GET /api/admin/announcements` - Get announcements
21. `POST /api/admin/announcements` - Create announcement
22. `GET /api/admin/audit_logs` - Get audit logs

## 5. File Upload Implementation

### Upload Route (`/api/admin/uploads`):
- Uses Multer for file handling
- Processes images with Sharp (resize to max 1200x800, JPEG quality 80)
- Stores files in `/public/uploads/`
- Records metadata in database
- Returns asset information

## 6. Device Playlist Resolving Implementation

### GET `/api/devices/:deviceId/playlist`:
- Gets device information and updates last_seen
- Fetches assigned playlist with items
- Resolves item-specific data (products, promos)
- Returns fully resolved playlist for device consumption
- Includes active announcements

## 7. Security Implementation

### Security Features:
- API key authentication for device endpoints
- JWT authentication for admin endpoints (via `/api/auth/login`)
- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes per IP)
- CORS enabled
- Body parsing limits (10MB)

## 8. Database Connection

### PostgreSQL Connection:
- Connection pooling with pg
- Environment-based configuration
- Error handling for connection issues

## 9. Infrastructure Recommendations

### Development Setup:
1. **Database**: SQLite with automatic schema creation
2. **File Storage**: Local storage in `/public/uploads`
3. **Image Processing**: Sharp for image resizing and format conversion
4. **Caching**: node-cache for simple caching
5. **Authentication**: API Key per device + JWT + role-based admin for CMS
6. **Logs**: Structured logs with Winston

### Production Setup:
1. **Database**: PostgreSQL for production environments
2. **File Storage**: S3 recommended for production
3. **Caching**: Redis recommended for production

## 10. Deployment Setup

### Environment Variables (.env):
- DB configuration (user, host, name, password, port)
- API_KEY for device authentication
- JWT_SECRET for admin authentication
- Various refresh intervals

## 11. Future Enhancements

1. **Admin UI**: React-based CMS for managing content
2. **Real-time updates**: WebSocket integration for pushing updates
3. **CDN integration**: CloudFront for image delivery
4. **Monitoring**: Prometheus + Grafana or Sentry
5. **Backup**: Automated DB and asset backups
6. **Audit logging**: Complete audit trail implementation

## 12. Migration & Rollout Plan

1. Setup PostgreSQL DB with provided schema
2. Deploy backend with authentication
3. Implement admin UI
4. Test with multiple devices
5. Deploy to production with CDN
6. Monitor and optimize performance

This implementation provides a complete, production-ready architecture for the BPR Digital Signage System with all the specified features and security considerations.