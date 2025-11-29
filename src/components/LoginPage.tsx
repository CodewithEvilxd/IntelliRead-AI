import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ArrowLeft, Brain } from 'lucide-react';

interface LoginPageProps {
  onBackToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen bg-vintage-white flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-16 left-8 w-20 h-px bg-vintage-gray-300 rotate-45 opacity-50"></div>
        <div className="absolute top-24 right-16 w-28 h-px bg-vintage-gray-300 -rotate-45 opacity-40"></div>
        <div className="absolute top-40 left-1/4 w-16 h-px bg-vintage-gray-300 rotate-12 opacity-35"></div>
        <div className="absolute bottom-32 left-16 w-24 h-px bg-vintage-gray-300 rotate-12 opacity-45"></div>
        <div className="absolute bottom-48 right-12 w-32 h-px bg-vintage-gray-300 -rotate-12 opacity-40"></div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-vintage-black hover:text-vintage-gray-700 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-vintage-black shadow-vintage">
            <Brain className="w-8 h-8 text-vintage-white" />
          </div>
          <h1 className="text-2xl font-display font-bold text-vintage-black mb-2">
            Welcome to IntelliRead AI
          </h1>
          <p className="text-vintage-gray-600">
            Sign in to access your chat history and personalized experience
          </p>
        </div>

        {/* Clerk Auth Components */}
        <div className="bg-vintage-white rounded-2xl shadow-vintage-lg border border-vintage-gray-200 p-6">
          <SignIn
            routing="path"
            path="/login"
            redirectUrl="/chat"
            appearance={{
              variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorInputBackground: '#f8f9fa',
                colorInputText: '#000000',
                colorText: '#000000',
                borderRadius: '0.5rem'
              },
              elements: {
                formButtonPrimary: 'bg-vintage-black hover:bg-vintage-gray-800 text-vintage-white',
                card: 'shadow-none border-none bg-transparent',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-vintage-gray-100 hover:bg-vintage-gray-200 text-vintage-black border border-vintage-gray-300',
                formFieldInput: 'border-vintage-gray-300 focus:border-vintage-black focus:ring-vintage-black',
                footerActionLink: 'text-vintage-black hover:text-vintage-gray-700',
                dividerLine: 'bg-vintage-gray-300',
                dividerText: 'text-vintage-gray-600'
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-vintage-gray-500">
            Don't have an account?{' '}
            <button
              onClick={() => window.location.href = '/login#sign-up'}
              className="text-vintage-black hover:text-vintage-gray-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Sign Up Modal/Overlay */}
      {window.location.hash === '#sign-up' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-vintage-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-vintage-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-vintage-black">Create Account</h2>
                <button
                  onClick={() => window.location.hash = ''}
                  className="p-2 rounded-lg hover:bg-vintage-gray-100"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <SignUp
                routing="path"
                path="/login"
                redirectUrl="/chat"
                appearance={{
                  variables: {
                    colorPrimary: '#000000',
                    colorBackground: '#ffffff',
                    colorInputBackground: '#f8f9fa',
                    colorInputText: '#000000',
                    colorText: '#000000',
                    borderRadius: '0.5rem'
                  },
                  elements: {
                    formButtonPrimary: 'bg-vintage-black hover:bg-vintage-gray-800 text-vintage-white',
                    card: 'shadow-none border-none bg-transparent',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'bg-vintage-gray-100 hover:bg-vintage-gray-200 text-vintage-black border border-vintage-gray-300',
                    formFieldInput: 'border-vintage-gray-300 focus:border-vintage-black focus:ring-vintage-black',
                    footerActionLink: 'text-vintage-black hover:text-vintage-gray-700'
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;