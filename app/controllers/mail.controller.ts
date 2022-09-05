const nodemailer = require("nodemailer");
// async..await is not allowed in global scope, must use a wrapper

const sendMail = async (user) => {
    // Generate test SMTP service account from ethereal.email
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "jojurdi.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'node@jojurdi.com', // generated ethereal user
            pass: 'master01', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Node Manager Server 👻" <node@jojurdi.com>', // sender address
        to: user.email, // list of receivers
        subject: "Activate your account", // Subject line
        text: "Express backend ", // plain text body
        html: "<b>Welcome</b><br/>to activate <a href='http://45.55.105.120:"+(process.env.PORT || 8080)+"/api/auth/activation/"+user.token+"'>press here</a>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const mailClient = {
    sendMail
};

module.exports = mailClient;
