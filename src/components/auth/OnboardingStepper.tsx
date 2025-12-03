import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, User, FileText, Settings, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingStepperProps {
  onComplete: (data: OnboardingData) => void;
}

interface OnboardingData {
  role: string;
  infoTypes: string[];
  preferences: {
    alerts: boolean;
    summaries: boolean;
    notifications: boolean;
    darkMode: boolean;
  };
}

const steps = [
  { id: 1, title: 'Role', icon: User },
  { id: 2, title: 'Info Type', icon: FileText },
  { id: 3, title: 'Preferences', icon: Settings },
];

const roles = [
  { id: 'individual', label: 'Individual', description: 'Personal fact-checking' },
  { id: 'company_partner', label: 'Company Partner', description: 'Business verification' },
  { id: 'researcher', label: 'Researcher', description: 'Academic research' },
  { id: 'analyst', label: 'Analyst', description: 'Data analysis' },
];

const infoTypes = [
  { id: 'news', label: 'News', description: 'News article verification' },
  { id: 'content', label: 'Content Accuracy', description: 'Social media & web content' },
  { id: 'factcheck', label: 'Fact-Checking', description: 'Claims & statements' },
  { id: 'research', label: 'Research', description: 'Academic sources' },
];

const OnboardingStepper = ({ onComplete }: OnboardingStepperProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedInfoTypes, setSelectedInfoTypes] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    alerts: true,
    summaries: true,
    notifications: false,
    darkMode: false,
  });

  const handleInfoTypeToggle = (id: string) => {
    setSelectedInfoTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        role: selectedRole,
        infoTypes: selectedInfoTypes,
        preferences,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return !!selectedRole;
    if (currentStep === 2) return selectedInfoTypes.length > 0;
    return true;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-primary text-primary-foreground'
                    : currentStep === step.id
                    ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 sm:w-24 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Select Your Role</h3>
              <p className="text-sm text-muted-foreground">Choose the role that best describes you</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <p className="font-medium text-foreground">{role.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{role.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Information Types</h3>
              <p className="text-sm text-muted-foreground">Select what you want to verify (multiple)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {infoTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleInfoTypeToggle(type.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
                    selectedInfoTypes.includes(type.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  {selectedInfoTypes.includes(type.id) && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                  <p className="font-medium text-foreground">{type.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Set Preferences</h3>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'alerts', label: 'Email Alerts', description: 'Get notified about important updates' },
                { key: 'summaries', label: 'Daily Summaries', description: 'Receive daily digest of activities' },
                { key: 'notifications', label: 'Push Notifications', description: 'Browser notifications' },
                { key: 'darkMode', label: 'Dark Mode', description: 'Use dark theme interface' },
              ].map((pref) => (
                <label
                  key={pref.key}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.description}</p>
                  </div>
                  <div
                    onClick={() =>
                      setPreferences((prev) => ({
                        ...prev,
                        [pref.key]: !prev[pref.key as keyof typeof prev],
                      }))
                    }
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      preferences[pref.key as keyof typeof preferences]
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${
                        preferences[pref.key as keyof typeof preferences]
                          ? 'translate-x-5'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
