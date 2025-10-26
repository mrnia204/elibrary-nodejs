import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, XCircle, Download, AlertCircle } from "lucide-react";
import { post } from '@/lib/http';
import axios from "axios";

interface UploadResult {
  success: boolean;
  message: string;
  data?: {
    successful: number;
    failed: number;
    total: number;
    errors: string[];
  };
}

const BulkUploadStudents = ({ onUploadComplete }: { onUploadComplete?: () => void }) => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      setResult(null);
      setUploadProgress(0);
    }
  };

  async function handleUpload () {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    setResult(null);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => (prev>= 90 ? 90 : prev + 10));
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('csvFile', selectedFile);
      formData.append('action', 'bulk_upload_students');

      const response = await  post('upload_bulk_students.php', formData);
      const result = response; // <-- removed .data

      clearInterval(progressInterval);
      setUploadProgress(100);

      setResult(result);

      if (result.success && onUploadComplete) {
        onUploadComplete();
      }
    } catch(error: unknown) {
      clearInterval(progressInterval);
      setUploadProgress(0);

      console.log("Upload error", error);

      let message = "An error occurred during upload";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      setResult({ success: false, message});
    } finally {
      setUploading(false);
    }
  }

  const downloadTemplate = () => {
    const csvContent = `student_id,full_name,email,phone,grade,class,address,username,password
      ST001,John Doe,john.doe@email.com,1234567890,10,10A,123 Main St,johndoe,password123
      ST002,Jane Smith,jane.smith@email.com,0987654321,10,10B,456 Oak Ave,janesmith,password456
      ST003,Alice Johnson,alice.johnson@email.com,5551234567,9,9A,789 Pine St,alicej,pass1234
      ST004,Bob Williams,bob.williams@email.com,5559876543,11,11C,321 Elm St,bobw,securepass
      ST005,Charlie Brown,charlie.brown@email.com,5554445555,10,10A,654 Maple Dr,charlieb,mysecret`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const progress = result?.data 
    ? (result.data.successful / result.data.total) * 100 
    : uploadProgress;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Bulk Upload Students
        </CardTitle>
        <CardDescription>
          Upload a CSV file to create multiple students at once. Ensure the CSV follows the required format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <Button variant="outline" asChild className="cursor-pointer">
              <span>Select CSV File</span>
            </Button>
          </label>
          {selectedFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Selected: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            CSV format: student_id, full_name, email, phone, grade, class, address, username, password
          </p>
        </div>

        {/* Download Template */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" />
            Download Template
          </Button>

          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
            className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload Students"}
          </Button>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 text-center">
              {progress < 100 ? "Processing CSV file..." : "Finalizing..."}
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {result.message}
              </AlertDescription>
            </Alert>

            {result.data && (
              <>
                {result.data.successful > 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{result.data.successful} students created successfully</span>
                  </div>
                )}

                {result.data.failed > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">{result.data.failed} records failed:</span>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                      {result.data.errors.map((error, index) => (
                        <p key={index} className="text-sm text-red-700">{error}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BulkUploadStudents;