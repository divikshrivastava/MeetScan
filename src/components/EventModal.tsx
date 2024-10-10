import React, { useState } from 'react';

interface EventModalProps {
  onSave: (data: any) => void;
  event: any;
  setTimerActive: (active: boolean) => void;
}

const EventModal: React.FC<EventModalProps> = ({ onSave, event, setTimerActive }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(event);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const minutes = formData.durationMinutes ?? 0
    if (minutes < 1 || minutes > 60) {
      setError('Minutes must be between 0 and 60');
    } else {
      setError('');
      const duration = (formData.durationHours ?? 0 * 60 + formData.durationMinutes) * 60 * 1000;
      onSave({ ...formData, duration });
      setTimerActive(true);
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        className="bg-sky-400 shadow-inner p-3 rounded-lg"
        onClick={() => setShowModal(true)}
      >
        Start Event
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Start Event</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Event Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Event Duration</label>
              <div className='flex-col'>
              <div className="flex space-x-2">
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded"
                  placeholder="Hours"
                  onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value, 10) })}
                />
                
                <input
                  type="number"
                  className="w-1/2 p-2 border rounded"
                  placeholder="Minutes"
                  min={1}
                  max={60}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value, 10) })}
                />
                {error && <div className='text-sm text-red-700'>{error}</div>}
              </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white p-2 rounded shadow"
                onClick={handleSubmit}
              >
                Start Event
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

export default EventModal;
