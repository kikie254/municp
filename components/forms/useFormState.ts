"use client";

import { useState } from "react";

export type Errors = Record<string, string>;

export function useDemoForm<T extends Record<string, string>>(initial: T, validate: (v: T) => Errors) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    setErrors((err) => {
      if (!err[key as string]) return err;
      const next = { ...err };
      delete next[key as string];
      return next;
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          document.getElementById("form-preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    } else {
      setSubmitted(false);
      const first = Object.keys(next)[0];
      document.getElementById(first)?.focus();
    }
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setSubmitted(false);
  };

  return { values, errors, submitted, set, onSubmit, reset };
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^(\+?254|0)[\s-]?7\d{2}[\s-]?\d{3}[\s-]?\d{3}$/.test(v.replace(/\s/g, ""));
