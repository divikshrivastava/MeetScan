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
  const [scanCounter, setScanCounter] = useState(0); // Scan counter state

  useEffect(() => {
    const savedProfile = localStorage.getItem('profile');
    const savedScans = localStorage.getItem('scans');
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedScans) setScans(JSON.parse(savedScans));
    if (process.env.REACT_APP_COUNTER === '1') {
      const savedScanCount = localStorage.getItem('scanCount');
      if (savedScanCount) {
        setScanCounter(parseInt(savedScanCount));
      }
    }
  }, []);

  const handleSaveProfile = (data: any) => {
    setProfile(data);
    localStorage.setItem('profile', JSON.stringify(data));
  };

  const handleSaveScan = (scan: any) => {
    setScans((prev) => [...prev, scan]);
    localStorage.setItem('scans', JSON.stringify([...scans, scan]));
    setScanCounter((prev) => {
      const newCount = prev + 1;
      localStorage.setItem('scanCount', newCount.toString());
      return newCount;
    });

    // Show the "Email Scans" button after the first scan is added in non-event mode
    if (!event.name && !showEmailButton) {
      setShowEmailButton(true);
    }
  };

  const handleEventEnd = () => {
    setTimerEnded(true);
    sendScansEmail(profile, event, scans)
      .then(() => {
        setScans([]);
        localStorage.removeItem('scans');
        setNotification('Email sent successfully!');
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

  const handleEmailScans = () => {
    sendScansEmail(profile, { name: '', description: '' }, scans)
      .then(() => {
        setScans([]);
        localStorage.removeItem('scans');
        setNotification('Email sent successfully!');
        setTimeout(() => {
          setNotification(null);
        }, 3000);
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
      

      <h1 className="text-4xl font-bold text-center mb-8 mt-8">
        MeetScan <span className="italic font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">Pro</span>
      </h1>

      {/* Show notification if it exists */}
      {notification && (
        <div
          className={`${
            notification.includes('success') ? 'bg-green-500' : 'bg-red-500'
          } text-white text-center p-3 rounded mb-4`}
        >
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
          <ScanArea onSave={handleSaveScan} />
        </>
      ) : (
        <>
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

      <ScansList scans={scans} onEdit={handleSaveProfile} onDelete={(url) => setScans((prev) => prev.filter((scan) => scan.url !== url))} />
      
      <footer className="text-center text-sm text-gray-500 mt-8">
      <div className="flex justify-between items-center mb-8">
        {/* GitHub Stars Button */}
        <div className='flex-col'>
        <a
          href="https://github.com/divikshrivastava/SuperConnector"
          className="flex items-center text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-black text-white shadow hover:bg-black/90 h-10 px-3 py-1 whitespace-pre group relative w-auto justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
        >
          <svg className="w-8 h-8 fill-current" viewBox="0 0 438.549 438.549">
            <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
          </svg>
          <div className='flex-col'>
          <span className="text-white">Star on GitHub</span>
          <div className='flex'>
          <div className="flex items-center gap-1 text-sm">
            <svg
              className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path clip-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" fill-rule="evenodd"></path>
            </svg>
            <span className="inline-block tabular-nums tracking-wider font-display font-medium text-white">
              6
            </span>
            </div>
            </div>
          </div>
        </a>
        <a
          href="https://discord.gg/rvZSbMQJ4y"
          className="flex items-center text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white shadow bg-indigo-400 hover:bg-black/90 h-10 px-3 py-1 whitespace-pre group relative w-auto justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2 mt-1"
        >
         <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      preserveAspectRatio="xMidYMid"
      viewBox="0 -28.5 256 256"
    >
      <path
        fill="#5865F2"
        d="M216.856 16.597A208.502 208.502 0 00164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 00-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0079.735 175.3a136.413 136.413 0 01-21.846-10.632 108.636 108.636 0 005.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 005.355 4.237 136.07 136.07 0 01-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36zM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18z"
      ></path>
    </svg>
          <span className="ml-1 text-white">Join our community</span>
        </a>
        </div>
        {/* Scan Counter */}
        {process.env.REACT_APP_COUNTER === '1' && (
           
          <div className="flex-col items-center space-y-2">
            <h4 className="text-lg font-semibold text-gray-700">Total Scans</h4>
            <div className="flex space-x-1">
            {String(scanCounter).padStart(5, '0').split('').map((digit, index) => (
              <div
                key={index}
                className="w-8 flex items-center justify-center bg-gray-200 rounded-md shadow-inner text-black text-lg font-semibold"
              >
                {digit}
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
        MeetScanPro &copy; 2024
      </footer>
    </div>
  );
};

export default App;
