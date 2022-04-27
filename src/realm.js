var Realm = require('realm');
// SubTaskの定義
const subTaskSchema = {
  name: 'SubTask',
  primaryKey: '_id',
  properties: {
    _id: 'objectId',
    name: 'string',
    isDone: 'bool',
    createdAt: 'date',
  },
};

// Realmの初期化
export const openRealm = () => {
  const config = {
    schema: [taskSchema, subTaskSchema],
    schemaVersion: 1, // スキーマを変更したらインクリメントする(後述)
  };

  return new Realm(config);
};

export {BSON} from 'realm';