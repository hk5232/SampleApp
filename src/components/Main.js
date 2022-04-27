import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {useTasks} from '../providers/TasksProvider';

// コンポーネント間の余白を作るための関数
const spacer = (size) => {
  return <View style={{height: size, width: size}} />;
};

export const Main = () => {
  const [inputText, setInputText] = useState('');
  const {createTask, deleteTask, setIsTaskDone, tasks} = useTasks();

  const onSubmitEditing = useCallback(
    (event) => {
      setInputText(event.nativeEvent.text);
      createTask(inputText);
      setInputText('');
    },
    [inputText, setInputText, createTask],
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView />
        <View style={styles.headerContent}>
          {spacer(15)}
          <Text accessibilityRole="header" style={styles.headerTitle}>
            My Tasks
          </Text>
          {spacer(15)}
          <TextInput
            placeholder="Add Task..."
            onSubmitEditing={onSubmitEditing}
            value={inputText}
            onChange={(e) => setInputText(e.nativeEvent.text)}
            style={styles.headerInput}
          />
          {spacer(24)}
        </View>
      </View>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {tasks.length > 0 ? (
          <FlatList
            style={styles.tasksContainer}
            contentContainerStyle={styles.tasksContentContainer}
            data={tasks}
            keyExtractor={(item) => item._id.toHexString()}
            renderItem={({item}) => (
              <View style={styles.taskItem}>
                <TouchableOpacity
                  style={styles.chechboxContainer}
                  onPress={() => setIsTaskDone(item, !item.isDone)}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: item.isDone ? '#2563EB' : '#60A5FA',
                        backgroundColor: item.isDone ? '#2563EB' : '#fff',
                      },
                    ]}>
                    {item.isDone && <Text style={styles.checkboxIcon}>✓</Text>}
                  </View>
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text
                    style={[
                      styles.taskName,
                      {
                        textDecorationLine: item.isDone
                          ? 'line-through'
                          : 'none',
                        color: item.isDone ? '#9CA3AF' : '#111827',
                      },
                    ]}>
                    {item.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteTask(item)}>
                  <View>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyMessage}>No Tasks</Text>
          </View>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// スタイル
const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    backgroundColor: '#2563EB',
  },
  headerContent: {paddingHorizontal: 24},
  headerTitle: {color: 'white', fontSize: 32, fontWeight: 'bold'},
  headerInput: {
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 12,
    marginHorizontal: -12,
    fontSize: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2.5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.4,
    elevation: 4,
  },
  tasksContainer: {flex: 1},
  tasksContentContainer: {paddingBottom: 20},
  taskItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chechboxContainer: {padding: 20},
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxIcon: {color: 'white', fontWeight: 'bold', fontSize: 18},
  taskContent: {flex: 1},
  taskName: {
    fontSize: 20,
    fontWeight: '600',
  },
  deleteButton: {padding: 20},
  deleteButtonText: {color: '#EF4444'},
  emptyContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: '500',
    color: '#9CA3AF',
  },
});