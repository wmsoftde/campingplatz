import { NextResponse } from 'next/server';
import { sendEmail, getEmailSettings } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const settings = await getEmailSettings();
    
    if (!settings) {
      return NextResponse.json({ 
        success: false, 
        error: 'SMTP-Einstellungen sind unvollständig. Bitte Host und Absender-E-Mail prüfen.' 
      }, { status: 400 });
    }

    const result = await sendEmail(
      email, 
      'Test-Email vom Campingplatz-System', 
      '<h1>Test erfolgreich!</h1><p>Ihre SMTP-Einstellungen funktionieren korrekt.</p>'
    );

    if (result.success) {
      return NextResponse.json({ success: true, messageId: result.messageId });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Ein unbekannter Fehler ist aufgetreten.' 
    }, { status: 500 });
  }
}
