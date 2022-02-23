import * as _ from 'underscore';
import { IUserDocument } from './types';

export interface ILogDataParams {
  type: string;
  description?: string;
  object: any;
  newData?: object;
  extraDesc?: object[];
  updatedDocument?: any;
  extraParams?: any;
}

interface ILogNameParams {
  collection: any;
  idFields: string[];
  foreignKey: string;
  prevList?: LogDesc[];
}

export interface IDescriptions {
  description?: string;
  extraDesc?: LogDesc[];
}

interface ILogParams extends ILogNameParams {
  nameFields: string[];
}

interface INameLabel {
  name: string;
  label: string;
}

interface ISchemaMap {
  name: string;
  schemas: any[];
}

/**
 * Finds name field from given collection
 * @param params.collection Collection to find
 * @param params.idFields Id fields saved in collection
 * @param params.foreignKey Name of id fields
 * @param params.prevList Array to save found id with name
 * @param params.nameFields List of values to be mapped to id field
 */
 export const gatherNames = async (params: ILogParams): Promise<LogDesc[]> => {
  const {
    collection,
    idFields,
    foreignKey,
    prevList,
    nameFields = []
  } = params;

  let options: LogDesc[] = [];

  if (prevList && prevList.length > 0) {
    options = prevList;
  }

  const uniqueIds = _.compact(_.uniq(idFields));

  for (const id of uniqueIds) {
    const item = await collection.findOne({ _id: id });
    let name: string = `item with id "${id}" has been deleted`;

    if (item) {
      for (const n of nameFields) {
        if (item[n]) {
          name = item[n];
        }
      }
    }

    options.push({ [foreignKey]: id, name });
  }

  return options;
};

export const gatherUsernames = async (
  params: ILogNameParams
): Promise<LogDesc[]> => {
  const { collection, idFields, foreignKey, prevList } = params;

  return gatherNames({
    collection,
    idFields,
    foreignKey,
    prevList,
    nameFields: ['email', 'username']
  });
};

interface IFinalLogParams extends ILogDataParams {
  action: string;
}

export const LOG_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
};

export type LogDesc = {
  [key: string]: any;
} & { name: any };

export const putCreateLog = async (
  messageBroker,
  params: ILogDataParams,
  user: IUserDocument
) => {
  const isAutomationsAvailable = await messageBroker.sendRPCMessage('gateway:isServiceAvailable', 'automations');

  if (isAutomationsAvailable) {
    messageBroker.sendMessage('automations', {
      type: `${params.type}`,
      targets: [params.object]
    });
  }

  return putLog(
    messageBroker,
    { ...params, action: LOG_ACTIONS.CREATE },
    user
  );
};

/**
 * Prepares a create log request to log server
 * @param params Log document params
 * @param user User information from mutation context
 */
export const putUpdateLog = async (
  messageBroker,
  params: ILogDataParams,
  user: IUserDocument
) => {
  return putLog(
    messageBroker,
    { ...params, action: LOG_ACTIONS.UPDATE },
    user
  );
};

/**
 * Prepares a create log request to log server
 * @param params Log document params
 * @param user User information from mutation context
 */
export const putDeleteLog = async (
  messageBroker,
  params: ILogDataParams,
  user: IUserDocument
) => {
  return putLog(
    messageBroker,
    { ...params, action: LOG_ACTIONS.DELETE },
    user
  );
};

const putLog = async (
  messageBroker,
  params: IFinalLogParams,
  user: IUserDocument
) => {
  const isLoggerAvailable = await messageBroker.sendRPCMessage('gateway:isServiceAvailable', 'logs');

  if (!isLoggerAvailable) {
    return;
  }

  return messageBroker.sendMessage('putLog', {
    ...params,
    createdBy: user._id,
    unicode: user.username || user.email || user._id,
    object: JSON.stringify(params.object),
    newData: JSON.stringify(params.newData),
    extraDesc: JSON.stringify(params.extraDesc),
  });
};

export interface IActivityLogParams {
  messageBroker;
  action: string;
  data: any;
}

export const putActivityLog = async (params: IActivityLogParams) => {
  const { messageBroker, data } = params;
  const isAutomationsAvailable = await messageBroker.sendRPCMessage('gateway:isServiceAvailable', 'automations');

  try {
    if (isAutomationsAvailable && data.target) {
      messageBroker.sendMessage('automations', {
        type: `${data.contentType}`,
        targets: [data.target]
      });
    }

    return messageBroker.sendMessage('putActivityLog', params);
  } catch (e) {
    return e.message;
  }
};

/**
 * Creates field name-label mapping list from given object
 */
const buildLabelList = (obj = {}): INameLabel[] => {
  const list: INameLabel[] = [];
  const fieldNames: string[] = Object.getOwnPropertyNames(obj);

  for (const name of fieldNames) {
    const field: any = obj[name];
    const label: string = field && field.label ? field.label : "";

    list.push({ name, label });
  }

  return list;
};

export const getSchemaLabels = (type: string, schemaMappings: ISchemaMap[]) => {
  let fieldNames: INameLabel[] = [];

  const found: ISchemaMap | undefined = schemaMappings.find(
    (m) => m.name === type
  );

  if (found) {
    const schemas: any = found.schemas || [];

    for (const schema of schemas) {
      // schema comes as either mongoose schema or plain object
      const names: string[] = Object.getOwnPropertyNames(
        schema.obj || schema
      );

      for (const name of names) {
        const field: any = schema.obj ? schema.obj[name] : schema[name];

        if (field && field.label) {
          fieldNames.push({ name, label: field.label });
        }

        // nested object field names
        if (typeof field === "object" && field.type && field.type.obj) {
          fieldNames = fieldNames.concat(buildLabelList(field.type.obj));
        }
      }
    } // end schema for loop
  } // end schema name mapping

  return fieldNames;
};