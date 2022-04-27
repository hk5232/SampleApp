import {openRealm, BSON} from './src/realm';

const realm = openRealm();

// 更新系はすべて realm.write(() => { }) (=トランザクション)内に書く
realm.write(() => {
  // サブタスクを作成しない場合
  realm.create('Task', {
    _id: new BSON.ObjectId(),
    name: 'タスクの名前',
    isDone: false,
    createdAt: new Date(),
  });

  // サブタスクを作成する場合
  realm.create('Task', {
    _id: new BSON.ObjectId(),
    name: 'タスクの名前',
    isDone: false,
    createdAt: new Date(),
    subTasks: [
      {
        _id: new BSON.ObjectId(),
        name: 'サブタスクの名前',
        isDone: false,
        createdAt: new Date(),
      },
    ],
  });
});

// タスクを全部取得
const tasks = realm.objects('Task');

console.log(tasks[0].name); // 「タスクの名前」と表示される
console.log(tasks[1].subTasks[0].name); // 「サブタスクの名前」と表示される

// フィルタの例 — 完了しているタスクのみ取得
const done = tasks.filtered('isDone == true');
console.log(`完了しているタスクは${done.length}件です。`);

// ソートの例 — 名前順で取得
const sorted = tasks.sorted('name');
console.log(sorted[0].name);

realm.write(() => {
  // 更新対象のタスク
  const task = realm.objects('Task')[0];

  // 更新
  task.name = '新しいタスクの名前';
  task.isDone = !task.isDone;
});

realm.write(() => {
  // 削除対象のタスク
  const task = realm.objects('Task')[0];

  if (task) {
    // まずサブタスクを削除
    realm.delete(task.subTasks);

    // 削除
    realm.delete(task);
  }
});

import React from 'react';
import {TasksProvider} from './src/providers/TasksProvider';
import {Main} from './src/components/Main';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <TasksProvider>
      <StatusBar barStyle="light-content" />
      <Main />
    </TasksProvider>
  );
};

export default App;