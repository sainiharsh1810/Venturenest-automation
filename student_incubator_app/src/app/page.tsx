"use client";

import React, { useState } from "react";
import { 
  Home, 
  UploadCloud, 
  Sparkles, 
  FileCheck, 
  TrendingUp, 
  UserCheck, 
  Plus, 
  Send, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  MessageSquare,
  X,
  FileText
} from "lucide-react";

export default function StudentIncubatorApp() {
  const [tab, setTab] = useState<"home" | "vault" | "intake" | "studio" | "financials" | "mentors">("home");
  
  // App state
  const [project, setProject] = useState({
    name: "EcoPack AI",
    stage: "Seed Round",
    readiness_score: 82,
    problem: "Sustainable packaging pricing is opaque for SMB e-commerce retailers.",
    audience: "D2C E-commerce Brands"
  });

  const [documents, setDocuments] = useState([
    { id: "d1", title: "EcoPack_PitchDeck_v1.pdf", type: "pdf", size: "2.4 MB", date: "Today", status: "Uploaded" },
    { id: "d2", title: "Executive_Summary_Brief.docx", type: "docx", size: "1.1 MB", date: "Yesterday", status: "Approved" }
  ]);

  const [newDocTitle, setNewDocTitle] = useState("");
  const [showUploadSheet, setShowUploadSheet] = useState(false);

  // Artifact Studio State
  const [artifactState, setArtifactState] = useState<"draft" | "in_review" | "approved">("draft");
  const [artifactVersion, setArtifactVersion] = useState(1);

  // Financial Planner State
  const [monthlyRevenue, setMonthlyRevenue] = useState(12000);
  const [monthlyCost, setMonthlyCost] = useState(8500);
  const [cashBalance, setCashBalance] = useState(45000);

  // AI Chat Assistant Drawer
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { sender: "AI Advisor", text: "Welcome Alex! I can help generate your business plan sections or calculate runway." }
  ]);

  // Mentors Request State
  const [mentorRequestSubmitted, setMentorRequestSubmitted] = useState(false);
  const [helpDescription, setHelpDescription] = useState("");

  const runwayMonths = Math.max(0, Math.round(cashBalance / Math.max(1, (monthlyCost - monthlyRevenue))));

  const handleDocumentUpload = () => {
    if (!newDocTitle) return;
    const doc = {
      id: `d_${Date.now()}`,
      title: newDocTitle.endsWith(".pdf") ? newDocTitle : `${newDocTitle}.pdf`,
      type: "pdf",
      size: "1.8 MB",
      date: "Just now",
      status: "Uploaded"
    };
    setDocuments([doc, ...documents]);
    setNewDocTitle("");
    setShowUploadSheet(false);

    // Call Backend API
    fetch("http://localhost:8000/api/student-app/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: "p1",
        title: doc.title,
        file_type: "pdf",
        file_url: `https://storage.venturenest.com/docs/${doc.title}`,
        file_size_bytes: 1800000,
        tags: ["mobile_upload"]
      })
    }).catch(() => console.log("Document upload saved locally"));
  };

  const handleSendMessage = () => {
    if (!chatInput) return;
    const userMsg = { sender: "You", text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const inputCopy = chatInput;
    setChatInput("");

    // Call AI Chatbot Service
    fetch("http://localhost:8001/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_role: "student_incubator", query: inputCopy })
    })
      .then(res => res.json())
      .then(data => {
        setChatMessages(prev => [...prev, { sender: "AI Advisor", text: data.reply }]);
      })
      .catch(() => {
        setChatMessages(prev => [
          ...prev, 
          { sender: "AI Advisor", text: `I reviewed your query regarding "${inputCopy}". Focus on validating your unit economics with your mentor.` }
        ]);
      });
  };

  return (
    <div className="flex flex-col h-full bg-[#0B192C] text-slate-100 relative">
      {/* Mobile Top Header */}
      <header className="px-5 py-4 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-[#008B8B] flex items-center justify-center font-bold text-xs text-white">
            VN
          </div>
          <div>
            <h1 className="font-bold text-sm leading-none text-slate-100">{project.name}</h1>
            <span className="text-[10px] text-[#14B8A6] font-medium">Student Mobile App</span>
          </div>
        </div>

        <button 
          onClick={() => setShowAiDrawer(true)}
          className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 animate-pulse"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Assistant</span>
        </button>
      </header>

      {/* Main Scrollable Mobile Body */}
      <main className="flex-1 overflow-y-auto p-5 pb-24 space-y-6">
        
        {/* VIEW 1: HOME */}
        {tab === "home" && (
          <div className="space-y-6">
            {/* Readiness Card */}
            <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#008B8B]/10 rounded-full blur-xl"></div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Venture Readiness</span>
                  <h2 className="text-xl font-extrabold text-white mt-1">{project.name}</h2>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#008B8B] flex items-center justify-center font-extrabold text-sm text-[#D4AF37] bg-slate-900">
                  {project.readiness_score}%
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Pitch Deck Upload</span>
                  <span className="text-emerald-400 font-bold">Completed</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Business Plan Draft</span>
                  <span className="text-amber-400 font-bold">{artifactState.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Mentor Review Request</span>
                  <span className="text-indigo-400 font-bold">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowUploadSheet(true)}
                className="p-4 bg-[#1E293B] border border-slate-700 rounded-xl flex flex-col items-center justify-center text-center hover:border-[#008B8B] transition"
              >
                <UploadCloud className="w-6 h-6 text-[#008B8B] mb-2" />
                <span className="text-xs font-bold text-slate-200">Submit Document</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Pitch deck or PDF</span>
              </button>

              <button 
                onClick={() => setTab("studio")}
                className="p-4 bg-[#1E293B] border border-slate-700 rounded-xl flex flex-col items-center justify-center text-center hover:border-[#008B8B] transition"
              >
                <FileCheck className="w-6 h-6 text-[#D4AF37] mb-2" />
                <span className="text-xs font-bold text-slate-200">Artifact Studio</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Review AI Draft v{artifactVersion}</span>
              </button>
            </div>

            {/* Document Snapshot */}
            <div className="bg-[#1E293B] border border-slate-700 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Submitted Vault Files</h3>
                <button onClick={() => setTab("vault")} className="text-xs text-[#14B8A6] font-semibold">View All</button>
              </div>

              {documents.slice(0, 2).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-900/60 rounded-lg text-xs">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-4 h-4 text-[#008B8B]" />
                    <div>
                      <p className="font-semibold text-slate-200">{doc.title}</p>
                      <p className="text-[10px] text-slate-500">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: VAULT */}
        {tab === "vault" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Document Submission Vault</h2>
                <p className="text-xs text-slate-400">Upload pitch decks & files for incubator & mentors.</p>
              </div>
              <button 
                onClick={() => setShowUploadSheet(true)}
                className="bg-[#008B8B] text-white p-2 rounded-lg text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-[#1E293B] border border-slate-700 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-[#008B8B]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{doc.title}</h4>
                      <p className="text-xs text-slate-400">{doc.size} • {doc.date}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: INTAKE */}
        {tab === "intake" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Guided Project Intake</h2>
              <p className="text-xs text-slate-400">Capture core assumptions driving your AI business artifacts.</p>
            </div>

            <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Startup Venture Name</label>
                <input 
                  type="text" 
                  value={project.name}
                  onChange={(e) => setProject({...project, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#008B8B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target Customer Problem</label>
                <textarea 
                  rows={3}
                  value={project.problem}
                  onChange={(e) => setProject({...project, problem: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#008B8B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">Target Audience</label>
                <input 
                  type="text" 
                  value={project.audience}
                  onChange={(e) => setProject({...project, audience: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#008B8B]"
                />
              </div>

              <button 
                onClick={() => setTab("studio")}
                className="w-full bg-[#008B8B] text-white py-3 rounded-lg text-sm font-bold shadow-lg flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Business Plan</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: STUDIO */}
        {tab === "studio" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Artifact Studio</h2>
                <p className="text-xs text-slate-400">Explicit Approval Workflow (Draft v{artifactVersion})</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                artifactState === "approved" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
              }`}>
                {artifactState.toUpperCase()}
              </span>
            </div>

            {/* Document Content */}
            <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-base border-b border-slate-700 pb-2">Executive Business Plan</h3>
              
              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <h4 className="font-bold text-[#14B8A6] uppercase text-[10px] tracking-wider mb-1">1. Problem Statement</h4>
                  <p className="bg-slate-900 p-3 rounded-lg">{project.problem}</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#14B8A6] uppercase text-[10px] tracking-wider mb-1">2. Market Solution</h4>
                  <p className="bg-slate-900 p-3 rounded-lg">AI-powered automated sustainable packaging pricing & supplier matching engine for D2C brands.</p>
                </div>

                <div>
                  <h4 className="font-bold text-[#14B8A6] uppercase text-[10px] tracking-wider mb-1">3. Financial Traction</h4>
                  <p className="bg-slate-900 p-3 rounded-lg">5 pilot retail accounts signed with ${monthlyRevenue} MRR.</p>
                </div>
              </div>

              {/* Explicit Approval Action Bar */}
              <div className="pt-4 border-t border-slate-700 flex space-x-3">
                {artifactState !== "approved" ? (
                  <button 
                    onClick={() => setArtifactState("approved")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-lg text-xs font-bold shadow flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve Version {artifactVersion}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setArtifactVersion(prev => prev + 1);
                      setArtifactState("draft");
                    }}
                    className="flex-1 bg-slate-800 text-slate-200 py-2.5 rounded-lg text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Request AI Revision v{artifactVersion + 1}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: FINANCIALS */}
        {tab === "financials" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Financial Runway Calculator</h2>
              <p className="text-xs text-slate-400">Interactive assumption sliders & scenario forecast.</p>
            </div>

            {/* Runway Result Card */}
            <div className="bg-gradient-to-br from-[#1E293B] to-[#0B192C] border border-[#008B8B] p-5 rounded-2xl text-center space-y-2 shadow-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase">Estimated Cash Runway</span>
              <p className="text-4xl font-extrabold text-[#D4AF37]">{runwayMonths} Months</p>
              <span className="text-xs text-slate-400 block">Based on ${monthlyCost - monthlyRevenue}/mo net cash burn</span>
            </div>

            {/* Assumptions Sliders */}
            <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Monthly Revenue</span>
                  <span className="text-[#14B8A6] font-mono">${monthlyRevenue.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50000" 
                  step="1000"
                  value={monthlyRevenue} 
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full accent-[#008B8B]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Monthly Operating Cost</span>
                  <span className="text-rose-400 font-mono">${monthlyCost.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="50000" 
                  step="500"
                  value={monthlyCost} 
                  onChange={(e) => setMonthlyCost(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Available Cash Reserve</span>
                  <span className="text-[#D4AF37] font-mono">${cashBalance.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="5000" 
                  max="200000" 
                  step="5000"
                  value={cashBalance} 
                  onChange={(e) => setCashBalance(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: MENTORS */}
        {tab === "mentors" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Mentor Advisory Bridge</h2>
              <p className="text-xs text-slate-400">Connect with assigned incubator mentors & request reviews.</p>
            </div>

            <div className="bg-[#1E293B] border border-slate-700 p-5 rounded-xl space-y-4">
              <div className="flex items-center space-x-3 border-b border-slate-700 pb-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                  SC
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Dr. Sarah Chen</h3>
                  <p className="text-xs text-indigo-400 font-medium">Assigned Lead Mentor • FinTech & Operations</p>
                </div>
              </div>

              {mentorRequestSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg text-center space-y-1">
                  <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-emerald-300">Help Request Submitted!</p>
                  <p className="text-[10px] text-slate-400">Dr. Sarah Chen will review your pitch deck in the Mentors App.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-400 block">Describe Your Problem or Request</label>
                  <textarea 
                    rows={3}
                    placeholder="E.g., We need guidance on validating our customer acquisition cost (CAC)..."
                    value={helpDescription}
                    onChange={(e) => setHelpDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#008B8B]"
                  />
                  <button 
                    onClick={() => setMentorRequestSubmitted(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-bold shadow flex items-center justify-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request to Mentors App</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Upload Sheet Modal */}
      {showUploadSheet && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex items-end">
          <div className="w-full bg-[#1E293B] border-t border-slate-700 rounded-t-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-sm text-slate-100">Submit Document to Vault</h3>
              <button onClick={() => setShowUploadSheet(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Document File Name</label>
              <input 
                type="text" 
                placeholder="EcoPack_PitchDeck_v2.pdf"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-[#008B8B]"
              />
            </div>

            <button 
              onClick={handleDocumentUpload}
              className="w-full bg-[#008B8B] text-white py-3 rounded-lg text-xs font-bold shadow flex items-center justify-center space-x-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Confirm File Upload</span>
            </button>
          </div>
        </div>
      )}

      {/* AI Assistant Drawer Modal */}
      {showAiDrawer && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-40 flex flex-col">
          <div className="px-5 py-4 bg-[#1E293B] border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-100">AI Startup Co-Founder</h3>
            </div>
            <button onClick={() => setShowAiDrawer(false)}><X className="w-5 h-5 text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl text-xs max-w-[85%] ${
                  msg.sender === "You" 
                    ? "bg-[#008B8B] text-white ml-auto" 
                    : "bg-slate-800 text-slate-200 border border-slate-700 mr-auto"
                }`}
              >
                <p className="font-bold text-[10px] opacity-75 mb-0.5">{msg.sender}</p>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#1E293B] border-t border-slate-700 flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Ask AI for advice or plan edits..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#008B8B]"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-[#008B8B] p-2 rounded-lg text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="h-16 bg-[#1E293B] border-t border-slate-700 fixed bottom-0 left-0 right-0 max-w-md mx-auto flex items-center justify-around z-20">
        <button 
          onClick={() => setTab("home")}
          className={`flex flex-col items-center justify-center w-12 py-1 ${tab === "home" ? "text-[#008B8B]" : "text-slate-400"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Home</span>
        </button>

        <button 
          onClick={() => setTab("vault")}
          className={`flex flex-col items-center justify-center w-12 py-1 ${tab === "vault" ? "text-[#008B8B]" : "text-slate-400"}`}
        >
          <UploadCloud className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Vault</span>
        </button>

        <button 
          onClick={() => setTab("intake")}
          className={`flex flex-col items-center justify-center w-12 py-1 ${tab === "intake" ? "text-[#008B8B]" : "text-slate-400"}`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Intake</span>
        </button>

        <button 
          onClick={() => setTab("studio")}
          className={`flex flex-col items-center justify-center w-12 py-1 ${tab === "studio" ? "text-[#008B8B]" : "text-slate-400"}`}
        >
          <FileCheck className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Studio</span>
        </button>

        <button 
          onClick={() => setTab("financials")}
          className={`flex flex-col items-center justify-center w-12 py-1 ${tab === "financials" ? "text-[#008B8B]" : "text-slate-400"}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Finance</span>
        </button>

        <button 
          onClick={() => setTab("mentors")}
          className={`flex flex-col items-center justify-center w-12 py-1 ${tab === "mentors" ? "text-[#008B8B]" : "text-slate-400"}`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[9px] font-semibold mt-1">Mentors</span>
        </button>
      </nav>
    </div>
  );
}
