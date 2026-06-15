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
      setError(
        err instanceof Error ? err.message : 'Failed to update user'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          required
        />
      </div>

      {/* Plan Field */}
      <div>
        <label htmlFor="plan" className="text-xs font-semibold text-slate-400 uppercase">
          Plan
        </label>
        <select
          id="plan"
          name="plan"
          value={formData.plan}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Status Field */}
      <div>
        <label htmlFor="status" className="text-xs font-semibold text-slate-400 uppercase">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded font-medium transition-colors"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded font-medium transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
