import jwt from 'jsonwebtoken'
import { Router } from 'express'
import { connect } from '../database/index'
// import { AvaliacaoController } from '../controllers/AvaliacaoController'
import { LoginController } from '../controllers/LoginController'
// import { StudentController } from '../controllers/StudentController'
import { ImovelController } from '../controllers/ImovelController'
// import { AdminController } from '../controllers/AdminController'
import { PrecipitacaoController } from '../controllers/PrecipitacaoController'
import { CargaHidraulica } from '../controllers/CargaHidraulica'
// import { Rec } from '../controllers/TecnicoAdministrativoController'
import { DataController } from '../controllers/dataController'
import { ReceitaController } from '../controllers/ReceitaController'
import { VolumeController } from '../controllers/VolumeController'

connect()
const routes = Router()

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Extrair o token do Bearer token

  // if (!token) {
  //   return res.status(401).json({ message: 'Token de autenticação não fornecido' })
  // }

  // jwt.verify(token, 'secret', (err, decoded) => {
  //   if (err) {
  //     return res.status(403).json({ message: 'Token de autenticação inválido' })
  //   }
  //   req.body.userId = decoded.userId
  next()
  // })
}



/////////////// Dados entrada
routes.route('/macrodrenagem').post(authenticateToken, DataController.create)
routes.route('/macrodrenagem/:year').get(authenticateToken, DataController.getByYear)


/////////////// CARGA HIDRAULICA
routes.route('/carga_hidraulica').post(authenticateToken, CargaHidraulica.create)
routes.route('/carga_hidraulica/:year').get(authenticateToken, CargaHidraulica.getByDate)
routes.route('/carga_hidraulica/imovel/:inscricao').get(authenticateToken, CargaHidraulica.getByImovel)


/////////////// IMOVEL
routes.route('/imovel').post(authenticateToken, ImovelController.create)
routes.route('/imovel/:inscricao').get(authenticateToken, ImovelController.getByImovel)
routes.route('/imovel/:inscricao').patch(authenticateToken, ImovelController.edit)

/////////////// precipitacao_anual
routes.route('/precipitacao').post(authenticateToken, PrecipitacaoController.create)
routes.route('/precipitacao/:year').get(authenticateToken, PrecipitacaoController.getByYear)


/////////////// RECEITA
routes.route('/receita').post(authenticateToken, ReceitaController.create)
routes.route('/receita/:year').get(authenticateToken, ReceitaController.getByYear)
routes.route('/receita_imovel/:inscricao').get(authenticateToken, ReceitaController.getByImovel)


/////////////// VOLUME GERADO
routes.route('/volume').post(authenticateToken, VolumeController.create)
routes.route('/volume/:year').get(authenticateToken, VolumeController.getByYear)
routes.route('/volume_imovel/:inscricao').get(authenticateToken, VolumeController.getByImovel)



export { routes }
