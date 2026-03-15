import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { demoCredentials, demoUsers, demoJobs, demoApplications } from './demoData.js';

let pool;
let ready = false;
let lastError = null;

function toJson(value) {
  return JSON.stringify(value ?? null);
}

export function parseJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function getDatabaseState() {
  return {
    ready,
    error: lastError
  };
}

export async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database pool is not initialized');
  }
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function createDatabaseIfMissing() {
  const connection = await mysql.createConnection({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    multipleStatements: true
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.mysql.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.end();
}

async function createSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      role ENUM('Student', 'Employer') NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(30) DEFAULT '',
      university VARCHAR(180) DEFAULT NULL,
      company_name VARCHAR(180) DEFAULT NULL,
      title VARCHAR(180) DEFAULT NULL,
      location VARCHAR(180) DEFAULT NULL,
      avatar_url TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id INT PRIMARY KEY,
      profile_json LONGTEXT NULL,
      profile_completion INT DEFAULT 0,
      profile_completed TINYINT(1) DEFAULT 0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employer_id INT NOT NULL,
      title VARCHAR(180) NOT NULL,
      department VARCHAR(150) NOT NULL,
      location VARCHAR(180) NOT NULL,
      type VARCHAR(80) NOT NULL,
      status ENUM('draft', 'active', 'closed') DEFAULT 'draft',
      salary VARCHAR(120) DEFAULT '',
      experience VARCHAR(80) DEFAULT '',
      description TEXT,
      requirements TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_jobs_employer FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS applications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      job_id INT NOT NULL,
      student_id INT NOT NULL,
      status ENUM('review', 'interview', 'hired', 'rejected') DEFAULT 'review',
      candidate_note TEXT,
      recruiter_note TEXT,
      response_json LONGTEXT NULL,
      schedule_date DATETIME NULL,
      schedule_type VARCHAR(40) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_application (job_id, student_id),
      CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
      CONSTRAINT fk_applications_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function seedDatabase() {
  const countRows = await query('SELECT COUNT(*) AS count FROM users');
  if (countRows[0]?.count > 0) {
    return;
  }

  const studentPasswordHash = await bcrypt.hash(demoCredentials.student.password, 10);
  const employerPasswordHash = await bcrypt.hash(demoCredentials.employer.password, 10);

  const student = demoUsers.student;
  const employer = demoUsers.employer;

  const studentResult = await query(
    `INSERT INTO users (role, full_name, email, password_hash, phone, university, title, location, avatar_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      student.role,
      student.fullName,
      student.email,
      studentPasswordHash,
      student.phone,
      student.university,
      student.title,
      student.location,
      student.profile.personalInfo.image || null
    ]
  );

  const employerResult = await query(
    `INSERT INTO users (role, full_name, email, password_hash, phone, company_name, title, location, avatar_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employer.role,
      employer.fullName,
      employer.email,
      employerPasswordHash,
      employer.phone,
      employer.companyName,
      employer.title,
      employer.location,
      employer.profile.logo || null
    ]
  );

  const studentId = studentResult.insertId;
  const employerId = employerResult.insertId;

  await query(
    `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed) VALUES (?, ?, ?, ?)`,
    [studentId, toJson(student.profile), student.profileCompletion, student.profileCompleted ? 1 : 0]
  );

  await query(
    `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed) VALUES (?, ?, ?, ?)`,
    [employerId, toJson(employer.profile), employer.profileCompletion, employer.profileCompleted ? 1 : 0]
  );

  const insertedJobs = [];
  for (const job of demoJobs) {
    const result = await query(
      `INSERT INTO jobs (employer_id, title, department, location, type, status, salary, experience, description, requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employerId,
        job.title,
        job.department,
        job.location,
        job.type,
        job.status,
        job.salary,
        job.experience,
        job.description,
        job.requirements
      ]
    );
    insertedJobs.push(result.insertId);
  }

  for (const application of demoApplications) {
    const jobId = insertedJobs[application.jobIndex] || insertedJobs[0];
    await query(
      `INSERT INTO applications (job_id, student_id, status, candidate_note, recruiter_note)
       VALUES (?, ?, ?, ?, ?)`,
      [jobId, studentId, application.status, application.candidateNote, application.recruiterNote]
    );
  }
}

export async function initializeDatabase() {
  try {
    await createDatabaseIfMissing();
    pool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    await createSchema();
    await seedDatabase();
    ready = true;
    lastError = null;
  } catch (error) {
    ready = false;
    lastError = error instanceof Error ? error.message : String(error);
  }

  return getDatabaseState();
}
