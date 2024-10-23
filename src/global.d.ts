import { FC as FCN, ReactNode } from 'react';

declare global {
    type FCCP<P extends object = object> = P & {
        children: ReactNode;
    };

    type FCCR = ReactNode;

    type FCC<P = object> = FCN<P & FCCP>;

    type FC<P = object> = FCN<P>;
}
