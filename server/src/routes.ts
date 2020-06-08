import express, { request, response } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import PointsController from './controllers/PointsController';
import ItensController from './controllers/ItensController';
import {celebrate,Joi} from 'celebrate';
const routes = express.Router();
const upload = multer(multerConfig);

const pointsController =  new PointsController();
const itensController = new ItensController();

//npm install multer
//npm install celebrate
//npm install @types/hapi__joi

routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);
routes.get('/itens', itensController.index);

routes.post('/points',
     upload.single('image'),
     celebrate({
        body:Joi.object().keys({
            name:Joi.object().required(),
            email:Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city:Joi.string().required(),
            uf:Joi.string().required().max(2),
            itens:Joi.string().required(),
            
            
        })
     },{
        abortEarly : false
    }),
     pointsController.create
    );

//index, show, create, update, delete

export default routes;

//Migration: Histórico do banco de dados

 