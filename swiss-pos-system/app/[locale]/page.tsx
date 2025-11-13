import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            🍽️ Swiss POS System
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-2">
            Restaurant Point of Sale for Switzerland
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Multi-language • Swiss VAT • TWINT • Table Management
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-green-500 text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Database Ready
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              PostgreSQL schema with complete POS structure
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-blue-500 text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              4 Languages
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              German, French, Italian, English
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-purple-500 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              API Routes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Complete REST API for all operations
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🪑</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Table Management
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  20 tables with floor plan positions
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🍕</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Menu System
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Multi-language menu with modifiers
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">💳</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Payment Processing
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Cash, Card, TWINT, Apple/Google Pay
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Swiss VAT
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  7.7% standard, 2.5% reduced rate
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">👨‍🍳</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Kitchen Display
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Real-time order updates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">👥</span>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Staff Management
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Role-based access control
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Start
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  npm run db:push
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Push database schema
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  npm run db:seed
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Seed with sample data
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  Start building the UI!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  POS, Kitchen, Admin interfaces
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Language
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/de"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
            >
              <span className="text-4xl mb-2">🇩🇪</span>
              <span className="font-semibold">Deutsch</span>
            </Link>

            <Link
              href="/en"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <span className="text-4xl mb-2">🇬🇧</span>
              <span className="font-semibold">English</span>
            </Link>

            <Link
              href="/fr"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all"
            >
              <span className="text-4xl mb-2">🇫🇷</span>
              <span className="font-semibold">Français</span>
            </Link>

            <Link
              href="/it"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
            >
              <span className="text-4xl mb-2">🇮🇹</span>
              <span className="font-semibold">Italiano</span>
            </Link>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium">
              Next.js 14
            </span>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
              TypeScript
            </span>
            <span className="px-4 py-2 bg-teal-600 text-white rounded-full text-sm font-medium">
              PostgreSQL
            </span>
            <span className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium">
              Prisma
            </span>
            <span className="px-4 py-2 bg-cyan-600 text-white rounded-full text-sm font-medium">
              Tailwind CSS
            </span>
            <span className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
              Zustand
            </span>
            <span className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
              next-intl
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p className="mb-2">🇨🇭 Built for Swiss Restaurants</p>
          <p className="text-sm">
            Check{" "}
            <a
              href="https://github.com"
              className="text-blue-600 hover:underline"
            >
              README.md
            </a>{" "}
            for complete documentation
          </p>
        </div>
      </div>
    </div>
  );
}
