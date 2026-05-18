import AppDataSource from '../../config/database/database';

import { Result, ok, err } from '../../core/utils/result';
import { generateUuidV7 } from '../../core/utils/uuid';
import { Lead, FuenteLead } from '../../models/Lead';
import { LessThan, MoreThanOrEqual, ILike } from 'typeorm';

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
      .orderBy('lead.createdAt', 'DESC')
      .addOrderBy('lead.id', 'DESC')
      .take(params.limit);

    if (params.cursor) {
      const cursorLead = await leadRepository.findOne({ where: { id: params.cursor } });
      if (cursorLead) {
        queryBuilder.where(
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
};