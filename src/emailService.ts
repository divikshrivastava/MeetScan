import emailjs from 'emailjs-com';

export const sendScansEmail = (profile: any, event: any, scans: any[]): Promise<void> => {
  const templateParams = {
    to_name: profile.name,
    to_email: profile.email,
    event_name: event.name || 'General', // In case of non-event mode
    event_description: event.description || 'None',
    event_date: new Date().toLocaleString(),
    scans: scans
      .map((scan) => {
        let linkLabel = 'URL';
        switch (scan.linkType) {
          case 'linkedin':
            linkLabel = 'LinkedIn URL';
            break;
          case 'bitly':
            linkLabel = 'Bitly URL';
            break;
          case 'instagram':
            linkLabel = 'Instagram URL';
            break;
          case 'website':
            linkLabel = 'Website URL';
            break;
          default:
            linkLabel = 'URL';
            break;
        }
        return `${linkLabel}: ${scan.url}, Name: ${scan.name}, Notes: ${scan.notes}`;
      })
      .join('\n'),
  };

  return emailjs
    .send(
      process.env.REACT_APP_SERVICE_ID ?? "", // Replace with your EmailJS service ID
      process.env.REACT_APP_TEMPLATE_ID ?? "", // Replace with your EmailJS template ID
      templateParams,
      process.env.REACT_APP_PUBLIC_KEY ?? "" // Replace with your EmailJS public key
    )
    .then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (err) => {
        console.error('FAILED...', err);
        throw new Error('Email sending failed');
      }
    );
};
