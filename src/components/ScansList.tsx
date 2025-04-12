// ScansList.tsx
import React, { useState } from 'react';

import linkedinIcon from '../icons/linkedin.svg';
import bitlyIcon from '../icons/bitly.svg';
import instagramIcon from '../icons/instagram.svg';
import websiteIcon from '../icons/website.svg';

interface ScansListProps {
  scans: any[];
  onEdit: (editedScan: any) => void;
  onDelete: (url: string) => void;
}

const ScansList: React.FC<ScansListProps> = ({ scans, onEdit, onDelete }) => {
  const [editingScan, setEditingScan] = useState<any | null>(null);

  const handleSaveEdit = () => {
    onEdit(editingScan);
    setEditingScan(null);
  };

  const renderLinkIcon = (linkType: string) => {
    switch (linkType) {
      case 'linkedin':
        return <img src={linkedinIcon} alt="LinkedIn" className="h-6 w-6" />;
      case 'bitly':
        return <img src={bitlyIcon} alt="Bitly" className="h-6 w-6" />;
      case 'instagram':
        return <img src={instagramIcon} alt="Instagram" className="h-6 w-6" />;
      case 'website':
        return <img src={websiteIcon} alt="Website" className="h-6 w-6" />;
      default:
        return <p>URL</p>;
    }
  };

  return (
    <div className="mt-6">
      <h4 className="text-2xl font-semibold mb-4">Latest Scans</h4>
      {scans.length === 0 ? (
        <p className="text-lg text-gray-500">None</p>
      ) : (
        scans.map((scan) => (
          <div key={scan.url} className="bg-white rounded-lg p-4 shadow-lg mb-4">
            {editingScan && editingScan.url === scan.url ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 border rounded mb-2"
                  value={editingScan.name}
                  onChange={(e) =>
                    setEditingScan({ ...editingScan, name: e.target.value })
                  }
                />
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  value={editingScan.notes}
                  onChange={(e) =>
                    setEditingScan({ ...editingScan, notes: e.target.value })
                  }
                />
                <div className="flex justify-between">
                  <button
                    className="bg-green-500 text-white p-2 rounded-lg shadow"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg shadow"
                    onClick={() => setEditingScan(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  {/* Show detected link type icon */}
                  {renderLinkIcon(scan.linkType)}
                  <p className="ml-2">{scan.url}</p>
                </div>
                <p className="text-lg mb-2">Name: {scan.name}</p>
                <p className="text-lg mb-2">Notes: {scan.notes}</p>
                {/* Display all tags */}
                {scan.tags && scan.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {scan.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between">
                  <button
                    className="bg-blue-500 text-white p-2 rounded-lg shadow"
                    onClick={() => setEditingScan(scan)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg shadow"
                    onClick={() => onDelete(scan.url)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ScansList;
