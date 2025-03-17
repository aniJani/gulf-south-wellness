export const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme === 'dark';
};

export const toggleTheme = (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Dispatch a custom event for components that need to know about theme changes
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { isDark }
    }));
};