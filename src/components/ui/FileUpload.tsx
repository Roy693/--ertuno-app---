import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Camera, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { useI18n } from '../../hooks/useI18n';

interface FileUploadProps {
  label: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  required?: boolean;
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string;
  className?: string;
  preview?: boolean;
  uploadType?: 'image' | 'document' | 'any';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  accept,
  multiple = false,
  maxFiles = multiple ? 10 : 1,
  maxSize = 10, // 10MB default
  required = false,
  files,
  onFilesChange,
  error,
  className = '',
  preview = true,
  uploadType = 'any'
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const validateFiles = (fileList: File[]): { valid: File[], errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    fileList.forEach(file => {
      // Size validation
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(t('kyc.fileTooLarge', `${file.name} is too large (max ${maxSize}MB)`));
        return;
      }

      // Type validation
      if (uploadType === 'image' && !file.type.startsWith('image/')) {
        errors.push(t('kyc.invalidImageType', `${file.name} must be an image`));
        return;
      }

      if (uploadType === 'document' && 
          !file.type.includes('pdf') && 
          !file.type.startsWith('image/')) {
        errors.push(t('kyc.invalidDocumentType', `${file.name} must be PDF or image`));
        return;
      }

      valid.push(file);
    });

    // Check total count
    const totalFiles = files.length + valid.length;
    if (totalFiles > maxFiles) {
      errors.push(t('kyc.tooManyFiles', `Maximum ${maxFiles} files allowed`));
      return { valid: [], errors };
    }

    return { valid, errors };
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const { valid, errors } = validateFiles(newFiles);

    if (errors.length > 0) {
      setValidationError(errors.join(', '));
      return;
    }

    setValidationError('');
    
    if (multiple) {
      onFilesChange([...files, ...valid]);
    } else {
      onFilesChange(valid);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Camera;
    if (file.type.includes('pdf')) return FileText;
    return Upload;
  };

  const displayError = error || validationError;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
          dragActive
            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/10'
            : displayError
            ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
            : files.length > 0
            ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="text-center">
          {files.length === 0 ? (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  {t('kyc.clickToUpload', 'Click to upload')}
                </button>
                <span> {t('kyc.orDragDrop', 'or drag and drop')}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {uploadType === 'image' && t('kyc.imageFormats', 'PNG, JPG, GIF up to')} {maxSize}MB
                {uploadType === 'document' && t('kyc.documentFormats', 'PDF, PNG, JPG up to')} {maxSize}MB
                {uploadType === 'any' && t('kyc.maxSize', 'Max size:')} {maxSize}MB
              </p>
            </>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="inline w-5 h-5 text-green-500 mr-2" />
              {t('kyc.filesSelected', `${files.length} file(s) selected`)}
              {multiple && files.length < maxFiles && (
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="ml-4 font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  {t('kyc.addMore', 'Add more')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* File Previews */}
      {preview && files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((file, index) => {
            const Icon = getFileIcon(file);
            const isImage = file.type.startsWith('image/');
            const fileUrl = URL.createObjectURL(file);

            return (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-3"
              >
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* File Preview */}
                <div className="flex items-center space-x-3">
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={file.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onLoad={() => URL.revokeObjectURL(fileUrl)}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          {displayError}
        </motion.div>
      )}
    </div>
  );
};