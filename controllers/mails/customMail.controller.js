const nodemailer = require('nodemailer')

module.exports.customEmail = async (req, res) =>{
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'louguefranck20@gmail.com',
            pass: 'Fanetech20/20@.Com'
        }
    })

    const mailOption ={
        form:'contact.educ2022@gmail.com',
        to: 'tarow36327@deitada.com',
        subject: 'test de reception',
        text: 'ok'
    }

    await transport.sendMail(mailOption, function(err){
        if(err) console.log(err)
        else {
            console.log('email send', info.response)
        }
    })
}