import api from '@/lib/api';
import { Breed } from '@/types';
import { BreedLikesState } from '@/types/breed';
import { useEffect, useState } from 'react';
import LikeButton from './like-btn';

export const BreedList = ({ breeds }: { breeds: Breed[] }) => {
    // shared state for likes per breed
    const [likes, setLikes] = useState<BreedLikesState>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(breeds)) {
            const initialLikes: BreedLikesState = {};
            breeds.forEach((breed) => {
                initialLikes[breed.name] = {
                    count: breed.likes || 0,
                    liked: false,
                };
            });
            setLikes(initialLikes);
        }
    }, [breeds]);

    const handleLike = (breedName: string) => {
        setLoading(true);
        api.post('/api/likes', { breed: breedName }, { withCredentials: true })
            .then(() => {
                setLikes((prev) => {
                    const prevState = prev[breedName] || {
                        count: 0,
                        liked: false,
                    };
                    const liked = !prevState.liked; // toggle
                    const count = liked
                        ? prevState.count + 1
                        : prevState.count - 1;
                    return {
                        ...prev,
                        [breedName]: { liked, count },
                    };
                });
                setLoading(false);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {breeds.map((breed) => (
                <BreedCard
                    key={breed.name}
                    breed={breed}
                    likes={likes[breed.name] || 0}
                    liked={likes[breed.name]?.liked || false}
                    onLike={() => handleLike(breed.name)}
                    loading={loading}
                />
            ))}
        </div>
    );
};

export const BreedCard = ({ breed, likes, liked, onLike, loading }) => {
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
                <p className="mt-1 text-sm text-gray-600">
                    {breed.description}
                </p>
            )}

            <LikeButton
                liked={liked}
                likesCount={likes.count}
                onLike={onLike}
                loading={loading}
            />
        </div>
    );
};

export default BreedList;
