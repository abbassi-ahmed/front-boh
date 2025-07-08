import type React from "react";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Tabs,
  Tab,
  Textarea,
  Chip,
  Divider,
  Progress,
} from "@heroui/react";
import {
  Upload,
  FileImage,
  FileText,
  AlertCircle,
  CheckCircle,
  Brain,
  Eye,
  Zap,
  FileCheck,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import { baseUrl } from "../../hooks/fetch-api.hook";

export interface OCRWord {
  text: string;
}

export interface OCRPage {
  index: number;
  markdown: string;
  images: any[];
  dimensions: any;
}

export interface OCRBackendResult {
  pages: OCRPage[];
  model: string;
  documentAnnotation: any;
  usageInfo: {
    pagesProcessed: number;
    docSizeBytes: number;
  };
}

export interface OCRResponse {
  success: boolean;
  data: OCRBackendResult;
}

export interface OCRResult {
  text: string;
  words?: OCRWord[];
}

export default function OCRDemo() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"image" | "pdf">("image");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const askQuestion = async (): Promise<void> => {
    if (!result?.text) {
      setAskError("No extracted text available to analyze");
      return;
    }
    if (!question.trim()) {
      setAskError("Please enter a question");
      return;
    }

    setIsAsking(true);
    setAskError(null);

    try {
      const response = await axios.post(`${baseUrl}ocr/ask`, {
        context: result.text,
        question: question.trim(),
      });
      setAiResponse(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setAskError(`Failed to get answer: ${errorMessage}`);
    } finally {
      setIsAsking(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const maxSize = activeTab === "pdf" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (uploadedFile.size > maxSize) {
      setError(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    if (
      (activeTab === "image" && !uploadedFile.type.startsWith("image/")) ||
      (activeTab === "pdf" && uploadedFile.type !== "application/pdf")
    ) {
      setError(
        activeTab === "image"
          ? "Please upload a valid image file (JPG, PNG)"
          : "Please upload a valid PDF file"
      );
      return;
    }

    setError(null);
    setFile(uploadedFile);

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    if (activeTab === "image") {
      setImage(URL.createObjectURL(uploadedFile));
    } else {
      setImage(null);
    }
  };

  const processOCR = async (): Promise<void> => {
    if (!file) {
      setError(
        `Please upload an ${activeTab === "image" ? "image" : "PDF"} first`
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append(activeTab === "image" ? "image" : "pdf", file);
      const endpoint = activeTab === "image" ? "ocr" : "ocr/pdf";

      const response = await axios.post<OCRResponse>(
        `${baseUrl}${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        const extractedText =
          activeTab === "image"
            ? response.data.data.pages[0]?.markdown ||
              "No text found in the image"
            : response.data.data.pages
                .map((page) => page.markdown || "No text found in this page")
                .join("\n\n--- PAGE BREAK ---\n\n");

        setResult({
          text: extractedText,
          words: extractWordsFromText(extractedText),
        });
      } else {
        setError("Failed to process OCR");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(
        `Failed to process ${
          activeTab === "image" ? "image" : "PDF"
        }: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  };

  const extractWordsFromText = (text: string): OCRWord[] => {
    return text
      .split(/\s+/)
      .filter((word) => word.trim().length > 0)
      .map((word) => ({
        text: word,
      }));
  };

  const resetForm = (): void => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    setQuestion("");
    setAiResponse(null);
    setAskError(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600/20 rounded-lg">
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Mistral OCR Demo</h1>
            <p className="text-zinc-400 mt-1">
              Extract and analyze text from images or PDFs using AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            variant="dot"
            color="success"
            size="sm"
            className="bg-zinc-800/50 text-zinc-300"
          >
            AI Powered
          </Chip>
        </div>
      </div>

      {/* Tabs */}
      <Card className="bg-transparent">
        <CardBody className="p-0">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key: any) =>
              setActiveTab(key as "image" | "pdf")
            }
            className="w-full"
            classNames={{
              tabList: "bg-zinc-800/30 p-1 rounded-lg",
              tab: "text-zinc-400 data-[selected=true]:text-white data-[selected=true]:bg-purple-600",
              cursor: "bg-purple-600",
              panel: "p-6",
            }}
          >
            <Tab
              key="image"
              title={
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Image OCR
                </div>
              }
            />
            <Tab
              key="pdf"
              title={
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF OCR
                </div>
              }
            />
          </Tabs>
        </CardBody>
      </Card>

      {/* Upload Card */}
      <Card className="bg-zinc-900/50 border-zinc-800/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Upload className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Upload {activeTab === "image" ? "Image" : "PDF"}
              </h2>
              <p className="text-zinc-400 text-sm">
                {activeTab === "image"
                  ? "JPG, PNG (MAX. 5MB)"
                  : "PDF (MAX. 10MB)"}
              </p>
            </div>
          </div>
        </CardHeader>

        <Divider className="bg-zinc-800/50" />

        <CardBody className="space-y-6">
          {/* File Upload Area */}
          <div className="relative">
            <input
              type="file"
              accept={activeTab === "image" ? "image/*" : ".pdf"}
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center hover:border-purple-500 hover:bg-purple-900/10 transition-all duration-200">
              {activeTab === "image" ? (
                <FileImage className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              ) : (
                <FileText className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
              )}
              <p className="text-zinc-300 mb-2">
                <span className="font-semibold text-purple-400">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-sm text-zinc-500">
                {activeTab === "image"
                  ? "JPG, PNG (MAX. 5MB)"
                  : "PDF (MAX. 10MB)"}
              </p>
            </div>
          </div>

          {/* Upload Progress */}
          {file && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Uploading {file.name}</span>
                <span className="text-purple-400">{uploadProgress}%</span>
              </div>
              <Progress
                value={uploadProgress}
                color="secondary"
                className="bg-zinc-800"
              />
            </div>
          )}

          {/* Preview */}
          {image && (
            <Card className="bg-zinc-800/50 border-zinc-700/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <h3 className="text-lg font-medium text-white">Preview</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Uploaded preview"
                    className="max-h-60 rounded-lg shadow-lg"
                  />
                </div>
              </CardBody>
            </Card>
          )}

          {/* File Info */}
          {file && (
            <Card className="bg-zinc-800/30 border-zinc-700/50">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-zinc-400 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Chip size="sm" color="success" variant="flat">
                    Ready
                  </Chip>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              color="secondary"
              size="lg"
              onPress={processOCR}
              isDisabled={loading || !file}
              isLoading={loading}
              startContent={!loading && <Zap className="w-4 h-4" />}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              {loading
                ? "Processing..."
                : `Extract Text (${activeTab.toUpperCase()})`}
            </Button>
            {(image || result || error) && (
              <Button
                variant="bordered"
                size="lg"
                onPress={resetForm}
                isDisabled={loading}
                className="border-zinc-700 text-zinc-300 hover:border-purple-500"
              >
                Reset
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardBody>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-400">Error</h3>
                <p className="text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardBody className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" color="secondary" />
              <div>
                <p className="text-white font-medium">
                  Processing your {activeTab === "image" ? "image" : "PDF"}...
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  This may take a few moments
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Results Display */}
      {result && (
        <Card className="bg-zinc-900/50 border-zinc-800/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">
                  OCR Results
                </h2>
                <p className="text-zinc-400 text-sm">
                  Text successfully extracted and ready for analysis
                </p>
              </div>
            </div>
          </CardHeader>

          <Divider className="bg-zinc-800/50" />

          <CardBody className="space-y-6">
            {/* Extracted Text */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Extracted Text
              </h3>
              <Card className="bg-zinc-800/50 border-zinc-700/50">
                <CardBody>
                  <pre className="text-zinc-200 whitespace-pre-wrap leading-relaxed font-mono text-sm max-h-60 overflow-y-auto">
                    {result.text}
                  </pre>
                </CardBody>
              </Card>
            </div>

            {/* Question Input */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Ask about this content
              </h3>
              <div className="space-y-3">
                <Textarea
                  value={question}
                  onChange={(e: any) => setQuestion(e.target.value)}
                  placeholder="Example: How many years of experience does this person have?"
                  minRows={3}
                  variant="bordered"
                  classNames={{
                    input: "text-white placeholder:text-zinc-500",
                    inputWrapper: [
                      "bg-zinc-800/50",
                      "border-zinc-700/50",
                      "hover:border-purple-500/50",
                      "focus-within:border-purple-500",
                      "group-data-[focus=true]:border-purple-500",
                    ],
                  }}
                />
                <div className="flex justify-end">
                  <Button
                    color="secondary"
                    onPress={askQuestion}
                    isDisabled={isAsking || !result?.text || !question.trim()}
                    isLoading={isAsking}
                    endContent={!isAsking && <Brain className="w-4 h-4" />}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isAsking ? "Analyzing..." : "Ask Question"}
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Response */}
            {aiResponse && (
              <div>
                <h3 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  AI Response
                </h3>
                <Card className="bg-purple-900/20 border-purple-500/50">
                  <CardBody>
                    <p className="text-zinc-200 whitespace-pre-wrap leading-relaxed">
                      {aiResponse}
                    </p>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Ask Error */}
            {askError && (
              <Card className="bg-red-900/20 border-red-500/50">
                <CardBody>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-red-400">Error</h3>
                      <p className="text-red-300 mt-1">{askError}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
