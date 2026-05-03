import React from 'react';
import { SimplePage } from './PageHeader';

const DebugForm = () => {
  return (
    <SimplePage title="Form Test" subtitle="Minimal test form for StaticForms verification" breadcrumb="Debug">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-4">StaticForms Minimal Test</h3>
        <p className="text-sm text-slate-600 mb-6">
          This form uses a standard HTML POST submission. If this works, your StaticForms account is correctly configured.
        </p>
        
        <form action="https://api.staticforms.xyz/submit" method="POST" className="space-y-4">
          {/* CRITICAL: StaticForms requires 'apiKey', NOT 'accessKey' */}
          <input type="hidden" name="apiKey" value="sf_3e694c876b011991c79230d8" />
          
          {/* Success Redirect (Optional but helpful) */}
          <input type="hidden" name="redirectTo" value={window.location.href} />
          
          <div className="space-y-2">
            <label className="text-sm font-semibold block">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="John Doe"
              className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003D52]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold block">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="john@example.com"
              className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003D52]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold block">Message</label>
            <textarea 
              name="message" 
              rows="3"
              placeholder="Test message..."
              className="w-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003D52] resize-none"
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="w-full h-12 bg-[#003D52] text-white font-bold rounded-xl hover:bg-[#002A38] transition-colors"
          >
            Send Test Submission
          </button>
        </form>
      </div>
    </SimplePage>
  );
};

export default DebugForm;
