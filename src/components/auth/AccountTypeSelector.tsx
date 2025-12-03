import { User, Building2, Check } from 'lucide-react';

interface AccountTypeSelectorProps {
  value: 'individual' | 'company_partner';
  onChange: (value: 'individual' | 'company_partner') => void;
}

const AccountTypeSelector = ({ value, onChange }: AccountTypeSelectorProps) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Account Type</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange('individual')}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
            value === 'individual'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
          }`}
        >
          {value === 'individual' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
            value === 'individual' ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-primary/10'
          }`}>
            <User className={`w-5 h-5 ${value === 'individual' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
          </div>
          <p className="font-medium text-foreground">Individual</p>
          <p className="text-xs text-muted-foreground mt-0.5">Personal account</p>
        </button>

        <button
          onClick={() => onChange('company_partner')}
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
            value === 'company_partner'
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30'
          }`}
        >
          {value === 'company_partner' && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
            value === 'company_partner' ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-primary/10'
          }`}>
            <Building2 className={`w-5 h-5 ${value === 'company_partner' ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
          </div>
          <p className="font-medium text-foreground">Company</p>
          <p className="text-xs text-muted-foreground mt-0.5">Organization account</p>
        </button>
      </div>
    </div>
  );
};

export default AccountTypeSelector;
