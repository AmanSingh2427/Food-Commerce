const nodemailer = require('nodemailer');
const fs = require('fs');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);

async function sendEmail() {
    try {
        // Read the HTML template and image file
        const htmlTemplate = await readFileAsync('./order.html', 'utf-8');
        const imageAttachment = await readFileAsync('./uploads/image-1717135432971.png');

        // Create a Nodemailer transporter
        // Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
      user: 'thakuraman8630@gmail.com',
      pass: 'sdqgihpkffcyipzj',
    }
  });
        

        // Send email
        const info = await transporter.sendMail({
            from: 'thakuraman8630@gmail.com', // Sender address
            to: 'shashankrajpathak123@gmail.com', // List of receivers
            subject: 'Your Subject', // Subject line
            html: htmlTemplate, // HTML content from template
            attachments: [{
                filename: 'image.png', // Name of the image file
                content: imageAttachment, // Content of the image file
                encoding: 'base64', // Image encoding type
                cid: 'uniqueImageCID', // CID to reference in the HTML template
            }],
        });

        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendEmail();