import React from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

type RatingProps = {
    rating: number; // 1~5 숫자 입력
    className?: string;
};

export const Rating: React.FC<RatingProps> = ({ rating, className }) => {
    return (
        <div className={clsx("flex items-center gap-1", className)}>
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={clsx(
                        "size-5",
                        index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300",
                    )}
                />
            ))}
        </div>
    );
};
