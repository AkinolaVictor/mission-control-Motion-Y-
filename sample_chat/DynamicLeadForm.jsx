// DynamicLeadForm — An advanced form engine that renders a wide variety of inputs based on AI-generated configuration.
// Supports hybrid selection (Predefined options + Custom "Other" input) and premium technical styling.

import React, { useState, useEffect } from "react";
import Button from "../primitives/Button";
import cn from "@/utils/cn";

export default function DynamicLeadForm({ config, onSubmit }) {
  const [values, setValues] = useState({});
  const [customValues, setCustomValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (id, value, isCustom = false) => {
    if (isCustom) {
      setCustomValues(prev => ({ ...prev, [id]: value }));
    } else {
      setValues(prev => ({ ...prev, [id]: value }));
    }

    if (errors[id]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    config.fields.forEach(field => {
      const value = values[field.id];
      const customValue = customValues[field.id];

      // If 'other' is selected, the custom value is what counts
      const effectiveValue = (value === 'other') ? customValue : value;

      if (field.required && (!effectiveValue || effectiveValue.trim() === "")) {
        newErrors[field.id] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Merge values: if a field was 'other', use the customValue instead
    const finalSubmission = {};
    config.fields.forEach(field => {
      const val = values[field.id];
      finalSubmission[field.id] = (val === 'other') ? customValues[field.id] : val;
    });

    try {
      await onSubmit(finalSubmission);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = values[field.id] || "";

    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] ml-1">
          {field.label} {field.required && <span className="text-[var(--accent)]">*</span>}
        </label>
        {field.type === "textarea" ? (
          <textarea
            className="w-full p-1.5 rounded-[7px] bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[12px] focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
            rows={3}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        ) : (
          <input
            type="text"
            className="w-full p-1.5 rounded-[7px] bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-[12px] focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="my-4 py-3 px-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[var(--text-primary)] mb-1">{config.title}</h4>
        {config.description && (
          <p className="text-sm text-[var(--text-secondary)]">{config.description}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {config.fields.map(field => (
          <div key={field.id}>
            {renderField(field)}
            {errors[field.id] && (
              <span className="text-[10px] text-red-400 ml-1 mt-1 block">{errors[field.id]}</span>
            )}
          </div>
        ))}

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full py-3 rounded-xl bg-[var(--accent)] text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Details"}
          </Button>
        </div>
      </form>
    </div>
  );
}
