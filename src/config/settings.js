import { LOCAL_API_HOST } from './api';

export const MAX_INPUT_LENGTH = 5000;
export const MAX_ROWS = 10;
export const DEFAULT_LANG = 'en';
export const DEFAULT_MODE = 'student';
export const TEACHER_MODE = 'teacher';

// avoid breaking the app in production when embedded in different contexts
let defaultApiHost;
try {
  defaultApiHost =
    window.parent.location.hostname === 'localhost' ? LOCAL_API_HOST : null;
} catch (e) {
  console.error(e);
  defaultApiHost = null;
}

export const DEFAULT_API_HOST = defaultApiHost;

export const MODES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PRODUCER: 'producer',
  EDUCATOR: 'educator',
  ADMIN: 'admin',
  CONSUMER: 'consumer',
  LEARNER: 'learner',
};

// we haven't decided what to call the teacher mode
export const TEACHER_MODES = [TEACHER_MODE, 'producer', 'educator', 'admin'];

export const PUBLIC_VISIBILITY = 'public';
export const DEFAULT_VISIBILITY = PUBLIC_VISIBILITY;

export const PUBLIC_OWNERSHIP = 'all';
export const DEFAULT_OWNERSHIP = PUBLIC_OWNERSHIP;

export const MAX_NUM_FILES = 1;
export const MAX_FILE_SIZE = 5 * 1000 * 1000;
