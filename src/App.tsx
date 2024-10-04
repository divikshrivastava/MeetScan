import React, { useState, useEffect } from 'react';
import ProfileModal from './components/ProfileModal';
import EventModal from './components/EventModal';
import Timer from './components/Timer';
import ScanArea from './components/ScanArea';
import ScansList from './components/ScansList';
import { sendScansEmail } from './emailService'; // Import the email service

const App: React.FC = () => {
  const [profile, setProfile] = useState({ name: '', email: '', qrCode: '' });
  const [event, setEvent] = useState({ name: '', duration: 0, description: '' });
  const [scans, setScans] = useState<any[]>([]);
  const [timerActive, setTimerActive] = useState(false);
  const [timerEnded, setTimerEnded] = useState(false);
  const [notification, setNotification] = useState<string | null>(null); // For showing notifications
  const [showEmailButton, setShowEmailButton] = useState(false); // Show email button after first scan

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    const savedScans = localStorage.getItem('scans');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedScans) setScans(JSON.parse(savedScans));
  }, []);

  const handleSaveProfile = (data: any) => {
    setProfile(data);
    localStorage.setItem('profile', JSON.stringify(data));
  };

  const handleSaveScan = (scan: any) => {
    setScans((prev) => [...prev, scan]);
    localStorage.setItem('scans', JSON.stringify([...scans, scan]));

    // Show the "Email Scans" button after the first scan is added in non-event mode
    if (!event.name && !showEmailButton) {
      setShowEmailButton(true);
    }
  };

  const handleEditScan = (editedScan: any) => {
    const updatedScans = scans.map((scan) => (scan.url === editedScan.url ? editedScan : scan));
    setScans(updatedScans);
    localStorage.setItem('scans', JSON.stringify(updatedScans));
  };

  const handleDeleteScan = (url: string) => {
    const updatedScans = scans.filter((scan) => scan.url !== url);
    setScans(updatedScans);
    localStorage.setItem('scans', JSON.stringify(updatedScans));
  };

  const handleEventEnd = () => {
    setTimerEnded(true);

    // Send email with scan data when the event ends
    sendScansEmail(profile, event, scans)
      .then(() => {
        // After email is sent, clear the scans
        setScans([]); // Clear the scan list
        localStorage.removeItem('scans'); // Remove scans from local storage

        // Show notification that the email was sent
        setNotification('Email sent successfully!');

        // Hide the notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setNotification('Failed to send email. Please try again.');
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
  };

  // Send scans via email in non-event mode
  const handleEmailScans = () => {
    sendScansEmail(profile, { name: '', description: '' }, scans) // No event details
      .then(() => {
        // Clear scans after email is sent
        setScans([]);
        localStorage.removeItem('scans');

        // Show notification that the email was sent
        setNotification('Email sent successfully!');

        // Hide the notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);

        // Hide the "Email Scans" button after email is sent
        setShowEmailButton(false);
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setNotification('Failed to send email. Please try again.');
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-300 to-white">
      {/* <h1 className="text-4xl font-bold text-center mb-8">MeetScan</h1> */}
      <h1 className="text-4xl font-bold text-center mb-8">
        MeetScan <span className="italic font-bold bg-gradient-to-r to-black from-silver-600 bg-clip-text text-transparent">Pro</span>
      </h1>
      {/* Show notification if it exists */}
      {notification && (
        <div className={`${
          notification.includes('success') ? 'bg-green-500' : 'bg-red-500'
        } text-white text-center p-3 rounded mb-4`}>
          {notification}
        </div>
      )}

      <div className="flex justify-between mb-8">
        <ProfileModal onSave={handleSaveProfile} profile={profile} />
        <EventModal onSave={setEvent} event={event} setTimerActive={setTimerActive} />
      </div>

      {/* Conditionally render timer and event-related content */}
      {event.name && !timerEnded ? (
        <>
          <h3 className="text-2xl mb-4">Event: {event.name}</h3>
          <Timer duration={event.duration} active={timerActive} onEnd={handleEventEnd} />
        </>
      ) : (
        <>
          {/* No event mode - Scan and QR functionalities always active */}
          <ScanArea onSave={handleSaveScan} />
          {showEmailButton && (
            <button
              className="bg-blue-500 text-white p-3 rounded-lg mt-4"
              onClick={handleEmailScans}
            >
              Email Scans
            </button>
          )}
        </>
      )}

      <ScansList scans={scans} onEdit={handleEditScan} onDelete={handleDeleteScan} />
    </div>
  );
};

export default App;
