import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getManager } from 'typeorm'
import { connect } from '../database/index'
import bcrypt from 'bcrypt'
import { RequestEmailNewRep } from '../Services/NotificationEmail'
require('dotenv').config()

connect()
const manager = getManager()

export abstract class LoginController {
  static async loginAluno(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { email, password } = request.body
      console.log(request.body)
      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select(
          '*'
        )
        .from('unifit.aluno', '')
        .where(`email = '${email}'`)

      const user = await userQuery.getRawOne()
      if (!user) {
        return response.status(401).json({ message: 'Credenciais inválidas' })
      }

      // Comparar as senhas
      bcrypt.compare(password, user.senha, (err, result) => {
        if (err || !result) {
          console.log(result)
          return response.status(401).json({ message: 'Credenciais inválidas' })
        }

        // Gerar token JWT
        const token = jwt.sign({ userId: user.id }, 'secret', {
          expiresIn: '10h',
        })

        // Retornar o token como resposta
        return response.json({ token, user })
      })
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }

  static async changePasswordAluno(request: Request, response: Response) {
    try {
      // Obter email, senha antiga e nova senha do corpo da solicitação
      const { oldPassword, newPassword } = request.body
      const userId = request.params.id

      // Verificar se o usuário existe
      const userQuery = manager.createQueryBuilder().select('*').from('unifit.aluno', '').where(`idaluno = ${userId}`)

      const user = await userQuery.getRawOne()
      console.log(user)
      if (!user) {
        return response.status(401).json({ message: 'Credenciais inválidas1' })
      }

      // Comparar as senhas
      bcrypt.compare(oldPassword, user.senha, async (err, result) => {
        if (err || !result) {
          return response.status(401).json({ message: 'Credenciais inválidas2' })
        }

        // Gerar o hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Atualizar a senha no banco de dados
        const updateQuery = manager
          .createQueryBuilder()
          .update('unifit.aluno')
          .set({ senha: hashedPassword })
          .where(`idaluno = '${userId}'`)

        await updateQuery.execute()

        return response.status(200).json({ message: 'Senha alterada com sucesso' })
      })
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }


  static async loginProfessor(request: Request, response: Response) {
    try {
      // Obter email e senha do corpo da solicitação
      const { email, password } = request.body
      console.log(request.body)
      // Verificar se o usuário existe
      const userQuery = manager
        .createQueryBuilder()
        .select(
          '*'
        )
        .from('unifit.professor', '')
        .where(`email = '${email}'`)
      const user = await userQuery.getRawOne()
      if (!user) {
        return response.status(401).json({ message: 'Credenciais inválidas' })
      }

      // Comparar as senhas
      bcrypt.compare(password, user.senha, (err, result) => {
        if (err || !result) {
          console.log(result)
          return response.status(401).json({ message: 'Credenciais inválidas' })
        }

        // Gerar token JWT
        const token = jwt.sign({ userId: user.id }, 'secret', {
          expiresIn: '1h',
        })

        // Retornar o token como resposta
        return response.json({ token, user })
      })
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }

  static async changePasswordProfessor(request: Request, response: Response) {
    try {
      // Obter email, senha antiga e nova senha do corpo da solicitação
      const { oldPassword, newPassword } = request.body
      const userId = request.params.id

      // Verificar se o usuário existe
      const userQuery = manager.createQueryBuilder().select('*').from('unifit.professor', '').where(`idprofessor = ${userId}`)

      const user = await userQuery.getRawOne()
      console.log(user)
      if (!user) {
        return response.status(401).json({ message: 'Credenciais inválidas1' })
      }

      // Comparar as senhas
      bcrypt.compare(oldPassword, user.senha, async (err, result) => {
        if (err || !result) {
          return response.status(401).json({ message: 'Credenciais inválidas2' })
        }

        // Gerar o hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Atualizar a senha no banco de dados
        const updateQuery = manager
          .createQueryBuilder()
          .update('unifit.professor')
          .set({ senha: hashedPassword })
          .where(`idprofessor = '${userId}'`)

        await updateQuery.execute()

        return response.status(200).json({ message: 'Senha alterada com sucesso' })
      })
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }

  // static async newRep(request: Request, response: Response) {
  //   try {
  //     const body = request.body
  //     if (body.email) {
  //       await new RequestEmailNewRep().sendEmail(
  //         'reptaskapp@gmail.com',
  //         'Solicitação de criação de nova república na RepTask',
  //         'novo pedido de criação de república: ' + JSON.stringify(body)
  //       )
  //     }
  //     response.status(201).send({
  //       message: 'Pedido cadastrado!',
  //     })
  //   } catch {
  //     return response.status(500).send({
  //       error: 'Houve um erro na aplicação',
  //     })
  //   }
  // }
}
