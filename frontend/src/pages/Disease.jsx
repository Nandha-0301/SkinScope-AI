import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AILoader from "../components/AILoader.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import MainLayout from "../components/layout/MainLayout.jsx";
import PageSection from "../components/layout/PageSection.jsx";
import PageHero from "../components/product/PageHero.jsx";
import InfoCard from "../components/product/InfoCard.jsx";
import Button from "../components/ui/Button.jsx";

const face = [
  {
    q: "Where on your face is the issue located?",
    type: "select",
    options: [
      "Select an option",
      "Forehead",
      "Cheeks",
      "Nose",
      "Chin",
      "Jawline",
      "Around eyes",
      "Around lips",
      "Full face",
    ],
  },
  {
    q: "What does the issue look like?",
    type: "multi-select",
    options: [
      "Red patches or bumps",
      "Itchy or burning skin",
      "Whiteheads/Blackheads",
      "Blisters or pus-filled spots",
      "Dark or discolored patches",
      "Dry, flaky, or scaly skin",
      "Swollen or painful area",
      "Open wounds or cracked skin",
    ],
  },
  {
    q: "How long has the issue been present?",
    type: "select",
    options: ["Select an option", "Less than 1 week", "1–4 weeks", "More than a month"],
  },
  {
    q: "Is the issue constant or does it come and go?",
    type: "select",
    options: ["Select an option", "Constant", "Comes and goes", "Triggered by something"],
  },
  {
    q: "Have you used any new skincare or makeup products recently?",
    type: "select",
    options: ["Select an option", "Yes", "No", "Not Sure"],
  },
  {
    q: "Have you experienced any of these triggers recently?",
    type: "multi-select",
    options: [
      "Extreme weather (cold, wind, sun)",
      "Hormonal changes or menstruation",
      "Stress or lack of sleep",
      "Spicy or allergy-prone food",
      "Shaving/waxing",
      "New detergent/pillowcase",
    ],
  },
  {
    q: "Do you have a history of any of the following skin conditions?",
    type: "multi-select",
    options: ["Acne", "Rosacea", "Eczema", "Psoriasis", "Melasma", "Sensitive skin", "None"],
  },
  {
    q: "Do you have any known medical conditions?",
    type: "multi-select",
    options: ["PCOS", "Thyroid issues", "Allergies", "Hormonal disorders", "None"],
  },
  {
    q: "Have you taken any medication or treatment for this before?",
    type: "select",
    options: ["Select an option", "Yes, prescribed", "Yes, OTC", "No"],
  },
  {
    q: "Does it affect your confidence or routine?",
    type: "select",
    options: ["Select an option", "Yes", "No", "Sometimes"],
  },
];

const otherArea = [
  {
    q: "Which part of your body is affected?",
    type: "select",
    options: [
      "Select an option",
      "Scalp",
      "Neck",
      "Chest",
      "Back",
      "Arms",
      "Legs",
      "Hands",
      "Feet",
      "Groin area",
      "Underarms",
      "Around nails",
      "Full body",
    ],
  },
  {
    q: "What does the affected area look like?",
    type: "multi-select",
    options: [
      "Red or pink patches",
      "Blisters or boils",
      "Dry/flaky/scaly skin",
      "Cracked or bleeding skin",
      "Itchy rash",
      "Darkened or pigmented area",
      "Raised bumps",
      "Open sores or ulcers",
      "Oozing or discharge",
    ],
  },
  {
    q: "How large is the affected area?",
    type: "select",
    options: [
      "Select an option",
      "Tiny spot (coin-sized or smaller)",
      "Moderate area (palm-sized)",
      "Large patch (bigger than a hand)",
      "Multiple small areas",
      "Covers most of the body part",
    ],
  },
  {
    q: "Is it painful, itchy, or numb?",
    type: "multi-select",
    options: ["Itchy", "Painful", "Tingling", "Numb", "None of these"],
  },
  {
    q: "When did you first notice it?",
    type: "select",
    options: ["Select an option", "Today", "1–3 days ago", "This week", "Over a week ago", "Over a month ago"],
  },
  {
    q: "Does it seem to be spreading?",
    type: "select",
    options: ["Select an option", "Yes", "No", "Not sure"],
  },
  {
    q: "Have you recently experienced any of the following?",
    type: "multi-select",
    options: [
      "Fever or chills",
      "Body aches",
      "Sweating or heat exposure",
      "Allergic reaction",
      "New clothes or detergent",
      "Close contact with infected person or animal",
    ],
  },
  {
    q: "Do you have a personal or family history of skin conditions?",
    type: "multi-select",
    options: ["Eczema", "Psoriasis", "Fungal infections", "Hives", "Vitiligo", "None", "Don’t know"],
  },
  {
    q: "Have you taken any medication or ointment for it?",
    type: "select",
    options: ["Select an option", "Yes - prescribed", "Yes - over the counter", "No"],
  },
  {
    q: "Does it affect your sleep, movement, or daily life?",
    type: "select",
    options: ["Select an option", "Yes", "No", "Sometimes"],
  },
];

const initialBySection = {
  upload: null,
  camera: null,
  ipcam: null,
  details: null,
};

const initialFeedbackBySection = {
  upload: null,
  camera: null,
  ipcam: null,
  details: null,
};

const LAST_DISEASE_RESULT_KEY = "lastDiseaseResult";
const DEFAULT_RESULT_BADGE = "Awaiting scan";
const NORMAL_SKIN_RESULT = "No Significant Skin Lesion Detected";
const UNCERTAIN_RESULT = "Uncertain - Please consult a dermatologist";

function formatRelativeTime(timestamp) {
  if (!timestamp) return "";

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);

  if (minutes <= 0) return "just now";
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} mins ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

function dataURLToBlob(dataURL) {
  const parts = dataURL.split(",");
  if (parts.length < 2) return null;
  const match = parts[0].match(/data:(.*?);base64/);
  const mime = match ? match[1] : "image/png";
  const binary = atob(parts[1]);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function buildResultNarrative(prediction) {
  if (prediction === NORMAL_SKIN_RESULT) {
    return {
      effects: "Skin appears normal or no visible lesion detected in this image.",
      cause: "The image did not show a clear HAM10000-style lesion pattern.",
      medications: "No treatment suggestion can be made from this scan alone. Monitor for changes or symptoms.",
      timePeriod: "No active lesion pattern was confidently detected at this time.",
      healthyHabits: "Continue sun protection, gentle skincare, and re-check the area if it changes in color, size, or shape.",
      cure: "If the area becomes darker, asymmetric, painful, itchy, or starts evolving, consult a dermatologist.",
    };
  }

  if (prediction === UNCERTAIN_RESULT) {
    return {
      effects: "The image did not produce a reliable lesion match, so the result was safely flagged as uncertain.",
      cause: "This can happen with random images, non-lesion patterns, unclear framing, or lighting that does not resemble dermatoscopic lesions.",
      medications: "No treatment suggestion should be based on this scan result alone.",
      timePeriod: "Please try again with a clearer close-up image if you want another screening pass.",
      healthyHabits: "Use even lighting, center the area of concern, avoid filters, and keep the image focused.",
      cure: "If you still have a concern after retaking the image, consult a dermatologist for a direct examination.",
    };
  }

  return {
    effects: "Please consult a dermatologist for more information.",
    cause: "Various potential causes depending on the exact condition.",
    medications: "A medical professional can advise on the right treatment if needed.",
    timePeriod: "Varies significantly.",
    healthyHabits: "Maintain good hygiene, avoid triggers, protect from sun.",
    cure: "Next steps depend on a professional medical evaluation.",
  };
}

function Disease() {
  const [activeSection, setActiveSection] = useState("details");
  const [locationType, setLocationType] = useState("face");
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submittedMsg, setSubmittedMsg] = useState("");
  const [lastResultSection, setLastResultSection] = useState("details");

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [cameraOpened, setCameraOpened] = useState(false);
  const [cameraCaptured, setCameraCaptured] = useState("");
  const videoRef = useRef(null);
  const captureCanvasRef = useRef(null);
  const streamRef = useRef(null);

  const [ipCamUrl, setIpCamUrl] = useState("");
  const [ipCamFeedUrl, setIpCamFeedUrl] = useState("");
  const [ipCamFeedback, setIpCamFeedback] = useState("");
  const [ipCamCaptured, setIpCamCaptured] = useState("");
  const ipCanvasRef = useRef(null);
  const ipImageRef = useRef(null);

  const [results, setResults] = useState(initialBySection);
  const [loading, setLoading] = useState({ upload: false, camera: false, ipcam: false, details: false });
  const [sectionFeedback, setSectionFeedback] = useState(initialFeedbackBySection);
  const [lastScanSummary, setLastScanSummary] = useState(null);

  const questions = useMemo(() => (locationType === "face" ? face : otherArea), [locationType]);
  const currentQuestion = questions[current];

  const answeredCount = useMemo(
    () => answers.filter((a) => (Array.isArray(a) ? a.length > 0 : String(a || "").trim().length > 0)).length,
    [answers]
  );

  useEffect(
    () => () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    },
    []
  );

  useEffect(() => {
    if (!previewImage) return undefined;
    return () => URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  useEffect(() => {
    const saved = localStorage.getItem(LAST_DISEASE_RESULT_KEY);
    if (!saved) return;

    try {
      setLastScanSummary(JSON.parse(saved));
    } catch {
      localStorage.removeItem(LAST_DISEASE_RESULT_KEY);
    }
  }, []);

  const resetDetailFlow = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers([]);
    setSubmittedMsg("");
    setResults((prev) => ({ ...prev, details: null }));
    setSectionFeedback((prev) => ({ ...prev, details: null }));
  };

  const handleStartDetails = () => {
    setStarted(true);
    setCurrent(0);
    setAnswers(Array(questions.length).fill(""));
    setSubmittedMsg("");
    setResults((prev) => ({ ...prev, details: null }));
    setSectionFeedback((prev) => ({
      ...prev,
      details: {
        tone: "info",
        message: "Assessment started. Answer each question and we will keep the summary easy to follow.",
      },
    }));
  };

  const handleSelectAnswer = (index, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const canProceedCurrent = useMemo(() => {
    if (!started || !currentQuestion) return false;
    const val = answers[current];
    if (currentQuestion.type === "multi-select") return Array.isArray(val) && val.length > 0;
    if (currentQuestion.type === "select") return typeof val === "string" && val !== "" && val !== "Select an option";
    return String(val || "").trim().length > 0;
  }, [answers, current, currentQuestion, started]);

  const nextQuestion = () => {
    if (!canProceedCurrent) return;
    setCurrent((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const updateLoading = (section, value) => {
    setLoading((prev) => ({ ...prev, [section]: value }));
  };

  const setFeedbackForSection = (section, tone, message) => {
    setSectionFeedback((prev) => ({
      ...prev,
      [section]: { tone, message },
    }));
  };

  const buildResultData = (data) => ({
    disease: data?.prediction || "Unknown",
    ...buildResultNarrative(data?.prediction || "Unknown"),
    accuracy: typeof data?.confidence === "number" ? `${data.confidence}%` : "N/A",
    top3: Array.isArray(data?.top3) ? data.top3 : [],
  });

  const submitImage = async (section, fileOrDataUrl) => {
    if (section !== "details" && !fileOrDataUrl) {
      setFeedbackForSection(section, "error", "Add an image first so the scan has something clear to review.");
      return;
    }

    if (section === "details" && !fileOrDataUrl) {
      setResults((prev) => ({
        ...prev,
        details: {
          disease: "No image provided",
          effects: "Responses saved successfully.",
          cause: "Attach an image to run AI prediction.",
          medications: "Consult a dermatologist for medical advice.",
          timePeriod: "Depends on professional evaluation.",
          healthyHabits: "Use gentle skincare and avoid triggers.",
          cure: "Upload image for AI estimate and verify with doctor.",
          accuracy: "N/A",
          top3: [],
        },
      }));
      setLastResultSection("details");
      setFeedbackForSection("details", "success", "Your answers are saved. Add an image next if you want an AI scan too.");
      return;
    }

    setFeedbackForSection(section, null, "");
    setResults((prev) => ({ ...prev, [section]: null }));
    setLastScanSummary(null);
    localStorage.removeItem(LAST_DISEASE_RESULT_KEY);
    updateLoading(section, true);

    try {
      const formData = new FormData();

      if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
        formData.append("file", fileOrDataUrl);
      } else if (typeof fileOrDataUrl === "string" && fileOrDataUrl.startsWith("data:")) {
        const blob = dataURLToBlob(fileOrDataUrl);
        if (!blob) throw new Error("Invalid capture data.");
        formData.append("file", blob, "capture.png");
      } else {
        throw new Error("Invalid image data.");
      }

      const minimumDelay = 900 + Math.round(Math.random() * 300);
      const [response] = await Promise.all([
        fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: formData,
        }),
        new Promise((resolve) => window.setTimeout(resolve, minimumDelay)),
      ]);

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();
      if (!data || !data.prediction) {
        throw new Error("No prediction received from the server.");
      }

      setResults((prev) => ({ ...prev, [section]: buildResultData(data) }));
      setLastResultSection(section);
      setFeedbackForSection(section, "success", "Analysis complete. Your review summary is ready.");

      const savedSummary = {
        disease: data.prediction || "Unknown",
        section,
        timestamp: Date.now(),
      };
      setLastScanSummary(savedSummary);
      localStorage.setItem(LAST_DISEASE_RESULT_KEY, JSON.stringify(savedSummary));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [section]: {
          disease: "Error",
          effects: error.message.includes("Failed to fetch")
            ? "Server not responding. Make sure backend is running on port 8000."
            : "Error recognizing disease. Please upload a clear image and try again.",
          cause: "Unable to complete prediction.",
          medications: "N/A",
          timePeriod: "N/A",
          healthyHabits: "N/A",
          cure: "N/A",
          accuracy: "N/A",
          top3: [],
        },
      }));
      setLastResultSection(section);
      setFeedbackForSection(
        section,
        "error",
        error.message.includes("Failed to fetch")
          ? "Something went wrong. Start the backend and try the scan again."
          : "Something went wrong. Try again with a clearer image."
      );
    } finally {
      updateLoading(section, false);
    }
  };

  const submitDetailsAnswers = async () => {
    if (answers.length !== questions.length || answers.some((a) => (Array.isArray(a) ? a.length === 0 : !String(a || "").trim()))) {
      setFeedbackForSection("details", "error", "Please answer every question so the summary has enough context.");
      return;
    }

    localStorage.setItem("diseaseDetectionAnswers", JSON.stringify(answers));
    setSubmittedMsg("Answers saved. Preparing your summary...");

    setTimeout(async () => {
      setSubmittedMsg("");
      await submitImage("details", null);
    }, 800);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setResults((prev) => ({ ...prev, upload: null }));
    setSectionFeedback((prev) => ({ ...prev, upload: null }));
    if (!file) {
      setPreviewImage("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setFeedbackForSection("upload", "info", "Image ready. Start the scan when you are comfortable with this preview.");
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewImage("");
    setResults((prev) => ({ ...prev, upload: null }));
    setSectionFeedback((prev) => ({ ...prev, upload: null }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOpened(true);
      setCameraCaptured("");
      setResults((prev) => ({ ...prev, camera: null }));
      setFeedbackForSection("camera", "info", "Camera is live. Frame the affected area clearly, then capture a still image.");
    } catch {
      setFeedbackForSection("camera", "error", "Camera access was blocked. Check permissions and try again.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpened(false);
  };

  const captureFromCamera = () => {
    if (!videoRef.current || !captureCanvasRef.current) return;
    const canvas = captureCanvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCameraCaptured(dataUrl);
    stopCamera();
    setFeedbackForSection("camera", "success", "Capture ready. Run the scan when you are ready.");
  };

  const validateIpUrl = (url) => {
    const valid = /^http:\/\/\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/video)?$/.test(url);
    setIpCamFeedback(valid ? "Looks good" : "Invalid URL format");
    return valid;
  };

  const connectIPCam = () => {
    if (!validateIpUrl(ipCamUrl)) {
      setFeedbackForSection("ipcam", "error", "Please enter a valid IP camera URL before connecting.");
      return;
    }
    const proxiedURL = `http://localhost:5000/ipcam-proxy?url=${encodeURIComponent(ipCamUrl)}`;
    setIpCamFeedUrl(proxiedURL);
    setIpCamCaptured("");
    setResults((prev) => ({ ...prev, ipcam: null }));
    setFeedbackForSection("ipcam", "info", "Camera connected. Wait for the preview, then capture a frame to scan.");
  };

  const captureFromIPCam = () => {
    if (!ipImageRef.current || !ipCanvasRef.current) return;
    const img = ipImageRef.current;
    const canvas = ipCanvasRef.current;
    if (!img.naturalWidth || !img.naturalHeight) {
      setFeedbackForSection("ipcam", "error", "The live frame is not ready yet. Give it a moment, then try again.");
      return;
    }
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/png");
    setIpCamCaptured(data);
    setFeedbackForSection("ipcam", "success", "Frame captured. Start the scan whenever you are ready.");
  };

  const openSection = (id) => {
    setActiveSection(id);
    if (id !== "camera") stopCamera();
  };

  const visibleResultSection = results[activeSection]
    ? activeSection
    : results[lastResultSection]
      ? lastResultSection
      : "details";

  const activeResult = results[visibleResultSection];
  const activeLoading = loading[activeSection];
  const activeFeedback = sectionFeedback[activeSection];
  const savedResultLabel = lastScanSummary?.disease
    ? `Last result: ${lastScanSummary.disease} (${formatRelativeTime(lastScanSummary.timestamp)})`
    : "";
  const dashboardConfidence = activeResult?.accuracy || DEFAULT_RESULT_BADGE;
  const loaderVariant = activeSection === "details" ? "thinking-dots" : activeSection === "upload" ? "scan-line" : "pulse-grid";
  const loaderMessages =
    activeSection === "details"
      ? ["Reviewing your responses...", "Analyzing visible patterns...", "Reviewing possible conditions..."]
      : activeSection === "upload"
        ? ["Preparing image...", "Analyzing visible patterns...", "Reviewing possible conditions..."]
        : ["Preparing image...", "Analyzing visible patterns...", "Reviewing possible conditions..."];
  const fieldClass = "field-base";
  const textInputClass = fieldClass;
  const selectClass = `${fieldClass} appearance-none`;
  const nestedCardClass = "card-base p-5";
  const labelTextClass = "text-sm theme-text-secondary";
  const descriptionTextClass = "text-sm theme-text-secondary";
  const actionRowClass = "flex flex-wrap gap-3 pt-4";
  const resultCardClass = "card-base p-5";

  const retryLastAnalysis = async () => {
    if (visibleResultSection === "upload") {
      if (selectedFile) {
        await submitImage("upload", selectedFile);
      } else {
        openSection("upload");
        setFeedbackForSection("upload", "error", "Add a clearer image before trying again.");
      }
      return;
    }

    if (visibleResultSection === "camera") {
      if (cameraCaptured) {
        await submitImage("camera", cameraCaptured);
      } else {
        openSection("camera");
        setFeedbackForSection("camera", "error", "Capture a new image before trying again.");
      }
      return;
    }

    if (visibleResultSection === "ipcam") {
      if (ipCamCaptured) {
        await submitImage("ipcam", ipCamCaptured);
      } else {
        openSection("ipcam");
        setFeedbackForSection("ipcam", "error", "Capture a clearer frame before trying again.");
      }
      return;
    }

    openSection("details");
    setFeedbackForSection("details", "info", "Review your answers or add an image for a clearer skin check.");
  };

  const renderFeedback = (feedback) => {
    if (!feedback?.message) return null;

    const feedbackToneClass =
      feedback.tone === "error"
        ? "border-red-400/25 bg-red-400/10 text-red-300"
        : feedback.tone === "success"
          ? "border-mint-400/30 bg-mint-400/10 text-mint-200"
          : "border-mint-400/20 bg-mint-400/8 text-[var(--text)]";

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${feedback.tone}-${feedback.message}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`card-base flex items-start gap-3 p-4 text-sm ${feedbackToneClass}`}
        >
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/20 bg-current/10 text-xs font-semibold" aria-hidden="true">
            {feedback.tone === "error" ? "!" : feedback.tone === "success" ? "\u2713" : "i"}
          </span>
          <span className="leading-6">{feedback.message}</span>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderDiagnosis = (data) => {
    if (!data) return null;
    const isError = data.disease === "Error";
    const isNormalSkinResult = data.disease === NORMAL_SKIN_RESULT;
    const isUncertainResult = data.disease === UNCERTAIN_RESULT;
    const confidence = Number.parseFloat(data.accuracy);
    const confidenceWidth = Number.isNaN(confidence) ? 0 : Math.max(Math.min(confidence, 100), 4);
    const tier = Number.isNaN(confidence)
      ? "confidence-medium"
      : confidence >= 80
        ? "confidence-high"
        : confidence >= 50
          ? "confidence-medium"
          : "confidence-low";

    return (
      <div className="grid gap-6">
        {isError ? (
          <div className="card-base border-red-400/25 bg-red-400/10 p-5 text-red-300" role="alert">
            <div className="grid gap-4">
              <p className="leading-7">We couldn&apos;t complete this review yet. Try a clearer photo or check that the backend service is available.</p>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={retryLastAnalysis}>
                  Try Again
                </Button>
                <Button type="button" variant="secondary" onClick={() => openSection(visibleResultSection)}>
                  Review Input
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <InfoCard
            tilt={false}
            eyebrow="Early Signal Detection"
            title="Possible Condition Insight"
            description={
              isNormalSkinResult
                ? "Skin appears normal or no visible lesion was detected in this image."
                : isUncertainResult
                  ? "The scan could not reliably match the image to a HAM10000 lesion class."
                  : "This early indication is based on visible patterns such as color variation, texture, and shape."
            }
          >
            <h3 className="pt-4 font-display text-3xl font-semibold text-mint-300 sm:text-4xl">{data.disease}</h3>
          </InfoCard>
          <div className={`card-base inline-flex h-fit items-center rounded-full px-4 py-3 text-sm font-semibold ${tier === "confidence-high" ? "border-mint-400/35 text-mint-300" : tier === "confidence-low" ? "border-amber-300/35 text-amber-200" : "border-sky-300/35 text-sky-200"}`}>
            {data.accuracy} confidence
          </div>
        </div>

        {!Number.isNaN(confidence) ? (
          <div className={resultCardClass}>
            <p className="eyebrow-text">Match Confidence</p>
            <div className="mt-4 grid gap-3">
              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${tier === "confidence-high" ? "from-mint-400 to-emerald-300" : tier === "confidence-low" ? "from-amber-300 to-orange-300" : "from-sky-300 to-cyan-300"}`}
                  style={{ width: `${confidenceWidth}%` }}
                />
              </div>
              <p className="theme-text-secondary text-sm leading-7">
                This gives a quick sense of how strongly the visible pattern matched similar examples.
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className={resultCardClass}>
            <p className="eyebrow-text">Visible Signs</p>
            <p className="mt-3 theme-text-secondary">{data.effects}</p>
          </div>
          <div className={resultCardClass}>
            <p className="eyebrow-text">Possible Cause</p>
            <p className="mt-3 theme-text-secondary">{data.cause}</p>
          </div>
          <div className={resultCardClass}>
            <p className="eyebrow-text">Care Guidance</p>
            <p className="mt-3 theme-text-secondary">{data.medications}</p>
          </div>
          <div className={resultCardClass}>
            <p className="eyebrow-text">Expected Recovery Time</p>
            <p className="mt-3 theme-text-secondary">{data.timePeriod}</p>
          </div>
          <div className={resultCardClass}>
            <p className="eyebrow-text">Healthy Habits and Foods</p>
            <p className="mt-3 theme-text-secondary">{data.healthyHabits}</p>
          </div>
          <div className={resultCardClass}>
            <p className="eyebrow-text">Next-Step Guidance</p>
            <p className="mt-3 theme-text-secondary">{data.cure}</p>
          </div>
        </div>

        {data.top3?.length > 0 && (
          <div className={resultCardClass}>
            <p className="eyebrow-text">{isNormalSkinResult || isUncertainResult ? "Closest Lesion Matches" : "Top 3 Predictions"}</p>
            <div className="mt-4 grid gap-4">
              {data.top3.map((item, index) => (
                <div className="grid gap-2" key={`${item.label}-${index}`}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="theme-text-primary font-medium">{item.label}</span>
                    <span className="theme-text-secondary">{item.confidence}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-emerald-300" style={{ width: `${item.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card-base border-amber-300/20 bg-amber-300/10 px-5 py-4 text-sm text-amber-100" role="note">
          This result is for early support only and not a medical diagnosis. Always consult a qualified professional.
        </div>

        <div className="card-base border-amber-300/18 bg-amber-300/8 px-5 py-4 text-sm theme-text-primary">
          <strong>Consult a Doctor:</strong> This is an AI-generated analysis. Always consult a licensed dermatologist
          for an accurate diagnosis and treatment plan.
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <PageSection first>
        <PageHero
          eyebrow="Detection"
          title="Skin Concern Review"
          subtitle="Upload affected-area images and answer a few prompts to get an early AI-supported indication in seconds."
        />
      </PageSection>

      <PageSection>
        <div className="grid gap-8 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
          <aside className="grid gap-6 xl:sticky xl:top-24 xl:h-fit">
            <div className="card-base p-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
                {["details", "upload", "camera", "ipcam"].map((id) => (
                  <Button
                    key={id}
                    type="button"
                    variant={activeSection === id ? "primary" : "ghost"}
                    onClick={() => openSection(id)}
                    className={activeSection === id ? "shadow-[0_18px_40px_rgba(53,201,139,0.16)]" : "theme-text-secondary"}
                  >
                    {id === "ipcam" ? "IP Cam" : id.charAt(0).toUpperCase() + id.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {activeSection === "details" && (
              <InfoCard tilt={false} title="Personalized Skin Review" description="Answer a guided set of prompts so the review summary can add better context to your image-based result." className="p-6">
                <div className="space-y-6">
                  {renderFeedback(activeSection === "details" ? activeFeedback : null)}

                  {!started && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className={labelTextClass} htmlFor="locationType">
                          Where is the issue located?
                        </label>
                        <select id="locationType" className={selectClass} value={locationType} onChange={(e) => setLocationType(e.target.value)}>
                          <option value="face">Face</option>
                          <option value="other">Other Body Area</option>
                        </select>
                      </div>

                      <div className={actionRowClass}>
                        <Button type="button" onClick={handleStartDetails}>
                          Start Skin Check
                        </Button>
                      </div>
                    </div>
                  )}

                  {started && (
                    <>
                      <div className="grid gap-2">
                        <div className="h-2 overflow-hidden rounded-full bg-white/8">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-mint-400 to-emerald-300 transition-[width] duration-300"
                            style={{ width: `${Math.max((answeredCount / questions.length) * 100, 2)}%` }}
                          />
                        </div>
                        <p className="text-sm theme-text-secondary">
                          {answeredCount}/{questions.length} answered
                        </p>
                      </div>

                      <motion.div
                        key={`q-${current}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${nestedCardClass} space-y-4`}
                      >
                        <div className="space-y-2">
                          <p className={labelTextClass}>Current question</p>
                          <label className="text-lg font-medium leading-7 theme-text-primary">{`${current + 1}. ${currentQuestion.q}`}</label>
                        </div>

                        {currentQuestion.type === "select" && (
                          <select
                            className={selectClass}
                            value={typeof answers[current] === "string" ? answers[current] : "Select an option"}
                            onChange={(e) => handleSelectAnswer(current, e.target.value)}
                          >
                            {currentQuestion.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}

                        {currentQuestion.type === "multi-select" && (
                          <div className="grid gap-3">
                            {currentQuestion.options.map((opt) => {
                              const selected = Array.isArray(answers[current]) ? answers[current] : [];
                              const checked = selected.includes(opt);
                              return (
                                <label key={opt} className="card-base flex items-center justify-between gap-4 rounded-xl px-4 py-3 theme-text-primary">
                                  <span className="leading-6">{opt}</span>
                                  <input
                                    className="h-4 w-4 rounded border-white/20 bg-transparent accent-mint-400"
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {
                                      const next = checked ? selected.filter((s) => s !== opt) : [...selected, opt];
                                      handleSelectAnswer(current, next);
                                    }}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {current < questions.length - 1 && (
                          <div className={actionRowClass}>
                            <Button type="button" onClick={nextQuestion} disabled={!canProceedCurrent}>
                              Next Question
                            </Button>
                          </div>
                        )}
                      </motion.div>

                      {current === questions.length - 1 && (
                        <div className={actionRowClass}>
                          <Button
                            type="button"
                            onClick={submitDetailsAnswers}
                            disabled={!canProceedCurrent || loading.details}
                          >
                            {loading.details ? "Preparing skin check..." : "Prepare Skin Check"}
                          </Button>
                          <Button type="button" variant="secondary" onClick={resetDetailFlow}>
                            Clear All
                          </Button>
                        </div>
                      )}
                    </>
                  )}

                  <AnimatePresence>
                    {submittedMsg ? (
                      <motion.p
                        className="text-sm theme-text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {submittedMsg}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>
              </InfoCard>
            )}

            {activeSection === "upload" && (
              <InfoCard tilt={false} title="Upload a Clear Affected Area Image" description="Keep the affected area centered and well-lit. Avoid filters, blur, and heavy shadows." className="p-6">
                <div className="space-y-6">
                  <p className="text-xs theme-text-secondary">Your image is not stored and is processed securely.</p>
                  {renderFeedback(activeSection === "upload" ? activeFeedback : null)}

                  <div className="space-y-4">
                    <Button as="label" htmlFor="imageInput">
                      <span>Choose Image</span>
                      <input id="imageInput" type="file" accept="image/*" onChange={handleFileChange} hidden />
                    </Button>
                    {selectedFile && <p className={descriptionTextClass}>{selectedFile.name}</p>}
                  </div>

                  {!previewImage && (
                    <div className={`${nestedCardClass} space-y-3`}>
                      <h4 className="font-semibold theme-text-primary">Upload a clear image to begin your skin review.</h4>
                      <p className="theme-text-secondary">We&apos;ll analyze visible patterns and guide your next step.</p>
                      <ul className="grid gap-2 pl-5 text-sm theme-text-secondary">
                        <li>Ensure good lighting</li>
                        <li>Focus clearly on the affected area</li>
                        <li>Avoid blurry images</li>
                      </ul>
                    </div>
                  )}

                  {previewImage && (
                    <div className={`${nestedCardClass} space-y-4`}>
                      <img src={previewImage} alt="Preview" className="w-full rounded-2xl object-cover" />
                      <div className={actionRowClass}>
                        <Button
                          type="button"
                          onClick={() => submitImage("upload", selectedFile)}
                          disabled={loading.upload}
                        >
                          {loading.upload ? "Preparing image..." : "Start Skin Check"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={clearImage}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </InfoCard>
            )}

            {activeSection === "camera" && (
              <InfoCard tilt={false} title="Live Camera Capture" description="Open your camera, frame the affected area clearly, then capture a sharp image for review." className="p-6">
                <div className="space-y-6">
                  {renderFeedback(activeSection === "camera" ? activeFeedback : null)}

                  <div className="card-base flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl p-4 text-center">
                    {!cameraOpened && !cameraCaptured ? <p className={descriptionTextClass}>Camera preview will appear here after you start the camera.</p> : null}
                    <video ref={videoRef} autoPlay muted className={cameraOpened ? "h-full w-full rounded-2xl object-cover" : "hidden"} />
                    {cameraCaptured ? <img src={cameraCaptured} alt="Captured" className="h-full w-full rounded-2xl object-cover" /> : null}
                  </div>
                  <canvas ref={captureCanvasRef} className="hidden" />

                  <div className={actionRowClass}>
                    {!cameraOpened && !cameraCaptured ? (
                      <Button type="button" onClick={startCamera}>
                        Open Camera
                      </Button>
                    ) : null}
                    {cameraOpened ? (
                      <>
                        <Button type="button" onClick={captureFromCamera}>
                          Capture
                        </Button>
                        <Button type="button" variant="secondary" onClick={stopCamera}>
                          Cancel
                        </Button>
                      </>
                    ) : null}
                    {cameraCaptured ? (
                      <>
                        <Button
                          type="button"
                          onClick={() => submitImage("camera", cameraCaptured)}
                          disabled={loading.camera}
                        >
                          {loading.camera ? "Preparing image..." : "Start Skin Check"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setCameraCaptured("")}>
                          Retake
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </InfoCard>
            )}

            {activeSection === "ipcam" && (
              <InfoCard tilt={false} title="Mobile IP Camera" description="Paste your IP webcam feed URL, connect it, then capture a frame once the preview is ready." className="p-6">
                <div className="space-y-6">
                  {renderFeedback(activeSection === "ipcam" ? activeFeedback : null)}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className={labelTextClass} htmlFor="ipcamURL">
                        IP Webcam URL
                      </label>
                      <input
                        id="ipcamURL"
                        className={`${textInputClass} ${ipCamFeedback === "Invalid URL format" ? "border-red-400 focus:ring-red-400/30" : ""}`}
                        type="text"
                        value={ipCamUrl}
                        placeholder="http://192.168.x.x:8080/video"
                        onChange={(e) => {
                          setIpCamUrl(e.target.value);
                          validateIpUrl(e.target.value);
                        }}
                      />
                      {ipCamFeedback ? (
                        <div className={`text-sm ${ipCamFeedback === "Looks good" ? "text-mint-300" : "text-red-400"}`}>
                          {ipCamFeedback}
                        </div>
                      ) : null}
                    </div>

                    <div className={actionRowClass}>
                      <Button type="button" onClick={connectIPCam}>
                        Connect
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setIpCamUrl("");
                          setIpCamFeedUrl("");
                          setIpCamCaptured("");
                          setIpCamFeedback("");
                        }}
                      >
                        Re-enter
                      </Button>
                    </div>
                  </div>

                  <div className="card-base flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl p-4 text-center">
                    {ipCamFeedUrl ? (
                      <img ref={ipImageRef} src={ipCamFeedUrl} alt="IP Cam Feed" className="h-full w-full rounded-2xl object-cover" />
                    ) : (
                      <p className={descriptionTextClass}>The connected IP camera feed will appear here.</p>
                    )}
                  </div>
                  <canvas ref={ipCanvasRef} className="hidden" />

                  {ipCamCaptured ? (
                    <div className={nestedCardClass}>
                      <img src={ipCamCaptured} alt="IP Capture" className="w-full rounded-2xl object-cover" />
                    </div>
                  ) : null}

                  <div className={actionRowClass}>
                    <Button type="button" onClick={captureFromIPCam} disabled={!ipCamFeedUrl}>
                      Capture
                    </Button>
                    {ipCamCaptured ? (
                      <>
                        <Button
                          type="button"
                          onClick={() => submitImage("ipcam", ipCamCaptured)}
                          disabled={loading.ipcam}
                        >
                          {loading.ipcam ? "Preparing image..." : "Start Skin Check"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setIpCamCaptured("")}>
                          Retake
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </InfoCard>
            )}

            <div className="flex flex-wrap gap-3">
              <Button to="/" variant="secondary">
                Back Home
              </Button>
              <Button to="/routine" variant="ghost">
                Create Routine Plan
              </Button>
            </div>
          </aside>

          <section className="grid gap-6">
            <div className="card-base p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="eyebrow-text">Possible Condition Insight</p>
                  <h2 className="heading-2">Review Summary</h2>
                  <p className="body-base">Real-time AI-supported review for possible visible skin patterns.</p>
                  {savedResultLabel ? <p className="text-sm theme-text-secondary">{savedResultLabel}</p> : null}
                </div>

                <div className="card-base inline-flex h-fit items-center rounded-full px-4 py-3 text-sm font-semibold text-mint-300">
                  {activeResult?.accuracy ? `${dashboardConfidence} confidence` : dashboardConfidence}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100" role="note">
                This result is for early support only and not a medical diagnosis. Always consult a qualified professional.
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!activeLoading && !activeResult ? (
                <motion.div
                  key="empty-result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="card-base p-6"
                >
                  <h4 className="text-xl font-semibold theme-text-primary">No review yet</h4>
                  <p className="mt-3 theme-text-secondary">
                    Upload a clear image to begin your skin review.
                    We&apos;ll analyze visible patterns and guide your next step.
                  </p>
                </motion.div>
              ) : null}

              {activeLoading ? (
                <motion.div
                  key={`loading-${activeSection}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="card-base grid gap-5 p-6"
                >
                  <AILoader
                    variant={loaderVariant}
                    label={loaderMessages[0]}
                    messages={loaderMessages}
                    showProgress
                    messageDuration={1600}
                  />
                  <SkeletonCard lines={3} />
                  <SkeletonCard lines={4} />
                  <SkeletonCard lines={3} />
                </motion.div>
              ) : null}

              {!activeLoading && activeResult ? (
                <motion.div
                  key={`result-${visibleResultSection}-${activeResult.disease}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {renderDiagnosis(activeResult)}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </section>
        </div>
      </PageSection>
    </MainLayout>
  );
}

export default Disease;
