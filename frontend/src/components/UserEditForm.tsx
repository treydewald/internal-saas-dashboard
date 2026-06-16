import React, { useState } from 'react';

interface UserData {
  id: number;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive';
  role: string;
  usage_percent: number;
  created_at: string;
  last_login?: string;
}

interface UserEditFormProps {
  user: UserData;
  onSave: (updatedUser: Partial<UserData>) => Promise<void>;
  onCancel: () => void;
  onChange: () => void;
}

const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  onSave,
  onCancel,
  onChange,
}) => {
  const [formData, setFormData] = useState({
    name: user.name,
    plan: user.plan,
    status: user.status,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    onChange();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <div className="form-group">
        <label htmlFor="name" className="label-text">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="plan" className="label-text">Plan</label>
        <select id="plan" name="plan" value={formData.plan} onChange={handleChange}>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status" className="label-text">Status</label>
        <select id="status" name="status" value={formData.status} onChange={handleChange}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={saving}
          style={{ opacity: saving ? 0.6 : 1 }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
