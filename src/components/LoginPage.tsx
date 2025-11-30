import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ArrowLeft, Brain, Sparkles, FileText, Zap, Shield } from 'lucide-react';

interface LoginPageProps {
  onBackToLanding: () => void;
  onContinueToChat?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const features = [
    { icon: FileText, text: "Multi-format document support" },
    { icon: Zap, text: "Lightning-fast AI analysis" },
    { icon: Shield, text: "Bank-level security" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-white via-vintage-gray-50 to-vintage-white relative overflow-hidden">
      {/* Enhanced Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-vintage-black/5 via-transparent to-vintage-gray-300/10"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-vintage-black/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-vintage-gray-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-vintage-gray-300/15 rounded-full blur-2xl animate-pulse animation-delay-500"></div>

      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-16 left-8 w-20 h-px bg-gradient-to-r from-vintage-gray-300 to-transparent rotate-45 opacity-60"></div>
        <div className="absolute top-24 right-16 w-28 h-px bg-gradient-to-l from-vintage-gray-300 to-transparent -rotate-45 opacity-50"></div>
        <div className="absolute bottom-32 left-16 w-24 h-px bg-gradient-to-r from-vintage-gray-300 to-transparent rotate-12 opacity-55"></div>
        <div className="absolute bottom-48 right-12 w-32 h-px bg-gradient-to-l from-vintage-gray-300 to-transparent -rotate-12 opacity-45"></div>
      </div>

      {/* Header */}
      <div className="relative z-20 p-6">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-3 text-vintage-black hover:text-vintage-gray-700 transition-all duration-300 group px-4 py-2 rounded-lg hover:bg-vintage-white/50"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      <div className="relative z-20 flex min-h-[calc(100vh-120px)]">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-vintage-black rounded-2xl flex items-center justify-center shadow-vintage-lg">
                  <Brain className="w-8 h-8 text-vintage-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-vintage-black">IntelliRead AI</h2>
                  <p className="text-vintage-gray-600">AI-Powered Document Analysis</p>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-vintage-black mb-6">
                Transform how you work with documents
              </h3>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-vintage-white/60 backdrop-blur-sm rounded-xl border border-vintage-gray-200/50">
                  <div className="w-10 h-10 bg-vintage-black/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-vintage-black" />
                  </div>
                  <span className="text-vintage-black font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-vintage-black/5 to-vintage-gray-300/10 rounded-2xl border border-vintage-gray-200/30">
              <blockquote className="text-vintage-gray-700 italic">
                "This AI platform has revolutionized how I analyze complex documents. The accuracy and speed are incredible."
              </blockquote>
              <cite className="text-vintage-black font-medium mt-2 block">- Research Analyst</cite>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-vintage-black shadow-vintage-lg">
                <Brain className="w-8 h-8 text-vintage-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-vintage-black">IntelliRead AI</h1>
            </div>

            {/* Auth Card */}
            <div className="bg-vintage-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-vintage-gray-200/50 p-8">
              {/* Tab Switcher */}
              <div className="flex rounded-2xl bg-vintage-gray-100/80 p-1.5 mb-8 backdrop-blur-sm">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    !isSignUp
                      ? 'bg-vintage-white text-vintage-black shadow-lg transform scale-105'
                      : 'text-vintage-gray-600 hover:text-vintage-gray-800 hover:bg-vintage-white/50'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isSignUp
                      ? 'bg-vintage-white text-vintage-black shadow-lg transform scale-105'
                      : 'text-vintage-gray-600 hover:text-vintage-gray-800 hover:bg-vintage-white/50'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display font-bold text-vintage-black mb-2">
                  {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="text-vintage-gray-600 text-sm">
                  {isSignUp
                    ? 'Join thousands using AI-powered document analysis'
                    : 'Continue your document analysis journey'
                  }
                </p>
              </div>

              {/* Clerk Auth Components */}
              <div className="space-y-4">
                {isSignUp ? (
                  <SignUp
                    routing="virtual"
                    redirectUrl="/chat"
                    appearance={{
                      variables: {
                        colorPrimary: '#000000',
                        colorBackground: '#ffffff',
                        colorInputBackground: '#f8f9fa',
                        colorInputText: '#000000',
                        colorText: '#000000',
                        borderRadius: '0.75rem'
                      },
                      elements: {
                        formButtonPrimary: 'w-full bg-gradient-to-r from-vintage-black to-vintage-gray-800 hover:from-vintage-gray-800 hover:to-vintage-black text-vintage-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform',
                        card: 'shadow-none border-none bg-transparent p-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'w-full bg-vintage-gray-50 hover:bg-vintage-gray-100 text-vintage-black border-2 border-vintage-gray-200 hover:border-vintage-gray-300 py-4 px-6 rounded-2xl font-medium transition-all duration-300 mb-4 flex items-center justify-center gap-3',
                        formFieldInput: 'w-full px-5 py-4 border-2 border-vintage-gray-200 rounded-2xl bg-vintage-white text-vintage-black placeholder-vintage-gray-500 focus:outline-none focus:ring-4 focus:ring-vintage-black/20 focus:border-vintage-black transition-all duration-300 text-base',
                        footerActionLink: 'text-vintage-black hover:text-vintage-gray-700 font-semibold text-sm',
                        formFieldLabel: 'text-vintage-black font-semibold mb-3 block text-sm',
                        dividerLine: 'bg-gradient-to-r from-transparent via-vintage-gray-300 to-transparent',
                        dividerText: 'text-vintage-gray-600 bg-vintage-white px-4 text-sm font-medium'
                      }
                    }}
                  />
                ) : (
                  <SignIn
                    routing="virtual"
                    redirectUrl="/chat"
                    appearance={{
                      variables: {
                        colorPrimary: '#000000',
                        colorBackground: '#ffffff',
                        colorInputBackground: '#f8f9fa',
                        colorInputText: '#000000',
                        colorText: '#000000',
                        borderRadius: '0.75rem'
                      },
                      elements: {
                        formButtonPrimary: 'w-full bg-gradient-to-r from-vintage-black to-vintage-gray-800 hover:from-vintage-gray-800 hover:to-vintage-black text-vintage-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 transform',
                        card: 'shadow-none border-none bg-transparent p-0',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden',
                        socialButtonsBlockButton: 'w-full bg-vintage-gray-50 hover:bg-vintage-gray-100 text-vintage-black border-2 border-vintage-gray-200 hover:border-vintage-gray-300 py-4 px-6 rounded-2xl font-medium transition-all duration-300 mb-4 flex items-center justify-center gap-3',
                        formFieldInput: 'w-full px-5 py-4 border-2 border-vintage-gray-200 rounded-2xl bg-vintage-white text-vintage-black placeholder-vintage-gray-500 focus:outline-none focus:ring-4 focus:ring-vintage-black/20 focus:border-vintage-black transition-all duration-300 text-base',
                        footerActionLink: 'text-vintage-black hover:text-vintage-gray-700 font-semibold text-sm',
                        formFieldLabel: 'text-vintage-black font-semibold mb-3 block text-sm',
                        dividerLine: 'bg-gradient-to-r from-transparent via-vintage-gray-300 to-transparent',
                        dividerText: 'text-vintage-gray-600 bg-vintage-white px-4 text-sm font-medium'
                      }
                    }}
                  />
                )}
              </div>

              {/* Alternative Toggle */}
              <div className="mt-6 text-center">
                <p className="text-sm text-vintage-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-vintage-black hover:text-vintage-gray-700 font-semibold transition-colors duration-200 underline underline-offset-2"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-vintage-gray-500 max-w-sm mx-auto leading-relaxed">
                🔒 Your data is secure. We use industry-standard encryption and never store your documents permanently.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sparkles */}
      <div className="absolute top-1/4 right-1/4 animate-bounce">
        <Sparkles className="w-8 h-8 text-vintage-gray-400 opacity-40" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-bounce animation-delay-1000">
        <Sparkles className="w-6 h-6 text-vintage-gray-400 opacity-30" />
      </div>
      <div className="absolute top-1/2 right-1/3 animate-bounce animation-delay-500">
        <Sparkles className="w-4 h-4 text-vintage-gray-400 opacity-25" />
      </div>
    </div>
  );
};

export default LoginPage;