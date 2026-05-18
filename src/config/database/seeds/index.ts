import AppDataSource from '../database';
import { Usuario } from '../../../models/Usuario';
import { Lead, FuenteLead } from '../../../models/Lead';
import { hashPassword } from '../../../libs/bcrypt';
import { generateUuidV7 } from '../../../core/utils/uuid';


async function loadDB(){
  try {
    await AppDataSource.initialize();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false
  }
  
}

async function runSeeds() {


  const loadDBResult = await loadDB();

  if (!loadDBResult) {
    console.error('Failed to connect to the database. Seeds cannot be run.');
    return;
  }

  console.log('Running seeds...');

  const usuarioRepo = AppDataSource.getRepository(Usuario);
  const leadRepo = AppDataSource.getRepository(Lead);

  try {
    const existingUser = await usuarioRepo.findOne({ where: { email: 'admin@mail.com' } });
    if (!existingUser) {
      console.log('Creating admin user...');
      const passwordHash = await hashPassword('Admin123+*');
      const adminUser = usuarioRepo.create({
        id: generateUuidV7(),
        nombre: 'Admin',
        email: 'admin@mail.com',
        hash: passwordHash,
      });
      await usuarioRepo.save(adminUser);
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    const existingLeadsCount = await leadRepo.count();
    console.log(`Existing leads: ${existingLeadsCount}`);

    if (existingLeadsCount === 0) {
      console.log('Creating leads...');
      const leads = [
        { nombre: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '5512345678', fuente: FuenteLead.INSTAGRAM, productoInteres: 'Curso Copywriting', presupuesto: 500 },
        { nombre: 'María García', email: 'maria.garcia@email.com', telefono: '5523456789', fuente: FuenteLead.FACEBOOK, productoInteres: 'Mentoría', presupuesto: 1200 },
        { nombre: 'Carlos López', email: 'carlos.lopez@email.com', telefono: '5534567890', fuente: FuenteLead.LANDING_PAGE, productoInteres: 'E-book', presupuesto: 50 },
        { nombre: 'Ana Martínez', email: 'ana.martinez@email.com', telefono: '5545678901', fuente: FuenteLead.REFERIDO, productoInteres: 'Curso Copywriting', presupuesto: 750 },
        { nombre: 'Pedro Rodríguez', email: 'pedro.rodriguez@email.com', telefono: '5556789012', fuente: FuenteLead.INSTAGRAM, productoInteres: 'Taller', presupuesto: 300 },
        { nombre: 'Laura Sánchez', email: 'laura.sanchez@email.com', telefono: '5567890123', fuente: FuenteLead.OTRO, productoInteres: 'Consultoría', presupuesto: 2000 },
        { nombre: 'Miguel Torres', email: 'miguel.torres@email.com', telefono: '5578901234', fuente: FuenteLead.FACEBOOK, productoInteres: 'Curso Copywriting', presupuesto: 600 },
        { nombre: 'Sofia Hernández', email: 'sofia.hernandez@email.com', telefono: '5589012345', fuente: FuenteLead.LANDING_PAGE, productoInteres: 'Mentoría', presupuesto: 1500 },
        { nombre: 'Diego Rivera', email: 'diego.rivera@email.com', telefono: '5590123456', fuente: FuenteLead.INSTAGRAM, productoInteres: 'E-book', presupuesto: 75 },
        { nombre: 'Carmen Díaz', email: 'carmen.diaz@email.com', telefono: '5501234567', fuente: FuenteLead.REFERIDO, productoInteres: 'Taller', presupuesto: 250 },
      ];

      for (let i = 0; i < leads.length; i++) {
        const leadData = leads[i];
        const lead = leadRepo.create({
          id: generateUuidV7(),
          nombre: leadData.nombre,
          email: leadData.email,
          telefono: leadData.telefono,
          fuente: leadData.fuente,
          productoInteres: leadData.productoInteres,
          presupuesto: leadData.presupuesto,
        });
        await leadRepo.save(lead);
        console.log(`Lead ${i + 1} created`);
      }
      console.log('10 leads created');
    } else {
      console.log('Leads already exist, skipping');
    }

    console.log('Seeds completed');
  } catch (error) {
    console.error('Error running seeds:', error);
  }
}

runSeeds().then(() => {
  console.log('Seed script finished');
  process.exit(0)}).catch((error) => {
  console.error('Error in seed script:', error);
  process.exit(1);
});