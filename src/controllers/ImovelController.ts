import { Request, Response } from 'express'
import { UpdateResult, getManager } from 'typeorm'
import { connect } from '../database/index'
import { NotificationEmail } from '../Services/NotificationEmail'
require('dotenv').config()

connect()
const manager = getManager()

export abstract class ImovelController {
  static async create(request: Request, response: Response) {
    try {
      const body = request.body

      const imovel = await manager
        .createQueryBuilder()
        .insert()
        .into('imovel') // Especifique o nome completo da tabela com o esquema
        .values({
          inscricao: body.inscricao,
          area_imovel: body.area_imovel,
          area_construida: body.area_construida,
          area_impermeavel_corrigida: body.area_impermeavel_corrigida,
          area_impermeavel_com_isencao: body.area_impermeavel_com_isencao,
          area_impermeavel_real: body.area_impermeavel_real
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

  static async edit(request: Request, response: Response) {
    try {
      const body = request.body
      const inscricao = request.params.inscricao

      const updateQueries: Promise<UpdateResult>[] = []

      if (body.hasOwnProperty('capacidade_retencao')) {

        updateQueries.push(
          manager
            .createQueryBuilder()
            .update('carga_hidraulica')
            .set({
              capacidade_retencao: body.capacidade_retencao,
            })
            .where(`inscricao = '${inscricao}'`)
            .execute()
        )
      }

      if (body.hasOwnProperty('area_imovel')) {
        updateQueries.push(
          manager
            .createQueryBuilder()
            .update('imovel')
            .set({
              area_imovel: body.area_imovel
            })
            .where(`inscricao = '${inscricao}'`)
            .execute()
        )
      }

      if (body.hasOwnProperty('area_impermeavel')) {
        updateQueries.push(
          manager
            .createQueryBuilder()
            .update('imovel')
            .set({
              area_impermeavel_real: body.area_impermeavel
            })
            .where(`inscricao = '${inscricao}'`)
            .execute()
        )
      }

      await Promise.all(updateQueries)

      return response.status(200).send({
        message: 'Editado com sucesso!',
      })
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }

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


  static async getByImovel(request: Request, response: Response) {
    try {
      const inscricao = (request.params.inscricao)

      const cargaQuery = await manager
        .createQueryBuilder()
        .select('*')
        .from('imovel', '')
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
