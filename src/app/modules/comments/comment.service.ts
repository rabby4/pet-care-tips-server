import { TComment } from './comment.interface';
import { Comment } from './comment.model';

const createCommentIntoDB = async (payload: TComment) => {
  const result = await Comment.create(payload);
  return result;
};

const getAllCommentsForPostFromDB = async (id: string) => {
  const result = await Comment.find({ post: id }).populate('user');
  return result;
};

const updateCommentIntoDB = async (id: string, payload: Partial<TComment>) => {
  const result = await Comment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteCommentFromDB = async (id: string) => {
  const result = await Comment.findByIdAndDelete(id);
  return result;
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsForPostFromDB,
  updateCommentIntoDB,
  deleteCommentFromDB,
};
