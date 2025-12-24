/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#00665f',
                    dark: '#004d47',
                    light: '#e5f5f4'
                }
            }
        },
    },
    plugins: [],
}
