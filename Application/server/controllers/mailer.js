import nodeMailer from "nodemailer";

// import dotenv from "dotenv";
// dotenv.config();

export const registerMail  = async (req, res) => {
  try {
    var transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "tekaleshantanu@gmail.com",
        pass: "kidu vgyh gteg rfyn",
      },
    });
    //Getting Email&Password form .env, but here its not accepting .env variables. (i have to provide it manually, i'm not able to use .env variables for Email & Password).
    
    console.log("Sending Email......");
    // console.log(process.env.GoogleEmail);
    // console.log(process.env.GoogleAppPassKey);

    const { username,userEmail, text, subject } = req.body;

    var mailOptions = {
      from: "MyApp@gmail.com",
      to: userEmail,
      subject: ` Registration  `,
      html: ` <h1>Hello Dear ${username} </h1><br/>             
              <h3><em> ${text}</em><h3>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "You should receive an email from us.",
    });
  } catch (err) {
    console.log("Error from Catch Block");
    return res.status(500).json({
      message: "Internal Server Error, Error in Sending Email",
    });
  }
};