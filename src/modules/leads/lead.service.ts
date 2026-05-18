import AppDataSource from '../../config/database/database';

import { Result, ok, err } from '../../core/utils/result';
import { generateUuidV7 } from '../../core/utils/uuid';
import { Lead } from '../../models/Lead';

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
};