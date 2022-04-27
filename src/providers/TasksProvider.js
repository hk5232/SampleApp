import React, {useContext, useState, useEffect, useRef} from 'react';
import {openRealm, BSON} from '../realm';

const TasksContext = React.createContext(null);

const TasksProvider = ({children}) => {
  const [tasks, setTasks] = useState([]);

  const realmRef = useRef(null);

  useEffect(() => {
    realmRef.current = openRealm();

    const tasks = realmRef.current.objects('Task').sorted('createdAt', true);
    setTasks(tasks);

    // Task のデータが更新されたら setTasks する
    tasks.addListener(() => {
      const tasks = realmRef.current.objects('Task').sorted('createdAt', true);
      setTasks(tasks);
    });

    return () => {
      // クリーンアップ
      if (realmRef.current) {
        realmRef.current.close();
      }
    };
  }, []);

  // タスクの新規作成
  const createTask = (newTaskName) => {
    const projectRealm = realmRef.current;
    projectRealm.write(() => {
      projectRealm.create('Task', {
        _id: new BSON.ObjectId(),
        name: newTaskName || '新しいタスク',
        isDone: false,
        createdAt: new Date(),
      });
    });
  };

  // タスクの isDone を更新する
  const setIsTaskDone = (task, isDone) => {
    const projectRealm = realmRef.current;

    projectRealm.write(() => {
      task.isDone = isDone;
    });
  };

  // タスクを削除する
  const deleteTask = (task) => {
    const projectRealm = realmRef.current;
    projectRealm.write(() => {
      projectRealm.delete(task);
    });
  };

  // useTasks フックで Task を操作できるようにする
  return (
    <TasksContext.Provider
      value={{
        createTask,
        deleteTask,
        setIsTaskDone,
        tasks,
      }}>
      {children}
    </TasksContext.Provider>
  );
};

// Task を操作するための React Hook
const useTasks = () => {
  const task = useContext(TasksContext);
  if (task == null) {
    throw new Error('useTasks() called outside of a TasksProvider?');
  }
  return task;
};

export {TasksProvider, useTasks};