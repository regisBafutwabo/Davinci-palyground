import { v4 as uuidv4 } from 'uuid';

import { User } from '@/typings/Chat';

const me: User = { firstName: 'me', id: uuidv4() };
const therapist: User = { firstName: 'Therapist', id: uuidv4() };

export const getAuthorByName = (name: string): User => {
  if (name.toLowerCase() === therapist.firstName) return therapist;
  return me;
};
