import './globals.css';

export const metadata = {
  title: "Who's Outage Is It Anyway",
  description: 'Simple status dashboard for service dependencies.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


