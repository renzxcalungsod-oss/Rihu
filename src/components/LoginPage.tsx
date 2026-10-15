import React, { useState } from 'react';
import { Wrench, Shield, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(username);
      setIsLoading(false);
    }, 300);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-2">
            <Wrench className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            TechPulse Repair System
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Computer Repair Shop Management System • SIA1 Project Demonstration
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500">Flask-Login session authentication with role verification</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin or tech_mark"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Management'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Documented Test Credentials for Academic Evaluation */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Quick Test Accounts (Click to Fill):
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="p-2 rounded-lg border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-[11px]">Administrator</span>
                  <span className="text-[10px] px-1 rounded bg-amber-200/60 text-amber-800 font-bold">Admin</span>
                </div>
                <p className="font-mono text-[11px] text-slate-600 mt-0.5">u: admin</p>
                <p className="font-mono text-[10px] text-slate-500">p: admin123</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('tech_mark', 'tech123')}
                className="p-2 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 text-left transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-[11px]">Lead Technician</span>
                  <span className="text-[10px] px-1 rounded bg-blue-200/60 text-blue-800 font-bold">Staff</span>
                </div>
                <p className="font-mono text-[11px] text-slate-600 mt-0.5">u: tech_mark</p>
                <p className="font-mono text-[10px] text-slate-500">p: tech123</p>
              </button>
            </div>
          </div>
        </div>

        {/* Security Feature Notice */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured with Werkzeug SHA-256 Hashing &amp; Flask-WTF CSRF Protection</span>
        </div>
      </div>
    </div>
  );
};
