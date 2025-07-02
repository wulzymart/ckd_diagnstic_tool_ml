import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Shield, 
  Users, 
  ArrowRight, 
  Heart,
  Microscope,
  TrendingUp
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced ML Algorithm',
      description: 'Random Forest Classifier trained on comprehensive medical datasets for accurate predictions'
    },
    {
      icon: Microscope,
      title: 'Comprehensive Analysis',
      description: '10 key medical parameters including GFR, creatinine, and electrolyte levels'
    },
    {
      icon: Shield,
      title: 'Evidence-Based',
      description: 'Built on peer-reviewed medical research and validated clinical indicators'
    },
    {
      icon: TrendingUp,
      title: 'Risk Assessment',
      description: 'Detailed risk stratification with personalized recommendations'
    }
  ];

  const parameters = [
    'Serum Creatinine Levels',
    'Glomerular Filtration Rate (GFR)',
    'Blood Urea Nitrogen (BUN)',
    'Systolic Blood Pressure',
    'Fasting Blood Sugar',
    'Protein in Urine',
    'Serum Electrolytes (Sodium)',
    'Symptom Assessment',
    'Socioeconomic Factors'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl">
            <Activity className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-6">
          Kidney Disease
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"> Predictor</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Advanced machine learning tool designed to assess kidney disease risk using comprehensive 
          medical parameters. This predictive model assists healthcare professionals in early detection 
          and risk stratification for chronic kidney disease.
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Start Assessment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
              <feature.icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Medical Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-red-100 rounded-lg mr-4">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">About Chronic Kidney Disease</h2>
          </div>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              Chronic Kidney Disease (CKD) is a progressive condition where kidney function 
              gradually declines over time. Early detection is crucial for effective management 
              and prevention of complications.
            </p>
            <p>
              CKD affects over 850 million people worldwide and is often called a "silent killer" 
              because symptoms may not appear until the disease is advanced. Our predictive model 
              helps identify at-risk patients before symptoms develop.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-amber-800 font-medium">
                ⚠️ Important: This tool is for educational and screening purposes only. 
                Always consult with healthcare professionals for proper diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Assessment Parameters</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Our comprehensive assessment evaluates multiple medical indicators:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {parameters.map((param, index) => (
              <div key={index} className="flex items-center text-slate-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-sm">{param}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Assessment?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Complete our comprehensive medical assessment to receive a detailed risk analysis 
          and personalized recommendations for kidney health management.
        </p>
        <Link
          to="/assessment"
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105"
        >
          Start Assessment Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};