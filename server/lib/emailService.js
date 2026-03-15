import nodemailer from 'nodemailer';
import { config } from './config.js';

function buildTransport() {
  if (!config.smtp.host || !config.smtp.user) {
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password
    }
  });
}

const transporter = buildTransport();

export function getEmailConfigState() {
  return {
    enabled: Boolean(transporter),
    fromName: config.smtp.fromName,
    fromEmail: config.smtp.fromEmail || config.smtp.user || ''
  };
}

export function getDefaultEmailTemplates() {
  return [
    {
      key: 'interview_invite',
      label: 'Interview Invite',
      subject: 'Interview invitation for {{jobTitle}} at {{companyName}}',
      body: `Hi {{candidateName}},\n\nThank you for applying for the {{jobTitle}} role at {{companyName}}. We were impressed by your background and would like to invite you to the next round.\n\nPlease reply with your availability for the next 3 business days.\n\nBest regards,\n{{senderName}}\n{{companyName}}`
    },
    {
      key: 'shortlist_update',
      label: 'Shortlist Update',
      subject: 'Update on your application for {{jobTitle}}',
      body: `Hi {{candidateName}},\n\nGood news. Your profile has been shortlisted for the {{jobTitle}} opportunity at {{companyName}}.\n\nOur team is reviewing next-step scheduling and we will share details shortly.\n\nBest regards,\n{{senderName}}\n{{companyName}}`
    },
    {
      key: 'custom_outreach',
      label: 'Custom Outreach',
      subject: 'Opportunity with {{companyName}}',
      body: `Hi {{candidateName}},\n\nI wanted to reach out regarding an opportunity at {{companyName}} that aligns well with your background.\n\nIf you are interested, reply to this email and I will share the next steps.\n\nBest regards,\n{{senderName}}\n{{companyName}}`
    }
  ];
}

export function populateEmailTemplate(template, variables) {
  return String(template || '').replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key) => {
    const value = variables[key];
    return value == null ? '' : String(value);
  });
}

export async function sendManagedEmail({ to, subject, text, html }) {
  if (!transporter) {
    return {
      status: 'simulated',
      providerMessageId: null,
      providerResponse: 'SMTP not configured; email logged only.'
    };
  }

  const info = await transporter.sendMail({
    from: config.smtp.fromEmail || config.smtp.user,
    to,
    subject,
    text,
    html
  });

  return {
    status: 'sent',
    providerMessageId: info.messageId || null,
    providerResponse: info.response || null
  };
}
