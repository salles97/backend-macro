import { Request, Response } from 'express'
import { UpdateResult, getManager } from 'typeorm'
import { connect } from '../database/index'
import { NotificationEmail } from '../Services/NotificationEmail'
require('dotenv').config()

connect()
const manager = getManager()

export abstract class ReceitaController {
  static async create(request: Request, response: Response) {
    try {
      const body = request.body

      const imovel = await manager
        .createQueryBuilder()
        .insert()
        .into('imovel') // Especifique o nome completo da tabela com o esquema
        .values({
          // inscricao: body.inscricao,
          // area_imovel: body.area_imovel,
          // area_construida: body.area_construida,
          // area_impermeavel_corrigida: body.area_impermeavel_corrigida,
          // area_impermeavel_com_isencao: body.area_impermeavel_com_isencao,
          // area_impermeavel_real: body.area_impermeavel_real
        })
        .execute();

      console.log(imovel)

      response.status(200).send({
        message: 'Imovel cadastrada com sucesso!',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }

  // static async edit(request: Request, response: Response) {
  //   try {
  //     const body = request.body
  //     const taskId = request.params.id

  //     const updateQueries: Promise<UpdateResult>[] = []

  //     updateQueries.push(
  //       manager
  //         .createQueryBuilder()
  //         .update('public.tasks')
  //         .set({
  //           title: body.title,
  //           description: body.description || null,
  //           deadline: body.deadline,
  //         })
  //         .where(`id = ${taskId}`)
  //         .execute()
  //     )

  //     if (body.hasOwnProperty('score')) {
  //       updateQueries.push(
  //         manager
  //           .createQueryBuilder()
  //           .update('public.scores')
  //           .set({
  //             responsible_user: body.score.responsible_user,
  //             value: body.score.value,
  //             finished: body.score.finished,
  //           })
  //           .where(`task_id = ${taskId}`)
  //           .execute()
  //       )
  //     }

  //     await Promise.all(updateQueries).then(async () => {
  //       const user = await manager
  //         .createQueryBuilder()
  //         .select('*')
  //         .from('users', '')
  //         .where(`users.id = ${body.score.responsible_user}`)
  //         .execute()
  //       if (user) {
  //         await new NotificationEmail().sendEmail(
  //           user[0].email,
  //           'Atualização em sua tarefa na RepTask!',
  //           'Olá ' +
  //           user[0].name +
  //           ', a tarefa ' +
  //           body.title +
  //           ', atribuída a você, teve atualizações. Entre em sua república e confira'
  //         )
  //       }
  //     })

  //     return response.status(200).send({
  //       message: 'Tarefa editada com sucesso!',
  //     })
  //   } catch (error) {
  //     console.error(error)
  //     return response.status(500).send({
  //       error: 'Houve um erro na aplicação',
  //     })
  //   }
  // }

  // static async delete(request: Request, response: Response) {
  //   try {
  //     const taskId = request.params.id
  //     await manager.createQueryBuilder().delete().from('public.scores').where(`task_id = ${taskId}`).execute()
  //     await manager.createQueryBuilder().delete().from('public.tasks').where(`id = ${taskId}`).execute()

  //     response.status(200).send({
  //       message: 'Tarefa excluída com sucesso!',
  //     })
  //   } catch (error) {
  //     console.error(error)
  //     return response.status(500).send({
  //       error: 'Houve um erro na aplicação',
  //     })
  //   }
  // }


  static async getByYear(request: Request, response: Response) {
    try {
      const year = (request.params.year)

      const receitaQuery = await manager
        .createQueryBuilder()
        .select()
        .from('receita', '')
        .where(`ano = '${year}'`)
        .execute()

      return response.status(200).send(receitaQuery)
    } catch (error) {
      console.error('Erro:', error.message);
      console.error('Stack Trace:', error.stack);
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      });
    }
  }

  static async getByImovel(request: Request, response: Response) {
    try {
      const inscricao = (request.params.inscricao)

      const receitaQuery = await manager
        .createQueryBuilder()
        .select()
        .from('receita', '')
        .where(`inscricao = '${inscricao}'`)
        .execute()

      return response.status(200).send(receitaQuery[0])
    } catch (error) {
      console.error('Erro:', error.message);
      console.error('Stack Trace:', error.stack);
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      });
    }
  }
}