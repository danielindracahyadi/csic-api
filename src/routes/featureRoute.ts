import { Router } from 'express';
import controllers from '../controllers';
import middleware from '../middleware';

const featureController = controllers.feature;
const featureRouter = Router();

featureRouter.post(
  '/add-post',
  middleware.multerUploads,
  featureController.addPost,
);

export default featureRouter;
