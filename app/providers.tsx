"use client";

import 'dayjs/locale/tr';
import dayjs from 'dayjs';

// Set default locale to Turkish
dayjs.locale('tr');

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <>
      {children}
    </>
  );
};
