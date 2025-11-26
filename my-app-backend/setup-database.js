require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL (without specifying database first)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS,
    });

    console.log('Connected to MySQL server');

    // Read and execute the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement) {
        try {
          await connection.execute(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
          // Ignore "table already exists" errors
          if (err.code !== 'ER_TABLE_EXISTS_ERROR' && err.code !== 'ER_DB_CREATE_EXISTS') {
            console.error('Error executing statement:', err.message);
            console.error('Statement:', statement.substring(0, 100));
          }
        }
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('Database:', process.env.DB_NAME || 'digital_identity_verification');
    console.log('Table "users" has been created.');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Please check your MySQL credentials in the .env file');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();

