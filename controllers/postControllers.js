import PostModel from '../models/PostModel.js'

export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()

    res.status(200).json(posts)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body

  try {
    const newPost = await PostModel.create({
      ...post,
      creator: req.userId,
      createdAt: new Date(),
    })

    res.status(200).json(newPost)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params

  await PostModel.findOneAndDelete({ _id: id }, (err, docs) => {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(docs)
    }
  })
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const post = req.body

  await PostModel.findOneAndUpdate({ _id: id }, post, { new: true }, (err, docs) => {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(docs)
    }
  })
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) {
    res.status(400).json({ message: 'Unauthenticated' })
  }

  const post = await PostModel.findOne({ _id: id }, (err, docs) => {
    if (err) {
      res.status(400).json(err)
    } else {
      return docs
    }
  })

  if (!post.likes.some((id) => id === req.userId)) {
    post.likes.push(req.userId)
  } else {
    post.likes = post.likes.filter((id) => id !== req.userId)
  }

  await PostModel.findOneAndUpdate({ _id: id }, post, { new: true }, (err, docs) => {
    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(docs)
    }
  })
}
