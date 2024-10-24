import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

// You can replace these with actual SVGs or image imports
import linkedinIcon from '../icons/linkedin.svg';
import bitlyIcon from '../icons/bitly.svg';
import instagramIcon from '../icons/instagram.svg';
import websiteIcon from '../icons/website.svg';
import xyzIcon from '../icons/xyz.svg';
import amazonIcon from '../icons/amazon.svg';

interface ScanAreaProps {
  onSave: (scan: any) => void;
}

const ScanArea: React.FC<ScanAreaProps> = ({ onSave }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [showScanner, setShowScanner] = useState(true); // Active scanner by default
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<'linkedin' | 'bitly' | 'instagram' | 'website' | 'xyz' | 'amazon' | 'unknown'>('unknown'); // Type of link detected

  useEffect(() => {
    const savedQrCode = localStorage.getItem('qrCode');
    if (savedQrCode) {
      setQrCodeImage(savedQrCode);
    }
  }, []);

  const handleScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      const scannedUrl = result[0]?.rawValue;
      setScannedData(scannedUrl);
      identifyLinkType(scannedUrl); // Identify type of link using regex
      
      // Show notification for half a second
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 500);
    }
  };

  const identifyLinkType = (url: string) => {
    if (/linkedin\.com/.test(url)) {
      setLinkType('linkedin');
    } else if (/bit\.ly/.test(url)) {
      setLinkType('bitly');
    } else if (/instagram\.com/.test(url)) {
      setLinkType('instagram');
    } else if (/^(https?:\/\/)?([\w\d-]+\.)+[\w-]+/.test(url)) {
      setLinkType('website');
    } else if (/xyz\.com/.test(url)) {
      setLinkType('xyz');
    } else if (/amazon\.com/.test(url)); {
      setLinkType('amazon');
    } else {
      setLinkType('unknown');
    }
  };

  const handleSave = () => {
    onSave({ name, url: scannedData, notes, linkType });
    setScannedData('');
    setName('');
    setNotes('');
    setLinkType('unknown'); // Reset the link type
  };

  const handleDiscard = () => {
    setScannedData('');
    setName('');
    setNotes('');
    setLinkType('unknown'); // Reset the link type
  };

  const renderLinkIcon = () => {
    switch (linkType) {
      case 'linkedin':
        return <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6" />;
      case 'bitly':
        return <img src={bitlyIcon} alt="Bitly" className="h-6 w-6" />;
      case 'instagram':
        return <img src={instagramIcon} alt="Instagram" className="h-6 w-6" />;
      case 'website':
        return <img src={websiteIcon} alt="Website" className="h-6 w-6" />;
      case 'xyz':
        return <img src={xyzIcon} alt="xyz" className="h-6 w-6" />;
      case 'amazon':
        return <img src={amazonIcon} alt="Amazon" className="h-6 w-6" />;
      default:
        return <p>URL</p>;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-center items-center mb-4">
        <div className="flex justify space-x-2">
          <div className="radio-inputs">
            <label className="radio">
              <input type="radio" name="mode" checked={showScanner} onChange={() => setShowScanner(true)} />
              <span className="name">Scan QR code</span>
            </label>
            <label className="radio">
              <input type="radio" name="mode" checked={!showScanner} onChange={() => setShowScanner(false)} />
              <span className="name">Show my QR</span>
            </label>
          </div>
        </div>
      </div>

      {/* Common container to ensure both scanner and QR display match sizes */}
      <div className="rounded-lg border p-4 bg-white shadow-lg w-full flex justify-center items-center">
        {showScanner ? (
          <Scanner
            onScan={handleScan}
            onError={(error) => console.error(error)}
            classNames={{
              container: 'h-full w-full', // Ensure full height and width matching the QR code display
            }}
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            {qrCodeImage ? (
              <img src={qrCodeImage} alt="Your QR Code" className="h-full object-contain" />
            ) : (
              <p>Upload your QR code</p>
            )}
          </div>
        )}
        {showNotification && (
          <div className="absolute top-4 bg-green-500 text-white px-4 py-2 rounded shadow-md">
            URL Scanned Successfully
          </div>
        )}
      </div>

      {scannedData && (
        <div className="card-glassmorphic mt-4">
          <div className="flex items-center space-x-2 mb-2">
            {/* Show the detected link type */}
            {renderLinkIcon()}
            <p className="ml-2">{scannedData}</p>
          </div>
          <input
            type="text"
            className="w-full p-2 border rounded mb-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-between">
            <button className="bg-green-500 text-white p-2 rounded shadow" onClick={handleSave}>
              Save
            </button>
            <button className="bg-red-500 text-white p-2 rounded shadow" onClick={handleDiscard}>
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanArea;
