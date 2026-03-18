import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, addTask, editTask, removeTask } from '../store/slices/taskSlice';

export const useTasks = () => {
  const dispatch = useDispatch();
  const { tasks, pagination, loading, error } = useSelector((s) => s.tasks);
  return {
    tasks, pagination, loading, error,
    fetchTasks: (p) => dispatch(fetchTasks(p)),
    addTask: (d) => dispatch(addTask(d)),
    editTask: (id, d) => dispatch(editTask({ id, data: d })),
    removeTask: (id) => dispatch(removeTask(id)),
  };
};
