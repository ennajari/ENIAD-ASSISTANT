"""
Image OCR Agent
Specialized agent for extracting text from images using OCR technology
Supports multiple image formats and OCR engines
"""

from crewai import Agent
from langchain.tools import Tool
import pytesseract
from PIL import Image
import cv2
import numpy as np
import requests
import io
import asyncio
import aiohttp
from typing import List, Dict, Any, Optional
import logging
from urllib.parse import urljoin, urlparse
import tempfile
import os
import base64

logger = logging.getLogger(__name__)

class ImageOCRAgent:
    def __init__(self):
        self.session = None
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'image/*,*/*'
        }
        
        # OCR configuration
        self.tesseract_config = {
            'default': '--oem 3 --psm 6',
            'single_block': '--oem 3 --psm 6',
            'single_line': '--oem 3 --psm 7',
            'single_word': '--oem 3 --psm 8',
            'sparse_text': '--oem 3 --psm 11'
        }
        
        # Supported image formats
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif', '.webp']
        
        # Initialize the CrewAI agent
        self.agent = Agent(
            role='Image OCR Specialist',
            goal='Extract text content from images using advanced OCR techniques for academic documents, screenshots, and visual content',
            backstory="""You are an expert in optical character recognition with deep knowledge of image processing. 
            You can extract text from various image formats, handle different languages, and optimize image quality 
            for better OCR accuracy.""",
            verbose=True,
            allow_delegation=False,
            tools=self._create_tools()
        )

    def _create_tools(self) -> List[Tool]:
        """Create tools for the image OCR agent"""
        return [
            Tool(
                name="extract_text_from_image",
                description="Extract text from image files using OCR",
                func=self.extract_text_from_image
            ),
            Tool(
                name="preprocess_image",
                description="Preprocess images to improve OCR accuracy",
                func=self.preprocess_image
            ),
            Tool(
                name="detect_text_regions",
                description="Detect text regions in images",
                func=self.detect_text_regions
            ),
            Tool(
                name="batch_ocr_images",
                description="Process multiple images with OCR in batch",
                func=self.batch_ocr_images
            ),
            Tool(
                name="extract_from_url",
                description="Download and extract text from image URLs",
                func=self.extract_from_url
            )
        ]

    async def initialize_session(self):
        """Initialize aiohttp session for downloading images"""
        if not self.session:
            connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
            timeout = aiohttp.ClientTimeout(total=30)
            self.session = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout,
                headers=self.headers
            )

    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            self.session = None

    async def extract_text_from_image(self, image_source: str, language: str = "fra+eng+ara", preprocess: bool = True) -> Dict[str, Any]:
        """
        Extract text from image using OCR
        image_source: file path, URL, or base64 encoded image
        language: OCR language (fra=French, eng=English, ara=Arabic)
        preprocess: whether to preprocess image for better OCR
        """
        try:
            logger.info(f"🖼️ Extracting text from image: {image_source[:100]}...")
            
            # Load image
            image = await self._load_image(image_source)
            if image is None:
                return {
                    'status': 'error',
                    'error': 'Failed to load image',
                    'source': image_source
                }

            # Preprocess image if requested
            if preprocess:
                image = await self._preprocess_for_ocr(image)

            # Perform OCR
            try:
                # Configure tesseract for the specified language
                config = f'--oem 3 --psm 6 -l {language}'
                
                # Extract text
                extracted_text = pytesseract.image_to_string(image, config=config)
                
                # Get confidence scores
                data = pytesseract.image_to_data(image, config=config, output_type=pytesseract.Output.DICT)
                confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
                avg_confidence = sum(confidences) / len(confidences) if confidences else 0

                # Clean extracted text
                cleaned_text = self._clean_ocr_text(extracted_text)
                
                result = {
                    'status': 'success',
                    'source': image_source,
                    'text': cleaned_text,
                    'text_length': len(cleaned_text),
                    'word_count': len(cleaned_text.split()),
                    'confidence': avg_confidence,
                    'language': language,
                    'preprocessed': preprocess,
                    'timestamp': asyncio.get_event_loop().time()
                }
                
                logger.info(f"✅ OCR completed: {len(cleaned_text)} characters, {avg_confidence:.1f}% confidence")
                return result

            except Exception as ocr_error:
                logger.error(f"❌ OCR processing failed: {ocr_error}")
                return {
                    'status': 'error',
                    'error': f'OCR failed: {str(ocr_error)}',
                    'source': image_source
                }

        except Exception as e:
            logger.error(f"❌ Error extracting text from image: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'source': image_source
            }

    async def preprocess_image(self, image_source: str, operations: List[str] = None) -> Dict[str, Any]:
        """
        Preprocess image to improve OCR accuracy
        operations: list of preprocessing operations to apply
        """
        try:
            logger.info(f"🔧 Preprocessing image: {image_source[:100]}...")
            
            # Default preprocessing operations
            if operations is None:
                operations = ['grayscale', 'denoise', 'threshold', 'deskew']
            
            # Load image
            image = await self._load_image(image_source)
            if image is None:
                return {
                    'status': 'error',
                    'error': 'Failed to load image'
                }

            # Convert PIL to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Apply preprocessing operations
            for operation in operations:
                if operation == 'grayscale':
                    cv_image = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
                elif operation == 'denoise':
                    cv_image = cv2.fastNlMeansDenoising(cv_image)
                elif operation == 'threshold':
                    _, cv_image = cv2.threshold(cv_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
                elif operation == 'deskew':
                    cv_image = self._deskew_image(cv_image)
                elif operation == 'enhance_contrast':
                    cv_image = cv2.equalizeHist(cv_image)

            # Convert back to PIL
            if len(cv_image.shape) == 2:  # Grayscale
                processed_image = Image.fromarray(cv_image, mode='L')
            else:
                processed_image = Image.fromarray(cv2.cvtColor(cv_image, cv2.COLOR_BGR2RGB))

            # Save processed image to temporary file
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                processed_image.save(temp_file.name)
                temp_path = temp_file.name

            result = {
                'status': 'success',
                'original_source': image_source,
                'processed_path': temp_path,
                'operations_applied': operations,
                'image_size': processed_image.size
            }
            
            logger.info(f"✅ Image preprocessed with operations: {', '.join(operations)}")
            return result

        except Exception as e:
            logger.error(f"❌ Error preprocessing image: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def detect_text_regions(self, image_source: str) -> Dict[str, Any]:
        """Detect text regions in image"""
        try:
            logger.info(f"🔍 Detecting text regions: {image_source[:100]}...")
            
            # Load image
            image = await self._load_image(image_source)
            if image is None:
                return {
                    'status': 'error',
                    'error': 'Failed to load image'
                }

            # Convert to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)

            # Use EAST text detector or simple contour detection
            # For simplicity, using contour-based detection
            # Apply threshold
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            
            # Find contours
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Filter contours that might contain text
            text_regions = []
            for contour in contours:
                x, y, w, h = cv2.boundingRect(contour)
                area = cv2.contourArea(contour)
                
                # Filter based on size and aspect ratio
                if area > 100 and w > 20 and h > 10:
                    aspect_ratio = w / h
                    if 0.1 < aspect_ratio < 10:  # Reasonable aspect ratio for text
                        text_regions.append({
                            'x': int(x),
                            'y': int(y),
                            'width': int(w),
                            'height': int(h),
                            'area': int(area)
                        })

            result = {
                'status': 'success',
                'source': image_source,
                'text_regions': text_regions,
                'regions_count': len(text_regions),
                'image_size': image.size
            }
            
            logger.info(f"✅ Detected {len(text_regions)} text regions")
            return result

        except Exception as e:
            logger.error(f"❌ Error detecting text regions: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }

    async def batch_ocr_images(self, image_sources: List[str], language: str = "fra+eng+ara") -> List[Dict[str, Any]]:
        """Process multiple images with OCR in batch"""
        try:
            logger.info(f"📚 Batch OCR processing {len(image_sources)} images")
            
            results = []
            for image_source in image_sources:
                try:
                    result = await self.extract_text_from_image(image_source, language)
                    results.append(result)
                    
                    # Add delay between processing
                    await asyncio.sleep(0.5)
                    
                except Exception as e:
                    logger.error(f"❌ Error processing image {image_source}: {e}")
                    results.append({
                        'status': 'error',
                        'source': image_source,
                        'error': str(e)
                    })

            successful = len([r for r in results if r.get('status') == 'success'])
            logger.info(f"✅ Batch OCR completed: {successful}/{len(results)} successful")
            return results

        except Exception as e:
            logger.error(f"❌ Error in batch OCR processing: {e}")
            return []

    async def extract_from_url(self, image_url: str, language: str = "fra+eng+ara") -> Dict[str, Any]:
        """Download and extract text from image URL"""
        try:
            logger.info(f"⬇️ Downloading and processing image: {image_url}")
            
            # Download image
            image_data = await self._download_image(image_url)
            if not image_data:
                return {
                    'status': 'error',
                    'error': 'Failed to download image',
                    'url': image_url
                }

            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                temp_file.write(image_data)
                temp_path = temp_file.name

            try:
                # Extract text
                result = await self.extract_text_from_image(temp_path, language)
                result['url'] = image_url
                result['file_size'] = len(image_data)
                
                logger.info(f"✅ Image downloaded and processed: {len(result.get('text', ''))} characters")
                return result

            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)

        except Exception as e:
            logger.error(f"❌ Error downloading and processing image: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'url': image_url
            }

    async def _load_image(self, image_source: str) -> Optional[Image.Image]:
        """Load image from various sources"""
        try:
            if image_source.startswith(('http://', 'https://')):
                # Download from URL
                image_data = await self._download_image(image_source)
                if image_data:
                    return Image.open(io.BytesIO(image_data))
            elif image_source.startswith('data:image'):
                # Base64 encoded image
                header, data = image_source.split(',', 1)
                image_data = base64.b64decode(data)
                return Image.open(io.BytesIO(image_data))
            else:
                # Local file
                return Image.open(image_source)
            
            return None

        except Exception as e:
            logger.error(f"❌ Error loading image: {e}")
            return None

    async def _download_image(self, url: str) -> Optional[bytes]:
        """Download image from URL"""
        try:
            await self.initialize_session()
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    content_type = response.headers.get('content-type', '').lower()
                    if 'image' in content_type or any(ext in url.lower() for ext in self.supported_formats):
                        return await response.read()
                    else:
                        logger.warning(f"⚠️ URL does not appear to be an image: {content_type}")
                        return None
                else:
                    logger.error(f"❌ Failed to download image: HTTP {response.status}")
                    return None

        except Exception as e:
            logger.error(f"❌ Error downloading image: {e}")
            return None

    async def _preprocess_for_ocr(self, image: Image.Image) -> Image.Image:
        """Apply standard preprocessing for better OCR"""
        try:
            # Convert to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Convert to grayscale
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            
            # Apply denoising
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Apply threshold
            _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Convert back to PIL
            return Image.fromarray(thresh, mode='L')

        except Exception as e:
            logger.error(f"❌ Error in preprocessing: {e}")
            return image

    def _deskew_image(self, image: np.ndarray) -> np.ndarray:
        """Deskew image to correct rotation"""
        try:
            # Find skew angle
            coords = np.column_stack(np.where(image > 0))
            if len(coords) == 0:
                return image
                
            angle = cv2.minAreaRect(coords)[-1]
            
            # Correct angle
            if angle < -45:
                angle = -(90 + angle)
            else:
                angle = -angle
            
            # Rotate image
            if abs(angle) > 0.5:  # Only rotate if significant skew
                (h, w) = image.shape[:2]
                center = (w // 2, h // 2)
                M = cv2.getRotationMatrix2D(center, angle, 1.0)
                rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
                return rotated
            
            return image

        except Exception as e:
            logger.error(f"❌ Error in deskewing: {e}")
            return image

    def _clean_ocr_text(self, text: str) -> str:
        """Clean and normalize OCR extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        import re
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remove common OCR artifacts
        text = text.replace('|', 'l')  # Common OCR mistake
        text = text.replace('0', 'O')  # In some contexts
        
        return text.strip()

    async def get_status(self) -> Dict[str, Any]:
        """Get agent status"""
        return {
            "agent_name": "ImageOCRAgent",
            "status": "active",
            "session_active": self.session is not None,
            "supported_formats": self.supported_formats,
            "supported_languages": ["fra", "eng", "ara"],
            "tools_available": len(self.agent.tools) if hasattr(self.agent, 'tools') else 5
        }
