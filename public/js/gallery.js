/**
 * Flux Image Generator - Gallery
 * Manages the storage and display of generated images
 */

// Gallery module - global object
window.FluxGallery = {
    // Max number of images to store
    maxImages: 50,
    
    // Current gallery items
    items: [],
    
    // Initialize the gallery
    init: function() {
        console.log('Initializing Gallery');
        
        // Load saved images from localStorage
        this.loadFromStorage();
        
        // Set up gallery UI
        this.setupGalleryUI();
        
        console.log(`Gallery loaded with ${this.items.length} images`);
    },
    
    // Load images from localStorage
    loadFromStorage: function() {
        try {
            const savedGallery = localStorage.getItem('flux_gallery');
            if (savedGallery) {
                this.items = JSON.parse(savedGallery);
                
                // Validate items and remove any corrupt entries
                this.items = this.items.filter(item => {
                    return item && item.imageData && item.metadata;
                });
                
                // Sort by date (newest first)
                this.items.sort((a, b) => new Date(b.metadata.timestamp) - new Date(a.metadata.timestamp));
            }
        } catch (error) {
            console.error('Error loading gallery from storage:', error);
            this.items = [];
        }
    },
    
    // Save gallery to localStorage
    saveToStorage: function() {
        try {
            localStorage.setItem('flux_gallery', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving gallery to storage:', error);
            
            // If storage is full, try removing oldest items
            if (error.name === 'QuotaExceededError') {
                this.handleStorageFull();
            }
        }
    },
    
    // Handle storage full error by removing oldest items
    handleStorageFull: function() {
        if (this.items.length > 10) {
            // Remove half of the oldest items
            const removeCount = Math.floor(this.items.length / 2);
            this.items = this.items.slice(0, this.items.length - removeCount);
            
            // Try saving again
            try {
                localStorage.setItem('flux_gallery', JSON.stringify(this.items));
                console.log(`Removed ${removeCount} old items due to storage constraints`);
            } catch (error) {
                console.error('Still cannot save gallery after removing items:', error);
            }
        }
    },
    
    // Add a new image to the gallery
    addImage: function(imageData, metadata) {
        // Create a gallery item
        const item = {
            id: this.generateId(),
            imageData: imageData,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString()
            }
        };
        
        // Add to beginning of array (newest first)
        this.items.unshift(item);
        
        // Limit the number of items
        if (this.items.length > this.maxImages) {
            this.items = this.items.slice(0, this.maxImages);
        }
        
        // Save to storage
        this.saveToStorage();
        
        // Update UI
        this.updateGalleryUI();
        
        return item.id;
    },
    
    // Remove an image from the gallery
    removeImage: function(id) {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        
        if (this.items.length !== initialLength) {
            // Save to storage
            this.saveToStorage();
            
            // Update UI
            this.updateGalleryUI();
            return true;
        }
        
        return false;
    },
    
    // Clear all images from the gallery
    clearGallery: function() {
        this.items = [];
        this.saveToStorage();
        this.updateGalleryUI();
    },
    
    // Generate a unique ID for gallery items
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    },
    
    // Set up the gallery UI
    setupGalleryUI: function() {
        // Get gallery elements
        const galleryContainer = document.getElementById('gallery-container');
        const galleryToggle = document.getElementById('gallery-toggle');
        const galleryContent = document.getElementById('gallery-content');
        const clearGalleryBtn = document.getElementById('clear-gallery-btn');
        
        if (!galleryContainer || !galleryToggle || !galleryContent) {
            console.error('Gallery UI elements not found');
            return;
        }
        
        // Toggle gallery visibility
        galleryToggle.addEventListener('click', () => {
            galleryContainer.classList.toggle('gallery-collapsed');
            
            // Update toggle button icon
            const isCollapsed = galleryContainer.classList.contains('gallery-collapsed');
            galleryToggle.innerHTML = isCollapsed ? 
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>';
        });
        
        // Clear gallery button
        if (clearGalleryBtn) {
            clearGalleryBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear all saved images?')) {
                    this.clearGallery();
                }
            });
        }
        
        // Initial UI update
        this.updateGalleryUI();
    },
    
    // Update the gallery UI
    updateGalleryUI: function() {
        const galleryContent = document.getElementById('gallery-content');
        const galleryCounter = document.getElementById('gallery-counter');
        
        if (!galleryContent) {
            return;
        }
        
        // Clear current content
        galleryContent.innerHTML = '';
        
        // Update counter if it exists
        if (galleryCounter) {
            galleryCounter.textContent = this.items.length;
        }
        
        // Show empty state if no items
        if (this.items.length === 0) {
            // No need to display an empty state message, just leave it blank.
            return;
        }
        
        // Create gallery items
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            // Use the class name from CSS for hover effects
            itemElement.className = 'gallery-item';
            itemElement.innerHTML = `
                <img src="${item.imageData}" alt="Generated image" class="w-full h-full object-cover bg-gray-100">
                
                <!-- Download Button -->
                <button class="download-btn" data-id="${item.id}" title="Download Image">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </button>

                <!-- Delete Button (adjusted position slightly) -->
                <button class="gallery-delete-btn absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" data-id="${item.id}" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Details Overlay (optional, can be removed if not needed) -->
                <div class="gallery-item-details absolute bottom-0 left-0 right-0 p-1 text-xs bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <p class="truncate text-center">${item.metadata.model || 'Unknown'}</p>
                </div>
            `;
            
            galleryContent.appendChild(itemElement);
            
            // Add event listener for item click
            itemElement.querySelector('img').addEventListener('click', () => {
                this.handleGalleryItemClick(item);
            });
            
            // Add event listener for image click (open modal)
            itemElement.querySelector('img').addEventListener('click', () => {
                this.handleGalleryItemClick(item);
            });

            // Add event listener for delete button
            itemElement.querySelector('.gallery-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal from opening
                this.removeImage(item.id);
            });

            // Add event listener for download button
            itemElement.querySelector('.download-btn').addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal from opening
                this.downloadGalleryImage(item);
            });
        });
    },
    
    // Handle gallery item click
    handleGalleryItemClick: function(item) {
        // Create modal with image details
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 gallery-modal';
        
        // Format metadata for display
        let metadataHtml = '';
        if (item.metadata) {
            // Extract the metadata we want to show
            const { model, prompt, width, height, seed } = item.metadata;
            const date = new Date(item.metadata.timestamp).toLocaleString();
            
            metadataHtml = `
                <div class="mt-4 bg-gray-800 p-4 rounded-md text-sm">
                    <div class="mb-2"><span class="font-bold text-indigo-300">Model:</span> ${model || 'Unknown'}</div>
                    <div class="mb-2"><span class="font-bold text-indigo-300">Size:</span> ${width || '?'} × ${height || '?'}</div>
                    <div class="mb-2"><span class="font-bold text-indigo-300">Seed:</span> ${seed || 'Unknown'}</div>
                    <div class="mb-2"><span class="font-bold text-indigo-300">Date:</span> ${date}</div>
                    ${prompt ? `<div class="mb-1"><span class="font-bold text-indigo-300">Prompt:</span> <div class="text-xs mt-1 text-gray-300 max-h-24 overflow-y-auto bg-gray-700 p-2 rounded">${prompt}</div></div>` : ''}
                </div>
            `;
        }
        
        // Create the modal content with buttons
        modal.innerHTML = `
            <div class="bg-gray-900 rounded-lg shadow-xl max-w-3xl max-h-full overflow-auto gallery-modal-content">
                <div class="p-5">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-lg font-semibold text-white">Gallery Image</h3>
                        <button class="modal-close p-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="image-container bg-black rounded-md overflow-hidden">
                        <img src="${item.imageData}" alt="Generated image" class="max-w-full max-h-[calc(100vh-300px)] object-contain mx-auto">
                    </div>
                    ${metadataHtml}
                    <div class="flex flex-wrap gap-2 mt-4">
                        <button class="download-btn px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors">
                            Download
                        </button>
                        <button class="copy-params-btn px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                            Copy Parameters
                        </button>
                        <button class="copy-image-btn px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors">
                            Copy to Clipboard
                        </button>
                        <button class="use-for-inpaint-btn px-3 py-1.5 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700 transition-colors">
                            Use for Inpaint
                        </button>
                        <button class="use-for-outpaint-btn px-3 py-1.5 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 transition-colors">
                            Use for Outpaint
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.appendChild(modal);
        
        // Add event listeners for buttons
        modal.querySelector('.modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.download-btn').addEventListener('click', () => {
            this.downloadGalleryImage(item);
        });
        
        modal.querySelector('.copy-params-btn').addEventListener('click', () => {
            this.copyGalleryItemParams(item);
        });
        
        modal.querySelector('.copy-image-btn').addEventListener('click', () => {
            this.copyGalleryImageToClipboard(item);
        });
        
        modal.querySelector('.use-for-inpaint-btn').addEventListener('click', () => {
            this.useForInpaint(item);
            document.body.removeChild(modal);
        });
        
        modal.querySelector('.use-for-outpaint-btn').addEventListener('click', () => {
            this.useForOutpaint(item);
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    },
    
    // Download a gallery image
    downloadGalleryImage: function(item) {
        const link = document.createElement('a');
        link.href = item.imageData;
        
        // Create filename from metadata
        const model = item.metadata.model || 'flux';
        const timestamp = item.metadata.timestamp 
            ? new Date(item.metadata.timestamp).toISOString().replace(/[:\.]/g, '-').slice(0, 19)
            : new Date().toISOString().replace(/[:\.]/g, '-').slice(0, 19);
        
        link.download = `${model}-${timestamp}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.FluxUI.showNotification('Image download started!', 'success');
    },
    
    // Copy gallery item parameters to clipboard
    copyGalleryItemParams: function(item) {
        if (!item.metadata) {
            window.FluxUI.showNotification('No parameters available for this image', 'error');
            return;
        }
        
        const params = JSON.stringify(item.metadata, null, 2);
        navigator.clipboard.writeText(params)
            .then(() => {
                window.FluxUI.showNotification('Parameters copied to clipboard!', 'success');
            })
            .catch(err => {
                window.FluxUI.showNotification('Failed to copy parameters: ' + err.message, 'error');
            });
    },
    
    // Copy gallery image to clipboard
    copyGalleryImageToClipboard: function(item) {
        // Create a temporary image to get the blob
        const img = new Image();
        img.src = item.imageData;
        img.onload = function() {
            // Create a canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw the image to the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // Get blob from canvas and copy to clipboard
            canvas.toBlob(function(blob) {
                try {
                    const item = new ClipboardItem({ 'image/png': blob });
                    navigator.clipboard.write([item])
                        .then(() => {
                            window.FluxUI.showNotification('Image copied to clipboard!', 'success');
                        })
                        .catch(err => {
                            window.FluxUI.showNotification('Failed to copy image: ' + err.message, 'error');
                        });
                } catch (error) {
                    window.FluxUI.showNotification('Your browser doesn\'t support copying images to clipboard', 'error');
                }
            });
        };
        img.onerror = function() {
            window.FluxUI.showNotification('Failed to load image for copying', 'error');
        };
    },
    
    // Use image for inpainting
    useForInpaint: function(item) {
        // Check if InpaintTab is available
        if (window.InpaintTab && typeof window.InpaintTab.setInputImage === 'function') {
            // Switch to inpaint tab
            const inpaintTabButton = document.querySelector('.tab-button[data-tab="inpaint-tab"]');
            if (inpaintTabButton) {
                inpaintTabButton.click();
            }
            
            // Set the image in the inpaint tab
            window.InpaintTab.setInputImage(item.imageData);
            window.FluxUI.showNotification('Image sent to Inpaint tab!', 'success');
        } else {
            window.FluxUI.showNotification('Inpaint tab is not ready yet', 'warning');
        }
    },
    
    // Use image for outpainting
    useForOutpaint: function(item) {
        // Check if OutpaintTab is available
        if (window.OutpaintTab && typeof window.OutpaintTab.setInputImage === 'function') {
            // Switch to outpaint tab
            const outpaintTabButton = document.querySelector('.tab-button[data-tab="outpaint-tab"]');
            if (outpaintTabButton) {
                outpaintTabButton.click();
            }
            
            // Set the image in the outpaint tab
            window.OutpaintTab.setInputImage(item.imageData);
            window.FluxUI.showNotification('Image sent to Outpaint tab!', 'success');
        } else {
            window.FluxUI.showNotification('Outpaint tab is not ready yet', 'warning');
        }
    }
};

// Initialize Gallery on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.FluxGallery.init();
    }, 200); // Small delay to ensure other components are loaded
});