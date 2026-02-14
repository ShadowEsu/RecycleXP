import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, MapPin, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

export function ScanPage() {
  const navigate = useNavigate();
  const { currentScan, isScanning, performScan } = useApp();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera
  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      setCameraError('');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      // Camera access denied or not available - this is expected in some environments
      setCameraError('Camera access denied or not available. You can still use the app by uploading images.');
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        performScan(imageData);
      }
    }
  };

  const resetScan = () => {
    setCapturedImage(null);
  };

  const getBinColor = (category: string) => {
    switch (category) {
      case 'recycle':
        return 'bg-blue-500';
      case 'compost':
        return 'bg-green-500';
      case 'waste':
        return 'bg-gray-700';
      default:
        return 'bg-gray-400';
    }
  };

  const getBinLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Scan an Item</h1>
        <p className="text-gray-600">Point your camera at an item to identify the correct bin</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Camera Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera Preview
            </CardTitle>
            <CardDescription>
              Position the item clearly in the frame
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {!capturedImage ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={capturedImage}
                  alt="Captured item"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Scan overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                    <p className="text-lg font-medium">Analyzing item...</p>
                    <p className="text-sm text-gray-300 mt-1">AI is identifying the waste category</p>
                  </div>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-4">
              {!capturedImage ? (
                <Button
                  onClick={captureImage}
                  disabled={isScanning}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Image
                </Button>
              ) : (
                <Button
                  onClick={resetScan}
                  disabled={isScanning}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Scan Another Item
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Scan Results</CardTitle>
            <CardDescription>
              {currentScan ? 'Classification complete' : 'Waiting for scan...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentScan ? (
              <div className="space-y-6">
                {/* Item Name */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {currentScan.itemName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Scanned {new Date(currentScan.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                {/* Bin Category */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Dispose in:</label>
                  <Badge 
                    className={`${getBinColor(currentScan.binCategory)} text-white text-lg px-4 py-2`}
                  >
                    {getBinLabel(currentScan.binCategory)} Bin
                  </Badge>
                </div>

                {/* Confidence */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-gray-600">Confidence</label>
                    <span className="text-sm font-medium text-gray-900">
                      {currentScan.confidence}%
                    </span>
                  </div>
                  <Progress value={currentScan.confidence} className="h-2" />
                </div>

                {/* Explanation */}
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Why?</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {currentScan.explanation}
                  </p>
                </div>

                {/* Points Earned */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    +{currentScan.pointsEarned}
                  </div>
                  <div className="text-sm text-green-600">Points Earned!</div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={() => navigate('/map')}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Find Nearest Bin
                  </Button>
                  
                  <Button
                    onClick={resetScan}
                    variant="outline"
                    className="w-full"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Scan Another Item
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Capture an image to start scanning</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}