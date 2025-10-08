import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type DocumentCategory = 'general' | 'technical' | 'business' | 'research' | 'other';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  success: boolean;
  category: DocumentCategory;
  processingStatus: ProcessingStatus;
  documentId?: string; // ID from the backend
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const UPLOAD_URL = `${API_BASE_URL}/documents/upload`;
const DELETE_URL = API_BASE_URL; // Base URL for document deletion

export function useFileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<DocumentCategory[]>([
    'general', 'technical', 'business', 'research', 'other'
  ]);

  // Load uploaded files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles).map((file: any) => ({
        ...file,
        uploadDate: new Date(file.uploadDate),
        category: file.category || 'general', // Default category for backward compatibility
        processingStatus: file.processingStatus || 'completed' // Default status for backward compatibility
      })));
    }
  }, []);

  // Save uploaded files to localStorage
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  // Upload files with category
  const uploadFiles = async (files: FileList | null, category: DocumentCategory = 'general') => {
    if (!files) return;

    setIsUploading(true);
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append('file', file);
      // Add category as metadata
      formData.append('metadata', JSON.stringify({ category }));

      try {
        const response = await fetch(UPLOAD_URL, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          // Generate a unique ID for this upload entry
          const newFileId = uuidv4(); 
          
          // Add the file with the new ID and 'processing' status
          setUploadedFiles(prev => [{
            id: newFileId, // Use the generated ID
            name: file.name,
            size: file.size,
            uploadDate: new Date(),
            success: true,
            category,
            processingStatus: 'processing', // Initially set to processing
            documentId: data.document_id, 
          }, ...prev]);

          // Update status to 'completed' after a delay, using the generated ID
          setTimeout(() => {
            setUploadedFiles(prev => 
              prev.map(f => 
                // Find the file using the unique ID captured above
                f.id === newFileId 
                  ? { ...f, processingStatus: 'completed' } // Update status
                  : f // Keep other files unchanged
              )
            );
          }, 3000); // Keep the 3-second delay for now
        } else {
          // Handle failed upload (this part seems okay, but ensure ID generation is consistent if needed)
          console.error('Upload failed:', data);
          setUploadedFiles(prev => [{
            id: uuidv4(), // Generate ID for the failed entry
            name: file.name,
            size: file.size,
            uploadDate: new Date(),
            success: false,
            category,
            processingStatus: 'failed',
            documentId: undefined,
          }, ...prev]);
        }
      } catch (error) {
        // Handle network/fetch error (this part seems okay)
        console.error('Upload error:', error);
        setUploadedFiles(prev => [{
          id: uuidv4(), // Generate ID for the failed entry
          name: file.name,
          size: file.size,
          uploadDate: new Date(),
          success: false,
          category,
          processingStatus: 'failed',
          documentId: undefined,
        }, ...prev]);
      }
    }

    setIsUploading(false);
  };

  // Delete file locally
  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Delete file from backend and locally
  const deleteFileFromKnowledgeBase = async (fileId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${fileId}`, {
        method: 'DELETE',
        headers: {
          'accept': 'application/json',
        }
      });

      if (response.ok) {
        console.log(`Successfully deleted document ${fileId} from backend`);
        // The knowledge base file list will be refreshed automatically by the useFileList hook
        // or the parent component should call refresh
      } else {
        const errorData = await response.json();
        console.error('Error deleting document from knowledge base:', errorData);
        alert('Failed to delete document from knowledge base. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting to backend for deletion:', error);
      alert('Failed to connect to server. Please check your connection and try again.');
    }
  };

  // Update file category
  const updateFileCategory = (fileId: string, newCategory: DocumentCategory) => {
    setUploadedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, category: newCategory } 
          : file
      )
    );
  };

  // Get files by category
  const getFilesByCategory = (category: DocumentCategory | 'all') => {
    if (category === 'all') {
      return uploadedFiles;
    }
    return uploadedFiles.filter(file => file.category === category);
  };

  return {
    uploadedFiles,
    isUploading,
    uploadFiles,
    deleteFile,
    deleteFileFromKnowledgeBase,
    updateFileCategory,
    getFilesByCategory,
    categories
  };
} 