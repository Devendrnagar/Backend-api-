import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController {
  static userRegistration = async (req, res) => {

    const { name, UserName, email, password, password_confirmation } = req.body

    console.log({ name, UserName, email, password, password_confirmation, body: req.body })

    const user = await UserModel.findOne({ email: email })

    if (user) {

      res.status(400).send({
        message: "Records show this email is linked to another account."
      });



    }

    else {

      if (name && UserName && email && password && password_confirmation) {

        if (password === password_confirmation) {


          try {

            const salt = await bcrypt.genSalt(10)

            const hashPassword = await bcrypt.hash(password, salt)

            const doc = new UserModel({
              name: name,
              UserName: UserName,
              email: email,
              password: hashPassword,

            })

            await doc.save()

            const saved_user = await UserModel.findOne({ email: email })

            // Generate JWT Token

            const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

            res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })

          } catch (error) {
            console.log(error)

            res.status(400).send({ "status": "failed", "message": "Unable to Register" })
          }
        } else {
          res.status().send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
        }
      } else {
        res.send({ "status": "failed", "message": "All fields are required" })
      }
    }
  }


  // login from 


  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body
      if (email && password) {
        const user = await UserModel.findOne({ email: email })
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password)
          if ((user.email === email) && isMatch) {
            // Generate JWT Token
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            res.send({ "status": "success", "message": "Login Success", "token": token })
          } else {
            res.send({ "status": "failed", "message": "Email or Password is not Valid" })
          }
        } else {
          res.send({ "status": "failed", "message": "You are not a Registered User" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      console.log(error)
      res.send({ "status": "failed", "message": "Unable to Login" })
    }
  }
  // end from 

}

export default UserController