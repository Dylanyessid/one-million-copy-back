import AppDataSource from '../../config/database/database';
import { DateTime } from 'luxon';

import { Result, ok, err } from '../../core/utils/result';
import { generateUuidV7 } from '../../core/utils/uuid';
import { Lead, FuenteLead } from '../../models/Lead';
import { openaiLib } from '../../libs/openai';

export interface CreateLeadData {
  id: string;
  nombre: string;
  email: string;
  telefono: string | null;
  fuente: string;
  productoInteres: string | null;
  presupuesto: number | null;
}

const MAX_UUID_RETRIES = 5;

export const leadService = {
  async createLead(data: {
    nombre: string;
    email: string;
    telefono?: string;
    fuente: string;
    productoInteres?: string;
    presupuesto?: number;
  }): Promise<Result<CreateLeadData, string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const existingEmail = await leadRepository.findOne({ where: { email: data.email } });
    if (existingEmail) {
      return err('LEAD_EMAIL_EXISTS');
    }
    
    


    let uuid: string;
    let uuidExists = true;
    let attempts = 0;

    while (uuidExists && attempts < MAX_UUID_RETRIES) {
      uuid = generateUuidV7();
      const existingLead = await leadRepository.findOne({ where: { id: uuid } });
      if (!existingLead) {
        uuidExists = false;
      }
      attempts++;
    }

    if (uuidExists) {
      return err('LEAD_ID_COLLISION');
    }

    const lead = leadRepository.create({
      id: uuid!,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono || null,
      fuente: data.fuente as any,
      productoInteres: data.productoInteres || null,
      presupuesto: data.presupuesto || null,
    });

    await leadRepository.save(lead);

    return ok({
      id: lead.id,
      nombre: lead.nombre,
      email: lead.email,
      telefono: lead.telefono,
      fuente: lead.fuente,
      productoInteres: lead.productoInteres,
      presupuesto: lead.presupuesto,
    });
  },

  async findAll(params: {
    cursor?: string;
    limit: number;
    fuente?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<Result<{ leads: Lead[]; nextCursor: string | null }, string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const queryBuilder = leadRepository.createQueryBuilder('lead')
      .where('lead.deletedAt IS NULL')
      .orderBy('lead.createdAt', 'DESC')
      .addOrderBy('lead.id', 'DESC')
      .take(params.limit);

    if (params.cursor) {
      const cursorLead = await leadRepository.findOne({ where: { id: params.cursor } });
      if (cursorLead) {
        queryBuilder.andWhere(
          '(lead.id < :cursorId)',
          {
            cursorCreatedAt: cursorLead.createdAt,
            cursorId: cursorLead.id,
          }
        );
      }
    }

    if (params.fuente) {
      const fuenteLower = params.fuente.toLowerCase();
      const fuenteValues = Object.values(FuenteLead).map(v => v.toLowerCase());
      const fuenteMatch = fuenteValues.find(v => v === fuenteLower);
      if (fuenteMatch) {
        queryBuilder.andWhere('LOWER(lead.fuente) = :fuente', { fuente: fuenteLower });
      }
    }

    if (params.fechaDesde) {
      queryBuilder.andWhere('lead.createdAt >= :fechaDesde', { 
        fechaDesde: new Date(params.fechaDesde) 
      });
    }

    if (params.fechaHasta) {
      queryBuilder.andWhere('lead.createdAt <= :fechaHasta', { 
        fechaHasta: new Date(params.fechaHasta) 
      });
    }

    const leads = await queryBuilder.getMany();

    let nextCursor: string | null = null;
    if (leads.length) {
      const lastLead = leads[leads.length - 1];
      nextCursor = lastLead.id;
    }

    return ok({ leads, nextCursor });
  },

  async updateLead(id: string, data: {
    nombre?: string;
    email?: string;
    telefono?: string;
    fuente?: string;
    productoInteres?: string;
    presupuesto?: number;
  }): Promise<Result<Lead, string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const lead = await leadRepository.findOne({ where: { id } });
    if (!lead) {
      return err('LEAD_NOT_FOUND');
    }

    if (data.email !== undefined && data.email !== lead.email) {
      const existingEmail = await leadRepository.findOne({ where: { email: data.email } });
      if (existingEmail) {
        return err('LEAD_EMAIL_EXISTS');
      }
    }

    if (data.nombre !== undefined) lead.nombre = data.nombre;
    if (data.email !== undefined) lead.email = data.email;
    if (data.telefono !== undefined) lead.telefono = data.telefono || null;
    if (data.fuente !== undefined) lead.fuente = data.fuente as any;
    if (data.productoInteres !== undefined) lead.productoInteres = data.productoInteres || null;
    if (data.presupuesto !== undefined) lead.presupuesto = data.presupuesto;

    await leadRepository.save(lead);

    return ok(lead);
  },

async deleteLead(id: string): Promise<Result<Lead, string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const lead = await leadRepository.findOne({ where: { id } });
    if (!lead) {
      return err('LEAD_NOT_FOUND');
    }

    await leadRepository.softDelete(id);

    return ok(lead);
  },

  async findById(id: string): Promise<Result<Lead, string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const lead = await leadRepository.findOne({ where: { id } });
    if (!lead) {
      return err('LEAD_NOT_FOUND');
    }

    return ok(lead);
  },

  async getStats(): Promise<Result<{
    total: number;
    porFuente: Record<string, number>;
    promedioPresupuesto: number | null;
    ultimos7Dias: number;
  }, string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const sevenDaysAgo = DateTime.utc().minus({ days: 7 }).toJSDate();

    const totalResult = await leadRepository
      .createQueryBuilder('lead')
      .where('lead.deletedAt IS NULL')
      .select('COUNT(*)', 'total')
      .getRawOne();

    const porFuenteResult = await leadRepository
      .createQueryBuilder('lead')
      .where('lead.deletedAt IS NULL')
      .select('lead.fuente', 'fuente')
      .addSelect('COUNT(*)', 'count')
      .groupBy('lead.fuente')
      .getRawMany();

    const presupuestoResult = await leadRepository
      .createQueryBuilder('lead')
      .where('lead.deletedAt IS NULL')
      .andWhere('lead.presupuesto IS NOT NULL')
      .select('AVG(lead.presupuesto)', 'promedio')
      .getRawOne();

    const ultimos7DiasResult = await leadRepository
      .createQueryBuilder('lead')
      .where('lead.deletedAt IS NULL')
      .andWhere('lead.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
      .select('COUNT(*)', 'total')
      .getRawOne();

    const porFuente: Record<string, number> = {};
    porFuenteResult.forEach((item) => {
      porFuente[item.fuente] = parseInt(item.count);
    });

    return ok({
      total: parseInt(totalResult.total, 10),
      porFuente,
      promedioPresupuesto: presupuestoResult.promedio ? parseFloat(parseFloat(presupuestoResult.promedio).toFixed(2)) : null,
      ultimos7Dias: parseInt(ultimos7DiasResult.total),
    });
  },

  async findByFilters(params: {
    fuente?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<Result<Lead[], string>> {
    const leadRepository = AppDataSource.getRepository(Lead);

    const queryBuilder = leadRepository.createQueryBuilder('lead')
      .where('lead.deletedAt IS NULL')
      .orderBy('lead.createdAt', 'DESC');

    if (params.fuente) {
      const fuenteLower = params.fuente.toLowerCase();
      const fuenteValues = Object.values(FuenteLead).map(v => v.toLowerCase());
      const fuenteMatch = fuenteValues.find(v => v === fuenteLower);
      if (fuenteMatch) {
        queryBuilder.andWhere('LOWER(lead.fuente) = :fuente', { fuente: fuenteLower });
      }
    }

    if (params.fechaDesde) {
      queryBuilder.andWhere('lead.createdAt >= :fechaDesde', {
        fechaDesde: DateTime.fromISO(params.fechaDesde).toUTC().toJSDate(),
      });
    }

    if (params.fechaHasta) {
      queryBuilder.andWhere('lead.createdAt <= :fechaHasta', {
        fechaHasta: DateTime.fromISO(params.fechaHasta).toUTC().toJSDate(),
      });
    }

    const leads = await queryBuilder.getMany();

    return ok(leads);
  },

  async getRecommendations(params: {
    fuente?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Promise<Result<string, string>> {
    const leadsResult = await this.findByFilters(params);

    if (!leadsResult.ok) {
      return err(leadsResult.error);
    }

    const leads = leadsResult.value;

    if (leads.length === 0) {
      return err('NO_LEADS_FOUND');
    }

    const leadsSummary = leads.map(l =>
      `- Nombre: ${l.nombre}, Email: ${l.email}, Fuente: ${l.fuente}, Producto: ${l.productoInteres || 'N/A'}, Presupuesto: ${l.presupuesto || 'N/A'}`
    ).join('\n');

    const prompt = `
Eres un asistente de ventas experto. Analiza los siguientes leads y proporciona recomendaciones actionable para mejorar la conversión:

${leadsSummary}

Basándote en este análisis, proporciona:
1. Un Resumen ejecutivo
2. La fuente principal de los leads
2. Recomendaciones concretas para mejorar las tasas de conversión y pasos sugeridos

`;

    const systemMessage = 'Eres un experto en análisis de leads y optimización de ventas. Responde siempre en español.';

    const response = await openaiLib.createCompletion(prompt, systemMessage);

    return ok(response);
  },
};