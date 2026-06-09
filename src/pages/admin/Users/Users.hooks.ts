import { useState, useEffect } from 'react';
import { UsersProps, UsersState } from './Users.types';

export function useUsers(props: UsersProps) {
  const [state, setState] = useState<UsersState>({});

  useEffect(() => {
    // Add your effect logic here
  }, []);

  const handleClick = () => {
    // Add your click handler logic here
  };

  return {
    state,
    handleClick,
  };
}