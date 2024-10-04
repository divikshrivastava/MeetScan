import React, { useState, useEffect } from 'react';

interface ProfileModalProps {
  onSave: (data: any) => void;
  profile: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onSave, profile }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);

  useEffect(() => {
    // Load name, email, and QR code from local storage if available
    const savedName = localStorage.getItem('name');
    const savedEmail = localStorage.getItem('email');
    const savedQrCode = localStorage.getItem('qrCode');

    if (savedName) {
      setFormData((prevData: any) => ({ ...prevData, name: savedName }));
    }
    if (savedEmail) {
      setFormData((prevData: any) => ({ ...prevData, email: savedEmail }));
    }
    if (savedQrCode) {
      setQrCodePreview(savedQrCode);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const qrCodeDataUrl = reader.result as string;
        setQrCodePreview(qrCodeDataUrl);
        localStorage.setItem('qrCode', qrCodeDataUrl); // Save QR code image to local storage
        setFormData({ ...formData, qrCode: qrCodeDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName });
    localStorage.setItem('name', newName); // Save name to local storage
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    localStorage.setItem('email', newEmail); // Save email to local storage
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
