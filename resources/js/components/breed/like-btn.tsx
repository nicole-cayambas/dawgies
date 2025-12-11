import { MouseEventHandler } from 'react';

type Props = {
    liked: boolean;
    likesCount: number, 
    onLike: MouseEventHandler,
    loading: boolean
};

export default function LikeButton({ liked, likesCount, onLike, loading }: Props) {
    return (
        <button
            onClick={onLike}
            disabled={loading}
            className={`rounded px-4 py-2 ${
                liked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
            }`}
        >
            {liked ? '❤️ Liked' : '🤍 Like'} {likesCount}
        </button>
    );
}
