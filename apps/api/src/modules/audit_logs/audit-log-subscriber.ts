import { 
  EventSubscriber, 
  EntitySubscriberInterface, 
  InsertEvent, 
  UpdateEvent, 
  RemoveEvent, 
  DataSource 
} from 'typeorm';
import { AuditLogEntity } from './entities/audit-log.entity';
import { ClsService } from 'nestjs-cls'
import { Injectable } from '@nestjs/common';


@EventSubscriber()
@Injectable()
export class AuditSubscriber implements EntitySubscriberInterface {


  
  // Le pasamos el DataSource para registrar el subscriber automáticamente en TypeORM
  constructor(
    private readonly cls: ClsService,
    dataSource: DataSource
  ) {
    dataSource.subscribers.push(this);

    
  }

  // 1. Captura inserciones (POST / Creaciones)
  async afterInsert(event: InsertEvent<any>) {
    await this.saveLog('INSERT', event);
  }

  // 2. Captura actualizaciones (PUT-PATCH / Modificaciones)
  // Usamos "beforeUpdate" porque nos permite acceder de forma segura a "event.databaseEntity" (el estado viejo)
  async beforeUpdate(event: UpdateEvent<any>) {
    await this.saveLog('UPDATE', event);
  }

  // 3. Captura eliminaciones (DELETE)
  // Usamos "beforeRemove" para tener acceso a los datos que están a punto de borrarse
  async beforeRemove(event: RemoveEvent<any>) {
    await this.saveLog('DELETE', event);
  }

  private async saveLog(action: string, event: any) {
    const entityName = event.metadata.name;

    // Si no hacemos esto, guardar un log generará otro log, creando un bucle infinito que romperá la app.
    console.log(entityName)
    if ( ![ 'ContactEntity' ].includes(entityName) ) return;

    // Obtenemos el repositorio utilizando el EntityManager del propio evento
    const auditRepository = event.manager.getRepository(AuditLogEntity);

    let oldData: any = null;
    let newData: any = null;

    if (action === 'INSERT') {
      newData = event.entity;
    } 
    
    if (action === 'UPDATE') {
      oldData = event.databaseEntity ? { ...event.databaseEntity } : null;
      // Combinamos el estado previo con las mutaciones parciales para tener el objeto final completo
      newData = (event.databaseEntity && event.entity) 
        ? { ...event.databaseEntity, ...event.entity } 
        : event.entity;
    }
    
    if (action === 'DELETE') {
      // Dependiendo de cómo elimines (remove o delete), los datos pueden venir en entity o databaseEntity
      oldData = event.entity || event.databaseEntity;
    }

    // Casteamos la propiedad a "any" de forma segura
    const entityIdRaw = event.entityId as any;

    const entityIndex = typeof entityIdRaw === 'object' && entityIdRaw !== null
      ? entityIdRaw.index || entityIdRaw.id || JSON.stringify(entityIdRaw)
      : entityIdRaw;

    // 🌟 Recuperamos el identificador del usuario que inició la petición HTTP
    // (Este valor lo debió inyectar previamente tu AuthGuard usando this.cls.set('userId', user.id))
    const userIdFromContext = this.cls.get<string>('userId') || null;
    const userTypeFromContext = this.cls.get<string>('userType') || null;

    // Creamos la fila de auditoría mapeando todo adecuadamente
    const log = auditRepository.create({
      entityName,
      entityIndex: entityIndex || newData?.index || oldData?.index, // Triple fallback de seguridad para el ID
      action,
      oldData,
      newData,
      performedId: userIdFromContext, // Asignamos el ID del usuario responsable
      performedBy: userTypeFromContext
    });


    // Guardamos de forma asíncrona en la tabla audit_logs
    await auditRepository.save(log);
  }
}