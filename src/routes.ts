import express, { Router } from 'express'
import UserRouter from './controllers/user.controller'
import eventRegRouter from './controllers/event.RegController'
import eventRouter from './controllers/eventController'
import XamarinRouter from './controllers/XamarinController'
import locationRouter from './controllers/locationRegistration.Controller'
import shipRouter from './controllers/ship.controller'
import racePointsRouter from './controllers/racePoints.controller'
const routes = Router();

routes.use('', UserRouter);
routes.use('', eventRegRouter)
routes.use('', eventRouter)
routes.use('', locationRouter)
routes.use('', shipRouter)
routes.use('', racePointsRouter)
routes.use('', XamarinRouter)
export default routes;