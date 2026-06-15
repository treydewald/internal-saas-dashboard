import React, { useState } from "react";
import { ScheduleSelector } from "./ScheduleSelector";

interface ReportBuilderProps {
  onSubmit: (data: any) => void;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    report_type: "kpis",
    export_format: "pdf",
    include_charts: true,
    schedule_type: "weekly",
    schedule_config: { cron: "", timezone: "UTC" },
    recipient_emails: [""],
    delivery_method: "email",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.recipient_emails];
    newEmails[index] = value;
    setFormData((prev) => ({ ...prev, recipient_emails: newEmails }));
  };

  const addEmailField = () => {
    setFormData((prev) => ({
      ...prev,
      recipient_emails: [...prev.recipient_emails, ""],
    }));
  };

  const removeEmailField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recipient_emails: prev.recipient_emails.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Report name is required";
    }

    if (formData.recipient_emails.some((email) => !email.trim())) {
      newErrors.recipient_emails = "All email fields must be filled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Create Scheduled Report</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Report Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                errors.name ? "border-red-500" : "border-slate-300 dark:border-slate-600"
              }`}
              placeholder="e.g., Weekly KPI Report"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Report Type
            </label>
            <select
              name="report_type"
              value={formData.report_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="kpis">KPI Summary</option>
              <option value="users">Users Report</option>
              <option value="api_logs">API Logs</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            rows={3}
            placeholder="Optional description for this report"
          />
        </div>

        {/* Report Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Export Format
            </label>
            <select
              name="export_format"
              value={formData.export_format}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="include_charts"
              checked={formData.include_charts}
              onChange={handleInputChange}
              className="h-4 w-4 text-cyan-500 rounded"
            />
            <label className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">Include Charts</label>
          </div>
        </div>

        {/* Schedule Configuration */}
        <ScheduleSelector
          scheduleType={formData.schedule_type}
          scheduleConfig={formData.schedule_config}
          onScheduleChange={(type, config) =>
            setFormData((prev) => ({
              ...prev,
              schedule_type: type,
              schedule_config: config,
            }))
          }
        />

        {/* Recipient Emails */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Recipient Email Addresses *
          </label>
          {formData.recipient_emails.map((email, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                  errors.recipient_emails ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                }`}
                placeholder="email@example.com"
              />
              {formData.recipient_emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEmailField(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {errors.recipient_emails && <p className="text-red-500 text-sm mt-1">{errors.recipient_emails}</p>}
          <button
            type="button"
            onClick={addEmailField}
            className="mt-2 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500"
          >
            Add Another Email
          </button>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium"
          >
            Create Report
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
