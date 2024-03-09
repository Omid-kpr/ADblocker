// Function to remove ads
function removeAds() {
    // Select and remove ad elements
    const ads = document.querySelectorAll('.ad');
    ads.forEach(ad => ad.remove());
}

// Function to run the adblocker
function runAdblocker() {
    // Check if the DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Remove ads
        removeAds();
    } else {
        // Wait for the DOM to be ready
        document.addEventListener('DOMContentLoaded', removeAds);
    }
}

// Run the adblocker
runAdblocker();