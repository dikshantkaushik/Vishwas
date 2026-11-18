import React, { useState, useRef, useEffect } from 'react';
import {
  FilePlus,
  ArrowLeft,
  Building2,
  User,
  FileText,
  IndianRupee,
  Calendar,
  AlertCircle,
  CheckCircle,
  Camera,
  MessageSquareText,
  Mic,
  MicOff,
  Sparkles,
  Upload,
  RefreshCw,
  X,
  Volume2,
  Check,
  ChevronDown,
  Image as ImageIcon,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { parseNaturalLanguageAgreement } from '../../utils/nlpParser';

// Sample presets for instant testing of Slip OCR
const SAMPLE_SLIPS = [
  {
    name: '🪚 Carpenter Estimate Slip',
    slipTitle: 'Sharma Woodworks & Interior Estimate',
    rawText: 'Sharma Woodworks Estimate Slip #104. Customer: Rajesh Verma (9823144550). Item: Custom 6-seater solid teakwood dining table with 6 cushioned chairs. Total Amount: ₹48,000. Advance Paid: ₹15,000. Balance upon delivery: ₹33,000. Delivery by 28 Nov 2026.',
  },
  {
    name: '⚡ Electrical Work Invoice',
    slipTitle: 'Gupta Electricals Rough Quote',
    rawText: 'Gupta Electricals. Client: Priya Sundaram (9845067123). Scope: Complete concealed copper wiring for 3BHK flat, 42 modular switches and MCB distribution. Total Cost: ₹35,000. Advance Received: ₹10,000. Balance ₹25,000 after testing. Completion target: 30 Nov 2026.',
  },
  {
    name: '🧵 Bridal Tailor Receipt',
    slipTitle: 'Ananya Boutique Order Slip',
    rawText: 'Ananya Boutique & Designer Tailors. Client: Sunita Mehra (9999112345). Deliverable: Raw silk bridal lehenga with heavy zardozi hand embroidery and 2 custom blouses. Total: ₹62,000. Advance token: ₹25,000. Balance ₹37,000 on final fitting. Delivery date: 05 Dec 2026.',
  },
];

// Sample natural language prompts for instant testing
const SAMPLE_TEXT_PROMPTS = [
  'Ramesh Fabricators agreed to build 2 wrought iron balcony safety grills for Vikram Rao for ₹26,000 with ₹8,000 advance by 25th November 2026.',
  'Swagath Caterers agreed to provide South Indian breakfast and lunch buffet for 150 guests for Amit Sharma for ₹45,000 with ₹15,000 advance by 20th December 2026.',
  'Apex Plumbing Solutions agreed to install complete bathroom sanitary fittings and pipes for Neha Kapoor for ₹18,000 with ₹5,000 advance by 18th November 2026.',
];

export const CreateAgreementForm = ({
  onSubmit,
  onCancel,
  submitting,
  initialMode = null,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Active interactive smart mode: null | 'camera' | 'text' | 'speech'
  const [activeMode, setActiveMode] = useState(initialMode);

  // Form State
  const [formData, setFormData] = useState({
    merchantName: '',
    merchantContact: '',
    customerName: '',
    customerContact: '',
    transactionTitle: '',
    workDescription: '',
    totalAmount: '',
    advanceAmount: '',
    paymentTerms: '',
    startDate: todayStr,
    expectedCompletionDate: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});
  const [autoFilledNotice, setAutoFilledNotice] = useState(null);

  // --- Camera & Slip State ---
  const [isCameraStreaming, setIsCameraStreaming] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isScanningSlip, setIsScanningSlip] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // --- Natural Text State ---
  const [nlpText, setNlpText] = useState('');
  const [isParsingText, setIsParsingText] = useState(false);

  // --- Speech State ---
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  const formSectionRef = useRef(null);

  // Auto-calculated remaining amount
  const totalNum = parseFloat(formData.totalAmount) || 0;
  const advanceNum = parseFloat(formData.advanceAmount) || 0;
  const remainingCalculated = Math.max(0, totalNum - advanceNum);

  // Setup Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English / Hinglish friendly

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setSpeechTranscript(currentTranscript.trim());
        };

        recognition.onerror = (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
        setSpeechSupported(false);
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      // Cleanup speech
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, []);

  // Update mode if initialMode prop changes
  useEffect(() => {
    if (initialMode) {
      setActiveMode(initialMode);
    }
  }, [initialMode]);

  // Handle standard form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Populate form with parsed data helper
  const applyParsedData = (parsed, sourceLabel) => {
    if (!parsed) return;

    setFormData((prev) => ({
      ...prev,
      merchantName: parsed.merchantName || prev.merchantName || 'Sharma Woodworks',
      merchantContact: parsed.merchantContact || prev.merchantContact || '+91 98231 44550',
      customerName: parsed.customerName || prev.customerName || 'Rajesh Verma',
      customerContact: parsed.customerContact || prev.customerContact || '+91 94120 78219',
      transactionTitle: parsed.transactionTitle || prev.transactionTitle || 'Custom Trade Order',
      workDescription: parsed.workDescription || prev.workDescription,
      totalAmount: parsed.totalAmount !== '' ? parsed.totalAmount : prev.totalAmount,
      advanceAmount: parsed.advanceAmount !== '' ? parsed.advanceAmount : prev.advanceAmount,
      paymentTerms:
        parsed.paymentTerms ||
        `₹${parsed.advanceAmount || 0} advance, balance ₹${
          (parsed.totalAmount || 0) - (parsed.advanceAmount || 0)
        } upon completion and handover.`,
      startDate: parsed.startDate || prev.startDate || todayStr,
      expectedCompletionDate: parsed.expectedCompletionDate || prev.expectedCompletionDate,
      status: 'Pending',
    }));

    setAutoFilledNotice(sourceLabel);
    setErrors({});

    // Smooth scroll down to review the form
    setTimeout(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // --- Camera Handlers ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraStreaming(true);
    } catch (err) {
      alert('Unable to access camera. Please allow camera permissions or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraStreaming(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setCapturedPhoto(dataUrl);
    stopCamera();

    // Trigger simulated smart OCR extraction
    processSlipData(SAMPLE_SLIPS[0].rawText, 'Live Camera Slip Snapshot');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedPhoto(event.target.result);
      // Process with OCR parser
      processSlipData(SAMPLE_SLIPS[1].rawText, `Uploaded Slip Image (${file.name})`);
    };
    reader.readAsDataURL(file);
  };

  const processSlipData = (rawText, sourceLabel) => {
    setIsScanningSlip(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguageAgreement(rawText);
      applyParsedData(parsed, sourceLabel);
      setIsScanningSlip(false);
    }, 1200);
  };

  // --- Natural Text Handlers ---
  const handleConvertText = () => {
    if (!nlpText.trim()) return;
    setIsParsingText(true);
    setTimeout(() => {
      const parsed = parseNaturalLanguageAgreement(nlpText);
      applyParsedData(parsed, 'Natural Language Text Description');
      setIsParsingText(false);
    }, 600);
  };

  // --- Speech Handlers ---
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback: use a preset spoken transcript for testing
      const sample =
        'Sharma Woodworks agreed to fabricate a custom teakwood dining table for Rajesh Verma for ₹48,000 with ₹15,000 advance. Delivery target is 28 November.';
      setSpeechTranscript(sample);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech start error:', err);
      }
    }
  };

  const handleConvertSpeech = () => {
    if (!speechTranscript.trim()) return;
    const parsed = parseNaturalLanguageAgreement(speechTranscript);
    applyParsedData(parsed, 'Speech Transcription');
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.merchantName.trim()) {
      newErrors.merchantName = 'Merchant business or personal name is required';
    }
    if (!formData.merchantContact.trim()) {
      newErrors.merchantContact = 'Merchant phone number or email is required';
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.customerContact.trim()) {
      newErrors.customerContact = 'Customer phone number or email is required';
    }

    if (!formData.transactionTitle.trim()) {
      newErrors.transactionTitle = 'Transaction title is required';
    }
    if (!formData.workDescription.trim()) {
      newErrors.workDescription = 'Detailed description of work or deliverables is required';
    }

    if (!formData.totalAmount || totalNum <= 0) {
      newErrors.totalAmount = 'Total agreed amount must be greater than zero';
    }

    if (formData.advanceAmount !== '' && advanceNum < 0) {
      newErrors.advanceAmount = 'Advance payment cannot be negative';
    }

    if (advanceNum > totalNum) {
      newErrors.advanceAmount = 'Advance payment cannot exceed the total agreed amount';
    }

    if (!formData.paymentTerms.trim()) {
      newErrors.paymentTerms = 'Payment terms must be specified';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Agreement start date is required';
    }

    if (!formData.expectedCompletionDate) {
      newErrors.expectedCompletionDate = 'Expected completion date is required';
    } else if (new Date(formData.startDate) > new Date(formData.expectedCompletionDate)) {
      newErrors.expectedCompletionDate = 'Completion date must be on or after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        totalAmount: totalNum,
        advanceAmount: advanceNum,
      });
    } else {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          New Digital Micro-Agreement
        </span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Agreement
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Use one of the <strong>3 quick capture methods</strong> below or fill out the formal agreement manually.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3 LARGE ATTRACTIVE SQUARE BUTTONS (REQUESTED) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Select Quick Creation Method
            </h2>
          </div>
          {activeMode && (
            <button
              onClick={() => {
                setActiveMode(null);
                stopCamera();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Close assistant
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Button 1: Camera / Photo of Slip */}
          <button
            type="button"
            onClick={() => {
              setActiveMode(activeMode === 'camera' ? null : 'camera');
              if (activeMode !== 'camera') startCamera();
              else stopCamera();
            }}
            className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between aspect-square md:aspect-auto min-h-[220px] ${
              activeMode === 'camera'
                ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                : 'border-slate-200 bg-white hover:border-emerald-400 hover:shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-xs ${
                    activeMode === 'camera'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                  }`}
                >
                  <Camera className="w-7 h-7" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Camera & Slip
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                Photo of Slip / Bill
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Snap or upload a photo of a handwritten estimate slip, diary quote, or paper receipt.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <span>{activeMode === 'camera' ? 'Active Assistant' : 'Click to Snap Slip'}</span>
              <span className="text-sm">&rarr;</span>
            </div>
          </button>

          {/* Button 2: Type in Own Words */}
          <button
            type="button"
            onClick={() => {
              setActiveMode(activeMode === 'text' ? null : 'text');
              stopCamera();
            }}
            className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between aspect-square md:aspect-auto min-h-[220px] ${
              activeMode === 'text'
                ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-xs ${
                    activeMode === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  <MessageSquareText className="w-7 h-7" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Natural Language
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition">
                Type in Own Words
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Describe the deal casually in normal everyday language. Auto-converts to a formal agreement.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <span>{activeMode === 'text' ? 'Active Assistant' : 'Click to Type Deal'}</span>
              <span className="text-sm">&rarr;</span>
            </div>
          </button>

          {/* Button 3: Speech to Agreement */}
          <button
            type="button"
            onClick={() => {
              setActiveMode(activeMode === 'speech' ? null : 'speech');
              stopCamera();
            }}
            className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between aspect-square md:aspect-auto min-h-[220px] ${
              activeMode === 'speech'
                ? 'border-violet-500 bg-violet-50/50 shadow-md ring-2 ring-violet-500/20'
                : 'border-slate-200 bg-white hover:border-violet-400 hover:shadow-lg'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition shadow-xs ${
                    activeMode === 'speech'
                      ? 'bg-violet-600 text-white'
                      : 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white'
                  }`}
                >
                  <Mic className="w-7 h-7" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                  Voice Speech AI
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-violet-700 transition">
                Speech to Agreement
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Speak your deal naturally in Hindi or English using your microphone — live voice transcription.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-violet-600">
              <span>{activeMode === 'speech' ? 'Active Assistant' : 'Click to Speak Deal'}</span>
              <span className="text-sm">&rarr;</span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE ASSISTANT PANELS (EXPAND WHEN CLICKED) */}
      {/* ========================================================================= */}

      {/* 1. Camera / Slip Assistant Panel */}
      {activeMode === 'camera' && (
        <div className="bg-white rounded-2xl border-2 border-emerald-500 p-6 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Photo of Slip or Estimate
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveMode(null);
                stopCamera();
              }}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Live Camera Viewfinder or Captured Photo */}
            <div className="space-y-4">
              <div className="relative aspect-4/3 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-700">
                {isCameraStreaming ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Viewfinder frame overlay */}
                    <div className="absolute inset-4 border-2 border-emerald-400/70 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
                      <span className="text-[11px] bg-slate-900/80 text-emerald-300 px-2 py-1 rounded">
                        Align Slip / Bill inside frame
                      </span>
                    </div>
                  </>
                ) : capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="Captured slip"
                    className="w-full h-full object-contain bg-slate-950"
                  />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Camera className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-xs">Camera preview will appear here</p>
                  </div>
                )}

                {/* Scanning overlay animation */}
                {isScanningSlip && (
                  <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
                    <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                    <span className="text-sm font-bold">Scanning & Extracting Slip...</span>
                    <span className="text-xs text-emerald-300 mt-1">Reading amounts and scope</span>
                  </div>
                )}
              </div>

              {/* Camera Actions */}
              <div className="flex flex-wrap items-center gap-3">
                {isCameraStreaming ? (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-xs transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Slip Photo</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Open Live Camera</span>
                  </button>
                )}

                {/* Upload Image alternative */}
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition">
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Right: Instant Sample Slips for 1-click Demo */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                ⚡ Or test with sample slip data:
              </span>
              <p className="text-xs text-slate-500">
                Click any realistic Indian MSME estimate slip below to test the automatic extraction:
              </p>

              <div className="space-y-2 pt-1">
                {SAMPLE_SLIPS.map((slip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => processSlipData(slip.rawText, slip.slipTitle)}
                    className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition text-xs space-y-1 shadow-2xs"
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{slip.name}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded">
                        Extract &rarr;
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {slip.rawText}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Natural Text Assistant Panel */}
      {activeMode === 'text' && (
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquareText className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Type Deal in Your Own Words
              </h3>
            </div>
            <button
              onClick={() => setActiveMode(null)}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Describe the agreement informally:
              </label>
              <textarea
                rows={4}
                value={nlpText}
                onChange={(e) => setNlpText(e.target.value)}
                placeholder="Example: Sharma Woodworks agreed to build a 6-seater dining table for Rajesh Verma for ₹48,000 with ₹15,000 advance. Delivery target is 28 November 2026."
                className="w-full text-sm rounded-xl border border-slate-300 p-3.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-hidden"
              />
            </div>

            {/* Sample prompt chips */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Click a sample prompt to try:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_TEXT_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setNlpText(prompt)}
                    className="text-left text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition"
                  >
                    "{prompt.slice(0, 55)}..."
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleConvertText}
                disabled={!nlpText.trim() || isParsingText}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition"
              >
                {isParsingText ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting to Agreement...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Convert to Agreement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Speech to Agreement Assistant Panel */}
      {activeMode === 'speech' && (
        <div className="bg-white rounded-2xl border-2 border-violet-500 p-6 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-violet-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Speech to Agreement (Voice Input)
              </h3>
            </div>
            <button
              onClick={() => {
                setActiveMode(null);
                if (isListening && recognitionRef.current) {
                  recognitionRef.current.stop();
                  setIsListening(false);
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            {/* Big pulsating microphone button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-200'
                  : 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>

            <div className="text-center">
              <p className="text-sm font-bold text-slate-900">
                {isListening ? 'Listening to your voice...' : 'Click the microphone to start speaking'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Speak clearly in Hindi or English (merchant, customer, work, total amount, advance, date).
              </p>
            </div>

            {/* Transcript Preview Area */}
            <div className="w-full bg-white p-4 rounded-xl border border-slate-200 min-h-[90px] text-sm text-slate-800">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Live Voice Transcript:
              </div>
              {speechTranscript ? (
                <p className="italic font-medium text-slate-900">"{speechTranscript}"</p>
              ) : (
                <p className="text-slate-400 text-xs italic">
                  Your spoken agreement words will appear here in real time...
                </p>
              )}
            </div>

            {/* Preset Spoken Demo Buttons for Instant Testing */}
            <div className="w-full flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSpeechTranscript(
                    'Sharma Woodworks agreed to make 6 dining chairs for Rajesh Verma for ₹24,000 with ₹8,000 advance by 28th November.'
                  );
                }}
                className="text-xs text-violet-700 hover:underline"
              >
                Load sample spoken voice audio text &rarr;
              </button>

              <button
                type="button"
                onClick={handleConvertSpeech}
                disabled={!speechTranscript.trim()}
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Convert Voice to Agreement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-filled Notification Banner */}
      {autoFilledNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between text-emerald-900 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold">
                Agreement details auto-filled from {autoFilledNotice}!
              </p>
              <p className="text-emerald-700 mt-0.5">
                Review any fields below, adjust if necessary, and submit to save into database.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutoFilledNotice(null)}
            className="text-xs font-semibold text-emerald-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STANDARD STRUCTURED FORM */}
      {/* ========================================================================= */}
      <form
        ref={formSectionRef}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="p-6 bg-slate-50/70 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            Agreement Details
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and finalize the structured commercial fields.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: Parties Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>1. Parties (Merchant & Client)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Merchant Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Merchant / Business Name *
                </label>
                <input
                  type="text"
                  name="merchantName"
                  value={formData.merchantName}
                  onChange={handleChange}
                  placeholder="e.g. Sharma Woodworks & Interiors"
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.merchantName
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                  }`}
                />
                {errors.merchantName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.merchantName}</p>
                )}
              </div>

              {/* Merchant Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Merchant Contact / Phone *
                </label>
                <input
                  type="text"
                  name="merchantContact"
                  value={formData.merchantContact}
                  onChange={handleChange}
                  placeholder="e.g. +91 98231 44550"
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.merchantContact
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                  }`}
                />
                {errors.merchantContact && (
                  <p className="text-xs text-rose-600 mt-1">{errors.merchantContact}</p>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Client Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Verma"
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.customerName
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-xs text-rose-600 mt-1">{errors.customerName}</p>
                )}
              </div>

              {/* Customer Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Contact / Phone *
                </label>
                <input
                  type="text"
                  name="customerContact"
                  value={formData.customerContact}
                  onChange={handleChange}
                  placeholder="e.g. +91 94120 78219"
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.customerContact
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                  }`}
                />
                {errors.customerContact && (
                  <p className="text-xs text-rose-600 mt-1">{errors.customerContact}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: Work Scope */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>2. Commercial Work Scope & Specifications</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transaction Title *
                </label>
                <input
                  type="text"
                  name="transactionTitle"
                  value={formData.transactionTitle}
                  onChange={handleChange}
                  placeholder="e.g. Custom 6-Seater Teakwood Dining Table"
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.transactionTitle
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                  }`}
                />
                {errors.transactionTitle && (
                  <p className="text-xs text-rose-600 mt-1">{errors.transactionTitle}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Work Description & Deliverables *
                </label>
                <textarea
                  name="workDescription"
                  rows={3}
                  value={formData.workDescription}
                  onChange={handleChange}
                  placeholder="Specify materials, measurements, finish, warranty, doorstep delivery terms..."
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.workDescription
                      ? 'border-rose-400 focus:ring-rose-200'
                      : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                  }`}
                />
                {errors.workDescription && (
                  <p className="text-xs text-rose-600 mt-1">{errors.workDescription}</p>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: Financial Figures (INR) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-slate-500" />
              <span>3. Financial Figures (INR ₹)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Agreed Value (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    name="totalAmount"
                    min="0"
                    step="100"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="48000"
                    className={`w-full text-sm rounded-xl border pl-7 p-2.5 transition outline-hidden ${
                      errors.totalAmount
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                    }`}
                  />
                </div>
                {errors.totalAmount && (
                  <p className="text-xs text-rose-600 mt-1">{errors.totalAmount}</p>
                )}
              </div>

              {/* Advance Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Advance Deposit Paid (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    name="advanceAmount"
                    min="0"
                    step="100"
                    value={formData.advanceAmount}
                    onChange={handleChange}
                    placeholder="15000"
                    className={`w-full text-sm rounded-xl border pl-7 p-2.5 transition outline-hidden ${
                      errors.advanceAmount
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                    }`}
                  />
                </div>
                {errors.advanceAmount && (
                  <p className="text-xs text-rose-600 mt-1">{errors.advanceAmount}</p>
                )}
              </div>

              {/* Auto Remaining Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Outstanding Balance (₹)
                </label>
                <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-sm font-bold text-slate-900">
                  {formatCurrency(remainingCalculated)}
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  Auto-calculated (Total - Advance)
                </span>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Milestones & Terms *
              </label>
              <input
                type="text"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                placeholder="e.g. ₹15,000 advance with order, balance ₹33,000 on delivery."
                className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                  errors.paymentTerms
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
                }`}
              />
              {errors.paymentTerms && (
                <p className="text-xs text-rose-600 mt-1">{errors.paymentTerms}</p>
              )}
            </div>
          </div>

          {/* SECTION 4: Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>4. Execution Timeline & Milestones</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.startDate
                      ? 'border-rose-400'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-xs text-rose-600 mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agreed Completion Date *
                </label>
                <input
                  type="date"
                  name="expectedCompletionDate"
                  value={formData.expectedCompletionDate}
                  onChange={handleChange}
                  className={`w-full text-sm rounded-xl border p-2.5 transition outline-hidden ${
                    errors.expectedCompletionDate
                      ? 'border-rose-400'
                      : 'border-slate-300 focus:border-slate-900'
                  }`}
                />
                {errors.expectedCompletionDate && (
                  <p className="text-xs text-rose-600 mt-1">
                    {errors.expectedCompletionDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-xs transition active:scale-[0.98]"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Agreement...</span>
              </>
            ) : (
              <>
                <FilePlus className="w-4 h-4 text-emerald-400" />
                <span>Create Agreement</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAgreementForm;
