import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ExerciseList = () => {
  const { category } = useParams();

  const [exercises, setExercises] = useState([
    { name: 'Bench Press', completed: false, completedAt: null },
    { name: 'Incline Dumbbell Press', completed: true, completedAt: Date.now() }, // sample completed time
  ]);
  const [newExercise, setNewExercise] = useState('');

  // 🔁 Reset completed exercises after 24 hours
  useEffect(() => {
    const now = Date.now();
    const updated = exercises.map((ex) => {
      if (ex.completed && ex.completedAt && now - ex.completedAt > 24 * 60 * 60 * 1000) {
        return { ...ex, completed: false, completedAt: null };
      }
      return ex;
    });
    setExercises(updated);
  }, []);

  const toggleCompleted = (i) => {
    const updated = [...exercises];
    const currentTime = Date.now();
    updated[i].completed = !updated[i].completed;
    updated[i].completedAt = updated[i].completed ? currentTime : null;
    setExercises(updated);
  };

  const addExercise = () => {
    if (newExercise.trim()) {
      setExercises([...exercises, { name: newExercise, completed: false, completedAt: null }]);
      setNewExercise('');
    }
  };

  const deleteExercise = (i) => {
    const updated = [...exercises];
    updated.splice(i, 1);
    setExercises(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold mb-4 capitalize">
        {category?.replace('-', ' ') || 'Exercises'}
      </h1>

      <ul className="space-y-2 mb-6">
        {exercises.map((ex, i) => (
          <li key={i} className="flex items-center justify-between bg-white/10 p-3 rounded">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-3"
                checked={ex.completed}
                onChange={() => toggleCompleted(i)}
              />
              <span className={ex.completed ? 'line-through text-gray-400' : ''}>
                {ex.name}
              </span>
            </div>
            <button
              onClick={() => deleteExercise(i)}
              className="text-red-500 hover:text-red-700"
              title="Delete"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <div className="flex">
        <input
          type="text"
          value={newExercise}
          onChange={(e) => setNewExercise(e.target.value)}
          placeholder="Add new exercise"
          className="flex-grow bg-white/10 p-2 rounded text-white"
        />
        <button
          onClick={addExercise}
          className="ml-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ExerciseList;
