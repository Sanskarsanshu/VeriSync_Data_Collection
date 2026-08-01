import * as faceapi from '@vladmandic/face-api';

export async function loadModels(modelsPath = '/models') {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromUri(modelsPath),
    faceapi.nets.faceRecognitionNet.loadFromUri(modelsPath),
  ]);
}

export async function detectFace(videoElement: HTMLVideoElement) {
  const detections = await faceapi.detectSingleFace(
    videoElement, 
    new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
  ).withFaceLandmarks().withFaceDescriptor();

  return detections;
}

export function drawFaceGuidance(canvas: HTMLCanvasElement, video: HTMLVideoElement, detections: any) {
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (detections) {
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    // Draw an oval guide
    ctx.beginPath();
    ctx.ellipse(displaySize.width / 2, displaySize.height / 2, displaySize.width * 0.25, displaySize.height * 0.35, 0, 0, 2 * Math.PI);
    
    // Check if face is centered
    const box = resizedDetections.detection.box;
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;
    
    const isCentered = Math.abs(centerX - displaySize.width / 2) < 50 && 
                       Math.abs(centerY - displaySize.height / 2) < 50;
    
    const isGoodSize = box.width > displaySize.width * 0.3 && box.width < displaySize.width * 0.6;
    
    if (isCentered && isGoodSize) {
      ctx.strokeStyle = '#10b981'; // green
      ctx.lineWidth = 4;
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#ef4444'; // red
      ctx.lineWidth = 4;
      ctx.stroke();
    }
    
    return isCentered && isGoodSize;
  }
  return false;
}
