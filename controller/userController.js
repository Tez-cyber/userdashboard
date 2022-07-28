const bcrypt = require('bcryptjs')
const User = require("../model/user")


class App {
    getPage = async (req, res, next) => {
        if(req.session.email){
            res.redirect(303, '/dashboard')
        }else{
            const users = await User.find({})
            if(users.length > 0){
                res.render('login', {title: 'Login to your account'})
            }else{
                res.redirect(303, '/create-account')
            }
            res.send('Our auth Page')
        }
    }
    getRegisterPage = async (req, res, next) =>{
        const users = await User.find({})
        if (users.length > 0){
            res.redirect(303, '/')
        }else{
            res.render('reg', {title: 'Create an account'})
        }
    }
    registerUser = async (req, res, next) => { 
        const {name, email, number, password, cPassword, secret} = req.body
        if(password !== cPassword){
            res.render('reg', {title: 'Create an account', error: 'Your Password is incorrect'})
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                mobile: number,
                secret: secret
            })
            const saveUser = newUser.save()
            if(saveUser){
                res.redirect(303, '/')
            }else{
                res.send('There is an error saving this')
            }
        }
    }
    postLogin = async (req, res, next) => {
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(user){
            const validUser = await bcrypt.compare(password, user.password)
            if(validUser){
                req.session.email= user.email
                res.redirect(303, '/dashboard')
            }else{
                res.render('login', {title: 'Login to your account', error: 'Invalid credentials'})
            }
            res.send('Welcome to Ajo')
        }else{
            res.render('login', {title: 'Login to your account', error: 'Invalid credentials'})
        }
    }
}
const newApp = new App
module.exports = newApp