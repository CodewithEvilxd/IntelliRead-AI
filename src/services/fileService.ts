import * as pdfjsLib from 'pdfjs-dist';
import type { Attachment, ComparisonResult, ComparisonType } from '@/types';
import { chatWithContext } from './groqService';

// Define FileProcessingResult type locally since it's not in types yet
export interface FileProcessingResult {
  text: string;
  pageCount: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: Date | string | null;
    keywords?: string;
    [key: string]: unknown;
  };
}

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Utility function to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Supported file types
export const SUPPORTED_FILE_TYPES: Record<string, {
  mimeTypes: string[];
  extensions: string[];
  maxSize: number;
}> = {
  pdf: {
    mimeTypes: ['application/pdf'],
    extensions: ['.pdf'],
    maxSize: 15 * 1024 * 1024, // 15MB
  },
  docx: {
    mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    extensions: ['.docx'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  doc: {
    mimeTypes: ['application/msword'],
    extensions: ['.doc'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  pptx: {
    mimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    extensions: ['.pptx'],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
  ppt: {
    mimeTypes: ['application/vnd.ms-powerpoint'],
    extensions: ['.ppt'],
    maxSize: 20 * 1024 * 1024, // 20MB
  },
  txt: {
    mimeTypes: ['text/plain'],
    extensions: ['.txt'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

export type SupportedFileType = keyof typeof SUPPORTED_FILE_TYPES;

// Validate file
export const validateFile = (file: File): { valid: boolean; error?: string; fileType?: SupportedFileType } => {
  // Check file size
  const fileType = getFileType(file);
  if (!fileType) {
    return { valid: false, error: 'Unsupported file type. Please upload PDF, Word, PowerPoint, or text files.' };
  }

  const fileTypeConfig = SUPPORTED_FILE_TYPES[fileType];
  if (!fileTypeConfig) {
    return { valid: false, error: 'Unsupported file type configuration.' };
  }

  if (file.size > fileTypeConfig.maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of ${formatFileSize(fileTypeConfig.maxSize)} for ${fileType.toUpperCase()} files`,
    };
  }

  return { valid: true, fileType };
};

// Get file type from file
export const getFileType = (file: File): SupportedFileType | null => {
  // Check MIME type first
  for (const [type, config] of Object.entries(SUPPORTED_FILE_TYPES)) {
    if (config.mimeTypes.includes(file.type)) {
      return type as SupportedFileType;
    }
  }

  // Check file extension as fallback
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  for (const [type, config] of Object.entries(SUPPORTED_FILE_TYPES)) {
    if (config.extensions.includes(extension)) {
      return type as SupportedFileType;
    }
  }

  return null;
};

// Extract text from PDF
const extractTextFromPDF = async (file: File): Promise<FileProcessingResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer, verbosity: 0 }).promise;

  const textPages: string[] = [];
  let metadata: Record<string, unknown> = {};

  // Extract metadata
  try {
    const pdfMetadata = await pdf.getMetadata();
    const info = pdfMetadata.info as Record<string, unknown> | undefined;
    metadata = {
      title: info && typeof info['Title'] === 'string' ? info['Title'] : file.name.replace('.pdf', ''),
      author: info && typeof info['Author'] === 'string' ? info['Author'] : 'Unknown',
      subject: info && typeof info['Subject'] === 'string' ? info['Subject'] : 'Document Analysis',
      creator: info && typeof info['Creator'] === 'string' ? info['Creator'] : 'PDF Creator',
      producer: info && typeof info['Producer'] === 'string' ? info['Producer'] : 'Unknown',
      creationDate: (pdfMetadata.info && 'CreationDate' in pdfMetadata.info) ? (pdfMetadata.info as Record<string, unknown>).CreationDate : null,
      keywords: (pdfMetadata.info && 'Keywords' in pdfMetadata.info) ? (pdfMetadata.info as Record<string, unknown>).Keywords : '',
      pageCount: pdf.numPages,
    };
  } catch (metaError) {
    console.warn('Could not extract PDF metadata:', metaError);
  }

  // Extract text from each page
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item: unknown) => {
        if (item && typeof item === 'object' && 'str' in item && typeof (item as { str: unknown }).str === 'string') {
          return (item as { str: string }).str;
        }
        return '';
      })
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) {
      textPages.push(`--- Page ${pageNum} ---\n${pageText}\n`);
    }

    page.cleanup();
  }

  const fullText = textPages.join('\n').trim();

  if (!fullText || fullText.length < 10) {
    throw new Error('PDF appears to be empty or contains only images/scanned content. Text extraction failed.');
  }

  return {
    text: fullText,
    pageCount: pdf.numPages,
    metadata,
  };
};


// Extract text from PowerPoint files (basic implementation)
const extractTextFromPowerPoint = async (file: File): Promise<FileProcessingResult> => {
  // For now, we'll use a simple approach - this could be enhanced with a proper PPTX parser
  const arrayBuffer = await file.arrayBuffer();
  const text = new TextDecoder('utf-8').decode(arrayBuffer);

  // Extract readable text content (this is a basic implementation)
  const extractedText = text
    .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
    .replace(/\s+/g, ' ')
    .trim();

  if (!extractedText || extractedText.length < 10) {
    throw new Error('PowerPoint file appears to be empty or contains only images/media. Text extraction failed.');
  }

  const metadata = {
    title: file.name.replace(/\.(pptx|ppt)$/i, ''),
    author: 'Unknown',
    subject: 'PowerPoint Presentation',
    creator: 'PowerPoint',
    pageCount: Math.ceil(extractedText.split(/\n/).length / 50), // Rough estimate
  };

  return {
    text: extractedText,
    pageCount: metadata.pageCount,
    metadata,
  };
};

// Extract text from plain text files
const extractTextFromText = async (file: File): Promise<FileProcessingResult> => {
  const text = await file.text();

  if (!text || text.trim().length < 1) {
    throw new Error('Text file appears to be empty.');
  }

  const metadata = {
    title: file.name.replace('.txt', ''),
    author: 'Unknown',
    subject: 'Text Document',
    creator: 'Text Editor',
    pageCount: Math.ceil(text.split(/\n/).length / 50), // Rough estimate
  };

  return {
    text: text.trim(),
    pageCount: metadata.pageCount,
    metadata,
  };
};

// Main file processing function
export const processFile = async (file: File): Promise<Attachment> => {
  const validation = validateFile(file);
  if (!validation.valid || !validation.fileType) {
    throw new Error(validation.error);
  }

  console.log(`🚀 Starting file processing for: ${file.name} (${formatFileSize(file.size)})`);

  let extractionResult: FileProcessingResult;

  try {
    switch (validation.fileType) {
      case 'pdf':
        extractionResult = await extractTextFromPDF(file);
        break;
      case 'docx':
      case 'doc':
        throw new Error('Word document processing is not yet supported. Please use PDF, PowerPoint, or text files.');
      case 'pptx':
      case 'ppt':
        extractionResult = await extractTextFromPowerPoint(file);
        break;
      case 'txt':
        extractionResult = await extractTextFromText(file);
        break;
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('File extraction error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to extract text from ${validation.fileType.toUpperCase()}: ${error.message}`);
    }
    throw new Error(`Failed to extract text from ${validation.fileType.toUpperCase()}`);
  }

  // Create attachment object
  const attachment: Attachment = {
    id: generateId(),
    name: file.name,
    type: validation.fileType,
    size: file.size,
    url: URL.createObjectURL(file),
    extractedText: extractionResult.text,
    metadata: extractionResult.metadata || {},
  };

  console.log(`✅ File processing complete:`, {
    name: attachment.name,
    type: attachment.type,
    textLength: attachment.extractedText?.length || 0,
    pageCount: extractionResult.pageCount,
  });

  return attachment;
};

// Get file statistics
export const getFileStats = (attachment: Attachment): {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  pages: number;
} => {
  const text = attachment.extractedText || '';
  const words = text.split(/\s+/).filter(word => word.length > 0);
  const characters = text.length;
  const readingTime = Math.ceil(words.length / 200); // Assuming 200 words per minute

  return {
    wordCount: words.length,
    characterCount: characters,
    readingTime,
    pages: attachment.metadata?.pageCount || 1,
  };
};

// Search within file text
export const searchInFile = (text: string, query: string): boolean => {
  if (!text || !query) return false;
  return text.toLowerCase().includes(query.toLowerCase());
};

// Extract key information from text
export const extractKeyInfo = (text: string): {
  emails: string[];
  phones: string[];
  urls: string[];
  dates: string[];
} => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const urlRegex = /https?:\/\/[^\s]+/g;
  const dateRegex = /\b\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}\b|\b\d{4}[/\-.]\d{1,2}[/\-.]\d{1,2}\b/g;

  return {
    emails: [...new Set(text.match(emailRegex) || [])],
    phones: [...new Set(text.match(phoneRegex) || [])],
    urls: [...new Set(text.match(urlRegex) || [])],
    dates: [...new Set(text.match(dateRegex) || [])],
  };
};

// Document comparison functions
export const compareDocuments = async (
  documents: Attachment[],
  comparisonType: ComparisonType,
  customPrompt?: string
): Promise<ComparisonResult> => {
  if (documents.length < 2) {
    throw new Error('At least 2 documents are required for comparison');
  }

  if (documents.length > 2) {
    throw new Error('Currently only 2-document comparison is supported');
  }

  const doc1 = documents[0]!;
  const doc2 = documents[1]!;

  // Prepare comparison prompt based on type
  let systemPrompt = '';
  let userPrompt = '';

  switch (comparisonType) {
    case 'similarity':
      systemPrompt = `You are an expert document analyst. Compare the similarity between two documents and provide a detailed analysis.`;
      userPrompt = `Compare these two documents for similarity:

Document 1 (${doc1.name}):
${doc1.extractedText?.substring(0, 4000) || 'No text available'}

Document 2 (${doc2.name}):
${doc2.extractedText?.substring(0, 4000) || 'No text available'}

Please provide:
1. Overall similarity percentage (0-100)
2. Key similarities found
3. Key differences identified
4. Summary of the comparison`;
      break;

    case 'differences':
      systemPrompt = `You are an expert document analyst. Identify and highlight the differences between two documents.`;
      userPrompt = `Analyze the differences between these two documents:

Document 1 (${doc1.name}):
${doc1.extractedText?.substring(0, 4000) || 'No text available'}

Document 2 (${doc2.name}):
${doc2.extractedText?.substring(0, 4000) || 'No text available'}

Please provide:
1. Major differences between the documents
2. Content that exists in one but not the other
3. Structural differences
4. Recommendations for harmonization`;
      break;

    case 'summary':
      systemPrompt = `You are an expert document analyst. Provide a comprehensive summary comparing two documents.`;
      userPrompt = `Create a comparative summary of these two documents:

Document 1 (${doc1.name}):
${doc1.extractedText?.substring(0, 4000) || 'No text available'}

Document 2 (${doc2.name}):
${doc2.extractedText?.substring(0, 4000) || 'No text available'}

Please provide:
1. Brief overview of each document
2. Key themes and topics covered
3. Comparative analysis
4. Overall assessment`;
      break;

    case 'key-points':
      systemPrompt = `You are an expert document analyst. Extract and compare key points from two documents.`;
      userPrompt = `Extract and compare key points from these two documents:

Document 1 (${doc1.name}):
${doc1.extractedText?.substring(0, 4000) || 'No text available'}

Document 2 (${doc2.name}):
${doc2.extractedText?.substring(0, 4000) || 'No text available'}

Please provide:
1. Key points from Document 1
2. Key points from Document 2
3. Points that are unique to each document
4. Points that are common to both`;
      break;

    case 'structure':
      systemPrompt = `You are an expert document analyst. Analyze and compare the structure and organization of two documents.`;
      userPrompt = `Analyze the structure and organization of these two documents:

Document 1 (${doc1.name}):
${doc1.extractedText?.substring(0, 4000) || 'No text available'}

Document 2 (${doc2.name}):
${doc2.extractedText?.substring(0, 4000) || 'No text available'}

Please provide:
1. Structural overview of each document
2. Organization patterns
3. Formatting and layout differences
4. Recommendations for structural improvements`;
      break;

    default:
      throw new Error(`Unsupported comparison type: ${comparisonType}`);
  }

  if (customPrompt) {
    userPrompt = customPrompt;
  }

  try {
    const response = await chatWithContext(
      userPrompt,
      [{
        role: 'system',
        content: systemPrompt
      }],
      documents.map(doc => doc.extractedText || '').join('\n\n---\n\n')
    );

    // Parse the AI response to extract structured comparison data
    const aiResponse = response;
    const result: ComparisonResult = {
      detailedAnalysis: aiResponse,
    };

    // Extract similarity percentage if applicable
    if (comparisonType === 'similarity') {
      const similarityMatch = aiResponse.match(/(\d+)%/);
      if (similarityMatch && similarityMatch[1]) {
        result.overallSimilarity = parseInt(similarityMatch[1]);
      }
    }

    // Extract common themes and differences from the response
    // This is a simplified parsing - in a real implementation, you might want more sophisticated parsing
    result.summary = aiResponse.substring(0, 500) + (aiResponse.length > 500 ? '...' : '');

    return result;

  } catch (error) {
    console.error('Document comparison failed:', error);
    throw new Error('Failed to compare documents. Please try again.');
  }
};

// Validate documents for comparison
export const validateDocumentsForComparison = (documents: Attachment[]): { valid: boolean; error?: string } => {
  if (documents.length < 2) {
    return { valid: false, error: 'At least 2 documents are required for comparison' };
  }

  if (documents.length > 2) {
    return { valid: false, error: 'Currently only 2-document comparison is supported' };
  }

  // Check if documents have extracted text
  for (const doc of documents) {
    if (!doc.extractedText || doc.extractedText.trim().length < 10) {
      return { valid: false, error: `Document "${doc.name}" does not contain sufficient text for comparison` };
    }
  }

  return { valid: true };
};

// Clean up blob URLs to prevent memory leaks
export const cleanupFileResources = (attachment: Attachment): void => {
  if (attachment.url.startsWith('blob:')) {
    URL.revokeObjectURL(attachment.url);
  }
};
