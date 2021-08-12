import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import UserModel from '../models/UserModel.js'
import dotenv from 'dotenv'

dotenv.config()

export const signin = async (req, res) => {
  const { email, password } = req.body

  try {
    const existingUser = await UserModel.findOne({ email })

    if (!existingUser) {
      res.status(400).json({ message: "User doesn't exist" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Password doesn't match" })
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.TEST, { expiresIn: '1h' })

    res.status(200).json({ profile: existingUser, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body

  try {
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' })
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords don't match" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const profile = await UserModel.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    })

    const token = jwt.sign({ email: profile.email, id: profile._id }, process.env.TEST, { expiresIn: '1h' })

    res.status(200).json({ profile, token })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
