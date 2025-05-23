/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    darkMode: 'class',
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './shared/**/*.{js,ts,jsx,tsx,mdx}',
        './styles/globals.scss',
        './node_modules/preline/dist/*.js', // <-- Problematic entry
        './src/**/*.{js,ts,jsx,tsx}' // Or if using `src` directory:
    ],
    theme: {
        screens: {
            lg: '992px',
            md: '768px',
            sm: '480px',
            xl: '1200px',
            xxl: '1400px',
            xxxl: '1800px',
            '3xl': '1920x', // Add a custom breakpoint for wider screens
            '4xl': '2560px' // Add a custom breakpoint for wider screens
        },
        borderRadius: {
            none: '0',
            sm: '0.25rem',
            md: '0.5rem',
            lg: '0.75rem',
            xl: '1rem',
            full: '9999px'
        },
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif', 'Inter var', ...defaultTheme.fontFamily.sans], // verify
            inter: ['Inter', 'sans-serif'],
            Montserrat: ['Montserrat', 'sans-serif']
        },
        fontSize: {
            defaultsize: '0.813rem',
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '3.75rem',
            '7xl': '4.5rem',
            '8xl': '6rem',
            '9xl': '8rem'
        },
        extend: {
            colors: {},
            gradientColorStops: {
                primary: 'rgb(var(--primary))',
                secondary: 'rgb(var(--secondary))',
                success: 'rgb(var(--success))',
                warning: 'rgb(var(--warning))',
                pink: 'rgb(var(--pink))',
                teal: 'rgb(var(--teal))',
                danger: 'rgb(var(--danger))',
                info: 'rgb(var(--info))',
                orange: 'rgb(var(--orange))',
                purple: 'rgb(var(--purple))',
                light: 'rgb(var(--light))',
                dark: 'rgb(var(--dark))'
            },
            linearGradientDirections: {
                'to-right': 'to right'
            },
            linearGradientColors: {
                'primary-to-blue': ['primary 0%', '#0086ed 100%'],
                'secondary-to-blue': ['secondary 0%', '#6789D8 100%'],
                'success-to-blue': ['success 0%', '#00A1C0 100%'],
                'warning-to-blue': ['warning 0%', '#7FA53A 100%'],
                'pink-to-blue': ['pink 0%', '#FFA795 100%'],
                'teal-to-blue': ['teal 0%', '#0695DD 100%'],
                'danger-to-blue': ['danger 0%', '#A34A88 100%'],
                'info-to-blue': ['info 0%', '#52F0CE 100%'],
                'orange-to-blue': ['orange 0%', '#9BA815 100%'],
                'purple-to-blue': ['purple 0%', '#FF496D 100%'],
                'light-to-blue': ['light 0%', '#D1D6DE 100%'],
                'dark-to-blue': ['dark 0%', '#54505D 100%']
            },
            boxShadow: {
                defaultshadow: '0 0.125rem 0 rgba(10, 10, 10, .04)'
            },
            backgroundImage: {
                instagram: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-1': 'linear-gradient(102deg,transparent 41%,primary/50 0)',
                'gradient-1': 'linear-gradient(102deg,light 41%,transparent 0)'
            }
        },
        animation: {
            projects: 'particles 2s linear infinite',
            spin: 'spin 1s linear infinite',
            ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
            pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            bounce: 'bounce 1s infinite',
            bell: 'ring 2s ease-in-out infinite',
            wase: 'wase 4s linear infinite',
            'spin-slow': 'spin 3s linear infinite',
            'slow-ping': 'ping 2s linear infinite',
            'animate-wase': 'wase 4s linear infinite'
        },
        keyframes: {
            particles: {
                '0%': {
                    transform: ' translateY(0) rotate(0)',
                    opacity: 1
                },
                '100%': {
                    transform: 'translateY(-90px) rotate(180deg)',
                    opacity: ' 0'
                }
            },
            pulse: {
                '0%, 100%': {
                    opacity: 1
                },
                '50%': {
                    opacity: 0.5
                }
            },
            ping: {
                '75%, 100%': {
                    transform: 'scale(2)',
                    opacity: '0'
                }
            },
            bounce: {
                '0%, 100% ': {
                    transform: 'translateY(-25%)',
                    ' animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
                },
                '50%': {
                    transform: 'translateY(0)',
                    'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
                }
            },
            ring: {
                '0%': { transform: 'rotateZ(0)' },
                '1%': { transform: 'rotateZ(30deg)' },
                '3%': { transform: 'rotateZ(-28deg)' },
                '5%': { transform: 'rotateZ(34deg)' },
                '7%': { transform: 'rotateZ(-32deg)' },
                '9%': { transform: 'rotateZ(30deg)' },
                '11%': { transform: 'rotateZ(-28deg)' },
                '13%': { transform: 'rotateZ(26deg)' },
                '15%': { transform: 'rotateZ(-24deg)' },
                '17%': { transform: 'rotateZ(22deg)' },
                '19%': { transform: 'rotateZ(-20deg)' },
                '21%': { transform: 'rotateZ(18deg)' },
                '23%': { transform: 'rotateZ(-16deg)' },
                '25%': { transform: 'rotateZ(14deg)' },
                '27%': { transform: 'rotateZ(-12deg)' },
                '29%': { transform: 'rotateZ(10deg)' },
                '31%': { transform: 'rotateZ(-8deg)' },
                '33%': { transform: 'rotateZ(6deg)' },
                '35%': { transform: 'rotateZ(-4deg)' },
                '37%': { transform: 'rotateZ(2deg)' },
                '39%': { transform: 'rotateZ(-1deg)' },
                '41%': { transform: 'rotateZ(1deg)' },
                '43%': { transform: 'rotateZ(0)' },
                '100%': { transform: 'rotateZ(0)' }
            },
            wase: {
                '0%, 100%': { transform: 'rotate(-3deg)' },
                '50%': { transform: 'rotate(3deg)' }
            },
            spin: {
                from: {
                    transform: 'rotate(0deg)'
                },
                to: {
                    transform: 'rotate(360deg)'
                }
            }
        }
    },
    variants: {},
    plugins: [
        require('tailwindcss'),
        require('@tailwindcss/forms'),
        require('tailwind-scrollbar')({ noCompatible: true }), // verify
        require('tailwind-clip-path'), // verify
        require('preline/plugin'),
        plugin(function({ addComponents }) {
            addComponents({
                '.dirrtl': {
                    direction: 'ltr'
                },
                '.dir-rtl': {
                    direction: 'rtl'
                },
                '.dir-ltr': {
                    direction: 'ltr'
                }
            });
        })
    ]
};