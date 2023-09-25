import { Request, Response } from 'express'
import { getManager } from 'typeorm'
import { connect } from '../database/index'
import { NotificationEmail } from '../Services/NotificationEmail'
require('dotenv').config()

connect()
const manager = getManager()

export abstract class DataController {
  static async create(request: Request, response: Response) {
    try {
      const body = request.body

      const year = body.year;

      const exist = await manager
        .createQueryBuilder()
        .select('*')
        .from('dados_entrada', '')
        .where(`aluno_idaluno = ${year}`)
        .execute()

      if (!exist) {

        const novo_ano = await manager
          .createQueryBuilder()
          .insert()
          .into('dados_entrada')
          .values({
            orcamento_total: body.orcamento_total,
            despesa_operacional_planejada: body.despesa_operacional_planejada,
            investimento_planejado: body.investimento_planejado,
            inadimplencia: body.inadimplencia,
            isencao_tarifaria: body.isencao_tarifaria,
            total_imoveis: body.total_imoveis,
            limite_para_isencao: body.limite_para_isencao,
            carga_hidraulica_total_ano_anterior: body.carga_hidraulica_total_ano_anterior,
            receita_fixa_requerida: body.receita_fixa_requerida,
            receita_variavel_requerida: body.receita_variavel_requerida,
            imoveis_tarifados: body.imoveis_tarifados,
            parcela_fixa: body.parcela_fixa,
            parcela_variavel: body.parcela_variavel,
            saldo_financeiro_realizado: body.saldo_financeiro_realizado,
            ano: body.year
          })
          .execute()
        if (novo_ano) {
          return response.status(200).send({
            message: 'Dados de entrada para novo ano registrado com sucesso!',
          })
        }
      }
      else {
        return response.status(403).send({
          message: 'Dados de entrada já cadastrado pro ano ',
          ano: body.year
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      })
    }
  }


  static async getByYear(request: Request, response: Response) {
    try {
      const year = request.params.year;
      const manager = getManager();

      // Consulte todos os registros de frequência em uma data específica
      const dados_entrada = await manager
        .createQueryBuilder()
        .select('*')
        .from('dados_entrada', '')
        .where(`ano = ${year}`,)
        .execute();

      return response.status(200).send(dados_entrada[0]);
    } catch (error) {
      console.error(error);
      return response.status(500).send({
        error: 'Houve um erro na aplicação',
      });
    }
  }


}
