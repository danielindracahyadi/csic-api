import { Request, Response } from 'express';
import userModel from '../models/userModel';
import postModel from '../models/postModel';

import { SERVER_OK, SERVER_BAD_REQUEST } from '../constants';
import { ResponseObject } from '../types';

async function myProfile(req: Request, res: Response) {
  try {
    let decoded = (<any>req).decoded;
    let { id } = decoded;
    let userResult: ResponseObject = await userModel.getUserById(id);
    let postResult: ResponseObject = await postModel.getPostByUserId(id);
    if (userResult.success && postResult.success) {
      res.status(SERVER_OK).json({
        success: true,
        data: [
          {
            user: userResult.data,
            post: postResult.data,
          },
        ],
        message: 'Successfully retrieve my profile',
      });
    } else if (!userResult) {
      res.status(SERVER_BAD_REQUEST).json(userResult);
    } else {
      res.status(SERVER_BAD_REQUEST).json(postResult);
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
    return;
  }
}

async function userProfile(req: Request, res: Response) {
  try {
    let { id } = req.params;
    let result: ResponseObject = await userModel.getUserById(Number(id));
    if (!result) {
      res.status(SERVER_OK).json({
        success: false,
        data: [],
        message: 'User is not exist',
      });
      return;
    }
    if (result.success) {
      result.message = 'Successfully retrieve user profile';
      res.status(SERVER_OK).json(result);
    } else {
      res.status(SERVER_BAD_REQUEST).json(result);
    }
  } catch (e) {
    res.status(SERVER_BAD_REQUEST).json(String(e));
  }
}

export default { myProfile, userProfile };
