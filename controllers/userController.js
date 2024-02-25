import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class UserController {
  static userRegistration = async (req, res) => {

    const { name, email, password, password_confirmation } = req.body

    console.log({ name, email, password, password_confirmation, body: req.body })

    const user = await UserModel.findOne({ email: email })

    if (user) {

      res.send({ "status": "failed", "message": "Email already exists" })

    }

    else {

      if (name && email && password && password_confirmation) {

        if (password === password_confirmation) {


          try {

            const salt = await bcrypt.genSalt(10)

            const hashPassword = await bcrypt.hash(password, salt)

            const doc = new UserModel({
              name: name,
              email: email,
              password: hashPassword,
              
            })

            await doc.save()

            const saved_user = await UserModel.findOne({ email: email })

            // Generate JWT Token

            // const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

            // res.status(201).send({ "status": "success", "message": "Registration Success", "token": token })

          } catch (error) {
            console.log(error)

            res.send({ "status": "failed", "message": "Unable to Register" })
          }
        } else {
          res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
        }
      } else {
        res.send({ "status": "failed", "message": "All fields are required" })
      }
    }
  }

  
}

export default UserController