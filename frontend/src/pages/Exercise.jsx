import { useNavigate } from 'react-router-dom';
import abs from '../photos/abs.jpeg';
import shoulder from '../photos/shoulder.jpeg';
import back from '../photos/back.jpeg';
import legs from '../photos/legs.jpeg';
import chest from '../photos/chest.jpeg';

const Exercise = () => {
  const navigate = useNavigate();
  const bodyParts = [
    { title: 'Chest and Triceps', slug: 'chest-triceps', img: chest },
    { title: 'Back and Biceps', slug: 'back-biceps', img: back },
    { title: 'Legs', slug: 'legs', img: legs },
    { title: 'Shoulders', slug: 'shoulders', img: shoulder },
    { title: 'Abs & Core', slug: 'abs-core', img: abs },
  ];

  return (
    <div className="min-h-screen bg-black p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Choose Body Part</h1>
      <div className="space-y-4">
        {bodyParts.map((part) => (
          <div
            key={part.slug}
            className="relative cursor-pointer h-40 rounded-lg overflow-hidden text-green-400 text-4xl"
            onClick={() => navigate(`/exercise/${part.slug}`)}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${part.img})` }}
            >
              {/* Overlay */}
              <div className="w-full h-full absolue inset-0  flex items-center px-4">
                <h2 className="text-xl font-bold">{part.title}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercise;
