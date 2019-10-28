import { Router } from 'express';

import authRoute from './authRoute';
import featureRoute from './featureRoute';
import controllers from '../controllers';
import pageRoute from './pageRoute';

const apiRouter = Router();

apiRouter.use('/auth', authRoute);
apiRouter.use('/feature', featureRoute);
apiRouter.use('/page', pageRoute);
apiRouter.all('*', controllers.error.getBadPath);

export default apiRouter;
