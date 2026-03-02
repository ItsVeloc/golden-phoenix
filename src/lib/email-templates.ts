export function bookingConfirmationEmail(booking: {
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  id: number;
}) {
  const formattedDate = new Date(booking.date + 'T12:00:00').toLocaleDateString(
    'en-GB',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );
  const formattedTime = formatTime(booking.time);

  return {
    subject: `Your Reservation at Golden Phoenix — ${formattedDate} at ${formattedTime}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0c0c0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#141412;border:1px solid rgba(255,255,255,0.06);">
        <!-- Header -->
        <tr><td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:400;color:#e8e4da;letter-spacing:3px;text-transform:uppercase;">Golden Phoenix</h1>
          <p style="margin:8px 0 0;font-size:12px;color:#8a8680;letter-spacing:2px;text-transform:uppercase;">Stratford-upon-Avon</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 20px;font-size:15px;color:#d4cfc4;line-height:1.7;">
            Dear ${escapeHtml(booking.customerName)},
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:#d4cfc4;line-height:1.7;">
            Thank you for your reservation. We look forward to welcoming you.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a18;border:1px solid rgba(255,255,255,0.06);margin-bottom:28px;">
            <tr><td style="padding:24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#8a8680;letter-spacing:2px;text-transform:uppercase;width:120px;">Date</td>
                  <td style="padding:6px 0;font-size:15px;color:#e8e4da;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#8a8680;letter-spacing:2px;text-transform:uppercase;">Time</td>
                  <td style="padding:6px 0;font-size:15px;color:#e8e4da;">${formattedTime}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#8a8680;letter-spacing:2px;text-transform:uppercase;">Guests</td>
                  <td style="padding:6px 0;font-size:15px;color:#e8e4da;">${booking.partySize}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:#8a8680;letter-spacing:2px;text-transform:uppercase;">Booking Ref</td>
                  <td style="padding:6px 0;font-size:15px;color:#e8e4da;">#${booking.id}</td>
                </tr>
              </table>
            </td></tr>
          </table>

          <p style="margin:0 0 6px;font-size:13px;color:#8a8680;line-height:1.7;">
            <strong style="color:#d4cfc4;">Address:</strong> 22a Bell Court, Stratford-upon-Avon, CV37 6EX
          </p>
          <p style="margin:0 0 20px;font-size:13px;color:#8a8680;line-height:1.7;">
            <strong style="color:#d4cfc4;">Phone:</strong> 01789 638 731
          </p>

          <p style="margin:0;font-size:13px;color:#8a8680;line-height:1.7;">
            If you need to cancel or amend your reservation, please call us on the number above.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;font-size:11px;color:#8a8680;">&copy; 2026 Golden Phoenix Stratford. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')}${suffix}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
