const mongoose = require('mongoose');

// Test script to verify auth service setup
async function testAuthService() {
  try {
    console.log('🔍 Testing Auth Service Setup...\n');

    // Test 1: Database Connection
    console.log('1. Testing Database Connection...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service';

    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('✅ Database connection successful');
    } catch (error) {
      console.log('❌ Database connection failed:', error.message);
      console.log('💡 Make sure MongoDB is running on localhost:27017 or update MONGODB_URI');
      return;
    }

    // Test 2: Import Models
    console.log('\n2. Testing Model Imports...');
    try {
      const User = require('./src/models/User');
      console.log('✅ User model imported successfully');
    } catch (error) {
      console.log('❌ User model import failed:', error.message);
      return;
    }

    // Test 3: Import Controllers
    console.log('\n3. Testing Controller Imports...');
    try {
      const authController = require('./src/controllers/authController');
      console.log('✅ Auth controller imported successfully');
    } catch (error) {
      console.log('❌ Auth controller import failed:', error.message);
      return;
    }

    // Test 4: Import Middleware
    console.log('\n4. Testing Middleware Imports...');
    try {
      const auth = require('./src/middleware/auth');
      console.log('✅ Auth middleware imported successfully');
    } catch (error) {
      console.log('❌ Auth middleware import failed:', error.message);
      return;
    }

    // Test 5: Import Routes
    console.log('\n5. Testing Route Imports...');
    try {
      const authRoutes = require('./src/routes/authRoutes');
      console.log('✅ Auth routes imported successfully');
    } catch (error) {
      console.log('❌ Auth routes import failed:', error.message);
      return;
    }

    // Test 6: Import Server
    console.log('\n6. Testing Server Import...');
    try {
      const app = require('./src/server');
      console.log('✅ Server imported successfully');
    } catch (error) {
      console.log('❌ Server import failed:', error.message);
      return;
    }

    // Test 7: Environment Variables
    console.log('\n7. Checking Environment Variables...');
    const requiredEnvVars = ['JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.log('⚠️  Missing environment variables:', missingVars.join(', '));
      console.log('💡 Copy .env.example to .env and configure the missing variables');
    } else {
      console.log('✅ All required environment variables are set');
    }

    console.log('\n🎉 Auth Service setup verification completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run dev');
    console.log('4. Test the API at: http://localhost:3001/health');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the test
testAuthService();