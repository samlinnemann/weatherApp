document.addEventListener("DOMContentLoaded", () => {
    // Get the theme toggle button
    const themeToggleButton = document.getElementById('theme-toggle');

    // Check if the theme is already saved in localStorage and apply it
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // Event listener to toggle the theme
    themeToggleButton.addEventListener('click', () => {
        // Toggle the dark theme class on the body element
        document.body.classList.toggle('dark-theme');

        // Save the theme preference in localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.removeItem('theme');
        }
    });
});
