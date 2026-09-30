/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#2D68F8",
        // Emerald brand scale. 700 is the button fill (white text passes
        // WCAG AA); 600 is for accents, rings and dots.
        brand: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
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
        "primary-green": "#059669",
        "pastel-green": "rgba(19, 194, 150, 0.20)",
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
