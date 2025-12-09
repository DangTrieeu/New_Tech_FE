/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Mulish', 'Be Vietnam Pro', 'Sen', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                'mulish': ['Mulish', 'sans-serif'],
                'be-vietnam': ['Be Vietnam Pro', 'sans-serif'],
                'sen': ['Sen', 'sans-serif'],
            },
        },
    },
    plugins: [],
}