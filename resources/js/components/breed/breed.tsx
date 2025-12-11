import { Breed } from '@/types';
import { BreedLikesState } from '@/types/breed';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LikeButton from './like-btn';

export const BreedList = ({ breeds }: { breeds: Breed[] }) => {
  const [likes, setLikes] = useState<BreedLikesState>({});

  useEffect(() => {
    if (Array.isArray(breeds)) {
      const initialLikes: BreedLikesState = {};
      breeds.forEach((breed) => {
        initialLikes[breed.name] = {
          count: breed.likes || 0,
          liked: breed.hasLiked,
        };
      });
      setLikes(initialLikes);
    }
  }, [breeds]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {breeds.map((breed) => (
        <BreedCard
          key={breed.name}
          breed={breed}
          likes={likes[breed.name]?.count || 0}
          liked={likes[breed.name]?.liked || false}
          setLikes={setLikes}
        />
      ))}
    </div>
  );
};

interface BreedCardProps {
  breed: Breed;
  likes: number;
  liked: boolean;
  setLikes: React.Dispatch<React.SetStateAction<BreedLikesState>>;
}

const BreedCard = ({ breed, likes, liked, setLikes }: BreedCardProps) => {
  // Each breed gets its own useForm
  const likeForm = useForm<{ breed: string }>({ breed: breed.name });
  const [loading, setLoading] = useState(false);

  console.log(breed);

  const handleLike = () => {
    setLoading(true);
    likeForm.post('/likes', {
      headers: { 'Accept': 'application/json' },
      onSuccess: () => {
        setLikes((prev) => {
          const prevState = prev[breed.name] || { count: 0, liked: false };
          const newLiked = !prevState.liked;
          const newCount = newLiked ? prevState.count + 1 : prevState.count - 1;
          return {
            ...prev,
            [breed.name]: { liked: newLiked, count: newCount },
          };
        });
        setLoading(false);
      },
      onError: (errors) => {
        console.log('Validation errors', errors);
        setLoading(false);
      },
    });
  };

  return (
    <div className="cursor-pointer rounded-lg bg-white p-4 shadow transition hover:shadow-lg">
      {breed.image && (
        <img
          src={breed.image}
          alt={breed.name}
          className="mb-3 h-60 w-full rounded object-cover"
        />
      )}

      <h2 className="text-lg font-semibold">{breed.name}</h2>

      {breed.description && (
        <p className="mt-1 text-sm text-gray-600">{breed.description}</p>
      )}

      <LikeButton
        liked={liked}
        likesCount={likes}
        onLike={handleLike}
        loading={loading}
      />
    </div>
  );
};

export default BreedList;
