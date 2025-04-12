// ProfileModal.tsx
import React, { useState, useEffect } from 'react';

interface ProfileModalProps {
  onSave: (data: any) => void;
  profile: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onSave, profile }) => {
  const [showModal, setShowModal] = useState(false);
  // Initialize customTags to an empty array if not provided
  const [formData, setFormData] = useState({
    ...profile,
    customTags: profile.customTags || [],
  });
  const [newTag, setNewTag] = useState('');
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);

  useEffect(() => {
    // Load values from local storage if available
    const savedName = localStorage.getItem('name');
    const savedEmail = localStorage.getItem('email');
    const savedQrCode = localStorage.getItem('qrCode');
    const savedTags = localStorage.getItem('customTags');

    if (savedName) {
      setFormData((prev: any) => ({ ...prev, name: savedName }));
    }
    if (savedEmail) {
      setFormData((prev: any) => ({ ...prev, email: savedEmail }));
    }
    if (savedQrCode) {
      setQrCodePreview(savedQrCode);
    }
    if (savedTags) {
      setFormData((prev: any) => ({ ...prev, customTags: JSON.parse(savedTags) }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const qrCodeDataUrl = reader.result as string;
        setQrCodePreview(qrCodeDataUrl);
        localStorage.setItem('qrCode', qrCodeDataUrl);
        setFormData({ ...formData, qrCode: qrCodeDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });
    localStorage.setItem('name', newName);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    localStorage.setItem('email', newEmail);
  };

  // Add a new tag if valid
  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && formData.customTags.length < 5) {
      const updatedTags = [...formData.customTags, trimmedTag];
      setFormData({ ...formData, customTags: updatedTags });
      localStorage.setItem('customTags', JSON.stringify(updatedTags));
      setNewTag('');
    }
  };

  // Remove tag by index
  const handleRemoveTag = (index: number) => {
    const updatedTags = formData.customTags.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, customTags: updatedTags });
    localStorage.setItem('customTags', JSON.stringify(updatedTags));
  };

  const handleSubmit = () => {
    onSave(formData);
    setShowModal(false);
  };

  return (
    <>
      <button
        className="bg-sky-400 shadow-inner p-3 rounded-lg"
        onClick={() => setShowModal(true)}
      >
        My Profile
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={handleNameChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={handleEmailChange}
              />
            </div>
            {/* New: Custom Tags input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Custom Tags (up to 5)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Enter tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white px-3 py-2 rounded"
                  onClick={handleAddTag}
                  disabled={formData.customTags.length >= 5}
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {formData.customTags.map((tag: string, index: number) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-sky-200 text-sky-800 px-2 py-1 rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      className="ml-1 text-sm font-bold"
                      onClick={() => handleRemoveTag(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">QR Code</label>
              <input
                type="file"
                className="w-full p-2 border rounded"
                onChange={handleFileChange}
              />
              {qrCodePreview && (
                <img src={qrCodePreview} alt="QR Code Preview" className="mt-4 w-full h-32 object-contain" />
              )}
            </div>
            <div className="flex justify-between">
              <button
                className="bg-sky-400 text-white p-2 rounded shadow"
                onClick={handleSubmit}
              >
                Save
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded shadow"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
