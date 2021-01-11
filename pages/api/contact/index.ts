import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { from, subject, message } = req.body;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_EMAIL_PASSWORD,
      },
    });

    var mailOptions: Mail.Options = {
      from,
      to: "contact@duskbooks.com",
      subject,
      text: message,
      sender: from,
      replyTo: from,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.statusCode = 200;
        res.json({ status: false, data: error });
      } else {
        console.log("Email sent: " + info.response);
        res.statusCode = 200;
        res.json({ status: true, data: info.response });
      }
    });
    res.statusCode = 405;
    res.end();
  } else {
    res.statusCode = 405;
    res.end();
  }
};
