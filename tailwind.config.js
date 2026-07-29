/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F3",
        peach: "#FCDFC8",
        pink: {
          DEFAULT: "#F6A8C4",
          light: "#F9C6D7", // added for subtle hovers
        },
        magenta: {
          DEFAULT: "#D6338B",
          dark: "#B82A75", // added for active states
        },
        rose: {
          deep: "#7A1F4B",
        },
        ink: {
          DEFAULT: "#201018",
          light: "#4A2B39", // added for secondary text
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(122, 31, 75, 0.08)',
        'elevated': '0 20px 60px -15px rgba(122, 31, 75, 0.15)',
        'bloom': '0 15px 50px -10px rgba(214, 51, 139, 0.25)', // For hover effects
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
};
