/**
 * Flux Image Generator - Inpaint Tab
 * Functionality for image inpainting
 */

// Inpaint tab module
const InpaintTab = {
    // Tab state
    imageData: null,
    maskData: null,
    currentParams: {},
    currentImageUrl: '',
    
    // Initialize the tab
    init: function() {
        console.log('Initializing Inpaint Tab');
        
        // Get the tab container element
        const inpaintContainer = document.getElementById('inpaint-tab');
        if (!inpaintContainer) {
            console.error('Inpaint Tab: Container element not found');
            return;
        }
        
        // Store elements
        this.elements = {
            inpaintContainer: inpaintContainer
        };
        
        console.log('Inpaint Tab: Container found, creating content...');
        
        // Create the tab content
        this.createTabContent();
        
        // Setup event listeners
        this.setupEventListeners();
    },
    
    // Create the tab content HTML
    createTabContent: function() {
        const container = this.elements.inpaintContainer;
        
        if (container) {
            container.innerHTML = `
                <div class="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">Inpaint Tab Coming Soon</h3>
                        <p class="mt-1 text-sm text-gray-500">This tab will allow you to selectively edit parts of an image using the Flux Pro Fill API.</p>
                        <div id="inpaint-image-preview" class="hidden mt-4">
                            <p class="text-xs font-medium text-gray-700 mb-2">Image loaded from gallery:</p>
                            <img id="inpaint-preview" class="max-h-40 mx-auto" />
                        </div>
                    </div>
                </div>
            `;
            
            // Update element references
            this.elements.imagePreview = container.querySelector('#inpaint-preview');
            this.elements.imagePreviewContainer = container.querySelector('#inpaint-image-preview');
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
        
        console.log('Image set for inpainting');
    }
};

// Initialize the Inpaint tab
document.addEventListener('DOMContentLoaded', function() {
    // Make InpaintTab globally available for debugging
    window.InpaintTab = InpaintTab;
    
    // Initialize right away
    InpaintTab.init();
    
    console.log('Inpaint tab loaded and initialized');
});