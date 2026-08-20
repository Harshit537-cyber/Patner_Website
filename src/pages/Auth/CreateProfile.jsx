import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronDown,
  ImagePlus,
  Loader2,
  MapPin,
  Sparkles,
  User,
  X,
} from "lucide-react";

import { registerPartner } from "../../services/authService";

const SPECIALTIES = [
  "Vedic Astrology",
  "Numerology",
  "Tarot Reading",
  "Palmistry",
  "Vastu",
  "Love & Relationship",
  "Career Guidance",
  "Marriage Astrology",
  "Finance & Business",
  "Spiritual Guidance",
];

const LANGUAGES = [
  "Hindi",
  "English",
  "Sanskrit",
  "Punjabi",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
];


const CATEGORIES=[
            'LOVE & RELATIONSHIPS',
            'CAREER & FINANCE',
            'MARRIAGE & FAMILY',
            'HEALTH & WELLNESS',
            'BUSINESS & WEALTH'
        ]

const CreateProfile = () => {
  const navigate = useNavigate();

  const profileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");

  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    city: "",
    specialties: [],
    languages: [],
    experience: "",
    qualification: "",
    expectedSalary: "",
    minRate: "",
    bio: "",
    categories: [],
  });

  /* =====================================================
     CLEANUP PREVIEWS
  ===================================================== */

  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }

      galleryPreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [profilePreview, galleryPreviews]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* =====================================================
     MULTI SELECT
  ===================================================== */

  const toggleArrayValue = (field, value) => {
    setForm((prev) => {
      const current = prev[field];

      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });

    setError("");
  };

  /* =====================================================
     PROFILE IMAGE
  ===================================================== */

  const handleProfilePicture = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image for your profile picture.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be smaller than 5MB.");
      return;
    }

    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    const preview = URL.createObjectURL(file);

    setProfilePic(file);
    setProfilePreview(preview);
    setError("");
  };

  /* =====================================================
     GALLERY IMAGES
  ===================================================== */

  const handleAdditionalPhotos = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const remainingSlots = 4 - additionalPhotos.length;

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 4 additional photos.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    );

    if (invalidFile) {
      setError("Each additional photo must be an image smaller than 5MB.");
      return;
    }

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));

    setAdditionalPhotos((prev) => [...prev, ...selectedFiles]);
    setGalleryPreviews((prev) => [...prev, ...previews]);

    setError("");

    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  const removeGalleryImage = (index) => {
    URL.revokeObjectURL(galleryPreviews[index]);

    setAdditionalPhotos((prev) => prev.filter((_, i) => i !== index));

    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.dateOfBirth) {
      return "Please select your date of birth.";
    }

    if (!form.gender) {
      return "Please select your gender.";
    }

    if (!form.city.trim()) {
      return "Please enter your city.";
    }

    if (!form.experience) {
      return "Please enter your experience.";
    }

    if (!form.qualification.trim()) {
      return "Please enter your qualification.";
    }

    if (!form.minRate) {
      return "Please enter your minimum consultation rate.";
    }

    if (form.specialties.length === 0) {
      return "Please select at least one specialty.";
    }

    if (form.languages.length === 0) {
      return "Please select at least one language.";
    }

    if (form.categories.length === 0) {
      return "Please select at least one category.";
    }

    if (!form.bio.trim()) {
      return "Please tell us a little about yourself.";
    }

    return "";
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      // Basic details
      formData.append("fullName", form.fullName);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("gender", form.gender);
      formData.append("city", form.city);

      // Professional details
      formData.append("experience", form.experience);
      formData.append("qualification", form.qualification);

      // Pricing
      formData.append("expectedSalary", form.expectedSalary);
      formData.append("minRate", form.minRate);

      // Bio
      formData.append("bio", form.bio);

      // Arrays - backend uses JSON.parse()
      formData.append("specialties", JSON.stringify(form.specialties));

      formData.append("languages", JSON.stringify(form.languages));

      formData.append("categories", JSON.stringify(form.categories));

      // Profile image
      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      // Gallery images
      additionalPhotos.forEach((file) => {
        formData.append("additionalPhotos", file);
      });

      console.log("========== REGISTER REQUEST ==========");

      for (const [key, value] of formData.entries()) {
        console.log(key, value instanceof File ? value.name : value);
      }

      const response = await registerPartner(formData);

      console.log("========== REGISTER RESPONSE ==========");
      console.log(response);

      if (response?.success) {
        setSuccess(response.message || "Partner profile created successfully.");

        setTimeout(() => {
          navigate("/dashboard", {
            replace: true,
          });
        }, 1000);
      } else {
        throw new Error(response?.message || "Profile registration failed.");
      }
    } catch (error) {
      console.error("Create Profile Error:", error);

      setError(error?.message || "Unable to create your profile.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#faf9ff]">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 shadow-lg shadow-violet-200">
              <Sparkles className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="font-serif text-lg font-bold tracking-[0.12em] text-slate-900">
                ASTRONARHARI
              </h1>

              <p className="text-[8px] font-bold tracking-[0.25em] text-violet-600">
                PARTNER PORTAL
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-50">
              <CheckCircle2 className="h-4 w-4 text-violet-600" />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800">
                Step 2 of 2
              </p>
              <p className="text-[10px] text-slate-400">
                Complete your profile
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
              Create your profile
            </span>
          </div>

          <h2 className="font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Tell us about
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              {" "}
              yourself.
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Complete your professional profile so seekers can understand your
            expertise, experience and consultation services.
          </p>
        </motion.div>

        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-600"
          >
            <CheckCircle2 className="h-5 w-5" />
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* =================================================
                PROFILE IMAGE CARD
            ================================================= */}

            <motion.section
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-5">
                <p className="text-sm font-bold text-slate-900">
                  Profile photo
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Add a clear professional photo to help seekers recognize you.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => profileInputRef.current?.click()}
                  className="group relative"
                >
                  <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-violet-200 bg-violet-50 transition group-hover:border-violet-400">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-violet-500" />

                        <p className="mt-2 text-xs font-semibold text-violet-700">
                          Upload photo
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg">
                    <Camera className="h-4 w-4" />
                  </div>
                </button>

                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleProfilePicture}
                  className="hidden"
                />
              </div>

              <p className="mt-4 text-center text-[10px] text-slate-400">
                JPG, JPEG, PNG or WEBP · Max 5MB
              </p>

              {/* GALLERY */}

              <div className="mt-8 border-t border-slate-100 pt-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">Gallery</p>

                    <p className="text-[10px] text-slate-400">
                      Up to 4 additional photos
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700">
                    {additionalPhotos.length}/4
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {galleryPreviews.map((preview, index) => (
                    <div
                      key={preview}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-600 shadow hover:text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                  {additionalPhotos.length < 4 && (
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-violet-300 hover:bg-violet-50"
                    >
                      <ImagePlus className="mx-auto h-6 w-6 text-slate-400" />

                      <p className="mt-1 text-[10px] font-semibold text-slate-500">
                        Add photo
                      </p>
                    </button>
                  )}
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleAdditionalPhotos}
                  className="hidden"
                />
              </div>
            </motion.section>

            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <div className="space-y-6">
              {/* PERSONAL DETAILS */}

              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <SectionHeader
                  icon={User}
                  title="Personal details"
                  description="Basic information about you."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Full name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />

                  <InputField
                    label="Date of birth"
                    name="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                    required
                  />

                  <SelectField
                    label="Gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                    required
                  />

                  <InputField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Dehradun"
                    icon={MapPin}
                    required
                  />
                </div>
              </motion.section>

              {/* PROFESSIONAL DETAILS */}

              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <SectionHeader
                  icon={Sparkles}
                  title="Professional details"
                  description="Tell seekers about your expertise."
                />

                <div className="space-y-6">
                  <MultiSelect
                    label="Specialties"
                    values={form.specialties}
                    options={SPECIALTIES}
                    onToggle={(value) => toggleArrayValue("specialties", value)}
                  />

                  <MultiSelect
                    label="Languages"
                    values={form.languages}
                    options={LANGUAGES}
                    onToggle={(value) => toggleArrayValue("languages", value)}
                  />

                  <MultiSelect
                    label="Categories"
                    values={form.categories}
                    options={CATEGORIES}
                    onToggle={(value) => toggleArrayValue("categories", value)}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="Experience"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      placeholder="e.g. 8 years"
                      required
                    />

                    <InputField
                      label="Qualification"
                      name="qualification"
                      value={form.qualification}
                      onChange={handleChange}
                      placeholder="e.g. M.A. Astrology"
                      required
                    />
                  </div>
                </div>
              </motion.section>

              {/* PRICING */}

              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <SectionHeader
                  icon={Sparkles}
                  title="Consultation & pricing"
                  description="Set your professional consultation rates."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Expected salary"
                    name="expectedSalary"
                    value={form.expectedSalary}
                    onChange={handleChange}
                    placeholder="e.g. 40000"
                    type="number"
                  />

                  <InputField
                    label="Minimum rate per minute"
                    name="minRate"
                    value={form.minRate}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    type="number"
                    required
                  />
                </div>
              </motion.section>

              {/* BIO */}

              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <SectionHeader
                  icon={Sparkles}
                  title="About you"
                  description="Write a short introduction for your profile."
                />

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700">
                    Professional bio <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={6}
                    maxLength={1000}
                    placeholder="Tell seekers about your experience, approach and what they can expect from a consultation..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                  />

                  <div className="mt-2 flex justify-end">
                    <span className="text-[10px] text-slate-400">
                      {form.bio.length}/1000
                    </span>
                  </div>
                </div>
              </motion.section>

              {/* SUBMIT */}

              <div className="flex flex-col gap-4 rounded-3xl border border-violet-100 bg-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Ready to join AstroNarhari?
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your profile will be submitted for admin approval.
                  </p>
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="flex h-13 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-800 px-7 text-sm font-bold text-white shadow-xl shadow-violet-200 transition hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Creating profile...
                    </>
                  ) : (
                    <>
                      Complete registration
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

/* =====================================================
   SECTION HEADER
===================================================== */

const SectionHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="mb-7 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>

        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
};

/* =====================================================
   INPUT
===================================================== */

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 ${
            Icon ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

/* =====================================================
   SELECT
===================================================== */

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="h-13 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
        >
          <option value="">Select {label}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
};

/* =====================================================
   MULTI SELECT
===================================================== */

const MultiSelect = ({ label, values, options, onToggle }) => {
  return (
    <div>
      <label className="mb-3 block text-xs font-bold text-slate-700">
        {label} <span className="text-red-500">*</span>
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                selected
                  ? "border-violet-500 bg-violet-600 text-white shadow-md shadow-violet-100"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
              }`}
            >
              {selected && "✓ "}
              {option}
            </button>
          );
        })}
      </div>

      {values.length > 0 && (
        <p className="mt-2 text-[10px] text-violet-600">
          {values.length} selected
        </p>
      )}
    </div>
  );
};

export default CreateProfile;
