import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentServices } from './comment.service';
import AppError from '../../errors/appError';
import { isAdminRole } from '../../middleware/auth';
import { sanitizePlainText } from '../../utils/sanitizeContent';

// create comment
const createComment = catchAsync(async (req, res) => {
  const payload = {
    post: req.body.post,
    content: sanitizePlainText(req.body.content ?? ''),
    // the comment author always comes from the verified token
    user: req.user.id,
  };

  const result = await CommentServices.createCommentIntoDB(payload);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Commented successfully',
    data: result,
  });
});

// get all comments of a post from database
const getAllCommentsForPost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const result = await CommentServices.getAllCommentsForPostFromDB(postId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const comment = await CommentServices.getCommentById(id);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
  }

  if (String(comment.user) !== req.user.id && !isAdminRole(req.user.role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only update your own comments!',
    );
  }

  const result = await CommentServices.updateCommentIntoDB(id, {
    content: sanitizePlainText(req.body.content ?? ''),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;

  const comment = await CommentServices.getCommentById(id);

  if (!comment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found!');
  }

  if (String(comment.user) !== req.user.id && !isAdminRole(req.user.role)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only delete your own comments!',
    );
  }

  const result = await CommentServices.deleteCommentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  getAllCommentsForPost,
  updateComment,
  deleteComment,
};
