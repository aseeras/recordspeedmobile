/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#2D68F8",
        "gray-2": "#F3F4F6",
        "dark-3": "#374151",
        "dark-4": "#4B5563",
        "dark-7": "#D1D5DB",
        "primary-black": "#637381",
        "primary-green": "#13C296",
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
