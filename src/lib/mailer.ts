import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'samstacktechs@gmail.com',
    pass: process.env.EMAIL_PASS || 'swen pwcw uben dfsy',
  },
});

export const sendOfferLetterEmail = async (
  email: string,
  fullName: string,
  rollNumber: string,
  track: string,
  pdfBuffer: Buffer
) => {
  const mailOptions = {
    from: `"SAMStack Tech" <${process.env.EMAIL_USER || 'samstacktechs@gmail.com'}>`,
    to: email,
    subject: `Internship Offer Letter - ${track}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #06b6d4;">Welcome to SAMStack Tech!</h2>
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Congratulations! We are thrilled to offer you an internship position in our <strong>${track}</strong> program.</p>
        <p>Your unique Roll Number is: <strong style="color: #06b6d4;">${rollNumber}</strong></p>
        <p>Please find your official Offer Letter attached to this email.</p>
        <p>We look forward to seeing your growth and contributions.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>SAMStack Tech Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Offer_Letter_${rollNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const sendCertificateEmail = async (
  email: string,
  fullName: string,
  certificateNumber: string,
  track: string,
  pdfBuffer: Buffer
) => {
  const mailOptions = {
    from: `"SAMStack Tech" <${process.env.EMAIL_USER || 'samstacktechs@gmail.com'}>`,
    to: email,
    subject: `Internship Certificate - ${track}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #06b6d4;">Congratulations on your successful completion!</h2>
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>We are proud to announce that you have successfully completed your internship in the <strong>${track}</strong> program.</p>
        <p>Your Certificate ID is: <strong style="color: #06b6d4;">${certificateNumber}</strong></p>
        <p>Please find your official Internship Certificate attached to this email. You can share this certificate with your professional network.</p>
        <p>We wish you the best in your future endeavors!</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>SAMStack Tech Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Certificate_${certificateNumber}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};
