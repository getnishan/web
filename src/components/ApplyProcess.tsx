import React, { useState, useCallback, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, Upload, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { VideoUploadUI } from './VideoUploadUI';

interface ApplyProcessProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  location: string;
  qualification: string;
  graduationYear: string;
  engagementStatus: string;
  tuitionExperience: string;
  motivation: string;
  commitment: string;
  heardFrom: string;
  comments: string;
  videoBlob: Blob | null;
  cvFile: File | null;
};

const engagementOptions = [
  'Studying - enrolled in a full time program',
  'Preparing for and applying to Jobs',
  'Currently engaged in full-time or part-time engagement',
  'Self-employed (working in own or family owned enterprise)',
  'Other',
];

const heardFromOptions = [
  'Lighthouse Foundation',
  'Aveti Learning',
  'Friend/Family',
  'Social Media',
  'Other',
];

const createInitialFormState = (): FormData => ({
  fullName: '',
  email: '',
  phone: '',
  age: '',
  location: '',
  qualification: '',
  graduationYear: '',
  engagementStatus: '',
  tuitionExperience: '',
  motivation: '',
  commitment: '',
  heardFrom: '',
  comments: '',
  videoBlob: null,
  cvFile: null,
});

export function ApplyProcess({ isOpen, onClose }: ApplyProcessProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(createInitialFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const totalSteps = 3;

  if (!isOpen) return null;

  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const { [key as string]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Name is required.';
      if (!formData.email.trim()) newErrors.email = 'Mail ID is required.';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
      if (!formData.age.trim()) newErrors.age = 'Please share your age.';
      if (!formData.location.trim()) newErrors.location = 'Current location is required.';
    }

    if (currentStep === 2) {
      if (!formData.qualification.trim()) newErrors.qualification = 'Add your qualification.';
      if (!formData.graduationYear.trim()) newErrors.graduationYear = 'Enter graduation year.';
      if (!formData.engagementStatus) newErrors.engagementStatus = 'Select your current engagement.';
      if (!formData.tuitionExperience) newErrors.tuitionExperience = 'Please answer this question.';
      if (!formData.commitment) newErrors.commitment = 'Let us know if you can commit.';
    }

    if (currentStep === 3) {
      if (!formData.motivation.trim() && !formData.videoBlob) {
        newErrors.motivation = 'Share your motivation text or record a video.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const resetForm = () => {
    setFormData(createInitialFormState());
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;
    console.log('Application submitted', formData);
    handleClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, cvFile: 'Upload a PDF, DOC, or DOCX file.' }));
      return;
    }

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((prev) => ({ ...prev, cvFile: 'File size exceeds 10 MB.' }));
      return;
    }

    updateField('cvFile', file);
  };

  const removeFile = () => updateField('cvFile', null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-black/70 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        >
          <div className="bg-secondary p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Application Form</h2>
                <p className="text-slate-300 text-sm mt-1">
                  Step {step} of {totalSteps}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                aria-label="Close application form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full mt-8 overflow-hidden">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="p-8 overflow-y-auto flex-1 bg-neutral-light/30">
            {step === 1 && (
              <StepOne formData={formData} errors={errors} updateField={updateField} />
            )}
            {step === 2 && (
              <StepTwo formData={formData} errors={errors} updateField={updateField} />
            )}
            {step === 3 && (
              <StepThree
                formData={formData}
                errors={errors}
                updateField={updateField}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
              />
            )}
          </div>

          <div className="p-6 border-t border-neutral-light flex justify-between items-center bg-white">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center text-neutral-gray hover:text-secondary disabled:opacity-40 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-neutral-light"
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>

            {step < totalSteps ? (
              <Button onClick={nextStep} variant="secondary">
                Next <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-variant text-white shadow-glow">
                Submit Application <Check size={18} className="ml-2" />
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

type StepProps = {
  formData: FormData;
  errors: Record<string, string>;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
};

function StepOne({ formData, errors, updateField }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-xl font-bold text-secondary mb-2">Personal Information</h3>
        <p className="text-neutral-gray text-sm">
          Tell us who you are so we can tailor the onboarding journey.
        </p>
      </div>
      <div className="space-y-4">
        <TextField
          label="Name *"
          value={formData.fullName}
          onChange={(value) => updateField('fullName', value)}
          placeholder="Enter your full name"
          error={errors.fullName}
        />
        <TextField
          label="Mail ID *"
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          placeholder="your.name@example.com"
          error={errors.email}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Phone No. *"
            value={formData.phone}
            onChange={(value) => updateField('phone', value)}
            placeholder="10-digit mobile number"
            error={errors.phone}
          />
          <TextField
            label="Age *"
            type="number"
            value={formData.age}
            onChange={(value) => updateField('age', value)}
            placeholder="Your age"
            error={errors.age}
          />
        </div>
        <TextField
          label="Current Location (city/state) *"
          value={formData.location}
          onChange={(value) => updateField('location', value)}
          placeholder="e.g., Bhubaneswar, Odisha"
          error={errors.location}
        />
      </div>
    </div>
  );
}

function StepTwo({ formData, errors, updateField }: StepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-xl font-bold text-secondary mb-2">Education & current engagement</h3>
        <p className="text-neutral-gray text-sm">
          Help us understand where you are in your learning and work journey today.
        </p>
      </div>

      <div className="space-y-4">
        <TextField
          label="Educational Qualification *"
          value={formData.qualification}
          onChange={(value) => updateField('qualification', value)}
          placeholder="BA, BBA, BSc, etc."
          error={errors.qualification}
        />
        <TextField
          label="Year of Graduation *"
          type="number"
          value={formData.graduationYear}
          onChange={(value) => updateField('graduationYear', value)}
          placeholder="e.g., 2024"
          error={errors.graduationYear}
        />

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-neutral-dark">
            Mention Current Engagement Status *
          </label>
          <div className="space-y-2">
            {engagementOptions.map((option) => (
              <label
                key={option}
                className={`flex items-center p-4 border rounded-xl bg-white cursor-pointer hover:border-primary/50 transition-all ${
                  formData.engagementStatus === option ? 'border-primary' : 'border-neutral-light'
                }`}
              >
                <input
                  type="radio"
                  name="engagement"
                  className="w-4 h-4 accent-primary"
                  checked={formData.engagementStatus === option}
                  onChange={() => updateField('engagementStatus', option)}
                />
                <span className="ml-3 text-sm text-neutral-dark font-medium">{option}</span>
              </label>
            ))}
          </div>
          {errors.engagementStatus && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.engagementStatus}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-neutral-dark">
            Have you ever given tuition lessons or managed a tuition service? *
          </label>
          <div className="flex gap-4 flex-wrap">
            {['Yes', 'No'].map((option) => (
              <label
                key={option}
                className={`flex-1 min-w-[140px] flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer ${
                  formData.tuitionExperience === option ? 'border-primary bg-primary/5' : 'border-neutral-light bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="tuitionExperience"
                  className="hidden"
                  checked={formData.tuitionExperience === option}
                  onChange={() => updateField('tuitionExperience', option)}
                />
                <span className="text-sm font-semibold text-neutral-dark">{option}</span>
              </label>
            ))}
          </div>
          {errors.tuitionExperience && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.tuitionExperience}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-neutral-dark">
            Are you willing to commit to a 1-month residential programme in Bhubaneswar starting 15 Dec 2025? *
          </label>
          <div className="flex gap-4 flex-wrap">
            {['Yes', 'No'].map((option) => (
              <label
                key={option}
                className={`flex-1 min-w-[140px] flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer ${
                  formData.commitment === option ? 'border-primary bg-primary/5' : 'border-neutral-light bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="commitment"
                  className="hidden"
                  checked={formData.commitment === option}
                  onChange={() => updateField('commitment', option)}
                />
                <span className="text-sm font-semibold text-neutral-dark">{option}</span>
              </label>
            ))}
          </div>
          {errors.commitment && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.commitment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

type StepThreeProps = StepProps & {
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
};

function StepThree({ formData, errors, updateField, onFileChange, onRemoveFile }: StepThreeProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-xl font-bold text-secondary mb-2">Motivation & supporting details</h3>
        <p className="text-neutral-gray text-sm">
          Record a short video or write a brief note so our admissions team understands your spark.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-neutral-dark mb-2">
            Motivation for Joining - Briefly explain why you want to join *
          </label>
          <textarea
            className={`w-full p-4 bg-white rounded-xl border min-h-[150px] transition-all outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.motivation ? 'border-red-300' : 'border-neutral-light'
            }`}
            placeholder="Share your motivation, expectations, and the impact you want to create."
            value={formData.motivation}
            onChange={(event) => updateField('motivation', event.target.value)}
          />
          {errors.motivation && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.motivation}
            </p>
          )}
        </div>

        <div className="text-center text-neutral-gray text-xs uppercase tracking-wider font-semibold">
          or upload a short video
        </div>

        <VideoUploadUI onRecordingComplete={(blob) => updateField('videoBlob', blob)} />

        <div>
          <label className="block text-sm font-semibold text-neutral-dark mb-2">
            Upload CV (Word or PDF)
          </label>
          <label
            htmlFor="cv-upload"
            className="w-full p-8 bg-neutral-light/30 rounded-xl border-2 border-dashed border-neutral-light flex flex-col items-center justify-center text-neutral-gray cursor-pointer hover:border-primary/50 hover:bg-white transition-all"
          >
            <Upload size={32} className="mb-3 text-neutral-gray" />
            <span className="text-sm font-medium text-neutral-dark">
              Click to upload CV (Max 10 MB)
            </span>
            <span className="text-xs opacity-70">Upload 1 supported file: PDF or document.</span>
            <input id="cv-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={onFileChange} />
          </label>
          {formData.cvFile && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-white border border-neutral-light px-4 py-2 text-sm">
              <span className="text-neutral-dark truncate">{formData.cvFile.name}</span>
              <button type="button" onClick={onRemoveFile} className="text-primary font-semibold">
                Remove
              </button>
            </div>
          )}
          {errors.cvFile && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle size={14} /> {errors.cvFile}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-neutral-dark">
            How Did You Hear About Us?
          </label>
          <div className="flex flex-wrap gap-3">
            {heardFromOptions.map((option) => (
              <label
                key={option}
                className={`px-4 py-2 rounded-full border text-sm cursor-pointer ${
                  formData.heardFrom === option ? 'border-primary bg-primary/10 text-secondary' : 'border-neutral-light text-neutral-gray'
                }`}
              >
                <input
                  type="radio"
                  name="heardFrom"
                  className="hidden"
                  checked={formData.heardFrom === option}
                  onChange={() => updateField('heardFrom', option)}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-dark mb-2">
            Any specific Comments or Questions?
          </label>
          <textarea
            className="w-full p-4 bg-white rounded-xl border border-neutral-light min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Drop any additional context, constraints, or clarifications."
            value={formData.comments}
            onChange={(event) => updateField('comments', event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
};

const TextField = ({ label, value, onChange, placeholder, type = 'text', error }: TextFieldProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-neutral-dark">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full p-3.5 bg-white rounded-xl border outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
        error ? 'border-red-300' : 'border-neutral-light'
      }`}
    />
    {error && (
      <p className="text-xs text-red-600 flex items-center gap-1">
        <AlertCircle size={14} /> {error}
      </p>
    )}
  </div>
);
