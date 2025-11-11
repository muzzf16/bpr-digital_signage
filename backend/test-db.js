// Test script to verify database functionality
import db from './src/db/index.js';
import assetService from './src/services/assetService.js';

async function testDatabase() {
  console.log('Testing database functionality...');
  
  // Test creating an asset
  try {
    const testAsset = await assetService.createAsset({
      filename: 'test_image.jpg',
      url: '/public/uploads/test_image.jpg',
      mime: 'image/jpeg',
      width: 1920,
      height: 1080,
      size_bytes: 123456,
      uploaded_by: 'test'
    });
    
    console.log('✓ Asset created successfully:', testAsset);
    
    // Test getting the asset
    const retrievedAsset = await assetService.getAssetById(testAsset.id);
    console.log('✓ Asset retrieved successfully:', retrievedAsset);
    
    // Test updating the asset
    const updatedAsset = await assetService.updateAsset(testAsset.id, {
      filename: 'updated_test_image.jpg'
    });
    console.log('✓ Asset updated successfully:', updatedAsset);
    
    // Clean up
    await assetService.deleteAsset(testAsset.id);
    console.log('✓ Asset deleted successfully');
    
    console.log('\n✓ All database operations completed successfully!');
  } catch (error) {
    console.error('✗ Database test failed:', error.message);
  }
}

testDatabase();