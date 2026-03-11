/** @type {import('tailwindcss').Config} */

export default {

    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],

    darkMode: "class",

    theme: {
        extend: {

            colors: {

                brasilGreen: "#009c3b",
                brasilGreenDark: "#006b28",
                brasilYellow: "#ffdf00",

                backgroundDark: "#050608",
                cardDark: "#0f1115"

            },

            backgroundImage: {

                brasilGradient:
                "linear-gradient(120deg,#009c3b,#00b347,#ffdf00,#009c3b)"

            },

            keyframes: {

                brasilGradient: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" }
                }

            },

            animation: {

                brasilGradient: "brasilGradient 18s ease infinite"

            },

            boxShadow: {

                brasilGlow: "0 0 40px rgba(0,156,59,0.35)"

            },

            backdropBlur: {
                xs: "2px"
            }

        }
    },

    plugins: []

}
