/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#2D68F8",
        // Calm periwinkle brand scale. 600 is the button fill (white text
        // ~4.9:1, WCAG AA); lighter steps are for tints and backgrounds.
        brand: {
          50: "#F3F6FE",
          100: "#E6ECFD",
          200: "#CCD8FB",
          300: "#A9BDF7",
          400: "#7F9AF1",
          500: "#6282EC",
          600: "#4A68DC",
          700: "#3F58C6",
          800: "#34479F",
          900: "#2C3B7E",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#475569",
          subtle: "#94A3B8",
        },
        "gray-2": "#F3F4F6",
        "dark-3": "#374151",
        "dark-4": "#4B5563",
        "dark-7": "#D1D5DB",
        "primary-black": "#637381",
        "primary-green": "#4A68DC", // legacy name; now the brand accent
        "pastel-green": "rgba(74, 104, 220, 0.15)", // legacy name
        "pastel-violet": "rgba(55, 88, 249, 0.20)",
        "pastel-orange": "rgba(242, 116, 48, 0.20)",
        "pastel-blue": {
          "008": "rgba(55, 88, 249, 0.08)",
          "016": "rgba(55, 88, 249, 0.16)",
        },
      },
    },
  },
  plugins: [],
};
