module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      primary: ["Exo", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#E6D5B8",
        secondary: "#E45826",
        navlink: "#8B6C61",
        placeholder: "#8B6C61",
        icon: "#9D917D",
        card: "#E9E4DB",
        info: "#F0A500",
        label: "#888888",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(10deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 2s ease-in-out infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
};
