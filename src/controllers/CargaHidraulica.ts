import { Request, Response } from 'express'
import { UpdateResult, getManager } from 'typeorm'
import { connect } from '../database/index'
import { NotificationEmail } from '../Services/NotificationEmail'
require('dotenv').config()

connect()
const manager = getManager()

export abstract class CargaHidraulica {
  static async create(request: Request, response: Response) {
    try {
      const body = request.body

      const carga_hidraulica = await manager
        .createQueryBuilder()
        .insert()
        .into('carga_hidraulica')
        .values({
          inscricao: body.inscricao,
          capacidade_retencao: body.capacidade_retencao,
          ano: body.ano,
          jan: body.jan,
          fev: body.fev,
          mar: body.mar,
          abr: body.abr,
          mai: body.mai,
          jun: body.jun,
          jul: body.jul,
          ago: body.ago,
          set: body.set,
          out: body.out,
          nov: body.nov,
          dez: body.dez
        })
        .execute();

      console.log(carga_hidraulica)

      response.status(200).send({
        message: 'Carga para o imovel cadastrada com sucesso!',
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

  static async getByDate(request: Request, response: Response) {
    try {
      const year = Number(request.params.year)
      // const repId = Number(request.params.rep)

      const cargaQuery = await manager
        .createQueryBuilder()
        .select('*')
        .from('carga_hidraulica', '')
        .where(`ano = ${year}`)
        .execute()

      return response.status(200).send(cargaQuery)
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

      const cargaQuery = await manager
        .createQueryBuilder()
        .select('*')
        .from('carga_hidraulica', '')
        .where(`inscricao = '${inscricao}'`)
        .execute()

      return response.status(200).send(cargaQuery[0])
    } catch (error) {
      console.error('Erro:', error.message);
      console.error('Stack Trace:', error.stack);
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      });
    }
  }

  static validateCreateEntries(body: any) {
    if (!('title' in body)) throw new Error('Campo title é obrigatório')
    if (!('deadline' in body)) throw new Error('Campo deadline é obrigatório')
    if (!('responsible_user' in body.score)) throw new Error('Campo score.responsible_user é obrigatório')
    if (!('value' in body.score)) throw new Error('Campo score.value é obrigatório')
    if (!('finished' in body.score)) throw new Error('Campo score.finished é obrigatório')
  }

  static validateEditEntries(body: any, params: any) {
    if (!('id' in params)) throw new Error('Campo task_id é obrigatório')
    if (!('title' in body)) throw new Error('Campo title é obrigatório')
    if (!('deadline' in body)) throw new Error('Campo deadline é obrigatório')
    if (!('responsible_user' in body.score)) throw new Error('Campo score.responsible_user é obrigatório')
    if (!('value' in body.score)) throw new Error('Campo score.value é obrigatório')
    if (!('finished' in body.score)) throw new Error('Campo score.finished é obrigatório')
  }

  static validateDeleteEntries(params: any) {
    if (!('id' in params)) throw new Error('Campo task_id é obrigatório')
  }

  static validateGetEntries(params: any) {
    if (!('option' in params)) throw new Error('Campo option é obrigatório')
  }

  static validateGetAllEntries(params: any) {
    if (!('username' in params)) throw new Error('Campo username é obrigatório')
  }
}
