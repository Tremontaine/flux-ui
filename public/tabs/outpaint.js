/**
 * Flux Image Generator - Outpaint Tab
 * Functionality for image outpainting (expansion)
 */

// Outpaint tab module
const OutpaintTab = {
    // Tab state
    imageData: null,
    currentParams: {},
    currentImageUrl: '',
    
    // Initialize the tab
    init: function() {
        console.log('Initializing Outpaint Tab');
        
        // Get the tab container element
        const outpaintContainer = document.getElementById('outpaint-tab');
        if (!outpaintContainer) {
            console.error('Outpaint Tab: Container element not found');
            return;
        }
        
        // Store elements
        this.elements = {
            outpaintContainer: outpaintContainer
        };
        
        console.log('Outpaint Tab: Container found, creating content...');
        
        // Create the tab content
        this.createTabContent();
        
        // Setup event listeners
        this.setupEventListeners();
    },
    
    // Create the tab content HTML
    createTabContent: function() {
        const container = this.elements.outpaintContainer;
        
        if (container) {
            container.innerHTML = `
                <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">Outpaint Tab Coming Soon</h3>
                        <p class="mt-1 text-sm text-gray-500">This tab will allow you to expand the canvas of an existing image using the Flux Pro Expand API.</p>
                        <div id="outpaint-image-preview" class="hidden mt-4">
                            <p class="text-xs font-medium text-gray-700 mb-2">Image loaded from gallery:</p>
                            <img id="outpaint-preview" class="max-h-40 mx-auto" />
                        </div>
                    </div>
                </div>
            `;
            
            // Update element references
            this.elements.imagePreview = container.querySelector('#outpaint-preview');
            this.elements.imagePreviewContainer = container.querySelector('#outpaint-image-preview');
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Will be implemented when tab is fully developed
    },
    
    // Set input image from gallery
    setInputImage: function(imageData) {
        this.imageData = imageData;
        
        // Show the image if element exists
        if (this.elements.imagePreview && this.elements.imagePreviewContainer) {
            this.elements.imagePreview.src = imageData;
            this.elements.imagePreviewContainer.classList.remove('hidden');
        }
        
        console.log('Image set for outpainting');
    }
};

// Initialize the Outpaint tab
document.addEventListener('DOMContentLoaded', function() {
    // Make OutpaintTab globally available for debugging
    window.OutpaintTab = OutpaintTab;
    
    // Initialize right away
    OutpaintTab.init();
    
    console.log('Outpaint tab loaded and initialized');
});