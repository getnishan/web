// Global variables for video recording
let mediaStream = null;
let mediaRecorder = null;
let recordedChunks = [];
let recordedBlob = null;
let recordingTimer = null;
let recordingStartTime = null;
const MIN_RECORDING_TIME = 30; // 30 seconds minimum
const MAX_RECORDING_TIME = 45; // 45 seconds maximum

// Open application form modal
function scrollToForm() {
    const modal = document.getElementById('applicationFormModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

// Scroll Float Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all scroll-float elements
document.addEventListener('DOMContentLoaded', () => {
    const scrollFloatElements = document.querySelectorAll('.scroll-float');
    scrollFloatElements.forEach(el => observer.observe(el));
});

// Tilt Card Effect
document.addEventListener('DOMContentLoaded', () => {
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});


// Video Recording Modal
const videoModal = document.getElementById('videoModal');
const recordVideoBtn = document.getElementById('recordVideoBtn');
const closeModal = document.getElementById('cameraCloseBtn');
const modalPreviewVideo = document.getElementById('modalPreviewVideo');
const modalStartRecordBtn = document.getElementById('modalStartRecordBtn');
const modalStopRecordBtn = document.getElementById('modalStopRecordBtn');
const modalRecordedVideo = document.getElementById('modalRecordedVideo');
const modalRecordedVideoContainer = document.getElementById('modalRecordedVideoContainer');
const modalSubmitVideoBtn = document.getElementById('modalSubmitVideoBtn');
const modalRetakeVideoBtn = document.getElementById('modalRetakeVideoBtn');
const recordingIndicator = document.getElementById('recordingTimer');
const timerDisplay = document.getElementById('timerDisplay');
const modalVideoActions = document.getElementById('modalVideoActions');
const recordingControls = document.getElementById('recordingControls');
const modalPauseRecordBtn = document.getElementById('modalPauseRecordBtn');
let recordingTimeInterval = null;
let isPaused = false;
let pausedTime = 0;
let totalPausedTime = 0;

// Open modal and start camera
if (recordVideoBtn) {
    recordVideoBtn.addEventListener('click', async () => {
        videoModal.style.display = 'block';
        await startCamera();
    });
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        closeModalAndCleanup();
    });
}

window.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeModalAndCleanup();
    }
});

// Start camera
async function startCamera() {
    try {
        // Check if getUserMedia is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            // Fallback for older browsers
            navigator.mediaDevices = navigator.mediaDevices || {};
            navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
                navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;
            
            if (!navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia is not supported in this browser');
            }
        }
        
        // Stop any existing stream first
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        
        // Try with ideal constraints first (portrait mode)
        let constraints = {
            video: { 
                facingMode: 'user',
                width: { ideal: 720 },
                height: { ideal: 1280 }
            },
            audio: true
        };
        
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (constraintError) {
            console.warn('Portrait mode constraints failed, trying basic constraints:', constraintError);
            // Fallback to basic constraints
            constraints = {
                video: { facingMode: 'user' },
                audio: true
            };
            
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (basicError) {
                console.warn('User-facing camera failed, trying any camera:', basicError);
                // Last resort: try any camera
                constraints = {
                    video: true,
                    audio: true
                };
                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            }
        }
        
        if (modalPreviewVideo) {
            modalPreviewVideo.srcObject = mediaStream;
            modalPreviewVideo.style.display = 'block';
            // Support portrait mode
            modalPreviewVideo.style.objectFit = 'contain';
            modalPreviewVideo.style.width = '100%';
            modalPreviewVideo.style.maxHeight = '70vh';
            
            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Video loading timeout'));
                }, 10000); // 10 second timeout
                
                if (modalPreviewVideo.readyState >= 2) {
                    clearTimeout(timeout);
                    resolve();
                } else {
                    modalPreviewVideo.onloadedmetadata = () => {
                        clearTimeout(timeout);
                        resolve();
                    };
                    modalPreviewVideo.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error('Video element error'));
                    };
                }
            });
        }
        
        // Hide recorded video container when starting camera
        if (modalRecordedVideoContainer) {
            modalRecordedVideoContainer.style.display = 'none';
        }
        
        // Enable start recording button only after camera is ready
        if (modalStartRecordBtn) {
            modalStartRecordBtn.style.display = 'inline-block';
            modalStartRecordBtn.disabled = false;
        }
        if (modalStopRecordBtn) {
            modalStopRecordBtn.style.display = 'none';
        }
        if (recordingIndicator) {
            recordingIndicator.style.display = 'none';
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
        
        let errorMessage = 'Unable to access camera. ';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMessage += 'Please allow camera access in your browser settings and refresh the page.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            errorMessage += 'No camera found. Please connect a camera and try again.';
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            errorMessage += 'Camera is being used by another application. Please close other apps using the camera and try again.';
        } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
            errorMessage += 'Camera does not support the requested settings. Trying with basic settings...';
            // Try again with basic constraints
            setTimeout(() => {
                startCamera();
            }, 1000);
            return;
        } else if (error.message && error.message.includes('HTTPS')) {
            errorMessage += 'Camera access requires HTTPS. Please access this site over HTTPS.';
        } else {
            errorMessage += 'Please check your camera permissions and make sure no other application is using the camera.';
        }
        
        alert(errorMessage);
        
        // Disable start recording button if camera fails
        if (modalStartRecordBtn) {
            modalStartRecordBtn.disabled = true;
        }
        
        // Close modal on error
        if (videoModal) {
            videoModal.style.display = 'none';
        }
    }
}

// Start recording
if (modalStartRecordBtn) {
    modalStartRecordBtn.addEventListener('click', () => {
        startRecording();
    });
}

function startRecording() {
    // Check if mediaStream is available
    if (!mediaStream) {
        alert('Camera is not ready. Please wait for the camera to initialize.');
        return;
    }
    
    // Check if mediaStream is active
    const videoTracks = mediaStream.getVideoTracks();
    const audioTracks = mediaStream.getAudioTracks();
    
    if (videoTracks.length === 0 || !videoTracks[0].enabled) {
        alert('Camera is not available. Please check your camera permissions.');
        return;
    }
    
    // Immediately change button state
    if (modalStartRecordBtn) {
        modalStartRecordBtn.style.display = 'none';
    }
    if (recordingControls) {
        recordingControls.style.display = 'flex';
    }
    if (recordingIndicator) {
        recordingIndicator.style.display = 'flex';
    }
    
    // Reset pause state
    isPaused = false;
    pausedTime = 0;
    totalPausedTime = 0;
    recordingStartTime = Date.now();
    
    // Start timer
    if (recordingTimeInterval) {
        clearInterval(recordingTimeInterval);
    }
    if (timerDisplay) {
        timerDisplay.textContent = '00:00:00';
    }
    recordingTimeInterval = setInterval(() => {
        if (!isPaused) {
            const elapsed = Date.now() - recordingStartTime - totalPausedTime;
            const totalSeconds = Math.floor(elapsed / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;
            if (timerDisplay) {
                timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
        } else {
            pausedTime = Date.now();
        }
    }, 100);
    
    recordedChunks = [];
    
    const options = {
        mimeType: 'video/webm;codecs=vp8,opus'
    };
    
    try {
        mediaRecorder = new MediaRecorder(mediaStream, options);
    } catch (e) {
        console.error('MediaRecorder error:', e);
        // Fallback to default
        mediaRecorder = new MediaRecorder(mediaStream);
    }
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    
    mediaRecorder.onstop = () => {
        recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(recordedBlob);
        
        // Stop camera stream after recording stops
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            mediaStream = null;
        }
        
        // Hide preview video (camera feed)
        if (modalPreviewVideo) {
            modalPreviewVideo.srcObject = null;
            modalPreviewVideo.style.display = 'none';
        }
        
        // Show recorded video
        if (modalRecordedVideo) {
            modalRecordedVideo.src = videoURL;
            modalRecordedVideo.style.display = 'block';
            // Support portrait mode
            modalRecordedVideo.style.objectFit = 'contain';
            modalRecordedVideo.style.width = '100%';
            modalRecordedVideo.style.maxHeight = '70vh';
        }
        
        if (modalRecordedVideoContainer) {
            modalRecordedVideoContainer.style.display = 'block';
        }
        
        // Stop timer
        if (recordingTimeInterval) {
            clearInterval(recordingTimeInterval);
            recordingTimeInterval = null;
        }
        
        // Hide recording controls
        if (recordingControls) {
            recordingControls.style.display = 'none';
        }
        if (recordingIndicator) {
            recordingIndicator.style.display = 'none';
        }
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
        }
        
        // Hide record button (will show video actions instead)
        if (modalStartRecordBtn) {
            modalStartRecordBtn.style.display = 'none';
        }
        
        // Show video actions overlay
        if (modalVideoActions) {
            modalVideoActions.style.display = 'flex';
        }
        
        // Reset pause state
        isPaused = false;
        pausedTime = 0;
        totalPausedTime = 0;
    };
    
    recordingStartTime = Date.now();
    
    try {
        mediaRecorder.start();
    } catch (error) {
        console.error('Error starting recording:', error);
        // Revert button state if recording fails to start
        if (modalStartRecordBtn) {
            modalStartRecordBtn.style.display = 'flex';
        }
        if (recordingControls) {
            recordingControls.style.display = 'none';
        }
        if (recordingIndicator) {
            recordingIndicator.style.display = 'none';
        }
        if (recordingTimeInterval) {
            clearInterval(recordingTimeInterval);
            recordingTimeInterval = null;
        }
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
        }
        isPaused = false;
        pausedTime = 0;
        totalPausedTime = 0;
        alert('Failed to start recording. Please try again.');
        return;
    }
    
    // Auto-stop after 45 seconds
    recordingTimer = setTimeout(() => {
        stopRecording();
    }, MAX_RECORDING_TIME * 1000);
}

// Stop recording
if (modalStopRecordBtn) {
    modalStopRecordBtn.addEventListener('click', () => {
        stopRecording();
    });
}

// Pause recording
if (modalPauseRecordBtn) {
    modalPauseRecordBtn.addEventListener('click', () => {
        if (isPaused) {
            // Resume recording
            if (mediaRecorder && mediaRecorder.state === 'paused') {
                mediaRecorder.resume();
            }
            totalPausedTime += Date.now() - pausedTime;
            isPaused = false;
            modalPauseRecordBtn.querySelector('.pause-icon').textContent = '⏸';
        } else {
            // Pause recording
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.pause();
            }
            pausedTime = Date.now();
            isPaused = true;
            modalPauseRecordBtn.querySelector('.pause-icon').textContent = '▶';
        }
    });
}

function stopRecording() {
    if (!mediaRecorder) {
        console.warn('No media recorder to stop');
        return;
    }
    
    // Check if recording is actually in progress
    if (mediaRecorder.state === 'inactive') {
        console.warn('Recording is already stopped');
        return;
    }
    
    // Stop timer
    if (recordingTimeInterval) {
        clearInterval(recordingTimeInterval);
        recordingTimeInterval = null;
    }
    
    if (timerDisplay) {
        timerDisplay.textContent = '00:00:00';
    }
    
    // Reset pause state
    isPaused = false;
    pausedTime = 0;
    totalPausedTime = 0;
    
    // Hide recording controls
    if (recordingControls) {
        recordingControls.style.display = 'none';
    }
    if (recordingIndicator) {
        recordingIndicator.style.display = 'none';
    }
    
    const recordingDuration = (Date.now() - recordingStartTime) / 1000;
    
    // Stop the recording
    try {
        if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
        }
    } catch (error) {
        console.error('Error stopping recording:', error);
    }
    
    // Clear the auto-stop timer
    if (recordingTimer) {
        clearTimeout(recordingTimer);
        recordingTimer = null;
    }
    
    // Check minimum duration after stopping
    if (recordingDuration < MIN_RECORDING_TIME) {
        alert(`Please record at least ${MIN_RECORDING_TIME} seconds. Recording was too short.`);
        // Reset to allow retry
        recordedChunks = [];
        recordedBlob = null;
        if (modalStartRecordBtn) {
            modalStartRecordBtn.style.display = 'flex';
        }
        if (recordingControls) {
            recordingControls.style.display = 'none';
        }
        if (modalRecordedVideoContainer) {
            modalRecordedVideoContainer.style.display = 'none';
        }
        if (modalVideoActions) {
            modalVideoActions.style.display = 'none';
        }
        if (recordingIndicator) {
            recordingIndicator.style.display = 'none';
        }
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
        }
        isPaused = false;
        pausedTime = 0;
        totalPausedTime = 0;
    }
}

// Submit video
if (modalSubmitVideoBtn) {
    modalSubmitVideoBtn.addEventListener('click', () => {
        if (recordedBlob) {
            // Store blob for form submission
            const videoBlobInput = document.getElementById('videoBlob');
            if (videoBlobInput) {
                // Convert blob to base64 for storage
                const reader = new FileReader();
                reader.onloadend = () => {
                    videoBlobInput.value = reader.result;
                };
                reader.readAsDataURL(recordedBlob);
            }
            
            // Store blob globally for form submission
            window.recordedVideoBlob = recordedBlob;
            
            closeModalAndCleanup();
            alert('Video recorded successfully! Please submit the form to upload it.');
        }
    });
}

// Retake video
if (modalRetakeVideoBtn) {
    modalRetakeVideoBtn.addEventListener('click', async () => {
        // Clear recorded video
        recordedBlob = null;
        recordedChunks = [];
        modalRecordedVideoContainer.style.display = 'none';
        
        if (modalRecordedVideo) {
            modalRecordedVideo.src = '';
            URL.revokeObjectURL(modalRecordedVideo.src);
        }
        
        // Hide video actions
        if (modalVideoActions) {
            modalVideoActions.style.display = 'none';
        }
        
        // Show record button
        if (modalStartRecordBtn) {
            modalStartRecordBtn.style.display = 'flex';
        }
        
        // Hide recording controls
        if (recordingControls) {
            recordingControls.style.display = 'none';
        }
        
        // Reset timer
        if (timerDisplay) {
            timerDisplay.textContent = '00:00:00';
        }
        
        // Reset pause state
        isPaused = false;
        pausedTime = 0;
        totalPausedTime = 0;
        
        // Restart camera
        if (modalPreviewVideo) {
            modalPreviewVideo.style.display = 'block';
        }
        
        await startCamera();
    });
}

// Close modal and cleanup
function closeModalAndCleanup() {
    videoModal.style.display = 'none';
    
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    
    if (modalPreviewVideo) {
        modalPreviewVideo.srcObject = null;
    }
    
    if (recordingTimer) {
        clearTimeout(recordingTimer);
        recordingTimer = null;
    }
    
    recordedChunks = [];
    mediaRecorder = null;
}

// Form submission
const applicationForm = document.getElementById('applicationForm');

if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Hide previous messages
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        
        // Validate video recording
        if (!window.recordedVideoBlob) {
            showError('Please record a video before submitting.');
            return;
        }
        
        // Create FormData
        const formData = new FormData();
        
        // Add all form fields
        formData.append('name', document.getElementById('name').value);
        const emailValue = document.getElementById('email').value;
        if (emailValue) {
            formData.append('email', emailValue);
        }
        formData.append('phone', document.getElementById('phone').value);
        formData.append('age', document.getElementById('age').value);
        formData.append('qualification', document.getElementById('qualification').value);
        formData.append('graduation_year', document.getElementById('graduation_year').value);
        formData.append('location', document.getElementById('location').value);
        
        // Add video blob
        if (window.recordedVideoBlob) {
            const videoFileName = `video_${Date.now()}.webm`;
            formData.append('video', window.recordedVideoBlob, videoFileName);
        }
        
        // Disable submit button
        const submitBtn = document.querySelector('.btn-submit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            const response = await fetch('./upload.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                showSuccess();
                applicationForm.reset();
                window.recordedVideoBlob = null;
                document.getElementById('videoBlob').value = '';
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    const modal = document.getElementById('applicationFormModal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                }, 2000);
            } else {
                showError(result.message || 'An error occurred while submitting the form.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Application';
        }
    });
}

// Show success message
function showSuccess() {
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
}

// Show error message
function showError(message) {
    document.getElementById('errorText').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
}

// Close application form modal
document.addEventListener('DOMContentLoaded', () => {
    const applicationFormModal = document.getElementById('applicationFormModal');
    const closeFormModal = document.querySelector('.close-form-modal');

    if (closeFormModal) {
        closeFormModal.addEventListener('click', () => {
            if (applicationFormModal) {
                applicationFormModal.style.display = 'none';
            }
        });
    }

    if (applicationFormModal) {
        applicationFormModal.addEventListener('click', (e) => {
            if (e.target === applicationFormModal) {
                applicationFormModal.style.display = 'none';
            }
        });
    }

    // Sample Video Modal
    const sampleVideoModal = document.getElementById('sampleVideoModal');
    const viewSampleVideoBtn = document.getElementById('viewSampleVideoBtn');
    const closeSampleModal = document.querySelector('.close-sample-modal');

    if (viewSampleVideoBtn) {
        viewSampleVideoBtn.addEventListener('click', () => {
            if (sampleVideoModal) {
                sampleVideoModal.style.display = 'block';
            }
        });
    }

    if (closeSampleModal) {
        closeSampleModal.addEventListener('click', () => {
            if (sampleVideoModal) {
                sampleVideoModal.style.display = 'none';
            }
        });
    }

    if (sampleVideoModal) {
        sampleVideoModal.addEventListener('click', (e) => {
            if (e.target === sampleVideoModal) {
                sampleVideoModal.style.display = 'none';
            }
        });
    }
});

