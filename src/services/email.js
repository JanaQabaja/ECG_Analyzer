import nodemailer from "nodemailer";

// Function to send email using nodemailer
export async function sendEmail(to, subject, html) {
    // Configure the email transporter using Gmail service
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILSENDER, // Sender email address
            pass: process.env.PASSWORDSENDER, // Sender email password
        },
    });
                                                                                            
    // Define the email details
    const info = await transporter.sendMail({
        from: `"ECG_Analyzer" <${process.env.EMAILSENDER}>`, // Sender name and address
        to, // Recipient email address
        subject, // Email subject
        html, // Email content in HTML format
    });

    // Return the information about the sent email
    return info;
}
