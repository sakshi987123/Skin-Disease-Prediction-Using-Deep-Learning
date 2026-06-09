import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../../../../components/ui/Card';
import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { useAuth } from '../../../../contexts/AuthContext';
import { apiService } from '../../../../services/api';
import { useToast } from '../../../../contexts/ToastContext';
import { User, Heart, X, Plus } from 'lucide-react';

const SKIN_TYPES = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [age, setAge] = useState<string>((user as any)?.age?.toString() || '');
  const [skinType, setSkinType] = useState<string>((user as any)?.skinType || '');
  const [allergies, setAllergies] = useState<string[]>((user as any)?.allergies || []);
  const [allergyInput, setAllergyInput] = useState('');
  const [medicalHistory, setMedicalHistory] = useState((user as any)?.medicalHistory || '');

  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      setAllergies(prev => [...prev, trimmed]);
    }
    setAllergyInput('');
  };

  const removeAllergy = (a: string) => setAllergies(prev => prev.filter(x => x !== a));

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiService.updateProfile({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        mobile: mobile || undefined,
        age: age ? Number(age) : undefined,
        skinType: skinType || undefined,
        allergies,
        medicalHistory: medicalHistory || undefined,
      });
      showSuccess('Profile updated', 'Your profile has been saved successfully.');
    } catch {
      showError('Save failed', 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Personal Information</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Your basic account details</p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
              <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
            </div>
            <Input label="Email" type="email" defaultValue={user?.email || ''} disabled />
            <Input label="Phone" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Phone number" />
          </div>
        </CardBody>
      </Card>

      {/* Medical Profile */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Medical Profile</h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            This information helps doctors provide a more accurate assessment of your condition.
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-5 pt-2">
            {/* Age + Skin Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Age</label>
                <input
                  type="number"
                  min={1} max={120}
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Skin Type</label>
                <select
                  value={skinType}
                  onChange={e => setSkinType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Select skin type</option>
                  {SKIN_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Known Allergies</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={allergyInput}
                  onChange={e => setAllergyInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  placeholder="Type allergy and press Enter or +"
                  className="flex-1 px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <Button type="button" onClick={addAllergy} variant="outline" size="sm" className="px-3">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {allergies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {allergies.map(a => (
                    <span key={a} className="flex items-center gap-1.5 px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-xs font-semibold">
                      {a}
                      <button onClick={() => removeAllergy(a)} className="hover:opacity-70">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {allergies.length === 0 && (
                <p className="text-xs text-muted-foreground">No allergies added. Type one above and press Enter.</p>
              )}
            </div>

            {/* Medical History */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Medical History</label>
              <textarea
                value={medicalHistory}
                onChange={e => setMedicalHistory(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Briefly describe any relevant medical history, chronic conditions, or current medications..."
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{medicalHistory.length}/1000</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => window.location.reload()}>Cancel</Button>
        <Button onClick={handleSave} isLoading={saving}>Save Changes</Button>
      </div>
    </div>
  );
};
