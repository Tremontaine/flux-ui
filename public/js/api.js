/**
 * Flux Image Generator - API JS
 * Handles API communication for all tabs
 */

// Global API functions
window.FluxAPI = {
    // Make an API request to a Flux endpoint
    makeRequest: async function(endpoint, params, method = 'POST') { // Added method parameter
        const apiKey = window.FluxUI.getApiKey();
        
        if (!apiKey) {
            throw new Error('API key is required');
        }
        
        console.log(`Making ${method} request to ${endpoint} with params:`, params); // Log method
        
        try {
            const fetchOptions = {
                method: method.toUpperCase(), // Use the provided method
                headers: {
                    'Content-Type': 'application/json',
                    'x-key': apiKey
                }
            };

            // Only add body for methods that typically have one
            if (method.toUpperCase() !== 'GET' && method.toUpperCase() !== 'HEAD' && params) {
                fetchOptions.body = JSON.stringify(params);
            }

            // Construct URL - handle GET params differently if needed (though proxy might handle it)
            let url = `/api-proxy/${endpoint}`;
            // Example if GET params needed direct handling (currently proxy likely handles this):
            // if (method.toUpperCase() === 'GET' && params) {
            //     const queryParams = new URLSearchParams(params).toString();
            //     url += `?${queryParams}`;
            // }

            const response = await fetch(url, fetchOptions);
            
            if (!response.ok) {
                let errorText = `API error (${response.status})`;
                try {
                    const errorData = await response.json();
                    if (errorData.detail && Array.isArray(errorData.detail)) {
                        // Extract validation errors
                        errorText = errorData.detail.map(err => 
                            `${err.loc.join('.')}: ${err.msg}`
                        ).join(', ');
                    } else {
                        errorText = errorData.message || errorData.detail || JSON.stringify(errorData);
                    }
                } catch (e) {
                    // Can't parse JSON, use default error
                }
                throw new Error(errorText);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },
    
    // Poll for a task result
    pollForResult: async function(taskId, onProgress, onSuccess, onError) {
        const apiKey = window.FluxUI.getApiKey();
        
        if (!apiKey) {
            onError(new Error('API key is required'));
            return;
        }
        
        const checkResult = async () => {
            try {
                const response = await fetch(`/api-proxy/get_result?id=${taskId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-key': apiKey
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const result = await response.json();
                console.log("Poll result:", result);
                
                if (result.status === 'Ready' && result.result) {
                    // Generation completed successfully
                    let imageUrl;
                    
                    // Extract the URL from the correct location in the response
                    if (result.result.sample) {
                        imageUrl = result.result.sample;
                    } else if (typeof result.result === 'string') {
                        imageUrl = result.result;
                    } else if (result.result.image) {
                        imageUrl = result.result.image;
                    } else if (result.result.url) {
                        imageUrl = result.result.url;
                    }
                    
                    if (!imageUrl) {
                        throw new Error('No image URL found in response');
                    }
                    
                    console.log("Original Image URL:", imageUrl);
                    
                    // Return the image URL and full result
                    onSuccess(imageUrl, result);
                    
                } else if (result.status === 'Error') {
                    // Generation failed
                    onError(new Error(`Generation error: ${result.details || 'Unknown error'}`));
                } else if (result.status === 'Content Moderated' || result.status === 'Request Moderated') {
                    // Content was moderated
                    onError(new Error('Content was moderated. Please adjust your prompt and try again.'));
                } else if (result.progress !== undefined) {
                    // Still processing with progress
                    onProgress(result.progress);
                    setTimeout(checkResult, 1000);
                } else {
                    // Still processing, no progress info
                    setTimeout(checkResult, 1000);
                }
            } catch (error) {
                console.error('Error polling for result:', error);
                onError(error);
            }
        };
        
        // Start polling
        checkResult();
    },
    
    // Get a proxied image URL
    getProxiedImageUrl: function(originalUrl) {
        return `/proxy-image?url=${encodeURIComponent(originalUrl)}`;
    },

    // Fetch the list of user's finetunes
    getMyFinetunes: async function() {
        console.log('Fetching user finetunes...');
        try {
            // Use makeRequest with GET method
            const response = await this.makeRequest('my_finetunes', null, 'GET');
            console.log('Finetunes fetched:', response);
            if (response && Array.isArray(response.finetunes)) {
                return response.finetunes;
            } else {
                console.warn('Unexpected response format for finetunes:', response);
                return []; // Return empty array if format is wrong
            }
        } catch (error) {
            console.error('Error fetching finetunes:', error);
            // Don't throw here, let the UI handle the empty list
            return [];
        }
    }
};

// Debugging log
console.log('FluxAPI initialized and globally available with getMyFinetunes');