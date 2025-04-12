// ScanArea.tsx
import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import linkedinIcon from '../icons/linkedin.svg';
import bitlyIcon from '../icons/bitly.svg';
import instagramIcon from '../icons/instagram.svg';
import websiteIcon from '../icons/website.svg';
import twitterIcon from '../icons/twitter.svg';
import netflixIcon from '../icons/netflix.svg';
import tiktokIcon from '../icons/tiktok.svg';
import wikipediaIcon from '../icons/wikipedia.svg';
import amazonIcon from '../icons/amazon.svg';

interface ScanAreaProps {
  onSave: (scan: any) => void;
  // List of custom tags from the user's profile
  customTags?: string[];
}

const ScanArea: React.FC<ScanAreaProps> = ({ onSave, customTags = [] }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [showScanner, setShowScanner] = useState(true);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<'linkedin' | 'bitly' | 'netflix' | 'instagram' | 'twitter' | 'tiktok' | 'website' | 'wikipedia' | 'amazon' | 'unknown'>('unknown');
  
  // New state: selected tags (an array)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      identifyLinkType(scannedUrl);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 500);
    }
  };

  const identifyLinkType = (url: string) => {
    if (/linkedin\.com/.test(url)) {
      setLinkType('linkedin');
    } else if (/bit\.ly/.test(url)) {
      setLinkType('bitly');
    } else if (/instagram\.com/.test(url)) {
      setLinkType('instagram');
    } else if (/tiktok\.com/.test(url)) {
      setLinkType('tiktok');
    } else if (/wikipedia\.com/.test(url)) {
      setLinkType('wikipedia');
    } else if (/twitter\.com/.test(url)) {
      setLinkType('twitter');
    } else if (/netflix\.com/.test(url)) {
      setLinkType('netflix');
    } else if (/amazon\.com/.test(url)) {
      setLinkType('amazon');
    } else if (/^(https?:\/\/)?([\w\d-]+\.)+[\w-]+/.test(url)) {
      setLinkType('website');
    } else {
      setLinkType('unknown');
    }
  };

  // Toggle a tag in the selectedTags state array
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    onSave({ name, url: scannedData, notes, linkType, tags: selectedTags });
    setScannedData('');
    setName('');
    setNotes('');
    setLinkType('unknown');
    setSelectedTags([]);
  };

  const handleDiscard = () => {
    setScannedData('');
    setName('');
    setNotes('');
    setLinkType('unknown');
    setSelectedTags([]);
  };

  const renderLinkIcon = () => {
    switch (linkType) {
      case 'linkedin':
        return <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6" />;
      case 'bitly':
        return <img src={bitlyIcon} alt="Bitly" className="h-6 w-6" />;
      case 'instagram':
        return <img src={instagramIcon} alt="Instagram" className="h-6 w-6" />;
      case 'twitter':
        return <img src={twitterIcon} alt="Twitter" className="h-6 w-6" />;
      case 'netflix':
        return <img src={netflixIcon} alt="Netflix" className="h-6 w-6" />;
      case 'tiktok':
        return <img src={tiktokIcon} alt="Tiktok" className="h-6 w-6" />;
      case 'wikipedia':
        return <img src={wikipediaIcon} alt="Wikipedia" className="h-6 w-6" />;
      case 'website':
        return <img src={websiteIcon} alt="Website" className="h-6 w-6" />;
      case 'amazon':
        return <img src={amazonIcon} alt="Amazon" className="h-6 w-6" />;
      default:
        return <p>URL</p>;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-center items-center mb-4">
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

      <div className="rounded-lg border p-4 bg-white shadow-lg w-full flex justify-center items-center">
        {showScanner ? (
          <Scanner
            onScan={handleScan}
            onError={(error) => console.error(error)}
            classNames={{ container: 'h-full w-full' }}
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
        <div className="card-glassmorphic mt-4 p-4">
          <div className="flex items-center space-x-2 mb-2">
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
          {/* New: Multi-select tag chips below the Notes field */}
          {customTags.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Tags</label>
              <div className="flex flex-wrap gap-2">
                {customTags.map((tag, index) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isSelected
                          ? 'bg-blue-500 text-white'
                          : 'border border-blue-500 text-blue-500'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
