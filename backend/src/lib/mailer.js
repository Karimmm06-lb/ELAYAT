const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // App password Gmail
  },
});

async function sendBookingConfirmation(booking) {
  if (!process.env.MAIL_USER) return;

  const dateStr = new Date(booking.date).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  await transporter.sendMail({
    from:    `"ELAYAT Réservations" <${process.env.MAIL_USER}>`,
    to:      process.env.MAIL_USER,
    subject: `Nouvelle réservation — ${booking.service} (${booking.name})`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
        <h2 style="color:#B8924A">Nouvelle réservation ELAYAT</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;color:#666">Client</td><td style="padding:8px"><strong>${booking.name}</strong></td></tr>
          <tr><td style="padding:8px;color:#666">Téléphone</td><td style="padding:8px">${booking.phone}</td></tr>
          ${booking.email ? `<tr><td style="padding:8px;color:#666">Email</td><td style="padding:8px">${booking.email}</td></tr>` : ''}
          <tr><td style="padding:8px;color:#666">Service</td><td style="padding:8px">${booking.service} — ${booking.price}</td></tr>
          <tr><td style="padding:8px;color:#666">Date</td><td style="padding:8px">${dateStr} à ${booking.time}</td></tr>
          ${booking.note ? `<tr><td style="padding:8px;color:#666">Note</td><td style="padding:8px">${booking.note}</td></tr>` : ''}
        </table>
        <p style="color:#999;font-size:12px;margin-top:24px">ELAYAT Institut de Beauté Privée · Dely Ibrahim, Alger</p>
      </div>
    `,
  });
}

async function sendContactNotification(contact) {
  if (!process.env.MAIL_USER) return;

  await transporter.sendMail({
    from:    `"ELAYAT Contact" <${process.env.MAIL_USER}>`,
    to:      process.env.MAIL_USER,
    subject: `Nouveau message — ${contact.name}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
        <h2 style="color:#B8924A">Nouveau message de contact</h2>
        <p><strong>${contact.name}</strong>${contact.phone ? ` · ${contact.phone}` : ''}</p>
        <p style="background:#f5f0e8;padding:16px;border-left:3px solid #B8924A">${contact.message}</p>
        <p style="color:#999;font-size:12px">ELAYAT Institut de Beauté Privée</p>
      </div>
    `,
  });
}

module.exports = { sendBookingConfirmation, sendContactNotification };
