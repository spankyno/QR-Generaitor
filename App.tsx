import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { Download, Clipboard, QrCode, Sparkles } from 'lucide-react';
import { QRConfig, QRQuality } from './types';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  // State for QR Configuration
  const [config, setConfig] = useState<QRConfig>({
    text: '',
    fgColor: '#ffffff',
    bgColor: '#000000', // Note: Library logic usually expects dark on light, but we can swap. 
                        // However, to ensure contrast in dark mode app, we default to standard QR (black on white) 
                        // or allow user to customize. Let's start with a nice visible default.
    quality: QRQuality.Medium,
  });

  // Start with a valid URL so the preview isn't empty on load
  useEffect(() => {
    setConfig(prev => ({ ...prev, text: 'https://qrgenerator.netlify.app', fgColor: '#000000', bgColor: '#ffffff' }));
  }, []);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Function to generate QR Code
  const generateQR = useCallback(async () => {
    if (!config.text) {
      setQrDataUrl('');
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(config.text, {
        errorCorrectionLevel: config.quality,
        color: {
          dark: config.fgColor,
          light: config.bgColor,
        },
        width: 1000, // Generate high res for download, CSS handles display size
        margin: 1,
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error("Error generating QR", err);
    } finally {
      setIsGenerating(false);
    }
  }, [config]);

  // Trigger generation when config changes
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 100); // Debounce slightly for performance on color drag
    return () => clearTimeout(timer);
  }, [generateQR]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setConfig((prev) => ({ ...prev, text }));
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert('No se pudo acceder al portapapeles. Por favor, pega el texto manualmente.');
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig((prev) => ({ ...prev, text: e.target.value }));
  };

  const handleColorChange = (key: 'fgColor' | 'bgColor', value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConfig((prev) => ({ ...prev, quality: e.target.value as QRQuality }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200 font-sans">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Kasbo's QR Generaitor
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Profesional & Gratuito
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="space-y-6">
                
                {/* Input Section */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-300 mb-2">
                    Contenido del QR (URL o Texto)
                  </label>
                  <div className="relative">
                    <textarea
                      id="content"
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-4 pr-12 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none leading-relaxed"
                      placeholder="Escribe o pega aquí tu enlace..."
                      value={config.text}
                      onChange={handleTextChange}
                    />
                    <button
                      onClick={handlePaste}
                      className="absolute top-3 right-3 p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Pegar desde el portapapeles"
                    >
                      <Clipboard className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Colors */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-300">Apariencia</h3>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-700">
                      <span className="text-sm text-slate-400">Color QR</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 uppercase">{config.fgColor}</span>
                        <input
                          type="color"
                          value={config.fgColor}
                          onChange={(e) => handleColorChange('fgColor', e.target.value)}
                          className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-700">
                      <span className="text-sm text-slate-400">Fondo</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-500 uppercase">{config.bgColor}</span>
                        <input
                          type="color"
                          value={config.bgColor}
                          onChange={(e) => handleColorChange('bgColor', e.target.value)}
                          className="h-8 w-8 rounded cursor-pointer bg-transparent border-0 p-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quality */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-300">Configuración</h3>
                    <div>
                      <label className="text-xs text-slate-500 mb-1.5 block">Corrección de Error</label>
                      <select
                        value={config.quality}
                        onChange={handleQualityChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value={QRQuality.Low}>Baja (7%)</option>
                        <option value={QRQuality.Medium}>Media (15%)</option>
                        <option value={QRQuality.Quartile}>Alta (25%)</option>
                        <option value={QRQuality.High}>Muy Alta (30%)</option>
                      </select>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        Niveles más altos permiten que el QR sea legible incluso si está parcialmente dañado o cubierto.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
                
                <h2 className="text-lg font-semibold text-slate-200 mb-6 w-full text-left flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                  Vista Previa
                </h2>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-white p-4 rounded-xl shadow-2xl">
                    {config.text ? (
                      <img 
                        src={qrDataUrl} 
                        alt="QR Code Preview" 
                        className="w-full max-w-[280px] h-auto object-contain mx-auto"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    ) : (
                      <div className="w-[280px] h-[280px] bg-slate-100 rounded flex items-center justify-center text-slate-400">
                        <QrCode className="w-16 h-16 opacity-20" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 w-full">
                  <button
                    onClick={handleDownload}
                    disabled={!config.text || isGenerating}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                  >
                    <Download className="w-5 h-5" />
                    {isGenerating ? 'Generando...' : 'Descargar PNG'}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-3">
                    Formato .PNG de alta resolución
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;