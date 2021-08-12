import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  name: String,
  creator: String,
  likes: {
    type: [String],
    default: [],
  },
  createdAt: Date,
})

const PostModel = mongoose.model('PostModel', postSchema)

export default PostModel
