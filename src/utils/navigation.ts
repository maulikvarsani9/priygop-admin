let navigateFunction: ((path: string) => void) | null = null;

export const setNavigateFunction = (navigate: (path: string) => void) => {
  navigateFunction = navigate;
};

export const navigateToLogin = () => {
  if (navigateFunction) {
    navigateFunction('/login');
  } else {
    window.location.href = '/login';
  }
};

