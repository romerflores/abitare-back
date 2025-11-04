import fs from 'node:fs';
import express from 'express';
import multer from 'multer';
import { validarTokenUsuario } from '../../helpers/middlewares/validarToken.js';
import { obtenerMantenimiento, obtenerMantenimientos, solicitarMantenimiento } from '../../controllers/mantenimientoController/mantenimiento.controller.js';

const router = express.Router();
const upload = multer({ dest: './files' });

//Lista de mantenimientos 
router.get('/', obtenerMantenimientos);

//Obtener informacion de mantenimiento específico
router.get('/:id', obtenerMantenimiento);

//Solicitar un mantenimiento
router.post('/solicitar-mantenimiento', solicitarMantenimiento);


/*//Obtener información del mantenimiento solicitado
router.get('/estado-mantenimiento/:id');


//Eliminar solicitud de mantenimiento
router.delete('/eliminar-solicitud/:id'); */


/* Solicitar mantenimiento */
router.post('/registro', upload.array('files', 5), (req, res) => {
    req.files.map(saveFile);
    console.log(req.body);
    return res.send('');
})

export {router};