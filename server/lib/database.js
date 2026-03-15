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
      role VARCHAR(30) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(180) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(30) DEFAULT '',
      university VARCHAR(180) DEFAULT NULL,
      company_name VARCHAR(180) DEFAULT NULL,
      company_slug VARCHAR(180) DEFAULT NULL,
      title VARCHAR(180) DEFAULT NULL,
      onboarding_status VARCHAR(30) DEFAULT 'approved',
      onboarding_note TEXT,
      external_api_key VARCHAR(120) DEFAULT NULL,
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

  await query(`
    CREATE TABLE IF NOT EXISTS email_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employer_id INT NOT NULL,
      application_id INT DEFAULT NULL,
      recipient_email VARCHAR(180) NOT NULL,
      recipient_name VARCHAR(180) DEFAULT '',
      subject VARCHAR(255) NOT NULL,
      body_text LONGTEXT NOT NULL,
      template_key VARCHAR(80) DEFAULT NULL,
      status ENUM('sent', 'simulated', 'failed') DEFAULT 'simulated',
      provider_message_id VARCHAR(255) DEFAULT NULL,
      provider_response TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_email_messages_employer FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE,
      CONSTRAINT fk_email_messages_application FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS saved_jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        job_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_saved_job (user_id, job_id),
        CONSTRAINT fk_saved_jobs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_saved_jobs_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS job_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        keyword VARCHAR(180) NOT NULL,
        email VARCHAR(180) NOT NULL,
        frequency ENUM('Daily', 'Weekly', 'Monthly') DEFAULT 'Daily',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_job_alerts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        author_name VARCHAR(180) NOT NULL,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        tags_json TEXT,
        read_time VARCHAR(30) DEFAULT '3 min',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_blog_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(60) NOT NULL DEFAULT 'info',
        title VARCHAR(255) NOT NULL,
        body TEXT,
        link VARCHAR(255) DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        user_role VARCHAR(30) DEFAULT '',
        action_type VARCHAR(120) NOT NULL,
        details_json TEXT,
        source VARCHAR(60) DEFAULT 'portal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_activity_user (user_id),
        INDEX idx_activity_action (action_type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(160) NOT NULL,
        email VARCHAR(180) NOT NULL,
        phone VARCHAR(50) DEFAULT '',
        company VARCHAR(180) DEFAULT '',
        subject VARCHAR(220) NOT NULL,
        message LONGTEXT NOT NULL,
        status VARCHAR(30) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const roleColumn = await query("SHOW COLUMNS FROM users LIKE 'role'");
    if (roleColumn[0] && String(roleColumn[0].Type || '').toLowerCase().includes('enum')) {
      await query('ALTER TABLE users MODIFY COLUMN role VARCHAR(30) NOT NULL');
    }

    const onboardingCol = await query("SHOW COLUMNS FROM users LIKE 'onboarding_status'");
    if (!onboardingCol[0]) {
      await query("ALTER TABLE users ADD COLUMN onboarding_status VARCHAR(30) DEFAULT 'approved' AFTER title");
    }

    const onboardingNoteCol = await query("SHOW COLUMNS FROM users LIKE 'onboarding_note'");
    if (!onboardingNoteCol[0]) {
      await query('ALTER TABLE users ADD COLUMN onboarding_note TEXT AFTER onboarding_status');
    }

    const slugCol = await query("SHOW COLUMNS FROM users LIKE 'company_slug'");
    if (!slugCol[0]) {
      await query('ALTER TABLE users ADD COLUMN company_slug VARCHAR(180) DEFAULT NULL AFTER company_name');
    }

    const apiKeyCol = await query("SHOW COLUMNS FROM users LIKE 'external_api_key'");
    if (!apiKeyCol[0]) {
      await query('ALTER TABLE users ADD COLUMN external_api_key VARCHAR(120) DEFAULT NULL AFTER onboarding_note');
    }

    const slugIdx = await query("SHOW INDEX FROM users WHERE Key_name = 'uniq_company_slug'");
    if (!slugIdx[0]) {
      await query('ALTER TABLE users ADD UNIQUE KEY uniq_company_slug (company_slug)');
    }

    const apiKeyIdx = await query("SHOW INDEX FROM users WHERE Key_name = 'uniq_external_api_key'");
    if (!apiKeyIdx[0]) {
      await query('ALTER TABLE users ADD UNIQUE KEY uniq_external_api_key (external_api_key)');
    }
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
  const admin = demoUsers.admin;

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
    `INSERT INTO users (role, full_name, email, password_hash, phone, company_name, company_slug, title, onboarding_status, external_api_key, location, avatar_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employer.role,
      employer.fullName,
      employer.email,
      employerPasswordHash,
      employer.phone,
      employer.companyName,
      employer.companySlug,
      employer.title,
      'approved',
      employer.externalApiKey,
      employer.location,
      employer.profile.logo || null
    ]
  );

  const adminPasswordHash = await bcrypt.hash(demoCredentials.admin.password, 10);
  const adminResult = await query(
    `INSERT INTO users (role, full_name, email, password_hash, phone, title, onboarding_status, location)
     VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)`,
    [admin.role, admin.fullName, admin.email, adminPasswordHash, admin.phone, admin.title, admin.location]
  );

  const studentId = studentResult.insertId;
  const employerId = employerResult.insertId;
  const adminId = adminResult.insertId;

  await query(
    `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed) VALUES (?, ?, ?, ?)`,
    [studentId, toJson(student.profile), student.profileCompletion, student.profileCompleted ? 1 : 0]
  );

  await query(
    `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed) VALUES (?, ?, ?, ?)`,
    [employerId, toJson(employer.profile), employer.profileCompletion, employer.profileCompleted ? 1 : 0]
  );

  await query(
    `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed) VALUES (?, ?, ?, ?)`,
    [adminId, toJson(admin.profile), admin.profileCompletion, admin.profileCompleted ? 1 : 0]
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

async function ensurePlatformDefaults() {
  const employers = await query(
    `SELECT id, company_name, full_name, company_slug, onboarding_status, external_api_key
     FROM users
     WHERE role = 'Employer'`
  );

  for (const employer of employers) {
    const updates = [];
    const params = [];
    if (!employer.company_slug) {
      const raw = String(employer.company_name || employer.full_name || `company-${employer.id}`).toLowerCase();
      const slug = raw.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || `company-${employer.id}`;
      updates.push('company_slug = ?');
      params.push(`${slug}-${employer.id}`);
    }
    if (!employer.onboarding_status) {
      updates.push("onboarding_status = 'approved'");
    }
    if (!employer.external_api_key) {
      updates.push('external_api_key = ?');
      params.push(`pst_live_${Math.random().toString(36).slice(2, 16)}${employer.id}`);
    }
    if (updates.length) {
      params.push(employer.id);
      await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    }
  }

  const adminRows = await query('SELECT id FROM users WHERE role = ? LIMIT 1', ['Admin']);
  if (!adminRows[0]) {
    const admin = demoUsers.admin;
    const adminPasswordHash = await bcrypt.hash(demoCredentials.admin.password, 10);
    const result = await query(
      `INSERT INTO users (role, full_name, email, password_hash, phone, title, onboarding_status, location)
       VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)`,
      [admin.role, admin.fullName, admin.email, adminPasswordHash, admin.phone, admin.title, admin.location]
    );
    await query(
      `INSERT INTO user_profiles (user_id, profile_json, profile_completion, profile_completed)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE profile_json = VALUES(profile_json), profile_completion = VALUES(profile_completion), profile_completed = VALUES(profile_completed)`,
      [result.insertId, toJson(admin.profile), admin.profileCompletion, admin.profileCompleted ? 1 : 0]
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
    await ensurePlatformDefaults();
    ready = true;
    lastError = null;
  } catch (error) {
    ready = false;
    lastError = error instanceof Error ? error.message : String(error);
  }

  return getDatabaseState();
}
